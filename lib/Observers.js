import {
  cloneObject,
  forLoop,
  getObject,
  checkValuesFromKeys,
} from "./utils.js";
import Setters from "./Setters.js";

export default class Observers {
  constructor(customElement, proto) {
    this.mapper = {};
    this.prototype = proto;
    this.prototypeClone = {};
    this.webComponent = customElement;
    this.cloneWebCompnent(customElement);
  }

  cloneWebCompnent() {
    let { webComponent, prototype } = this;
    this.prototypeClone = cloneObject(prototype);

    forLoop(prototype, (key) => {
      webComponent[key] = prototype[key];
    });
  }

  observe(node, nodeObject, reParsing) {
    if (nodeObject.Attribute) {
      this.createMappings(nodeObject, "Attribute", reParsing);
    } else if (nodeObject.TextContent) {
      this.createMappings(nodeObject, "TextContent", reParsing);
    } else if (nodeObject.If) {
      this.createMappings(nodeObject, "If", reParsing);
    }
  }

  createMappings(nodeObject, observeType, reParsing) {
    nodeObject[observeType].forEach((item) => {
      const { keys } = item;

      keys.forEach((key) => {
        if (reParsing) {
          this.removeFromMapper(key);
        }
        var check = checkValuesFromKeys(this.webComponent, key, this.mapper);
        if (check) this.defineProperty(key);
      });
    });
  }

  removeFromMapper(key) {
    const { mapper } = this;
    const targetMapper = getObject(mapper, key);
    const keyName = key.split(".").pop();

    if (targetMapper[keyName]) {
      delete targetMapper[keyName];
    }
  }

  /**
   * function to handle two way data binding
   * @param {} key
   */
  defineProperty(key) {
    const { webComponent } = this;
    const that = this;
    const targetObject = getObject(webComponent, key);
    const keyClone = key.split(".").pop();
    const targetClone = cloneObject(targetObject);

    try {
      Object.defineProperty(targetObject, keyClone, {
        get: function () {
          return targetClone[keyClone];
        },
        set: function (val) {
          var change = that.apply(targetClone, keyClone, val);
          if (!change) return;

          change.templateInstance = webComponent.templateInstance[key];
          targetClone[keyClone] = val;
          that.digest(change);
        },
        enumerable: true,
      });
    } catch (error) {
      // console.log(error);
    }
  }

  observeArray(bindingObject, executeRepeaters) {
    const { targetArray } = bindingObject;
    const that = this;

    // a proxy for our array
    var proxy = new Proxy(targetArray, {
      apply: function (target, thisArg, argumentsList) {
        return thisArg[target].apply(this, argumentsList);
      },
      deleteProperty: function (target, index) {
        // console.log("Deleted %s", index);
        return true;
      },
      set: function (target, property, value, receiver) {
        // console.log("Set %s to %o", property, value, targetArray);
        target[property] = value;
        if (property === "length") {
          executeRepeaters(bindingObject, true);

          /**
           * Executing if condition when array length changes
           */
          if (
            that.webComponent.templateInstance[bindingObject.raw + ".length"]
          ) {
            that.digest({
              arrayLengthObserver: true,
              newValue: value,
              name: bindingObject.raw + ".length",
              templateInstance:
                that.webComponent.templateInstance[
                  bindingObject.raw + ".length"
                ],
            });
          }
        }
        return true;
      },
    });
    return proxy;
  }

  digest(change) {
    if (!change.templateInstance) {
      console.error("unable to process digest for the change object", change);
      return;
    }

    change.templateInstance.forEach((item) => {
      const { node, bindingObject } = item;

      if (bindingObject.Attribute) {
        this.ObserveChanges(change, bindingObject.Attribute, node, "Attribute");
      } else if (bindingObject.TextContent) {
        this.ObserveChanges(
          change,
          bindingObject.TextContent,
          node,
          "TextContent"
        );
      } else if (bindingObject.If) {
        this.ObserveChanges(change, bindingObject.If, node, "If");
      }
    });
  }

  apply(clone, key, value) {
    var newValue = value;
    var oldValue = clone[key];

    if (oldValue !== newValue) {
      return {
        name: key,
        newValue: newValue,
        oldValue: oldValue,
        type: "updated",
      };
    }
  }

  updateValues(bindingObject, change) {
    bindingObject.forEach(function (item) {
      var effectedPropertyName = change.name;

      item.keys.forEach(function (key, index) {
        key = change.arrayLengthObserver ? key : key.split(".").pop();
        if (key === effectedPropertyName) item.values[index] = change.newValue;
      });
    });
  }

  ObserveChanges(change, bindingObject, node, changeType) {
    const { webComponent, prototypeClone } = this;

    this.updateValues(bindingObject, change);

    if (node.nodeName === "INPUT" && node.type !== "checkbox") {
      node.value = change.newValue;
    }

    new Setters(
      node,
      { [changeType]: bindingObject },
      webComponent,
      prototypeClone,
      null,
      true
    );
  }
}
