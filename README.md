# x-postpress-code

A web component used for code highlighting.

## Load and register as a custom element

```js
import 'x-postpress-code'
```

## Example usages

Pass a source url:

```html
<x-postpress-code type="js" src="https://example.com/example.js"></x-postpress-code>
```

Include the source in the default slot (inside `pre` tags):

```html
<x-postpress-code type="bash"><pre>
#/usr/bin/env bash
for file in *; do
  echo $file
done
</pre></x-postpress-code>
```
