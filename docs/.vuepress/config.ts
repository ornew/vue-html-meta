import { defaultTheme, defineUserConfig } from 'vuepress'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE: '/' | '/${string}/'
    }
  }
}

export default defineUserConfig({
  base: process.env.BASE ?? '/',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'vue-html-meta',
      description: 'The simple Vue-Composable to render HTML meta tags (support SSR)'
    }
    /*
    '/ja/': {
      lang: 'ja-JP',
      title: 'vue-meta-html',
      description: 'HTMLメタタグのためのVue-Composable (SSRサポート)'
    }
    */
  },
  theme: defaultTheme({
    repo: 'ornew/vue-html-meta',
    docsDir: 'docs',
    locales: {
      '/': {
        navbar: [
          {
            text: 'Guide',
            link: '/guide/'
            //children: []
          }
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'Guide',
              //collapsible: true,
              children: ['/guide/getting-started.md', '/guide/server-side-rendering.md']
            }
          ]
        }
      }
      /*
      '/ja/': {
        navbar: [
          {
            text: 'Guide',
            link: '/guide/'
          }
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'Guide',
              //collapsible: true,
              children: ['/guide/getting-started.md', '/guide/server-side-rendering.md']
            }
          ]
        },
        selectLanguageName: '日本語',
        selectLanguageText: '言語',
        selectLanguageAriaLabel: '言語'
        //editLinkText
        //contributorsText
        //tip
        //warning
        //danger
        //notFound
        //backToHome
        //openInNewWindow
        //toggleDarkMode
        //toggleSidebar
      }
      */
    }
  })
})
