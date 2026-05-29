<template>
  <div class="articles-page" ref="pageRef">
    <div class="page-head">
      <div>
        <h1>全部文章</h1>
        <p class="page-desc">共 {{ filteredArticles.length }} 篇实战文章，覆盖 Vue、构建、性能与工程化。</p>
      </div>
      <div v-if="activeTag" class="tag-clear">
        <a-button type="link" @click="clearTag">清除标签筛选</a-button>
      </div>
    </div>

    <div class="filters">
      <div class="search-box">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索文章标题、标签或关键字"
          allow-clear
          enter-button="搜索"
          @search="onSearch"
        />
      </div>
      <div class="filter-tags">
        <span class="tag-label">热门标签：</span>
        <a-tag
          v-for="tag in allTags"
          :key="tag"
          :color="activeTag === tag ? tagColor(tag) : 'default'"
          :class="{ 'tag-active': activeTag === tag }"
          @click="toggleTag(tag)"
        >{{ tag }}</a-tag>
      </div>
    </div>

    <div v-if="filteredArticles.length === 0" class="empty">
      <a-empty description="没有找到匹配的文章" />
    </div>

    <a-row :gutter="[24, 24]" v-else>
      <a-col :xs="24" :sm="12" :lg="8" v-for="article in sortedArticles" :key="article.id">
        <div class="article-card" @click="goToArticle(article.id)">
          <div class="card-cover" :style="{ background: article.coverColor }">
            <span class="cover-icon">📄</span>
            <span class="cover-time">{{ article.readingTime }} min</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ article.title }}</h3>
            <p class="card-summary">{{ article.summary }}</p>
            <div class="card-meta">
              <span>{{ formatDate(article.date) }}</span>
              <span class="meta-sep">·</span>
              <span>👁 {{ article.views }}</span>
            </div>
            <div class="card-tags">
              <a-tag v-for="tag in article.tags" :key="tag" :color="tagColor(tag)">{{ tag }}</a-tag>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
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
    gsap.from(pageRef.value?.querySelector('.page-head'), {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    })
    gsap.from(pageRef.value?.querySelector('.filters'), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: 0.2,
      ease: 'power3.out'
    })
    gsap.from(pageRef.value?.querySelectorAll('.article-card'), {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.6,
      delay: 0.3,
      ease: 'power3.out'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})

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

const formatDate = (d) => {
  const date = new Date(d)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`
}

const goToArticle = (id) => {
  router.push(`/articles/${id}`)
}

const onSearch = () => {}

const clearTag = () => {
  activeTag.value = ''
  searchText.value = ''
}

const toggleTag = (tag) => {
  if (activeTag.value === tag) {
    clearTag()
  } else {
    activeTag.value = tag
    searchText.value = tag
  }
}

if (route.query.tag) {
  activeTag.value = route.query.tag
  searchText.value = route.query.tag
}
</script>

<style scoped>
.articles-page {
  padding: 24px 0;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.page-head h1 {
  font-size: 32px;
  margin: 0;
}

.page-desc {
  color: #64748b;
  font-size: 15px;
  margin-top: 8px;
}

.tag-clear {
  display: flex;
  align-items: center;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}

.search-box {
  max-width: 420px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.tag-label {
  color: #64748b;
  font-size: 14px;
}

.tag-active .ant-tag {
  font-weight: 700;
}

.article-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(255,255,255,0.96);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(148,163,184,0.18);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: transform 0.25s, box-shadow 0.25s;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.card-cover {
  position: relative;
  min-height: 180px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.cover-icon {
  font-size: 34px;
  z-index: 1;
}

.cover-time {
  position: absolute;
  right: 16px;
  bottom: 16px;
  background: rgba(0,0,0,0.18);
  color: #fff;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.card-body {
  padding: 22px 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-title {
  font-size: 18px;
  margin: 0;
  line-height: 1.35;
}

.card-summary {
  color: #64748b;
  font-size: 14px;
  line-height: 1.75;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 13px;
}

.meta-sep {
  margin: 0 4px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.empty {
  padding: 80px 0;
}

@media (max-width: 768px) {
  .article-card {
    border-radius: 20px;
  }

  .filters {
    gap: 12px;
  }
}
</style>
