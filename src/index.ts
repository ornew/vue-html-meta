import {
  ref,
  inject,
  watch,
  h,
  onMounted,
  onUnmounted,
  onServerPrefetch,
  App,
  Ref,
} from "vue";

const key = Symbol();

interface MetaPluginOptions {
  ssr?: boolean;
}

interface _VNode {
  tag: string;
  attributes?: object;
  text?: string;
}

class MetaPlugin {
  private _options: MetaPluginOptions;
  private _tags: Ref<_VNode[]>;
  private _els: HTMLElement[];

  constructor(options: MetaPluginOptions) {
    this._options = options;
    this._tags = ref([]);
    this._els = [];
    if (!this._options.ssr) {
      watch(this._tags, (_new, {}) => {
        for (const element of this._els) {
          element.remove();
        }
        this._els = _new.map((c) => toDOMElement(c));
        for (const element of this._els) {
          document.head.append(element);
        }
      });
    }
  }

  setTags(tags: _VNode[]) {
    this._tags.value = tags;
  }

  install(app: App) {
    app.config.globalProperties.$meta = this;
    app.provide(key, this);
  }
}

export function createMeta(options: MetaPluginOptions): MetaPlugin {
  return new MetaPlugin(options);
}

export function injectMeta(): MetaPlugin | undefined {
  return inject(key);
}

function toDOMElement({ tag, attributes, text }: _VNode): HTMLElement {
  const element = document.createElement(tag);
  if (attributes) {
    for (const [k, v] of <[string, string][]>Object.entries(attributes)) {
      element.setAttribute(k, v);
    }
  }
  if (!!text) {
    element.append(document.createTextNode(text));
  }
  return element;
}

export const AppMeta = {
  name: "AppMeta",
  inheritAttrs: false,

  props: {
    title: {
      type: String,
      required: false,
    },
    meta: {
      type: Array,
      required: false,
      default: () => [],
    },
    jsonld: {
      type: Object,
      required: false,
    },
  },

  setup({
    title,
    meta,
    jsonld,
  }: {
    title?: string;
    meta: object[];
    jsonld?: object;
  }) {
    const $meta = injectMeta();
    const space = import.meta.env.DEV ? 2 : undefined;
    const tags: _VNode[] = [
      { tag: "title", attrs: {}, text: title },
      ...meta?.map((attributes: object) => ({ tag: "meta", attributes })),
      ...(!jsonld
        ? []
        : [
            {
              tag: "script",
              attrs: { type: "application/ld+json" },
              text: JSON.stringify(jsonld, undefined, space),
            },
          ]),
    ];
    onMounted(() => {
      $meta?.setTags(tags);
      //document.title = title
    });
    onServerPrefetch(() => {
      $meta?.setTags(tags);
    });
    onUnmounted(() => {
      $meta?.setTags([]);
    });
    return () => {
      return h("div");
      /*
      return h(
        Teleport,
        { to: document.head },
        children,
      )
      */
    };
  },
};
