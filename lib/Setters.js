import {
  forLoop,
  isArray,
  setBindingVariables,
  keys,
  getFunctionParameters,
} from "./utils.js";
import { walkNodes } from "./WebComponent.js";
import Getters from "./Getters.js";
import { executeCondition } from "./ConditionExecuter.js";
export default class Setters {
  constructor(...props) {
    const [node, nodeObject, customElement, proto, observer, reParsing] = props;
    this.node = node;
    this.nodeObject = nodeObject;
    this.customElement = customElement;
    this.proto = proto;
    this.observer = observer;
    this.reParsing = reParsing;

    this.beginWork();
  }

  beginWork() {
    const { nodeObject } = this;
    // console.log(this.node, nodeObject)
    forLoop(nodeObject, (bindingType, item) => {
      if (isArray(item)) {
        forLoop(item, (bindingObject) => {
          switch (bindingType) {
            case "TextContent":
              this.__SetterTextNodes__(bindingObject);
              break;
            case "Attribute":
              this.__Setter__Attribute(bindingObject);
              break;
            case "Event":
              this.__Setter__Events(bindingObject);
              break;
            case "Repeater":
              this.__Setter__Repeaters(bindingObject);
              break;
            case "If":
              this.__Setter__Condition(bindingObject);
              break;
          }
        });
      }
    });
  }

  __Setter__Condition(bindingObject) {
    let {
      keys: bindingKeys,
      values,
      raw,
      templateClone,
      nextSibling,
      valuesType,
    } = bindingObject;

    if (!raw) {
      console.warn("Condition not found template", templateClone.outerHTML);
      return;
    }

    const {
      node,
      customElement: { nodeName },
      reParsing,
    } = this;

    /**
     * parsing condition
     */
    values = values.map((val, index) => {
      if (typeof val === "string" && valuesType[index] === "string") {
        return `'${val}'`;
      }
      if (valuesType[index] === "number") {
        val = val === "" ? null : +val;
      }
      return val;
    });
    const parsedCondition = setBindingVariables(
      raw,
      bindingKeys,
      values,
      nodeName
    );
    bindingObject.value = executeCondition(parsedCondition);
    node.setAttribute("if", bindingObject.value);

    /**
     * creating if DOM
     * */
    if (bindingObject.value) {
      this.setBoundary(bindingObject, "start", `start of if condition`);
      const instance = document.importNode(templateClone.content, true);
      if (reParsing) {
        walkNodes(instance, (node) => {
          node.setAttribute && node.setAttribute("processed", "yes");
          node.processedNode = bindingObject.template.processedNode;
          node.iteratorKey = bindingObject.template.iteratorKey;
          node.alias = bindingObject.template.alias;

          const nodeObject = new Getters(node, this.customElement, this.customElement);
          if (keys(nodeObject).length) {
            this.nodeObject = nodeObject;
            this.node = node;
            this.beginWork();
            // this.observer.observe(node, nodeObject, reParsing);
          }
        });
      }
      bindingObject.parentNode.insertBefore(instance, nextSibling);
      this.setBoundary(bindingObject, "end", `end of if condition`);
    } else {
      if (bindingObject.start && bindingObject.end) {
        this.cleanUp(bindingObject, true);
        bindingObject.start.remove();
        bindingObject.end.remove();
      }
    }
  }

  setBoundary(bindingObject, type, message) {
    const { template } = bindingObject;
    if (template) {
      const comment = document.createComment(message);
      bindingObject.parentNode.insertBefore(comment, bindingObject.nextSibling);
      bindingObject[type] = comment;
    }
  }

  __Setter__Repeaters(bindingObject) {
    this.setBoundary(bindingObject, "start", `start of template repeat`);
    this.executeRepeaters(bindingObject);
    this.setBoundary(bindingObject, "end", `end of template repeat`);
    bindingObject.nextSibling = bindingObject.end;

    /**
     * Observing array changes
     */
    bindingObject.targetArray = this.observer.observeArray(
      bindingObject,
      this.executeRepeaters.bind(this)
    );

    this.customElement[bindingObject.raw] = bindingObject.targetArray;
  }

  /**
   *  below mthod executes on load and
   *  after array length changes
   */
  executeRepeaters(bindingObject, reParsing) {
    if (reParsing) {
      this.cleanUp(bindingObject);
    }
    forLoop(bindingObject.targetArray, (item, index) => {
      const { templateClone } = bindingObject;

      const instance = document.importNode(templateClone.content, true);

      ((instance) => {
        walkNodes(instance, (node) => {
          node.processedNode = true;
          node.setAttribute && node.setAttribute("processed", "yes");
          node.iteratorKey = bindingObject.raw + "." + index;
          node.alias = bindingObject.alias;
          if (reParsing) {
            const nodeObject = new Getters(
              node,
              this.customElement,
              this.proto
            );
            if (keys(nodeObject).length) {
              this.nodeObject = nodeObject;
              this.node = node;
              this.beginWork();
              this.observer.observe(node, nodeObject, reParsing);
            }
          }
        });

        bindingObject.parentNode.insertBefore(
          instance,
          bindingObject.nextSibling
        );
      })(instance);
    });
  }

  cleanUp(bindingObject, notDeleteTemplateInstance) {
    const { parentNode, start, end } = bindingObject;
    let canDelete = false;

    /**
     * removing repeaters previously created node
     */
    var prev;
    for (var child = parentNode.lastChild; child; child = prev) {
      prev = child.previousSibling;
      if (child === end) {
        canDelete = true;
        continue;
      }
      if (child === start) {
        canDelete = false;
      }
      if (canDelete) {
        parentNode.removeChild(child);
      }
    }

    /**
     * Cleaning up custom element's
     * template instance.
     */
    if (!notDeleteTemplateInstance) {
      for (let key in this.customElement.templateInstance) {
        if (
          key.startsWith(
            bindingObject.raw + "." && key !== bindingObject.raw + "." + length
          )
        ) {
          delete this.customElement.templateInstance[key];
        }
      }
    }
  }

  __Setter__Attribute(bindingObject) {
    const { node, customElement } = this;
    const { keys, values, raw: nodeText, attributeName } = bindingObject;

    const value = setBindingVariables(
      nodeText,
      keys,
      values,
      customElement.nodeName
    );

    
    if (node.type === "checkbox" && attributeName==="checked") {
      node.checked = values[0];
      node.removeAttribute("checked");
    } else {
      node.setAttribute(bindingObject.attributeName, value);
    }
  }

  __Setter__Events(bindingObject) {
    const { node, customElement } = this;

    node.addEventListener(
      bindingObject.eventName,
      function (event) {
        try {
          event.stopPropagation();
          let arr = [event];

          if (bindingObject.arguments && bindingObject.arguments.length)
            arr = arr.concat(
              getFunctionParameters(
                bindingObject.arguments,
                node,
                customElement
              )
            );

          bindingObject.functionBody.apply(customElement, arr);
          event.preventDefault();
        } catch (error) {
          // console.error(error.message);
          // console.error(
          //   `${bindingObject?.scopeVariable[0]} function is not defined in ${customElement.nodeName}`
          // );
          throw error;
        }
      },
      true
    );
  }

  __SetterTextNodes__(bindingObject) {
    const { node, customElement } = this;
    const { keys, values, raw } = bindingObject;

    node.textContent = setBindingVariables(
      raw,
      keys,
      values,
      customElement.nodeName
    );
  }
}
