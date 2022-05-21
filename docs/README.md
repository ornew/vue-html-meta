---
home: true
title: Home
#heroImage: ''
actions:
  - text: Get Started
    link: /guide/getting-started.html
    type: primary
#features:
#  - title: Simplicity First
#    details: Minimal
---

## How it works

```vue
<script setup>
import { mountMeta } from 'vue-html-meta'

const { title, meta, jsonld } = mountMeta()

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

## License

[Apache 2.0](https://github.com/ornew/vue-html-meta/blob/main/LICENSE)
