export const ChantersConstants=e=>({AttributeObject:{bindingType:"Attribute",raw:"HTMLNode Attribute AttributeValue eg style: color:{{color}}, size:{{size}}  //or// class : dark-div {{hidden}}",keys:new Array,values:new Array,attributeName:"AttributeName eg Style/Class"},TextObect:{bindingType:"TextContent",raw:"HTMLNode textContent eg hello my name is {{user.name}} or color",keys:new Array,values:new Array},EventObject:{bindingType:"Event",raw:"HTMLNode Attribute name in which on-click/on-input or on-event name found",functionBody:"contains function which from webComponent prototype, always first level",eventName:"on-EventType"},repeaterObject:{parsingLevel:{bindingType:"Repeater",raw:"HTMLNode Attribute Value eg repeat = [[order in orders]] or friend in user.friendList",nextSibling:"template tag nextSibling",parentNode:"template tag parentNode",targetArray:new Array,cloneTargetArray:new Array,template:"orginal template for binding",templateClone:"create a clone from orginal template"},childLevel:{bindingType:"ReaterChild",processedNode:"either true or undefined",index:"index of currently repeating array",item:"object on which bingding is done",clone:"clone object for defineProperty",bindingObject:"object contains information of top level repeater on which we are iterating i.e parsingLevel"}},ConditionObject:{bindingType:"If",raw:"HTMLNode Attribute Value eg if = {{condition}}",template:"orginal template for binding",templateClone:"create a clone from orginal template",value:"parsed value of condition",nextSibling:"template tag nextSibling",parentNode:"template tag parentNode"}}[e]);