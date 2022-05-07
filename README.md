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

  <!-- Render meta tags in head until to unmount this component. -->
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

## Server Side Rendering (SSR)

### Vite.js

```js
import { createMeta } from 'vue-html-meta'

const app = createSSRApp(App)
const meta = createMeta()
app.use(meta)

// ...

// SSR logic
const appHtml = await renderToString(app, ctx)
const metaHtml = await renderMeta(meta)

const html = template
  .replace(`<!--preload-links-->`, preloadLinksHtml)
  .replace(`<!--app-->`, appHtml)
  .replace(`<!--meta-->`, metaHtml)
```

## Components

### `AppMeta`

TBW

## License

[Apache 2.0](./LICENSE)
