import { createTemplate } from './unnamed/createTemplate.js'
import { makeMovable } from './unnamed/makeMovable.js'

const template = createTemplate(`
  <template>
    <link rel="stylesheet" href="material-design-icons/outlined.css">
    <style>
      :host {
        display: flex;
        flex-direction: column;
        align-content: stretch;
        justify-content: stretch;
        position: absolute;
        width: 640px;
        height: 480px;
      }
    
      .window {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        border: 1px solid black;
        background-color: white;
      }
  
      .window-title {
        flex: 0 0 auto;
        display: flex;
        flex-direction: row;
        background-color: blue;
        color: white;
        font-family: sans-serif;
        border-bottom: 1px solid white;
        line-height: 1.5rem;
        height: 1.5rem;
        padding-left: 0.25rem;
        user-select: none;
      }
      
      .window-title-text {
        flex: 1 1 auto;
      }
      
      .window-maximize {
        box-sizing: border-box;
        flex: 0 0 auto;
        display: flex;
        border-left: 1px solid white;
        width: 1.5rem;
        align-items: center;
        justify-content: center;
        padding: 0 0.125rem;
      }
      
      .window-maximize:hover {
        background-color: hsl(240deg 100% 45%);
      }
      
      .window-maximize .material-icons-outlined {
        font-size: 1rem;
      }
  
      .window-body {
        flex: 1 1 auto;
        display: flex;
        flex-direction: row;
        align-content: stretch;
        align-items: stretch;
      }
  
      .window-body iframe {
        flex: 1 1 auto;
        display: block;
      }
    </style>
    <div class="window">
      <div class="window-title">
        <div class="window-title-text"></div>
        <div class="window-maximize">
          <span class="material-icons-outlined">
            maximize
          </span>  
        </div>
      </div>
      <div class="window-body">
        <iframe src="" frameborder="0"></iframe>
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

  getTitleText() {
    return this._shadowRoot.querySelector('.window-title-text')
  }

  getMaximize() {
    return this._shadowRoot.querySelector('.window-maximize')
  }

  getBodyIframe() {
    return this._shadowRoot.querySelector('.window-body iframe')
  }

  connectedCallback() {
    const $titleText = this.getTitleText()

    this._makeMaximizable()

    makeMovable(
      this,
      {
        elementWithWhichTheElementCanBeMovedWith: $titleText,
        onPointerDown: () => {
          document.body.classList.add('disable-iframe-pointer-events')
        },
        onPointerUp: () => {
          document.body.classList.remove('disable-iframe-pointer-events')
        }
      }
    )
  }

  _makeMaximizable() {
    this.getMaximize().addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent(
        'maximize'
      ))
    })
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title') {
      const $titleText = this.getTitleText()
      $titleText.textContent = newValue
    } else if (name === 'url') {
      const $iframe = this.getBodyIframe()
      $iframe.src = newValue
    }
  }
}
