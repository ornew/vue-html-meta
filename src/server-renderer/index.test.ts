import type { PropType } from 'vue'
import { createSSRApp, defineComponent, h, isReactive } from 'vue'
import type { SSRContext } from 'vue/server-renderer'
import { renderToString } from 'vue/server-renderer'
import { renderMeta } from '.'
import type { MetaProps } from '../core'
import { createMeta, mountMeta } from '../core'

describe('SSR', () => {
  test('title', async () => {
    document.head.outerHTML = ''
    const meta = createMeta({
      ssr: true
    })
    const spy = jest.fn(() => true)
    const app = createSSRApp(
      defineComponent({
        props: {
          title: String
        },
        setup(props) {
          const { title } = mountMeta() ?? {}
          expect(title).not.toBeUndefined()
          if (title) {
            title.value = props.title
            if (isReactive(props)) {
              // when SSR mode, props is not reactive so not reached here
              spy()
            }
          }
          return () => h('div')
        }
      }),
      {
        title: 'test'
      }
    )
    app.use(meta)

    const context: SSRContext = {}
    const appHtml = await renderToString(app, context)
    expect(appHtml).toBe('<div></div>')
    expect(context).toHaveProperty('meta')
    expect(spy.mock.calls.length).toBe(0)

    const metaHtml = await renderMeta(context)
    expect(metaHtml).toBe('<title data-ssr>test</title>')
  })

  test('meta', async () => {
    document.head.outerHTML = ''
    const meta = createMeta({
      ssr: true
    })
    const spy = jest.fn(() => true)
    const app = createSSRApp(
      defineComponent({
        props: {
          meta: Array as PropType<MetaProps[]>
        },
        setup(props) {
          const { meta } = mountMeta() ?? {}
          expect(meta).not.toBeUndefined()
          if (meta) {
            meta.value = props.meta
            if (isReactive(props)) {
              // when SSR mode, props is not reactive so not reached here
              spy()
            }
          }
          return () => h('div')
        }
      }),
      {
        meta: [{ name: 'description', content: 'hello' }]
      }
    )
    app.use(meta)

    const context: SSRContext = {}
    const appHtml = await renderToString(app, context)
    expect(appHtml).toBe('<div></div>')
    expect(context).toHaveProperty('meta')
    expect(spy.mock.calls.length).toBe(0)

    const metaHtml = await renderMeta(context)
    expect(metaHtml).toBe('<meta name="description" content="hello" data-ssr>')
  })

  test('jsonld', async () => {
    document.head.outerHTML = ''
    const meta = createMeta({
      ssr: true
    })
    const spy = jest.fn(() => true)
    const app = createSSRApp(
      defineComponent({
        props: {
          jsonld: Object
        },
        setup(props) {
          const { jsonld } = mountMeta() ?? {}
          expect(jsonld).not.toBeUndefined()
          if (jsonld) {
            jsonld.value = props.jsonld
            if (isReactive(props)) {
              // when SSR mode, props is not reactive so not reached here
              spy()
            }
          }
          return () => h('div')
        }
      }),
      {
        jsonld: {
          '@context': 'https://schema.org'
        }
      }
    )
    app.use(meta)

    const context: SSRContext = {}
    const appHtml = await renderToString(app, context)
    expect(appHtml).toBe('<div></div>')
    expect(context).toHaveProperty('meta')
    expect(spy.mock.calls.length).toBe(0)

    const metaHtml = await renderMeta(context)
    expect(metaHtml).toBe('<script type="application/ld+json" data-ssr>{"@context":"https://schema.org"}</script>')
  })
})
