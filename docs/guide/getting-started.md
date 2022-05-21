# Getting Started

[[toc]]

## Prerequisites

- Vue 3+

This library won't not support Vue 2 and below.

## Installation

```sh
npm inatll vue-html-meta
# or
yarn add vue-html-meta
```

Install the plugin to your Vue app:

```javascript {2,6-7}
import { createApp } from 'vue'
import { createMeta } from 'vue-html-meta'

const app = createApp(App)

const meta = createMeta()
app.use(meta)
```

## Mount to HTML

`mountMeta` is [Vue Composable](https://vuejs.org/guide/reusability/composables.html).
It returns `ref`s for setting meta information.

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

The metadata are rendered in the `<head>` tag:

```html
<head>
  <title>My Page</title>
  <meta name="description" content="hello">
  <script type="application/ld+json">{"@context":"https://schema.org"}</script>
</head>
```

These tags are automatically removed when the component is unmounted.

Changing the value of the `ref`s reacts to the DOM.

```vue
<script setup>
import { mountMeta } from 'vue-html-meta'

const { title } = metaMount()

title.value = 'loading'

// <title> will be changed with a new value
api.get.then((value) => title.value = value.title)
</script>
```

You can also use `reactive` to write:

```vue
<script setup>
import { reactive } from 'vue'
import { mountMeta } from 'vue-html-meta'

const meta = reactive(metaMount())

meta.title = 'My Page'
meta.meta = [
  { name: 'description', content: 'hello' }
]
meta.jsonld = {
  '@context': 'https://schema.org'
}
</script>
```

::: tip
`mountMeta` is only works in `setup()` or other Composable.
:::

## State Sharing

`mountMeta` always returns new `ref`s.
It mounts HTML individually for each call.
It is the user's responsibility to ensure that the content is not redundant.

For example, this is not the desired state, but it is correct behavior:

```javascript
// in Component A setup
const { title } = metaMount()
title.value = 'A'

// in Component B setup
const { title } = metaMount()
title.value = 'B'
```

```vue
<template>
  <A />
  <B />
</template>
```

```html
<head>
  <title>A</title>
  <title>B</title>
</head>
```

You can use `provide`/`inject` or state management libraries
to share `ref`s between components.

```vue
<script setup>
// in root component

// ...

const { title } = metaMount()

function updateTitle(value) {
  title.value = value
}

provide('title', { updateTitle })

// in child component
const { updateTitle } = inject('title')
updateTitle('A')
</script>
```

```vue
<script setup>
const { title } = metaMount()

// computed_title will be computed very complicatedly, probably
const computed_title = /* your store */

watch(computed_title, (next) => title.value = next)
</script>
```
