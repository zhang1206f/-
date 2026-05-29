<template>
  <div class="article-detail" v-if="article" ref="detailRef">
    <div class="toolbar">
      <button class="back-btn" @click="goBack">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        返回文章列表
      </button>
    </div>

    <div class="article-header">
      <div class="header-cover" :style="{ background: article.coverColor }"></div>
      <h1>{{ article.title }}</h1>
      <div class="meta-row">
        <span>{{ article.date }}</span>
        <span class="sep">·</span>
        <span>{{ article.readingTime }} 分钟</span>
        <span class="sep">·</span>
        <span>{{ article.views }} 次阅读</span>
      </div>
      <div class="meta-tags">
        <span class="tag-pill tag-sm" v-for="tag in article.tags" :key="tag" :class="tagClass(tag)">{{ tag }}</span>
      </div>
    </div>

    <div class="content glass" v-html="renderedContent"></div>

    <div class="recommendation glass" v-if="article.recommendation">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
      <div class="rec-text">{{ article.recommendation }}</div>
    </div>

    <section class="related-section" v-if="relatedArticles.length">
      <h3>相关阅读</h3>
      <div class="related-list">
        <div
          class="related-card glass"
          v-for="item in relatedArticles"
          :key="item.id"
          @click="goToArticle(item.id)"
        >
          <div class="related-cover" :style="{ background: item.coverColor }"></div>
          <div class="related-body">
            <div class="related-top">
              <span class="tag-pill tag-sm" :class="tagClass(item.tags[0])">{{ item.tags[0] }}</span>
              <span class="related-date">{{ item.date }}</span>
            </div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.summary }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <p>文章不存在</p>
    <button class="btn-primary" @click="router.push('/articles')">返回文章列表</button>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'
import articles from '../mock/articles'

const detailRef = ref(null)
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(detailRef.value?.querySelector('.toolbar'), { opacity: 0, y: -10, duration: 0.4, ease: 'power2.out' })
    gsap.from(detailRef.value?.querySelector('.article-header'), { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' })
    gsap.from(detailRef.value?.querySelector('.content'), { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: 'power2.out' })
    gsap.from(detailRef.value?.querySelector('.recommendation'), { opacity: 0, y: 20, duration: 0.5, delay: 0.35, ease: 'power2.out' })
    gsap.from(detailRef.value?.querySelectorAll('.related-card'), { opacity: 0, y: 20, stagger: 0.1, duration: 0.5, delay: 0.45, ease: 'power2.out' })
  })
})

onUnmounted(() => { ctx?.revert() })

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const article = articles.find((a) => a.id === id)

const tagClass = (tag) => {
  const map = {
    Vue: 'tag-vue', 前端: 'tag-frontend', 经验分享: 'tag-exp',
    Vite: 'tag-vite', 构建工具: 'tag-build', 体验: 'tag-exp',
    'Ant Design Vue': 'tag-antd', 'UI 组件': 'tag-ui', CSS: 'tag-css',
    Grid: 'tag-css', 踩坑: 'tag-bug', JavaScript: 'tag-js',
    异步编程: 'tag-js', 最佳实践: 'tag-best',
    Router: 'tag-vue', 性能优化: 'tag-best', Lighthouse: 'tag-build'
  }
  return map[tag] || ''
}

const renderedContent = computed(() => {
  if (!article) return ''
  let html = article.content

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langClass = lang ? ` class="language-${lang}"` : ''
    const langLabel = lang ? `<span class="code-lang">${lang}</span>` : ''
    return `<div class="code-block"><div class="code-block-header">${langLabel}</div><pre><code${langClass}>${escapeHtml(code.trim())}</code></pre></div>`
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
  html = '<p>' + html + '</p>'
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p>\s*<\/p>/g, '')
  html = html.replace(/<p>(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')
  return html
})

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return text.replace(/[&<>"']/g, (c) => map[c])
}

const relatedArticles = computed(() => {
  if (!article) return []
  return articles
    .filter((item) => item.id !== article.id && item.tags.some((tag) => article.tags.includes(tag)))
    .slice(0, 3)
})

const goBack = () => { router.push('/articles') }
const goToArticle = (id) => { router.push(`/articles/${id}`) }
</script>

<style scoped>
.article-detail { padding: 24px 0; max-width: 800px; margin: 0 auto; }

.toolbar { margin-bottom: 24px; }

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
  font-family: inherit;
}

.back-btn:hover { color: var(--primary); background: rgba(37,99,235,0.06); }

.article-header {
  margin-bottom: 32px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--border);
}

