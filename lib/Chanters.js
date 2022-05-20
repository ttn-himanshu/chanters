import WebComponent from "./WebComponent.js";

export default class Chanters extends HTMLElement {
  constructor() {
    super();
    this.init();
  }
  /**
   * @initialize the new custom Element
   **/
  init = () => {
    this.attachShadowRoot();
    const webComponent = new WebComponent(this, this.constructor.properties);
  };

  // onReady = (webComponent) => {
  //   if (
  //     webComponent?.customElement?.onReady &&
  //     typeof webComponent.customElement.onReady === "function"
  //   ) {
  //     webComponent.customElement.onReady();
  //   }
  // };

  /**
   * create template tag and append it into custom elemants shadow root
   *
   **/
  attachShadowRoot = () => {
    const template = this.constructor.template;
    const clone = document.importNode(template.content, true);
    this.attachShadow({ mode: "open" }).appendChild(clone);
  };

  connectedCallback() {
    console.log("custom element connectedCallback called", this.nodeName);
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.", this.nodeName);
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.", this.nodeName);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element attributes changed.', this.nodeName);
  }
}
