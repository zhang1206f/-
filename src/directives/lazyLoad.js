/**
 * v-lazy 图片懒加载指令
 *
 * 用法：
 *   <img v-lazy="imageUrl" alt="..." />
 *   <div v-lazy:background="imageUrl"></div>
 */
const LAZY_LOADING_CLASS = 'lazy-loading'
const LAZY_LOADED_CLASS = 'lazy-loaded'
const LAZY_ERROR_CLASS = 'lazy-error'

const OBSERVED = new WeakMap()

let observer = null

function getObserver() {
  if (observer) return observer

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        const el = entry.target
        const info = OBSERVED.get(el)
        if (!info) return

        observer.unobserve(el)
        OBSERVED.delete(el)

        const { value, arg } = info
        if (!value) return

        if (arg === 'background') {
          // 背景图模式
          const img = new Image()
          img.onload = () => {
            el.style.backgroundImage = `url(${value})`
            el.classList.remove(LAZY_LOADING_CLASS)
            el.classList.add(LAZY_LOADED_CLASS)
          }
          img.onerror = () => {
            el.classList.remove(LAZY_LOADING_CLASS)
            el.classList.add(LAZY_ERROR_CLASS)
          }
          img.src = value
        } else {
          // img 标签模式
          el.classList.add(LAZY_LOADING_CLASS)

          const img = new Image()
          img.onload = () => {
            el.src = value
            el.classList.remove(LAZY_LOADING_CLASS)
            el.classList.add(LAZY_LOADED_CLASS)
          }
          img.onerror = () => {
            el.classList.remove(LAZY_LOADING_CLASS)
            el.classList.add(LAZY_ERROR_CLASS)
          }
          img.src = value
        }
      })
    },
    { rootMargin: '200px 0px', threshold: 0 }
  )

  return observer
}

export const lazyLoad = {
  mounted(el, binding) {
    const obs = getObserver()
    el.classList.add(LAZY_LOADING_CLASS)
    OBSERVED.set(el, { value: binding.value, arg: binding.arg })
    obs.observe(el)
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      const obs = getObserver()
      const info = OBSERVED.get(el)
      if (info) {
        obs.unobserve(el)
      }
      el.classList.add(LAZY_LOADING_CLASS)
      el.classList.remove(LAZY_LOADED_CLASS, LAZY_ERROR_CLASS)
      OBSERVED.set(el, { value: binding.value, arg: binding.arg })
      obs.observe(el)
    }
  },

  unmounted(el) {
    const obs = getObserver()
    const info = OBSERVED.get(el)
    if (info) {
      obs.unobserve(el)
      OBSERVED.delete(el)
    }
  }
}
