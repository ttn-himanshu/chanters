import { forLoop, keys } from "./utils.js";
import Getters from "./Getters.js";
import Setters from "./Setters.js";
import Observers from "./Observers.js";

export default class WebComponent {
  constructor(customElement, proto) {
    this.customElement = customElement;
    this.proto = proto;
    this.initializeComponent();
    this.beginWork();
  }

  beginWork = () => {
    const { customElement, proto } = this;
    var observer = new Observers(customElement, proto);
    customElement.templateInstance = new Object();

    walkNodes(customElement.shadowRoot, (node) => {
      /**
       * Get all the binding in a node
       * like @events, @id(ref), @repeat, @if,
       */
      const nodeObject = new Getters(node, customElement, proto);

      node.setAttribute && node.setAttribute("processed", "yes");
      /**
       * Set all the bindings in a node
       * @textBinding @attributeBinding - like @events, @id(ref)
       */
      if (keys(nodeObject).length) {
        new Setters(node, nodeObject, customElement, proto, observer);
        observer.observe(node, nodeObject);
      }
    });
  };

  ifParentIsAReapeater = (parent, child) => {
    if (parent.contains(child)) return true;
    return false;
  };

  initializeComponent = () => {
    const { customElement, proto } = this;
    customElement.$ = {};

    /**
     * handling props
     */
    if (keys(customElement.dataset).length) {
      customElement.props = {};
      forLoop(customElement.dataset, (key, value) => {
        customElement.props[key] = this.getProps(customElement, value);
      });
    }
  };

  getProps = (customElement, value) => {
    const parentComponent = customElement.getRootNode().host;
    
    if (parentComponent && parentComponent[value]) {
      if (typeof parentComponent[value] === "function") {
        return parentComponent[value].bind(parentComponent);
      } else {
        parentComponent[value];
      }
    } else {
      return value;
    }
  };
}

/**
 *  Recursive loop for html node
 *  node parser
 **/
export const walkNodes = (node, callback) => {
  if (node.childNodes.length > 0) {
    let child = node.firstChild;
    while (child) {
      if (callback && typeof callback === "function") callback(child);

      walkNodes(child, callback);
      child = child.nextSibling;
    }
  }
};
