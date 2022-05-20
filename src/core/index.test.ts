import { flushPromises, mount } from '@vue/test-utils'
import type { PropType } from 'vue'
import { h, isReactive, watch } from 'vue'
import type { MetaProps } from '.'
import { createMeta, useMeta } from '.'

describe('mount', () => {
  beforeEach(() => {
    document.head.outerHTML = ''
  })
  afterEach(() => {
    document.head.outerHTML = ''
  })

  test('title', async () => {
    const meta = createMeta()
    const app = mount(
      {
        props: {
          title: String
        },
        setup(props) {
          const { title } = useMeta()?.mount() ?? {}
          if (title) {
            title.value = props.title
            if (isReactive(props)) {
              watch(props, (n) => {
                title.value = n.title
              })
            }
          }
          return () => h('div')
        }
      },
      {
        global: {
          plugins: [meta]
        },
        props: {
          title: 'test'
        }
      }
    )

    await flushPromises()

    expect(document.title).toBe('test')

    const t1 = document.querySelector('head title')
    expect(t1).not.toBeNull()
    expect(t1?.innerHTML).toBe('test')

    const nt1 = document.querySelectorAll('head :not(title)')
    expect(nt1.length).toBe(0)

    await app.setProps({
      title: 'test-2'
    })

    expect(document.title).toBe('test-2')

    const t2 = document.querySelector('head title')
    expect(t2).not.toBeNull()
    expect(t2?.innerHTML).toBe('test-2')

    const nt2 = document.querySelectorAll('head :not(title)')
    expect(nt2.length).toBe(0)

    app.unmount()

    await flushPromises()

    expect(document.title).toBe('')

    const t_ = document.querySelector('head title')
    expect(t_).toBeNull()

    const nt_ = document.querySelectorAll('head :not(title)')
    expect(nt_.length).toBe(0)
  })

  test('meta', async () => {
    const meta = createMeta()
    const app = mount(
      {
        props: {
          meta: Array as PropType<MetaProps[]>
        },
        setup(props) {
          const { meta } = useMeta()?.mount() ?? {}
          if (meta) {
            meta.value = props.meta
            if (isReactive(props)) {
              watch(props, (n) => {
                meta.value = n.meta
              })
            }
          }
          return () => h('div')
        }
      },
      {
        global: {
          plugins: [meta]
        },
        props: {
          meta: [{ name: 'title', content: 'hello' }]
        }
      }
    )

    await flushPromises()

    const t1 = document.querySelectorAll('head meta')
    expect(t1.length).toBe(1)
    expect(t1[0]?.outerHTML).toBe('<meta name="title" content="hello">')

    const nt1 = document.querySelectorAll('head :not(meta)')
    expect(nt1.length).toBe(0)

    await app.setProps({
      meta: [
        { name: 'title', content: 'changed' },
        { name: 'description', content: 'we are happy' }
      ]
    })

    const t2 = document.querySelectorAll('head meta')
    expect(t2.length).toBe(2)
    expect(t2[0]?.outerHTML).toBe('<meta name="title" content="changed">')
    expect(t2[1]?.outerHTML).toBe('<meta name="description" content="we are happy">')

    const nt2 = document.querySelectorAll('head :not(meta)')
    expect(nt2.length).toBe(0)

    app.unmount()

    await flushPromises()

    const t_ = document.querySelectorAll('head meta')
    expect(t_.length).toBe(0)

    const nt_ = document.querySelectorAll('head :not(meta)')
    expect(nt_.length).toBe(0)
  })

  test('jsonld', async () => {
    const meta = createMeta()
    const jsonld = {
      '@context': 'https://schema.org',
      foo: 'bar',
      arr: [2, 3]
    }
    const json = `{"@context":"https://schema.org","foo":"bar","arr":[2,3]}`
    const app = mount(
      {
        props: {
          jsonld: Object
        },
        setup(props) {
          const { jsonld } = useMeta()?.mount() ?? {}
          if (jsonld) {
            jsonld.value = props.jsonld
            if (isReactive(props)) {
              watch(props, (n) => {
                jsonld.value = n.jsonld
              })
            }
          }
          return () => h('div')
        }
      },
      {
        global: {
          plugins: [meta]
        },
        props: {
          jsonld
        }
      }
    )

    await flushPromises()

    const t1 = document.querySelector('head script')
    expect(t1).not.toBeNull()
    expect(t1?.innerHTML).toBe(json)

    const nt1 = document.querySelectorAll('head :not(script)')
    expect(nt1.length).toBe(0)

    await app.setProps({
      jsonld: {}
    })

    const t2 = document.querySelector('head script')
    expect(t2).not.toBeNull()
    expect(t2?.innerHTML).toBe('{}')

    const nt2 = document.querySelectorAll('head :not(script)')
    expect(nt2.length).toBe(0)

    app.unmount()

    await flushPromises()

    const t_ = document.querySelector('head script')
    expect(t_).toBeNull()

    const nt_ = document.querySelectorAll('head :not(script)')
    expect(nt_.length).toBe(0)
  })
})
