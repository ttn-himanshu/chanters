# Chanters

Chanters is a JavaScript library for creating browser supported re-usable web components.

## Install via npm

    npm install chanters
    
## Usage

```jsx
import Chanters from "chanters";
import { html } from "chanters/utils";

class CustomElement extends Chanters {
  static get properties() {
    return {
      hello: "world"
    };
  }
  
  static get template() {
    return html`
      <style>
        @import "path/to/cssfile";
      </style>
      <div class="footer">
        <label>{{hello}}</label>
        <input type="text" value="{{hello}}" />
      </div>
    `;
  }
}

customElements.define("custom-element", CustomElement);
```

## Adding Events
```jsx
import Chanters from "chanters";
import { html } from "chanters/utils";

class CustomElement extends Chanters {
  static get properties() {
    return {
      counter: 0
    };
  }
  
  handleClick() {
    this.counter++;
  }
  
  static get template() {
    return html`
      <style>
        @import "path/to/cssfile";
      </style>
      <div class="footer">
        <label>{{counter}}</label>
        <button on-click="{{handleClick}}">increment counter</button>
      </div>
    `;
  }
}

customElements.define("custom-element", CustomElement);
```
If one want to pass arguments to handle click function then use this syntax instead
```jsx
<button on-click="{{handleClick(arg1, arg2)}}">increment counter</button>
```

## Repeating templates
```jsx
```jsx
import Chanters from "chanters";
import { html } from "chanters/utils";

class CustomElement extends Chanters {
  static get properties() {
    return {
      arr: [1,2,3,4]
    };
  }
  
  static get template() {
    return html`
      <style>
        @import "path/to/cssfile";
      </style>
      <div class="footer">
        <template repeat items="arr" key="item">
            <label>{{item}}</label>
        </template>
      </div>
    `;
  }
}

customElements.define("custom-element", CustomElement);
```

## If Condition
```jsx
```jsx
import Chanters from "chanters";
import { html } from "chanters/utils";

class CustomElement extends Chanters {
  static get properties() {
    return {
      counter:0
    };
  }
  
  
  handleClick() {
    this.counter++;
  }
  
  static get template() {
    return html`
      <style>
        @import "path/to/cssfile";
      </style>
      <div class="footer">
        counter = {{counter}}
        <button on-click="{{handleClick}}">increment counter</button>
        <template if="{{counter}} === 4">
            <label>counter value is 4</label>
        </template>
      </div>
    `;
  }
}

customElements.define("custom-element", CustomElement);
```
