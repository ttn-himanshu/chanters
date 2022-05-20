export const isArray = Array.isArray;

export const isFunction = (value) => {
  return typeof value === "function";
};
export const isNumber = (value) => {
  return typeof value === "number";
};
export const isString = (value) => {
  return typeof value === "string";
};

export const isBoolean = (value) => {
  return typeof value === "boolean";
};

/**
 * To check if a node contains text content or not
 **/
export const hasTextContent = (n) => {
  if (n.textContent.trim().length) return true;
  else return false;
};

/**
 * A template literal tag that creates an HTML <template> element from the
 * contents of the string.
 *
 * This allows you to write a Polymer Template in JavaScript.
 **/
export const html = function html(strings, ...values) {
  const template = document.createElement("template");
  template.innerHTML = strings[0];
  return template;
};
/**
 return object keys
  **/
export const keys = (obj) => {
  return isObject(obj) && Object.keys(obj);
};
/**
 * generic for loop
 **/
export const forLoop = (arr, callback) => {
  if (!arr) return;

  if (isArray(arr))
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && typeof callback === "function") callback(arr[i], i);
    }
  else if (isObject(arr))
    Object.keys(arr).forEach(function (key, index) {
      if (typeof callback === "function") callback(key, arr[key], index);
    });
};
/**
 * function to check is object
 **/
export const isObject = (value) => {
  return value !== null && value !== undefined && typeof value === "object";
};

/**
 * function to get binding variables
 **/
export const getBindingVariables = (str) => {
  if (str.indexOf("{{") !== -1)
    return str
      .trim()
      .match(/{{\s*[\w\.]+\s*}}/g)
      .map(function (x) {
        return x.match(/[\w\.]+/)[0];
      });
};

export const getAttributeByName = (attrName, n) => {
  return Array.prototype.slice.call(n.attributes).filter(function (attr) {
    if (attrName === attr.name) return attr;
  });
};

/**
 * function to set binding variables
 **/
export const setBindingVariables = (
  textContent,
  from,
  With,
  customElementName
) => {
  var str = textContent;
  for (var i = 0; i < from.length; i++) {
    if (With[i] !== undefined) {
      // if try to print object
      if (isObject(With[i])) With[i] = JSON.stringify(With[i]);

      str = str.replace(new RegExp("{{" + from[i] + "}}", "gi"), With[i]);
    } else {
      console.error(
        `${from[i]} property is not defined in ${customElementName}`
      );
    }
  }

  return str;
};

/**
 * function to get binding variable
 * values from custom element prototype
 **/

export const getValuesFromKeys = (
  keys,
  proto,
  customElement,
  node,
  nodeObject
) => {
  var values = [];

  forLoop(keys, function (key, i) {
    values.push(byString(proto, key, customElement, node, nodeObject));
  });
  return values;
};

const byString = (proto, str, customElement, node, nodeObject) => {
  const { templateInstance } = customElement;
  let prototype = { ...proto };
  str = str.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  str = str.replace(/^\./, ""); // strip a leading dot
  const nthStr = str.split(".");

  for (var i = 0, n = nthStr.length; i < n; ++i) {
    var k = nthStr[i];

    if (k in prototype) {
      if (
        (isString(prototype[k]) ||
          isNumber(prototype[k]) ||
          isBoolean(prototype[k])) &&
        nodeObject
      ) {
        mapNodes(node, nodeObject, templateInstance, str);
      }
      prototype = prototype[k];
    } else if (k in customElement) {
      prototype = customElement[k];
    } else {
      return;
    }
  }

  return prototype;
};

const mapNodes = (n, bindingObject, templateInstance, str) => {
  if (!templateInstance[str]) {
    templateInstance[str] = [];
  }

  templateInstance[str].push({
    node: n,
    bindingObject: bindingObject,
  });
};

// creates bindingObject from Getters class
export const createBindingObject = (nodeObject, bindingObject) => {
  var bindingType = bindingObject.bindingType;

  if (!nodeObject[bindingType]) nodeObject[bindingType] = [];

  nodeObject[bindingType].push(bindingObject);
};

