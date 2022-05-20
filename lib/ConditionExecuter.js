import {
  getValuesFromKeys,
  getBindingVariables,
  handleRepeaterKeys,
} from "./utils.js";

export const parseCondition = (bindingObject, nodeObject, attr) => {
  const { proto, customElement, template } = bindingObject;
  bindingObject.keys = getBindingVariables(bindingObject.raw);

  if (template.processedNode) {
    bindingObject.keys = handleRepeaterKeys(
      bindingObject.keys,
      template,
      nodeObject,
      "attribute",
      attr
    );
    bindingObject.raw = attr.value;
  }
  bindingObject.values = getValuesFromKeys(
    bindingObject.keys,
    proto,
    customElement,
    template,
    nodeObject
  );
  bindingObject.valuesType = bindingObject.values.map((val) => typeof val);
};

export const executeCondition = (str) => {
  return Function(`'use strict'; return (${str})`)();
};
