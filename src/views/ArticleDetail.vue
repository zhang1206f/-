<template>
  <div class="article-detail" v-if="article">
    <div class="toolbar">
      <a-button class="back-btn" type="link" @click="goBack">
        ← 返回文章列表
      </a-button>
      <div class="action-group">
        <a-button type="text" @click="goBack">阅读全部文章</a-button>
      </div>
    </div>

    <div class="article-header">
      <div class="header-cover" :style="{ background: article.coverColor }">
        <span class="header-icon">📄</span>
      </div>
      <div class="header-body">
        <h1>{{ article.title }}</h1>
        <div class="meta-row">
          <span class="meta-date">{{ article.date }}</span>
          <span class="meta-sep">·</span>
          <span class="meta-reading">📖 {{ article.readingTime }} 分钟</span>
          <span class="meta-sep">·</span>
          <span class="meta-views">👁 {{ article.views }} 次阅读</span>
        </div>
        <div class="meta-tags">
          <a-tag v-for="tag in article.tags" :key="tag" :color="tagColor(tag)">{{ tag }}</a-tag>
        </div>
      </div>
    </div>

    <div class="content" v-html="renderedContent"></div>

    <div class="recommendation" v-if="article.recommendation">
      <div class="rec-icon">💡</div>
      <div class="rec-text">{{ article.recommendation }}</div>
    </div>

    <section class="related-section" v-if="relatedArticles.length">
      <h3>相关阅读</h3>
      <div class="related-list">
        <div
          class="related-card"
          v-for="item in relatedArticles"
          :key="item.id"
          @click="goToArticle(item.id)"
        >
          <div class="related-top">
            <span class="related-tag">{{ item.tags[0] }}</span>
            <span class="related-date">{{ item.date }}</span>
          </div>
          <h4>{{ item.title }}</h4>
          <p>{{ item.summary }}</p>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <a-empty description="文章不存在" />
    <a-button type="primary" @click="router.push('/articles')">返回文章列表</a-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import articles from '../mock/articles'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const article = articles.find((a) => a.id === id)

const tagPalette = {
  Vue: 'blue',
  前端: 'geekblue',
  经验分享: 'cyan',
  Vite: 'green',
  构建工具: 'lime',
  体验: 'orange',
  'Ant Design Vue': 'purple',
  'UI 组件': 'magenta',
  CSS: 'pink',
  Grid: 'volcano',
  踩坑: 'red',
  JavaScript: 'gold',
  异步编程: 'yellow',
  最佳实践: 'orange',
  Router: 'geekblue',
  性能优化: 'red',
  Lighthouse: 'cyan'
}

const tagColor = (tag) => tagPalette[tag] || 'blue'

const renderedContent = computed(() => {
  if (!article) return ''
  let html = article.content

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langClass = lang ? ` class="language-${lang}"` : ''
    return `<pre><code${langClass}>${escapeHtml(code.trim())}</code></pre>`
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

const goBack = () => {
  router.push('/articles')
}

const goToArticle = (id) => {
  router.push(`/articles/${id}`)
}
</script>

<style scoped>
.article-detail {
  padding: 24px 0;
  max-width: 860px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn {
  padding: 0;
  font-size: 14px;
}

.action-group a {
  color: var(--primary);
}

.article-header {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
  padding: 32px;
  border-radius: 28px;
  background: rgba(255,255,255,0.94);
  border: 1px solid rgba(148,163,184,0.16);
  box-shadow: var(--shadow-sm);
}

.header-cover {
  width: 110px;
  height: 110px;
  border-radius: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 42px;
}

.header-body {
  flex: 1;
  min-width: 0;
}

.header-body h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px;
  line-height: 1.25;
}

.meta-row {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 14px;
}

.meta-sep {
  margin: 0 8px;
}

.meta-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.content {
  line-height: 1.85;
  font-size: 16px;
  color: #334155;
  margin-top: 28px;
}

.content :deep(h1) {
  font-size: 28px;
  margin: 36px 0 18px;
}

.content :deep(h2) {
  font-size: 24px;
  font-weight: 700;
  margin: 36px 0 18px;
  color: #111827;
}

.content :deep(h3) {
  font-size: 20px;
  margin: 32px 0 14px;
  color: #111827;
}

.content :deep(p) {
  margin: 18px 0;
}

.content :deep(strong) {
  font-weight: 700;
  color: #111827;
}

.content :deep(pre) {
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 18px;
  overflow-x: auto;
  margin: 22px 0;
  font-size: 14px;
  line-height: 1.7;
}

.content :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, Consolas, monospace;
  background: rgba(79,70,229,0.08);
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 0.95em;
  color: #7c3aed;
}

.content :deep(pre code) {
  background: none;
  padding: 0;
}

.content :deep(ul) {
  padding-left: 24px;
  margin: 14px 0;
}

.content :deep(li) {
  margin: 8px 0;
}

.content :deep(blockquote) {
  border-left: 4px solid rgba(99,102,241,0.55);
  margin: 26px 0;
  padding: 18px 22px;
  background: rgba(99,102,241,0.08);
  border-radius: 0 16px 16px 0;
  color: #334155;
}

.content :deep(blockquote p) {
  margin: 0;
}

.recommendation {
  margin-top: 48px;
  padding: 20px 24px;
  background: rgba(250, 244, 195, 0.95);
  border: 1px solid rgba(250, 204, 21, 0.35);
  border-radius: 18px;
  display: flex;
  gap: 14px;
}

.rec-icon {
  font-size: 22px;
  flex-shrink: 0;
  margin-top: 2px;
}

.rec-text {
  font-size: 15px;
  color: #334155;
  line-height: 1.75;
}

.related-section {
  margin-top: 48px;
}

.related-section h3 {
  margin-bottom: 18px;
  font-size: 22px;
  color: #0f172a;
}

.related-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.related-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255,255,255,0.94);
  border: 1px solid rgba(148,163,184,0.16);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: transform 0.25s, box-shadow 0.25s;
}

.related-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.related-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #64748b;
}

.related-tag {
  background: rgba(99,102,241,0.12);
  color: #4f46e5;
  border-radius: 999px;
  padding: 4px 12px;
}

.related-date {
  white-space: nowrap;
}

.related-card h4 {
  margin: 0 0 10px;
  font-size: 16px;
  line-height: 1.4;
}

.related-card p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
}

.not-found {
  text-align: center;
  padding: 80px 0;
}

@media (max-width: 960px) {
  .article-header {
    flex-direction: column;
  }

  .related-list {
    grid-template-columns: 1fr;
  }
}
</style>
