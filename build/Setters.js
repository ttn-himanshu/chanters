import{forLoop,isArray,setBindingVariables,keys,getFunctionParameters}from"./utils.js";import{walkNodes}from"./WebComponent.js";import Getters from"./Getters.js";import{executeCondition}from"./ConditionExecuter.js";export default class Setters{constructor(...e){const[t,s,o,r,n,i]=e;this.node=t,this.nodeObject=s,this.customElement=o,this.proto=r,this.observer=n,this.reParsing=i,this.beginWork()}beginWork(){const{nodeObject:e}=this;forLoop(e,((e,t)=>{isArray(t)&&forLoop(t,(t=>{switch(e){case"TextContent":this.__SetterTextNodes__(t);break;case"Attribute":this.__Setter__Attribute(t);break;case"Event":this.__Setter__Events(t);break;case"Repeater":this.__Setter__Repeaters(t);break;case"If":this.__Setter__Condition(t)}}))}))}__Setter__Condition(e){let{keys:t,values:s,raw:o,templateClone:r,nextSibling:n,valuesType:i}=e;if(!o)return void console.warn("Condition not found template",r.outerHTML);const{node:a,customElement:{nodeName:c},reParsing:d}=this;s=s.map(((e,t)=>"string"==typeof e&&"string"===i[t]?`'${e}'`:("number"===i[t]&&(e=""===e?null:+e),e)));const l=setBindingVariables(o,t,s,c);if(e.value=executeCondition(l),a.setAttribute("if",e.value),e.value){this.setBoundary(e,"start","start of if condition");const t=document.importNode(r.content,!0);d&&walkNodes(t,(t=>{t.setAttribute&&t.setAttribute("processed","yes"),t.processedNode=e.template.processedNode,t.iteratorKey=e.template.iteratorKey,t.alias=e.template.alias;const s=new Getters(t,this.customElement,this.customElement);keys(s).length&&(this.nodeObject=s,this.node=t,this.beginWork())})),e.parentNode.insertBefore(t,n),this.setBoundary(e,"end","end of if condition")}else e.start&&e.end&&(this.cleanUp(e,!0),e.start.remove(),e.end.remove())}setBoundary(e,t,s){const{template:o}=e;if(o){const o=document.createComment(s);e.parentNode.insertBefore(o,e.nextSibling),e[t]=o}}__Setter__Repeaters(e){this.setBoundary(e,"start","start of template repeat"),this.executeRepeaters(e),this.setBoundary(e,"end","end of template repeat"),e.nextSibling=e.end,e.targetArray=this.observer.observeArray(e,this.executeRepeaters.bind(this)),this.customElement[e.raw]=e.targetArray}executeRepeaters(e,t){t&&this.cleanUp(e),forLoop(e.targetArray,((s,o)=>{const{templateClone:r}=e;(s=>{walkNodes(s,(s=>{if(s.processedNode=!0,s.setAttribute&&s.setAttribute("processed","yes"),s.iteratorKey=e.raw+"."+o,s.alias=e.alias,t){const e=new Getters(s,this.customElement,this.proto);keys(e).length&&(this.nodeObject=e,this.node=s,this.beginWork(),this.observer.observe(s,e,t))}})),e.parentNode.insertBefore(s,e.nextSibling)})(document.importNode(r.content,!0))}))}cleanUp(e,t){const{parentNode:s,start:o,end:r}=e;let n=!1;for(var i,a=s.lastChild;a;a=i)i=a.previousSibling,a!==r?(a===o&&(n=!1),n&&s.removeChild(a)):n=!0;if(!t)for(let t in this.customElement.templateInstance)t.startsWith(e.raw+"."&&t!==e.raw+"."+length)&&delete this.customElement.templateInstance[t]}__Setter__Attribute(e){const{node:t,customElement:s}=this,{keys:o,values:r,raw:n,attributeName:i}=e,a=setBindingVariables(n,o,r,s.nodeName);"checkbox"===t.type&&"checked"===i?(t.checked=r[0],t.removeAttribute("checked")):t.setAttribute(e.attributeName,a)}__Setter__Events(e){const{node:t,customElement:s}=this;t.addEventListener(e.eventName,(function(o){try{o.stopPropagation();let r=[o];e.arguments&&e.arguments.length&&(r=r.concat(getFunctionParameters(e.arguments,t,s))),e.functionBody.apply(s,r),o.preventDefault()}catch(e){throw e}}),!0)}__SetterTextNodes__(e){const{node:t,customElement:s}=this,{keys:o,values:r,raw:n}=e;t.textContent=setBindingVariables(n,o,r,s.nodeName)}}