.header-cover {
  width: 80px;
  height: 80px;
  border-radius: var(--radius);
  margin-bottom: 16px;
}

.article-header h1 {
  font-size: 30px;
  font-weight: 700;
  margin: 0 0 14px;
  line-height: 1.2;
}

.meta-row {
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.meta-tags { display: flex; gap: 8px; flex-wrap: wrap; }

/* ===== Content ===== */
.content {
  line-height: 1.9;
  font-size: 17px;
  color: var(--text);
  padding: 32px;
  border-radius: var(--radius);
}

.content :deep(h1) { font-size: 26px; margin: 40px 0 18px; padding-left: 16px; border-left: 3px solid var(--primary); }
.content :deep(h2) { font-size: 24px; font-weight: 600; margin: 36px 0 16px; padding-left: 16px; border-left: 3px solid var(--accent); }
.content :deep(h3) { font-size: 20px; margin: 32px 0 14px; }
.content :deep(p) { margin: 20px 0; }
.content :deep(strong) { font-weight: 700; color: var(--text-h); }

.content :deep(.code-block) {
  margin: 24px 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border);
  background: rgba(9,9,11,0.95);
}

.content :deep(.code-block-header) {
  padding: 8px 16px;
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(24,24,27,0.8);
  border-bottom: 1px solid var(--border);
  font-family: 'DM Sans', monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.content :deep(pre) {
  margin: 0;
  padding: 20px;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.7;
}

.content :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  background: rgba(37,99,235,0.06);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.92em;
  color: var(--primary);
}

.content :deep(pre code) { background: none; padding: 0; color: #e4e4e7; font-size: 13px; }

.content :deep(ul) { padding-left: 24px; margin: 16px 0; }
.content :deep(li) { margin: 8px 0; }

.content :deep(blockquote) {
  border-left: 3px solid var(--primary);
  margin: 24px 0;
  padding: 16px 20px;
  background: rgba(37,99,235,0.04);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--text-secondary);
}

.content :deep(blockquote p) { margin: 0; }

/* ===== Recommendation ===== */
.recommendation {
  margin-top: 36px;
  padding: 20px 24px;
  border-radius: var(--radius-sm);
  display: flex;
  gap: 12px;
  align-items: flex-start;
  color: var(--primary);
}

.rec-text { font-size: 15px; color: var(--text); line-height: 1.7; }

/* ===== Related ===== */
.related-section { margin-top: 48px; }

.related-section h3 {
  font-size: 20px;
  margin-bottom: 20px;
}

.related-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }

.related-card {
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
}

.related-card:hover {
  transform: translateY(-3px);
  border-color: var(--border-active);
}

.related-cover {
  height: 80px;
}

.related-body { padding: 16px 18px 20px; }

.related-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--text-secondary);
}

.related-date { white-space: nowrap; }

.related-card h4 {
  margin: 0 0 8px;
  font-size: 15px;
  line-height: 1.35;
}

.related-card p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.not-found { text-align: center; padding: 80px 0; }

.not-found p { color: var(--text-secondary); margin-bottom: 20px; }

.not-found .btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
  background: var(--accent-gradient);
  color: #fff;
  box-shadow: var(--shadow-glow);
}

@media (max-width: 860px) {
  .related-list { grid-template-columns: 1fr; }
  .content { padding: 24px; }
  .article-header h1 { font-size: 24px; }
}
</style>
