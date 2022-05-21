# vue-html-meta

[![npm version](https://badge.fury.io/js/vue-html-meta.svg)](https://badge.fury.io/js/vue-html-meta)

- [Getting Started](docs/guide/getting-started.md)
- [Server-Side Rendering](docs/guide/server-side-rendering.md)

## How it works

```vue
<script setup>
import { mountMeta } from 'vue-html-meta'

const { title, meta, jsonld } = metaMount()

title.value = 'My Page'
meta.value = [
  { name: 'description', content: 'hello' }
]
jsonld.value = {
  '@context': 'https://schema.org'
}
</script>
```

```html
<head>
  <title>My Page</title>
  <meta name="description" content="hello">
  <script type="application/ld+json">{"@context":"https://schema.org"}</script>
</head>
```

```sh
npm inatll vue-html-meta
# or
yarn add vue-html-meta
```

## API

### createMeta

- `createMeta(options?: MetaPluginOptions): MetaPlugin`

### mountMeta

- `mountMeta(): MetaData | undefined`

```
interface MetaData {
  /*
   * The text of <title>
   */
  title: Ref<string | undefined>

  /*
   * The attributes of <meta> tags
   */
  meta: Ref<MetaProps[] | undefined>

  /*
   * JSON-LD. This value will stringify to JSON and
   * render to <script type="application/ld+json">{...}</script> in <head>
   */
  jsonld: Ref<object | undefined>
}

type MetaProps = {
  [key: string]: string
}
```

## Known Issues

### Why not use Transport?

This is intentionally to avoid hydration, checking and errors.
`Transport` to the` head` tag can fail hydration.
This is because HTTP middleware and other libraries can change the `head`.
However there is room to consider the option of using transport.

## License

[Apache 2.0](./LICENSE)
