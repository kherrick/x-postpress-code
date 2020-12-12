import { formatCode } from './utils'

type XPostpressCodeObservedAttributes = 'type' | 'src'

export const XPostpressCodeTemplate = (formattedCode: string, type: string) => `
  <style>
    :host {
      display: block;
    }

    div {
      position: relative;
    }

    .lang {
      padding: 0.25rem;
    }

    .lang-theme {
      border-radius: 0.375rem;
      border: 0.125rem solid rgba(200, 200, 200, 0.5);
      color: #aaa;
      font-family: monospace;
      font-size: 0.75em;
      line-height: 1rem;
      padding: 0.25rem;
      position: absolute;
      right: 0.5rem;
      text-align: center;
      top: 0.25rem;
    }

    pre {
      margin: 0;
    }

    code.hljs {
      border-radius: 0.375rem;
      font-family: monospace;
      padding: calc(0.5rem * 2);
    }

    .hljs {
      background: #2b2b2b;
      color: #bababa;
      display: block;
      overflow-x: auto;
    }

    .hljs-emphasis, .hljs-strong {
      color: #a8a8a2;
    }

    .hljs-bullet,
    .hljs-link,
    .hljs-literal
    .hljs-number,
    .hljs-quote,
    .hljs-regexp {
      color: #6896ba;
    }

    .hljs-code,
    .hljs-selector-class {
      color: #a6e22e;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-attribute,
    .hljs-keyword,
    .hljs-name,
    .hljs-section,
    .hljs-selector-tag,
    .hljs-variable {
      color: #cb7832;
    }

    .hljs-params {
      color: #b9b9b9;
    }

    .hljs-string {
      color: #6a8759;
    }

    .hljs-addition
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-selector-attr,
    .hljs-selector-id,
    .hljs-selector-pseudo,
    .hljs-subst,
    .hljs-symbol,
    .hljs-template-tag,
    .hljs-template-variable,
    .hljs-type, {
      color: #e0c46c;
    }

    .hljs-comment,
    .hljs-deletion,
    .hljs-meta {
      color: #7f7f7f;
    }
  </style>
  <div>
    <div part="lang-theme" class="lang-theme">
      <div class="lang">${type}</div>
    </div>
    <pre><code class="hljs ${type}">${formattedCode}</code></pre>
  </div>
`

export class XPostpressCode extends HTMLElement {
  constructor() {
    super()
  }

  private _type: string | undefined = ''

  set type(type) {
    if (type) {
      this._type = type
      this.setAttribute('type', type)

      return
    }

    this._type = undefined
    this.removeAttribute('type')
  }

  get type() {
    return this.getAttribute('type')
  }

  private _src: string | undefined = ''

  set src(src) {
    if (src) {
      this._src = src
      this.setAttribute('src', src)

      return
    }

    this._src = undefined
    this.removeAttribute('src')
  }

  get src() {
    return this.getAttribute('src')
  }

  static get observedAttributes(): XPostpressCodeObservedAttributes[] {
    return ['type', 'src']
  }

  private _hasRendered: boolean = false
  private _listener: any

  connectedCallback() {
    this.attachShadow({ mode: 'open' })

    const host = this.shadowRoot?.host as HTMLElement

    if (host) {
      host.style.whiteSpace = 'normal'
    }

    this.render(this.shadowRoot, '<slot id="removeMe"></slot>')

    new Promise((res, rej) => {
      const slot = this.shadowRoot?.querySelector('slot')

      this._listener = slot?.addEventListener('slotchange', event => {
        let content = ''

        this.shadowRoot?.querySelector('slot')?.assignedNodes().forEach(({ nodeName, textContent }) => {
          content = content + textContent
        })

        res(content)
      })
    }).then(nodeVal => {
      if (this.type && !this.src && !this._hasRendered) {
        this._hasRendered = true

        this.render(
          this.shadowRoot,
          XPostpressCodeTemplate(`${formatCode(nodeVal, `${this.type}`)}`, `${this.type}`)
        )
      }
    }).then(() => {
      (this.shadowRoot?.getElementById('removeMe') as HTMLElement).remove()
    })
  }

  async attributeChangedCallback(
    name: XPostpressCodeObservedAttributes,
    oldValue: string,
    newValue: string
  ) {
    if (newValue === null) {
      return
    }

    switch (name) {
      case 'type':
        this._type = newValue
        break
      case 'src':
        this._src = newValue
        break
    }

    if (this.type && this.src && !this._hasRendered) {
      this._hasRendered = true
      this.fetchSrc(this.src).then(src => {
        this.render(this.shadowRoot, XPostpressCodeTemplate(formatCode(src, this.type), this.type))
      })
    }
  }

  private fetchSrc(url: string) {
    return fetch(`${url}`)
      .then(res => res.text())
      .then(json => {

        return json
      })
  }

  private render(target: any, html: string) {
    const template = document.createElement('template')
    template.innerHTML = html

    target?.appendChild(template.content.cloneNode(true))
  }
}

if (!customElements.get('x-postpress-code')) {
  customElements.define('x-postpress-code', XPostpressCode)
}
