# Chanters

Chanters is a JavaScript library for creating browser supported re-usable web components.

##Install via npm

    npm install chanters
    
##Usage

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
