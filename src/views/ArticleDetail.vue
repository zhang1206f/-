<template>
  <div
    v-if="article"
    ref="detailRef"
    class="page-shell page-stack article-page"
  >
    <button
      class="btn-link article-back"
      @click="goBack"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      返回文章列表
    </button>

    <section class="page-hero article-hero">
      <div
        class="article-hero__cover"
        :style="{ background: article ? getCoverGradient(article) : '' }"
      />
      <div class="article-hero__body">
        <div class="list-inline">
          <span
            v-for="tag in article.tags"
            :key="tag"
            class="tag-pill tag-sm"
            :class="getTagClass(tag)"
          >{{ tag }}</span>
        </div>
        <h1 class="section-title article-title">
          {{ article.title }}
        </h1>
        <p class="section-subtitle">
          {{ article.summary }}
        </p>
        <div class="meta-row">
          <span class="surface-badge">{{ formatFullDate(article.date) }}</span>
          <span class="surface-badge">{{ article.readingTime }} 分钟阅读</span>
          <span class="surface-badge">{{ article.views }} 次阅读</span>
        </div>
      </div>
    </section>

    <section class="article-layout">
      <aside class="article-side glass-panel">
        <div class="toc-panel">
          <span class="side-label">目录导航</span>
          <nav
            v-if="headings.length"
            class="toc-list"
          >
            <button
              v-for="h in headings"
              :key="h.id"
              class="toc-item"
              :class="[`toc-level-${h.level}`, { active: activeId === h.id }]"
              @click="scrollToHeading(h.id)"
            >
              <span class="toc-dot" />
              <span class="toc-text">{{ h.text }}</span>
            </button>
          </nav>
          <p
            v-else
            class="toc-empty"
          >
            暂无目录
          </p>
        </div>

        <div class="side-divider" />

        <div class="side-block">
          <span class="side-label">内容摘要</span>
          <p>{{ article.summary }}</p>
        </div>
        <div
          v-if="article.recommendation"
          class="side-block"
        >
          <span class="side-label">推荐理由</span>
          <p>{{ article.recommendation }}</p>
        </div>
        <div class="side-block">
          <span class="side-label">阅读标签</span>
          <div class="list-inline">
            <span
              v-for="tag in article.tags"
              :key="`${tag}-side`"
              class="tag-pill tag-sm"
              :class="getTagClass(tag)"
            >{{ tag }}</span>
          </div>
        </div>
      </aside>

      <article
        class="article-content glass-panel"
        v-html="articleHtml"
      />
    </section>

    <!-- 移动端浮动目录按钮 -->
    <button
      v-if="headings.length"
      class="toc-fab"
      :class="{ open: tocOpen }"
      aria-label="文章目录"
      @click="tocOpen = !tocOpen"
    >
      <svg
        v-if="!tocOpen"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line
          x1="8"
          y1="6"
          x2="21"
          y2="6"
        />
        <line
          x1="8"
          y1="12"
          x2="21"
          y2="12"
        />
        <line
          x1="8"
          y1="18"
          x2="21"
          y2="18"
        />
        <line
          x1="3"
          y1="6"
          x2="3.01"
          y2="6"
        />
        <line
          x1="3"
          y1="12"
          x2="3.01"
          y2="12"
        />
        <line
          x1="3"
          y1="18"
          x2="3.01"
          y2="18"
        />
      </svg>
      <svg
        v-else
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line
          x1="18"
          y1="6"
          x2="6"
          y2="18"
        />
        <line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
        />
      </svg>
    </button>
    <div
      v-if="tocOpen"
      class="toc-mobile-overlay"
      @click="tocOpen = false"
    >
      <nav
        class="toc-mobile-panel glass-panel"
        @click.stop
      >
        <span class="side-label">目录导航</span>
        <button
          v-for="h in headings"
          :key="`${h.id}-mobile`"
          class="toc-item"
          :class="[`toc-level-${h.level}`, { active: activeId === h.id }]"
          @click="scrollToHeading(h.id); tocOpen = false"
        >
          <span class="toc-dot" />
          <span class="toc-text">{{ h.text }}</span>
        </button>
      </nav>
    </div>

    <section
      v-if="relatedArticles.length"
      class="section-card related-section"
    >
      <div class="section-header compact-header">
        <div>
          <span class="eyebrow">Related Reads</span>
          <h2>继续阅读</h2>
        </div>
      </div>
      <div class="related-grid">
        <button
          v-for="item in relatedArticles"
          :key="item.id"
          class="related-card glass-panel card-hover"
          @click="goToArticle(item.id)"
        >
          <div
            class="related-cover"
            :style="{ background: getCoverGradient(item) }"
          />
          <div class="related-body">
            <span
              class="tag-pill tag-sm"
              :class="getTagClass(item.tags[0])"
            >{{ item.tags[0] }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
          </div>
        </button>
      </div>
    </section>
  </div>

  <div
    v-else
    class="page-shell"
  >
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
import { useToc } from '../composables/useToc'
import { useMarkdown } from '../composables/useMarkdown'

const { renderMarkdown } = useMarkdown()

const detailRef = ref(null)
const route = useRoute()
const router = useRouter()
const tocOpen = ref(false)

const article = computed(() => articles.find((item) => item.id === Number(route.params.id)))

const renderedContent = computed(() => {
  if (!article.value) return ''
  return renderMarkdown(article.value.content)
})

const articleHtml = computed(() => {
  if (!renderedContent.value) return ''
  // Add copy button wrapper to each code block
  return renderedContent.value.replace(
    /<pre(.*?)>/g,
    '<div class="code-block-wrapper"><button class="code-copy-btn">复制</button><pre$1>'
  )
})

const { headings, activeId, scrollToHeading, initObserver, disconnectObserver } = useToc(renderedContent)

const relatedArticles = computed(() => {
  if (!article.value) return []
  return articles
    .filter((item) => item.id !== article.value.id && item.tags.some((tag) => article.value.tags.includes(tag)))
    .slice(0, 3)
})

const goBack = () => router.push('/articles')
const goToArticle = (id) => router.push(`/articles/${id}`)

let detachHover = () => {}

function handleCodeCopy(e) {
  const btn = e.target.closest('.code-copy-btn')
  if (!btn) return
  const code = btn.nextElementSibling?.textContent
  if (!code) return
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = '已复制'
    setTimeout(() => { btn.textContent = '复制' }, 1500)
  })
}

