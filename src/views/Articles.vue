<template>
  <div class="articles-page" ref="pageRef">
    <div class="page-head">
      <div>
        <h1>全部文章</h1>
        <p class="page-desc">共 {{ filteredArticles.length }} 篇实战文章</p>
      </div>
      <div v-if="activeTag" class="tag-clear">
        <button class="btn-text" @click="clearTag">清除筛选</button>
      </div>
    </div>

    <div class="filters">
      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          v-model="searchText"
          placeholder="搜索文章标题、标签或关键字"
          class="search-input"
          @input="onSearch"
        />
      </div>
      <div class="filter-tags">
        <span class="filter-label">标签：</span>
        <span
          v-for="tag in allTags"
          :key="tag"
          class="tag-pill tag-sm"
          :class="[tagClass(tag), { 'tag-active': activeTag === tag }]"
          @click="toggleTag(tag)"
        >{{ tag }}</span>
      </div>
    </div>

    <div v-if="filteredArticles.length === 0" class="empty">
      <p>没有找到匹配的文章</p>
    </div>

    <div class="articles-grid" v-else>
      <div class="article-card glass" v-for="article in sortedArticles" :key="article.id" @click="goToArticle(article.id)">
        <div class="card-cover" :style="{ background: article.coverColor }">
          <span class="cover-time">{{ article.readingTime }} min</span>
        </div>
        <div class="card-body">
          <h3>{{ article.title }}</h3>
          <p class="card-summary">{{ article.summary }}</p>
          <div class="card-meta">
            <span>{{ formatDate(article.date) }}</span>
            <span class="sep">·</span>
            <span>{{ article.views }} 次阅读</span>
          </div>
          <div class="card-tags">
            <span class="tag-pill tag-sm" v-for="tag in article.tags" :key="tag" :class="tagClass(tag)">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'
import articles from '../mock/articles'

const pageRef = ref(null)
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(pageRef.value?.querySelector('.page-head'), { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' })
    gsap.from(pageRef.value?.querySelector('.filters'), { opacity: 0, y: 20, duration: 0.5, delay: 0.15, ease: 'power3.out' })
    gsap.from(pageRef.value?.querySelectorAll('.article-card'), { opacity: 0, y: 30, stagger: 0.06, duration: 0.5, delay: 0.25, ease: 'power3.out' })
  })
})

onUnmounted(() => { ctx?.revert() })

const route = useRoute()
const router = useRouter()

const searchText = ref(route.query.tag || '')
const activeTag = ref(route.query.tag || '')

const allTags = computed(() => {
  const set = new Set()
  articles.forEach((a) => a.tags.forEach((t) => set.add(t)))
  return [...set]
})

const filteredArticles = computed(() => {
  let result = articles
  const keyword = searchText.value.toLowerCase().trim()
  if (keyword) {
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.summary.toLowerCase().includes(keyword) ||
        item.tags.some((tag) => tag.toLowerCase().includes(keyword))
    )
  }
  return result
})

const sortedArticles = computed(() => {
  return [...filteredArticles.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

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

const formatDate = (d) => {
  const date = new Date(d)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const goToArticle = (id) => { router.push(`/articles/${id}`) }
const onSearch = () => {}
const clearTag = () => { activeTag.value = ''; searchText.value = '' }
const toggleTag = (tag) => {
  if (activeTag.value === tag) { clearTag() }
  else { activeTag.value = tag; searchText.value = tag }
}

if (route.query.tag) {
  activeTag.value = route.query.tag
  searchText.value = route.query.tag
}
</script>

<style scoped>
.articles-page { padding: 24px 0; }

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.page-head h1 {
  font-size: 30px;
  font-weight: 600;
  margin: 0;
}

.page-desc { color: var(--text-secondary); font-size: 15px; margin-top: 6px; }

.tag-clear { display: flex; align-items: center; }

.filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.search-box {
  position: relative;
  max-width: 420px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-h);
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s;
  outline: none;
}

.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
}

.search-input::placeholder { color: var(--text-secondary); }

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.filter-label { color: var(--text-secondary); font-size: 14px; }

.tag-active {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.article-card {
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-active);
  box-shadow: var(--shadow-glow);
}

.card-cover {
  position: relative;
  min-height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-time {
  position: absolute;
  right: 14px;
  bottom: 14px;
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(4px);
  color: #fff;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.card-body { padding: 20px 22px 24px; display: flex; flex-direction: column; gap: 12px; }

.card-body h3 {
  font-size: 18px;
  margin: 0;
  line-height: 1.3;
}

.card-summary {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 13px;
}

.card-tags { display: flex; flex-wrap: wrap; gap: 6px; }

.empty { text-align: center; padding: 80px 0; color: var(--text-secondary); }

@media (max-width: 960px) {
  .articles-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .articles-grid { grid-template-columns: 1fr; }
}
</style>
