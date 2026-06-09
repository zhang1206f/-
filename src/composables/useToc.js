import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export function useToc(htmlContent, options = {}) {
  const { levels = [2, 3, 4, 5, 6], rootMargin = -80 } = options

  const activeId = ref('')
  let observer = null

  const headings = computed(() => {
    const content = typeof htmlContent === 'function' ? htmlContent() : htmlContent.value
    if (!content) return []

    const result = []
    let idx = 0
    // Match rendered heading tags with toc- IDs
    const regex = /<h([2-6]) id="([^"]*)">([\s\S]*?)<\/h\1>/g
    let match

    while ((match = regex.exec(content)) !== null) {
      const level = parseInt(match[1])
      if (!levels.includes(level)) continue

      const id = match[2]
      const text = match[3].replace(/<[^>]+>/g, '').trim() // strip any inner HTML tags
      result.push({ id, level, text })
    }

    return result
  })

  function scrollToHeading(id) {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY + rootMargin
    window.scrollTo({ top, behavior: 'smooth' })
  }

  function initObserver() {
    if (typeof IntersectionObserver === 'undefined') return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        }
      },
      {
        rootMargin: `${rootMargin}px 0px -60% 0px`,
        threshold: 0
      }
    )

    headings.value.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
  }

  function disconnectObserver() {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  return {
    headings,
    activeId,
    scrollToHeading,
    initObserver,
    disconnectObserver
  }
}
