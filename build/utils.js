export const isArray=Array.isArray;export const isFunction=t=>"function"==typeof t;export const isNumber=t=>"number"==typeof t;export const isString=t=>"string"==typeof t;export const isBoolean=t=>"boolean"==typeof t;export const hasTextContent=t=>!!t.textContent.trim().length;export const html=function(t,...e){const n=document.createElement("template");return n.innerHTML=t[0],n};export const keys=t=>isObject(t)&&Object.keys(t);export const forLoop=(t,e)=>{if(t)if(isArray(t))for(var n=0;n<t.length;n++)t[n]&&"function"==typeof e&&e(t[n],n);else isObject(t)&&Object.keys(t).forEach((function(n,r){"function"==typeof e&&e(n,t[n],r)}))};export const isObject=t=>null!=t&&"object"==typeof t;export const getBindingVariables=t=>{if(-1!==t.indexOf("{{"))return t.trim().match(/{{\s*[\w\.]+\s*}}/g).map((function(t){return t.match(/[\w\.]+/)[0]}))};export const getAttributeByName=(t,e)=>Array.prototype.slice.call(e.attributes).filter((function(e){if(t===e.name)return e}));export const setBindingVariables=(t,e,n,r)=>{for(var o=t,i=0;i<e.length;i++)void 0!==n[i]?(isObject(n[i])&&(n[i]=JSON.stringify(n[i])),o=o.replace(new RegExp("{{"+e[i]+"}}","gi"),n[i])):console.error(`${e[i]} property is not defined in ${r}`);return o};export const getValuesFromKeys=(t,e,n,r,o)=>{var i=[];return forLoop(t,(function(t,s){i.push(byString(e,t,n,r,o))})),i};const byString=(t,e,n,r,o)=>{const{templateInstance:i}=n;let s={...t};const a=(e=(e=e.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split(".");for(var c=0,p=a.length;c<p;++c){var l=a[c];if(l in s)(isString(s[l])||isNumber(s[l])||"boolean"==typeof s[l])&&o&&mapNodes(r,o,i,e),s=s[l];else{if(!(l in n))return;s=n[l]}}return s},mapNodes=(t,e,n,r)=>{n[r]||(n[r]=[]),n[r].push({node:t,bindingObject:e})};export const createBindingObject=(t,e)=>{var n=e.bindingType;t[n]||(t[n]=[]),t[n].push(e)};export const attributeIterator=(t,e,n,r,o)=>{t.attributes&&forLoop(t.attributes,(function(e,n){if(-1!==n.value.indexOf("{{")&&"TEMPLATE"!==t.nodeName){let t=n.value;-1!==n.value.indexOf("(")&&(t=n.value.split("(")[0],t+="}}");const e=getBindingVariables(t);isFunction(o)&&(r=e,isObject(r)&&Object.keys(r)).length&&o(n,e)}else"items"===n.name&&"TEMPLATE"===t.nodeName?isFunction(o)&&o(n,null,!0):"if"===n.name&&"TEMPLATE"===t.nodeName&&isFunction(o)&&o(n,null,null,!0);var r}))};export const cloneObject=t=>{if(isObject(t))return JSON.parse(JSON.stringify(t))};export const getObject=(t,e,n)=>{let r=e.split(".");for(let e=0;e<r.length;e++){const o=r[e];(o in t&&"object"==typeof t[o]||n)&&(t=t[o])}return t};export const getFunctionArguments=t=>{var e=/\(\s*([^)]+?)\s*\)/.exec(t);return e[1]?e[1].split(/\s*,\s*/):e[0]};export const checkValuesFromKeys=(t,e,n)=>{for(var r=(e=(e=e.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),o=0,i=r.length;o<i;++o){var s=r[o];if(!(s in t))return;if(n[s]&&o===r.length-1)return!1;(isString(t[s])||isNumber(t[s])||"boolean"==typeof t[s])&&(n[s]=!0),isObject(t[s])&&(n[s]||(n[s]={}),n=n[s]),t=t[s]}return!0};export const getFunctionParameters=(t,e,n)=>{const r=[],{iteratorKey:o}=e;return t.forEach((t=>{e.alias&&o&&(t.startsWith(e.alias+".")||t===e.alias)&&(t=o),"itemsIndex"===t&&o?r.push(o.split(".").pop()):r.push(getObject(n,t,!0))})),r};export const getReapeaterArrayPath=(t,e)=>{if(t.processedNode){const n=e.nodeValue.split(".");return n.shift(),t.iteratorKey+"."+n.join("")}return e.nodeValue};export const isInputNode=t=>"INPUT"===t.nodeName&&(-1!==t.value.indexOf("{{")||-1!==t.getAttribute("checked").indexOf("{{"));export const handleRepeaterKeys=(t,e,n,r,o)=>{var i,s=t;let a=[];var c=e.iteratorKey;return i=t.map((t=>((t.startsWith(e.alias+".")||t===e.alias)&&(t=t.replace(e.alias||"item",c)),a.push(t),"{{"+t+"}}"))),"textContent"===r?e.textContent=setBindingVariables(e.textContent,s,i):"attribute"===r&&e.setAttribute(o.name,setBindingVariables(o.value,s,i)),a};