export const attributeIterator = (
  node,
  proto,
  nodeObject,
  customElement,
  callback
) => {
  if (!node.attributes) return;

  forLoop(node.attributes, function (index, attr) {
    if (attr.value.indexOf("{{") !== -1 && node.nodeName !== "TEMPLATE") {
      let functionName = attr.value;
      if (attr.value.indexOf("(") !== -1) {
        functionName = attr.value.split("(")[0];
        functionName = functionName + "}}";
      }

      const _keys = getBindingVariables(functionName);

      if (isFunction(callback) && keys(_keys).length) callback(attr, _keys);
    } else if (attr.name === "items" && node.nodeName === "TEMPLATE") {
      // todo add below check in above if conditoin
      // && node.nodeName === "template-repeat"
      if (isFunction(callback)) callback(attr, null, true);
    } else if (attr.name === "if" && node.nodeName === "TEMPLATE") {
      if (isFunction(callback)) callback(attr, null, null, true);
    }
  });
};

export const cloneObject = (obj) => {
  if (isObject(obj)) return JSON.parse(JSON.stringify(obj));
};

export const getObject = (prototype, keys, force) => {
  let splitKeys = keys.split(".");

  for (let i = 0; i < splitKeys.length; i++) {
    const key = splitKeys[i];
    if ((key in prototype && typeof prototype[key] === "object") || force) {
      prototype = prototype[key];
    } else {
      // console.log("match found", prototype, keys);
    }
  }
  return prototype;
};

export const getFunctionArguments = (str) => {
  var args = /\(\s*([^)]+?)\s*\)/.exec(str);

  if (args[1]) {
    return args[1].split(/\s*,\s*/);
  }

  return args[0];
};

export const checkValuesFromKeys = (o, s, mapper) => {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  var a = s.split(".");

  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];

    if (k in o) {
      if (mapper[k] && i === a.length - 1) return false;

      if (isString(o[k]) || isNumber(o[k]) || typeof o[k] === "boolean")
        mapper[k] = true;

      if (isObject(o[k])) {
        if (!mapper[k]) mapper[k] = {};

        mapper = mapper[k];
      }

      o = o[k];
    } else {
      return;
    }
  }

  return true;
};

export const getFunctionParameters = (parameters, node, customElement) => {
  const arr = [];
  const { iteratorKey } = node;

  parameters.forEach((param) => {
    if (
      node.alias &&
      iteratorKey &&
      (param.startsWith(node.alias + ".") || param === node.alias)
    ) {
      param = iteratorKey;
    }
    if (param === "itemsIndex" && iteratorKey) {
      arr.push(iteratorKey.split(".").pop());
    } else {
      arr.push(getObject(customElement, param, true));
    }
  });
  return arr;
};

export const getReapeaterArrayPath = (node, attr) => {
  if (node.processedNode) {
    const splitChildKeys = attr.nodeValue.split(".");
    splitChildKeys.shift();
    return node.iteratorKey + "." + splitChildKeys.join("");
  }
  return attr.nodeValue;
};

export const isInputNode = (node) => {
  return (
    node.nodeName === "INPUT" &&
    (node.value.indexOf("{{") !== -1 ||
      node.getAttribute("checked").indexOf("{{") !== -1)
  );
};


export const handleRepeaterKeys = (keys, node, nodeObject, type, attr) => {
  var _from = keys;
  var _with = [];
  let _keys = [];
  var iteratorKey = node.iteratorKey;

  _with = keys.map((item) => {
    if (item.startsWith(node.alias + ".") || item === node.alias) {
      item = item.replace(node.alias || "item", iteratorKey);
    }
    _keys.push(item);
    return "{{" + item + "}}";
  });

  if (type === "textContent")
    node.textContent = setBindingVariables(node.textContent, _from, _with);
  else if (type === "attribute") {
    node.setAttribute(attr.name, setBindingVariables(attr.value, _from, _with));
  }

  return _keys;
};