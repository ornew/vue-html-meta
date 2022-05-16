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

## Components

### `<AppMeta>`

```
interface Props {
  title?: string
  meta?: Meta
}

interface Meta {
}
```

## Known Issues

## License

[Apache 2.0](./LICENSE)
