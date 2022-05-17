import type { PropType } from 'vue'
import { defineComponent, h, isReactive, watch } from 'vue'
import { useMeta } from '../core'

export const TestComponent = defineComponent({
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
    const meta = useMeta()
    if (meta) {
      const { title } = meta.mount()
      title.value = props.title
      if (isReactive(props)) {
        watch(props, (n) => {
          title.value = n.title
        })
      }
      return () => h('div', undefined, title.value)
    }
    return () => h('div')
  }
})
