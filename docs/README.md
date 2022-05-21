---
home: true
title: Home
#heroImage: ''
actions:
  - text: Get Started
    link: /guide/getting-started.html
    type: primary
features:
  - title: Simplicity First
    details: Minimal
---

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

## License

[Apache 2.0](https://github.com/ornew/vue-html-meta/blob/main/LICENSE)
