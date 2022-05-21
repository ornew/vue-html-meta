# Server-Side Rendering (SSR)

```javascript
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { renderMeta } from 'vue-html-meta/server-renderer'

const app = createSSRApp(/* ... */)

// should be ssr is true
const meta = createMeta({ ssr: true })
app.use(meta)

// share SSR context
const ctx = {}

// ctx will be taken metadata
const appHtml = await renderToString(app, ctx)

// should pass same ctx as used for rendering app
const metaHtml = await renderMeta(ctx)

const html = htmlTemplate
  .replace(`<!--app-->`, appHtml)
  .replace(`<!--meta-->`, metaHtml)
```
