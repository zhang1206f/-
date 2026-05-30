<template>
  <div class="page-shell page-stack articles-page" ref="pageRef">
    <section class="page-hero articles-hero">
      <div class="articles-hero__copy">
        <span class="eyebrow">Article Library</span>
        <h1 class="section-title">围绕真实项目问题组织的前端文章库</h1>
        <p class="section-subtitle">支持标签过滤、关键词搜索与按时间排序，让内容探索路径更直接，也更适合在不同设备上快速浏览。</p>
      </div>
      <div class="articles-hero__meta">
        <article class="metric-mini glass-panel">
          <span>当前结果</span>
          <strong>{{ sortedArticles.length }}</strong>
        </article>
        <article class="metric-mini glass-panel">
          <span>全部标签</span>
          <strong>{{ allTags.length }}</strong>
        </article>
      </div>
    </section>

    <section class="section-card filters-panel" ref="filtersRef">
      <div class="filters-head">
        <div class="input-shell filter-input">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input v-model="searchText" placeholder="搜索标题、摘要或标签" />
        </div>

        <div class="filter-actions">
          <span class="surface-badge">{{ activeTag || '全部主题' }}</span>
          <button class="btn-ghost" :disabled="!searchText && !activeTag" @click="clearTag">重置筛选</button>
        </div>
      </div>

      <div class="tag-cloud">
        <button
          v-for="tag in allTags"
          :key="tag"
          class="tag-pill"
          :class="[getTagClass(tag), { 'tag-active': activeTag === tag }]"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header compact-header">
        <div>
          <span class="eyebrow">Results</span>
          <h2>筛选结果</h2>
        </div>
        <span class="surface-badge">{{ searchHint }}</span>
      </div>

      <div v-if="sortedArticles.length === 0" class="empty-state">
        没有找到匹配内容，试试更换关键词或清空标签。
      </div>

      <div v-else ref="gridRef" class="article-grid">
        <button class="article-card glass-panel card-hover" v-for="article in sortedArticles" :key="article.id" @click="goToArticle(article.id)">
          <div class="article-card__cover" :style="{ background: getCoverGradient(article) }">
            <span class="surface-badge article-time">{{ article.readingTime }} 分钟</span>
          </div>
          <div class="article-card__body">
            <div class="list-inline">
              <span class="tag-pill tag-sm" v-for="tag in article.tags" :key="tag" :class="getTagClass(tag)">{{ tag }}</span>
            </div>
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
            <div class="article-card__meta">
              <span>{{ formatFullDate(article.date) }}</span>
              <span>{{ article.views }} 次阅读</span>
            </div>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import articles from '../mock/articles'
import { formatFullDate, getCoverGradient, getTagClass } from '../composables/useArticleMeta'
import { animateIn, attachHoverLift, gsap, revealOnScroll, useGsapContext } from '../composables/useMotion'

const route = useRoute()
const router = useRouter()

const pageRef = ref(null)
const filtersRef = ref(null)
const gridRef = ref(null)

const searchText = ref((route.query.tag || '').toString())
const activeTag = ref((route.query.tag || '').toString())

const allTags = computed(() => {
  const set = new Set()
  articles.forEach((article) => article.tags.forEach((tag) => set.add(tag)))
  return [...set]
})

const filteredArticles = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()
  if (!keyword) return articles

  return articles.filter((item) => {
    return (
      item.title.toLowerCase().includes(keyword) ||
      item.summary.toLowerCase().includes(keyword) ||
      item.tags.some((tag) => tag.toLowerCase().includes(keyword))
    )
  })
})

const sortedArticles = computed(() =>
  [...filteredArticles.value].sort((a, b) => new Date(b.date) - new Date(a.date))
)

const searchHint = computed(() => {
  if (activeTag.value) return `标签：${activeTag.value}`
  if (searchText.value) return `关键词：${searchText.value}`
  return '展示全部内容'
})

const syncQuery = (tag) => {
  router.replace({
    path: '/articles',
    query: tag ? { tag } : {}
  })
}

const clearTag = () => {
  activeTag.value = ''
  searchText.value = ''
  syncQuery('')
}

const toggleTag = (tag) => {
  if (activeTag.value === tag) {
    clearTag()
    return
  }

  activeTag.value = tag
  searchText.value = tag
  syncQuery(tag)
}

const goToArticle = (id) => router.push(`/articles/${id}`)

let detachHover = () => {}

const refreshCards = async () => {
  await nextTick()
  detachHover()
  detachHover = attachHoverLift(gridRef.value?.querySelectorAll('.card-hover'))
  if (!gridRef.value) return

  gsap.fromTo(
    gridRef.value.children,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out', stagger: 0.05 }
  )
}

watch([searchText, activeTag], refreshCards)

useGsapContext(() => {
  animateIn(pageRef.value?.querySelectorAll('.articles-hero, .filters-panel'), { stagger: 0.12 })
  revealOnScroll(gridRef.value?.children, { trigger: gridRef.value })
})

onMounted(() => {
  refreshCards()
})

onUnmounted(() => {
  detachHover()
})
</script>

<style scoped>
.articles-page {
  gap: 24px;
}

.articles-hero,
.filters-panel {
  display: grid;
  gap: 18px;
}

.articles-hero {
  grid-template-columns: minmax(0, 1fr) 280px;
}

.articles-hero__meta {
  display: grid;
  gap: 14px;
}

.metric-mini {
  padding: 20px;
  border-radius: 24px;
}

.metric-mini span {
  color: var(--text-subtle);
  font-size: 13px;
}

.metric-mini strong {
  display: block;
  margin-top: 10px;
  color: var(--text-heading);
  font-size: 34px;
  letter-spacing: -0.04em;
}

.filters-head {
  display: flex;
  gap: 14px;
  justify-content: space-between;
  align-items: center;
}

.filter-input {
  flex: 1;
}

.filter-input svg {
  color: var(--text-subtle);
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.compact-header {
  margin-bottom: 20px;
}

.article-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.article-card {
  padding: 0;
  overflow: hidden;
  text-align: left;
  border-radius: 24px;
}

.article-card__cover {
  position: relative;
  min-height: 170px;
}

.article-time {
  position: absolute;
  right: 16px;
  bottom: 16px;
  color: #fff;
  background: rgba(15, 23, 42, 0.28);
}

.article-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.article-card__body h3 {
  color: var(--text-heading);
}

.article-card__body p {
  color: var(--text-muted);
}

.article-card__meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: var(--text-subtle);
  font-size: 13px;
}

@media (max-width: 1080px) {
  .articles-hero {
    grid-template-columns: 1fr;
  }

  .articles-hero__meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .article-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .filters-head {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-actions {
    justify-content: space-between;
  }
}

@media (max-width: 640px) {
  .articles-hero__meta,
  .article-grid {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
