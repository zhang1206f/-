<template>
  <div v-if="article" class="page-shell page-stack article-page" ref="detailRef">
    <button class="btn-link article-back" @click="goBack">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5"></path>
        <path d="m12 19-7-7 7-7"></path>
      </svg>
      返回文章列表
    </button>

    <section class="page-hero article-hero">
      <div class="article-hero__cover" :style="{ background: getCoverGradient(article) }"></div>
      <div class="article-hero__body">
        <div class="list-inline">
          <span class="tag-pill tag-sm" v-for="tag in article.tags" :key="tag" :class="getTagClass(tag)">{{ tag }}</span>
        </div>
        <h1 class="section-title article-title">{{ article.title }}</h1>
        <p class="section-subtitle">{{ article.summary }}</p>
        <div class="meta-row">
          <span class="surface-badge">{{ formatFullDate(article.date) }}</span>
          <span class="surface-badge">{{ article.readingTime }} 分钟阅读</span>
          <span class="surface-badge">{{ article.views }} 次阅读</span>
        </div>
      </div>
    </section>

    <section class="article-layout">
      <aside class="article-side glass-panel">
        <div class="side-block">
          <span class="side-label">内容摘要</span>
          <p>{{ article.summary }}</p>
        </div>
        <div class="side-block" v-if="article.recommendation">
          <span class="side-label">推荐理由</span>
          <p>{{ article.recommendation }}</p>
        </div>
        <div class="side-block">
          <span class="side-label">阅读标签</span>
          <div class="list-inline">
            <span class="tag-pill tag-sm" v-for="tag in article.tags" :key="`${tag}-side`" :class="getTagClass(tag)">{{ tag }}</span>
          </div>
        </div>
      </aside>

      <article class="article-content glass-panel" v-html="renderedContent"></article>
    </section>

    <section v-if="relatedArticles.length" class="section-card related-section">
      <div class="section-header compact-header">
        <div>
          <span class="eyebrow">Related Reads</span>
          <h2>继续阅读</h2>
        </div>
      </div>
      <div class="related-grid">
        <button class="related-card glass-panel card-hover" v-for="item in relatedArticles" :key="item.id" @click="goToArticle(item.id)">
          <div class="related-cover" :style="{ background: getCoverGradient(item) }"></div>
          <div class="related-body">
            <span class="tag-pill tag-sm" :class="getTagClass(item.tags[0])">{{ item.tags[0] }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
          </div>
        </button>
      </div>
    </section>
  </div>

  <div v-else class="page-shell">
    <div class="section-card empty-state">
      文章不存在或已被移除。
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import articles from '../mock/articles'
import { formatFullDate, getCoverGradient, getTagClass } from '../composables/useArticleMeta'
import { animateIn, attachHoverLift, revealOnScroll, useGsapContext } from '../composables/useMotion'

const detailRef = ref(null)
const route = useRoute()
const router = useRouter()

const article = articles.find((item) => item.id === Number(route.params.id))

const renderedContent = computed(() => {
  if (!article) return ''

  let html = article.content
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const label = lang ? `<span class="code-lang">${lang}</span>` : ''
    return `<div class="code-block"><div class="code-block-header">${label}</div><pre><code>${escapeHtml(code.trim())}</code></pre></div>`
  })
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
  html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul>$1</ul>')
  html = html.replace(/\n\n/g, '</p><p>')
  html = `<p>${html}</p>`
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p>\s*<\/p>/g, '')
  html = html.replace(/<p>(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')
  return html
})

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

const relatedArticles = computed(() => {
  if (!article) return []
  return articles
    .filter((item) => item.id !== article.id && item.tags.some((tag) => article.tags.includes(tag)))
    .slice(0, 3)
})

const goBack = () => router.push('/articles')
const goToArticle = (id) => router.push(`/articles/${id}`)

let detachHover = () => {}

onMounted(() => {
  detachHover = attachHoverLift(detailRef.value?.querySelectorAll('.card-hover'))
})

onUnmounted(() => {
  detachHover()
})

useGsapContext(() => {
  animateIn(detailRef.value?.querySelectorAll('.article-back, .article-hero, .article-side, .article-content'), {
    stagger: 0.08
  })
  revealOnScroll(detailRef.value?.querySelectorAll('.related-card'), {
    trigger: detailRef.value?.querySelector('.related-grid')
  })
})
</script>

<style scoped>
.article-page {
  gap: 20px;
}

.article-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
}

.article-hero {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 24px;
  align-items: center;
}

.article-hero__cover {
  min-height: 140px;
  border-radius: 28px;
}

.article-hero__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-title {
  font-size: clamp(34px, 4vw, 56px);
}

.meta-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.article-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.article-side {
  position: sticky;
  top: 102px;
  padding: 22px;
  border-radius: 24px;
}

.side-block + .side-block {
  margin-top: 20px;
}

.side-label {
  display: block;
  margin-bottom: 10px;
  color: var(--text-subtle);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.side-block p {
  color: var(--text-muted);
}

.article-content {
  padding: 32px;
  border-radius: 28px;
}

.article-content :deep(h1) {
  margin-top: 2.2em;
  font-size: 32px;
}

.article-content :deep(h2) {
  margin-top: 2em;
  font-size: 28px;
}

.article-content :deep(h3) {
  margin-top: 1.8em;
  font-size: 22px;
}

.article-content :deep(p),
.article-content :deep(li) {
  color: var(--text);
  font-size: 17px;
  line-height: 1.95;
}

.article-content :deep(p) {
  margin: 18px 0;
}

.article-content :deep(strong) {
  color: var(--text-heading);
}

.article-content :deep(code) {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 8px;
  background: var(--primary-soft);
  color: var(--primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.92em;
}

.article-content :deep(.code-block) {
  margin: 24px 0;
  overflow: hidden;
  border-radius: 20px;
  background: #0a1020;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.article-content :deep(.code-block-header) {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #8ea2ff;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.article-content :deep(pre) {
  margin: 0;
  padding: 18px;
  overflow-x: auto;
}

.article-content :deep(pre code) {
  display: block;
  padding: 0;
  background: transparent;
  color: #dbe7ff;
  font-size: 13px;
  line-height: 1.8;
}

.article-content :deep(ul) {
  padding-left: 22px;
}

.related-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.related-card {
  overflow: hidden;
  padding: 0;
  text-align: left;
  border-radius: 24px;
}

.related-cover {
  min-height: 120px;
}

.related-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.related-body h3 {
  color: var(--text-heading);
}

.related-body p {
  color: var(--text-muted);
}

@media (max-width: 1080px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-side {
    position: static;
  }
}

@media (max-width: 768px) {
  .article-hero {
    grid-template-columns: 1fr;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .article-content {
    padding: 24px;
  }
}
</style>
