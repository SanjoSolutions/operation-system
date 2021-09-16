import { createTemplate } from './unnamed/createTemplate.js'
import { makeMovable } from './unnamed/makeMovable.js'

const template = createTemplate(`
  <template>
    <style>
      :host {
        display: inline-block;
        position: absolute;
      }
    
      .window {
        border: 1px solid black;
        background-color: white;
        display: inline-block;
        position: absolute;
      }
  
      .window-title {
        background-color: blue;
        color: white;
        font-family: sans-serif;
        border-bottom: 1px solid white;
        line-height: 1.5rem;
        height: 1.5rem;
        padding: 0 0.25rem;
        user-select: none;
      }
  
      .window-body {
  
      }
      
      iframe {
        display: block;
      }
    </style>
    <div class="window">
      <div class="window-title"></div>
      <div class="window-body">
        <iframe src="" width="640" height="480" frameborder="0"></iframe>
      </div>
    </div>
  </template>
`)

export class Window extends HTMLElement {
  constructor() {
    super()
    const templateContent = template.content
    this._shadowRoot = this.attachShadow({ mode: 'closed' })
    this._shadowRoot.appendChild(templateContent.cloneNode(true))
  }

  static get observedAttributes() {
    return [
      'title',
      'url',
    ]
  }

  getWindow() {
    return this._shadowRoot.querySelector('.window')
  }

  getTitle() {
    return this._shadowRoot.querySelector('.window-title')
  }

  getBodyIframe() {
    return this._shadowRoot.querySelector('.window-body iframe')
  }

  connectedCallback() {
    const $window = this.getWindow()
    const $title = this.getTitle()
    makeMovable(
      $window,
      {
        elementWithWhichTheElementCanBeMovedWith: $title,
        onPointerDown: () => {
          document.body.classList.add('disable-iframe-pointer-events')
        },
        onPointerUp: () => {
          document.body.classList.remove('disable-iframe-pointer-events')
        }
      }
    )
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title') {
      const $title = this.getTitle()
      $title.textContent = newValue
    } else if (name === 'url') {
      const $iframe = this.getBodyIframe()
      $iframe.src = newValue
    }
  }
}
