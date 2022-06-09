import type { App, InjectionKey, Ref, VNode } from 'vue'
import { getCurrentInstance, h, inject, onMounted, onServerPrefetch, onUnmounted, ref, useSSRContext, watch } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $meta: MetaPlugin
  }
}

const key = Symbol.for('vue-html-meta') as InjectionKey<MetaPlugin>

export interface MetaPluginOptions {
  ssr?: boolean
  space?: number
}

export type MetaProps = { [key: string]: string }

export interface MetaData {
  title: Ref<string | undefined>
  meta: Ref<MetaProps[] | undefined>
  jsonld: Ref<object | undefined>

  unmount: () => void
}

export class MetaPlugin {
  private _options: MetaPluginOptions
  private _cleanedSSR: boolean

  constructor(options?: MetaPluginOptions) {
    this._options = options || {}
    this._cleanedSSR = false
  }

  mount(): MetaData {
    const title = ref<string | undefined>()
    const meta = ref<MetaProps[] | undefined>()
    const jsonld = ref<object | undefined>()

    let els: HTMLElement[] = []

    const unmount = () => {
      for (const element of els) {
        element.remove()
      }
      els = []
    }
    const mount = (next: VNode[]) => {
      if (!this._options?.ssr) {
        this.cleanSSR()
        unmount()
        els = next.map((c) => toDOMElement(c))
        for (const element of els) {
          document.head.append(element)
        }
        //document.title = title
      }
    }

    watch([title, meta, jsonld], ([title, meta, jsonld]) => {
      const vnodes = this.toVNodes(title, meta, jsonld)
      mount(vnodes)
    })

    onMounted(() => {
      const vnodes = this.toVNodes(title.value, meta.value, jsonld.value)
      mount(vnodes)
    })
    onServerPrefetch(() => {
      const vnodes = this.toVNodes(title.value, meta.value, jsonld.value)
      const context = useSSRContext() ?? {}
      context['meta'] = vnodes
    })
    onUnmounted(unmount)

    return {
      title,
      meta,
      jsonld,

      unmount
    }
  }

  install(app: App) {
    app.config.globalProperties.$meta = this
    app.provide(key, this)
  }

  private cleanSSR() {
    if (this._options?.ssr) {
      return
    }
    if (!this._cleanedSSR) {
      for (const element of document.querySelectorAll<HTMLElement>('head [data-ssr]')) {
        element.remove()
      }
      this._cleanedSSR = true
    }
  }

  private toVNodes(title?: string, meta?: MetaProps[], jsonld?: object): VNode[] {
    let vnodes: VNode[] = []
    if (title) {
      vnodes.push(h('title', {}, title))
    }
    if (meta) {
      vnodes = [...vnodes, ...meta.map((props) => h('meta', props))]
    }
    if (jsonld) {
      vnodes.push(h('script', { type: 'application/ld+json' }, JSON.stringify(jsonld, undefined, this._options?.space)))
    }
    return vnodes
  }
}

export let activeMeta: MetaPlugin | undefined

export function createMeta(options?: MetaPluginOptions): MetaPlugin {
  activeMeta = new MetaPlugin(options)
  return activeMeta
}

export function useMeta(): MetaPlugin | undefined {
  return (getCurrentInstance() && inject(key)) || activeMeta
}

export function mountMeta(): MetaData | undefined {
  const meta = useMeta()
  return meta?.mount()
}

function toDOMElement(node: VNode): HTMLElement {
  const element = document.createElement(node.type as string)
  if (node.props) {
    for (const [k, v] of Object.entries(node.props)) {
      element.setAttribute(k, v as string)
    }
  }
  if (node.children && typeof node.children === 'string') {
    element.append(document.createTextNode(node.children))
  }
  return element
}
