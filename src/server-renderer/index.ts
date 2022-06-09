import { decode as decodeHE } from 'html-entities'
import type { VNode } from 'vue'
import type { SSRContext } from 'vue/server-renderer'
import { renderToString } from 'vue/server-renderer'

export async function renderMeta(context: SSRContext): Promise<string> {
  const vnodes = (context.meta as VNode[]) ?? []
  const s = await Promise.all(
    vnodes.map(async (n) => {
      n.props = n.props ?? {}
      n.props['data-ssr'] = ''
      const s = await renderToString(n)
      if (n.type === 'script' && n.props?.type === 'application/ld+json') {
        return decodeHE(s)
      }
      return s
    })
  )
  return s.join('')
}
