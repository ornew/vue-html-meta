import type { Component } from 'vue'
import { createSSRApp } from 'vue'
import type { SSRContext } from 'vue/server-renderer'
import { renderToString } from 'vue/server-renderer'
import { renderMeta } from '.'
import { createMeta } from '../core'
import { TestComponent } from '../test'

describe('SSR', () => {
  test('title', async () => {
    document.head.outerHTML = ''
    const meta = createMeta({
      ssr: true
    })
    const app = createSSRApp(<Component>TestComponent, {
      title: 'test'
    })
    app.use(meta)

    const context: SSRContext = {}
    const appHtml = await renderToString(app, context)
    expect(appHtml).toBe('<div>test</div>')
    expect(context).toHaveProperty('meta')

    const metaHtml = await renderMeta(context)
    expect(metaHtml).toBe('<title>test</title>')
  })
})
