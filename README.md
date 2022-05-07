# vue-html-meta

Easy setting HTML tags in head (title, meta, jsonld, etc...) for Vue

## Usage

```vue
<script setup>
import { AppMeta } from 'vue-html-meta'

const jsonld = { /**/ }
</script>

<template>

  <!-- Reender meta tags in head until to unmount this component. -->
  <AppMeta title="My Page" :jsonld="jsonld">

  <p>My Page</p>
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
