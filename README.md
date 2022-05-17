# vue-html-meta

Easy rendering HTML meta tags for Vue.js (with SSR)

## Usage

```vue
<script setup>
import { AppMeta } from 'vue-html-meta'

const jsonld = {
  '@context': 'https://schema.org',
  ...
}
</script>

<template>

  <!-- Render meta tags in <head> until to unmount this component. -->
  <AppMeta title="My Page" :jsonld="jsonld">
  <!--
    <title>My Page</title>
    <script type="application/json+ld">{
      "@context": "https://schema.org"
    }</script>
  -->

  <p>My Page</p>
  <!-- ... -->
</template>
```

## Install

```
npm inatll vue-html-meta

# if you use yarn
yarn add vue-html-meta
```

Create and install the plugin to your Vue app:

```js
import { createMeta } from 'vue-html-meta'

const app = createSSRApp(App)

// create meta plugin
const meta = createMeta()
app.use(meta)
```

## Components

### `<AppMeta>`

Props

```typescript
interface _AppMetaProps {
  /*
   * The text of <title>
   */
  title?: string

  /*
   * The attributes of <meta> tags
   *
   * e.g, <AppMeta meta="[{ a: '10', b: '20' }]" />
   *   => <meta a="10" b="20" />
   */
  meta?: {key: string: string}[]

  /*
   * JSON-LD. This value will stringify to JSON and
   * render to <script type="application/json+ld">{...}</script> in <head>
   */
  jsonld?: object
}
```

## Server Side Rendering (SSR)

### Vite.js

Learn more about SSR: ["Server-Side Rendering | Vite"](https://vitejs.dev/guide/ssr.html)

```js
// SSR logic
const appHtml = await renderToString(app, ctx)
const metaHtml = await renderMeta(meta)

const html = template
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
