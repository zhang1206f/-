import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 从 Markdown 内容中提取标题列表，并通过 IntersectionObserver 追踪当前激活标题
 * @param {import('vue').Ref<string>|() => string} markdownContent - 文章 Markdown 内容
 * @param {object} options
 * @param {number[]} options.levels - 要提取的标题层级，默认 [2, 3]
 * @param {number} options.rootMargin - IntersectionObserver rootMargin（px）
 */
export function useToc(markdownContent, options = {}) {
  const { levels = [2, 3], rootMargin = -80 } = options

  const activeId = ref('')
  let observer = null

  const headings = computed(() => {
    const content = typeof markdownContent === 'function' ? markdownContent() : markdownContent.value
    if (!content) return []

    const regex = /^(#{2,3})\s+(.+)$/gm
    const result = []
    let match
    let idx = 0

    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length
      if (!levels.includes(level)) continue

      const text = match[2].trim()
      const id = `toc-${idx++}`
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