onMounted(() => {
  detachHover = attachHoverLift(detailRef.value?.querySelectorAll('.card-hover'))
  detailRef.value?.addEventListener('click', handleCodeCopy)
  // 等 DOM 渲染完成后初始化观察器
  requestAnimationFrame(() => initObserver())
})

onUnmounted(() => {
  detachHover()
  disconnectObserver()
  detailRef.value?.removeEventListener('click', handleCodeCopy)
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

/* ===== TOC 样式 ===== */
.toc-panel {
  margin-bottom: 4px;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.toc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
  line-height: 1.4;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.toc-item:hover {
  background: var(--primary-soft);
  color: var(--primary);
}

.toc-item.active {
  color: var(--primary);
  background: var(--primary-soft);
  font-weight: 700;
}

.toc-item.active .toc-dot {
  background: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.toc-level-2 {
  padding-left: 12px;
}

.toc-level-3 {
  padding-left: 28px;
}

.toc-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--line-strong);
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.toc-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc-empty {
  color: var(--text-subtle);
  font-size: 13px;
  margin-top: 4px;
}

.side-divider {
  height: 1px;
  background: var(--line);
  margin: 16px 0;
}

/* ===== 移动端浮动目录按钮 ===== */
.toc-fab {
  display: none;
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 90;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--gradient-brand);
  color: #fff;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 40px rgba(109, 124, 255, 0.34);
  transition: all var(--transition-base);
}

.toc-fab:hover {
  transform: translateY(-2px) scale(1.04);
}

.toc-fab.open {
  background: var(--surface-strong);
  color: var(--text-heading);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-md);
}

.toc-mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 89;
  background: rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.toc-mobile-panel {
  position: absolute;
  bottom: 88px;
  right: 28px;
  width: min(340px, calc(100vw - 56px));
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-mobile-panel .toc-item {
  padding: 10px 14px;
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

.code-block-wrapper {
  position: relative;
}
.code-copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  padding: 4px 12px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-muted);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.code-copy-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
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

  .toc-fab,
  .toc-mobile-overlay {
    display: flex;
  }
}
</style>
