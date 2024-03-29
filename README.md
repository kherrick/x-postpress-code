# [x-postpress-code](https://kherrick.github.io/x-postpress-code/)

A web component used for code highlighting. [Try it out at JS BIN](https://j.mp/2JZUTAP).

## Usage

Use the type attribute and include the source in the default slot with `pre` tags to render static content:

```html
<x-postpress-code type="bash"><pre>
#/usr/bin/env bash
for file in *; do
  echo $file
done
</pre></x-postpress-code>
```

Lazy load the content to be highlighted by using both the type and src attributes:

```html
<x-postpress-code
  src="https://example.com/example.js"
  type="js"
></x-postpress-code>
```

## Installation

### from unpkg:

```html
<script
  src="https://unpkg.com/x-postpress-code"
  type="module"
></script>
```

### from npm

```bash
npm i x-postpress-code
```

```js
import 'x-postpress-code'
```

## Uses the following [highlight.js languages](https://github.com/highlightjs/highlight.js/tree/master/src/languages)

* `bash`
* `c`
* `csharp`
* `cpp`
* `css`
* `javascript`
* `json`
* `markdown`
* `php`
* `plaintext`
* `python`
* `shell`
* `typescript`
* `xml`
