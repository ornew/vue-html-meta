import { ref, inject, watch, h, onMounted, onUnmounted, onServerPrefetch } from 'vue'

const key = Symbol()

class MetaProvider {
  constructor(options) {
    this._tags = ref([])
    this._els = []
    if (!import.meta.env.SSR) {
      watch(this._tags, (_new, _old) => {
        for (const element of this._els) {
          element.remove()
        }
        this._els = _new.map(c => toDOMElement(c))
        for (const element of this._els) {
          element.remove()
        }
      })
    }
  }

  install(app) {
    app.config.globalProperties.$meta = this
    app.provide(key, this)
  }
}

export function createMeta(options) {
  return new MetaProvider(options)
}

export function injectMeta() {
  return inject(key)
}

function toDOMElement({ tag, attrs, text }) {
  const element = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    element.setAttribute(k, v)
  }
  if (!!text) {
    element.append(text)
  }
  return element
}

export const AppMeta = {
  name: 'AppMeta',
  inheritAttrs: false,

  props: {
    title: {
      type: String,
      required: false,
    },
    meta: {
      type: Array,
      required: false,
      default: () => ([]),
    },
    jsonld: {
      type: Object,
      required: false,
    },
  },

  setup({ title, meta, jsonld }) {
    const $meta = injectMeta()
    const space = import.meta.env.DEV ? 2 : undefined
    const tags = [
      {tag: 'title', attrs: {}, text: title},
      ...meta.map(m => ({tag: 'meta', attrs: m})),
      ...(!jsonld ? []
        : [{tag: 'script', attrs: {type: 'application/ld+json'}, text: JSON.stringify(jsonld, undefined, space)}]),
    ]
    onMounted(() => {
      $meta._tags.value = tags
      //document.title = title
    })
    onServerPrefetch(() => {
      $meta._tags.value = tags
    })
    onUnmounted(() => {
      $meta._tags.value = []
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
  },
}

