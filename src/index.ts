import { ref, inject, watch, h, defineComponent, onMounted, onUnmounted, onServerPrefetch } from 'vue'
import type { App, VNode, PropType, Ref } from 'vue'

const key = Symbol()

interface MetaPluginOptions {
  ssr?: boolean
}

class MetaPlugin {
  private _options: MetaPluginOptions
  private _tags: Ref<VNode[]>
  private _els: HTMLElement[]

  constructor(options: MetaPluginOptions) {
    this._options = options
    this._tags = ref([])
    this._els = []
    if (!this._options.ssr) {
      watch(this._tags, (_new, {}) => {
        for (const element of this._els) {
          element.remove()
        }
        this._els = _new.map((c) => toDOMElement(c))
        for (const element of this._els) {
          document.head.append(element)
        }
      })
    }
  }

  setTags(tags: VNode[]) {
    this._tags.value = tags
  }

  install(app: App) {
    app.config.globalProperties.$meta = this
    app.provide(key, this)
  }
}

export function createMeta(options: MetaPluginOptions): MetaPlugin {
  return new MetaPlugin(options)
}

export function injectMeta(): MetaPlugin | undefined {
  return inject(key)
}

function toDOMElement(node: VNode): HTMLElement {
  const element = document.createElement(<string>node.type)
  if (!!node.props) {
    for (const [k, v] of Object.entries(node.props)) {
      element.setAttribute(k, <string>v)
    }
  }
  if (!!node.children && typeof node.children === 'string') {
    element.append(document.createTextNode(node.children))
  }
  return element
}

export const AppMeta = defineComponent({
  name: 'AppMeta',
  inheritAttrs: false,

  props: {
    title: {
      type: String,
      required: false
    },
    meta: {
      type: Array as PropType<{ [key: string]: string }[]>,
      required: false,
      default: () => []
    },
    jsonld: {
      type: Object,
      required: false
    }
  },

  setup(props) {
    const $meta = injectMeta()
    const space = 2 /* import.meta.env.DEV ? 2 : undefined */
    const tags = <VNode[]>[h('title', {}, props.title), ...props.meta?.map((props) => h('meta', props))]
    if (!props.jsonld) {
      tags.push(h('script', { type: 'application/ld+json' }, JSON.stringify(props.jsonld, undefined, space)))
    }
    onMounted(() => {
      $meta?.setTags(tags)
      //document.title = title
    })
    onServerPrefetch(() => {
      $meta?.setTags(tags)
    })
    onUnmounted(() => {
      $meta?.setTags([])
    })
    return () => {
      return h('div')
      /*
      return h(
        Teleport,
        { to: document.head },
        children,
      )
      */
    }
  }
})

export default AppMeta
