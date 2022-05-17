import { mount, flushPromises } from '@vue/test-utils'

import { createMeta, AppMeta } from '.'

export const testCom = {
  template: '<div>test</div>',
  data() {
    return {
      admin: false
    }
  }
}

afterEach(() => {
  document.head.outerHTML = ''
})

test('render title', async () => {
  const meta = createMeta()
  const app = mount(AppMeta, {
    global: {
      plugins: [meta]
    },
    props: {
      title: 'test'
    }
  })

  await flushPromises()

  console.log(document.head.outerHTML)
  expect(document.title).toBe('test')

  const t1 = document.querySelector('head title')
  expect(t1).not.toBeNull()
  expect(t1?.innerHTML).toBe('test')

  const nt1 = document.querySelectorAll('head :not(title)')
  expect(nt1.length).toBe(0)

  await app.setProps({
    title: 'test-2'
  })

  console.log(document.head.outerHTML)
  expect(document.title).toBe('test-2')

  const t2 = document.querySelector('head title')
  expect(t2).not.toBeNull()
  expect(t2?.innerHTML).toBe('test-2')

  const nt2 = document.querySelectorAll('head :not(title)')
  expect(nt2.length).toBe(0)

  app.unmount()

  await flushPromises()

  console.log(document.head.outerHTML)
  expect(document.title).toBe('')

  const t_ = document.querySelector('head title')
  expect(t_).toBeNull()

  const nt_ = document.querySelectorAll('head :not(title)')
  expect(nt_.length).toBe(0)
})
