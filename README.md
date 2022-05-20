# vue-html-meta

[![npm version](https://badge.fury.io/js/vue-html-meta.svg)](https://badge.fury.io/js/vue-html-meta)

Easy rendering HTML meta tags for Vue.js (with SSR)

## Usage

```vue
<script setup>
import { useMeta } from 'vue-html-meta'

const meta = useMeta()
const { title, meta, jsonld } = meta.mount()

title.value = 'My Page'
meta.value = [
  { name: 'description', content: 'hello' }
]
jsonld.value = {
  '@context': 'https://schema.org'
}

// Render meta tags in <head> until to unmount this component:
//
// <title>My Page</title>
// <meta name="description" content="hello">
// <script type="application/ld+json">{"@context":"https://schema.org"}</script>
</script>

<template>
  <p>My Page</p>
  <!-- ... -->
</template>
```

## Install

```sh
npm inatll vue-html-meta

# if you use yarn
yarn add vue-html-meta
```

Create and install the plugin to your Vue app:

```javascript
import { createApp } from 'vue'
import { createMeta } from 'vue-html-meta'

const app = createApp(App)

// create meta plugin
const meta = createMeta()
app.use(meta)
```

## API

```typescript
function createMeta(options?: MetaPluginOptions): MetaPlugin
function useMeta(): MetaPlugin | undefined

interface MetaPlugin {
  mount(): MetaData
}

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

## Server Side Rendering (SSR)

```javascript
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { renderMeta } from 'vue-html-meta/server-renderer'

const app = createSSRApp(/* ... */)

const meta = createMeta({ ssr: true }) // should be ssr is true
app.use(meta)

const ctx = {} // share SSR context
const appHtml = await renderToString(app, ctx) // ctx will be taken metadata
const metaHtml = await renderMeta(ctx) // should pass same ctx as used by app

const html = htmlTemplate
  .replace(`<!--app-->`, appHtml)
  .replace(`<!--meta-->`, metaHtml)
```

## Known Issues

### Why not use Transport?

This is intentionally to avoid hydration, checking and errors.
`Transport` to the` head` tag can fail hydration.
This is because HTTP middleware and other libraries can change the `head`.
However there is room to consider the option of using transport.

## License

[Apache 2.0](./LICENSE)
