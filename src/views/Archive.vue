<template>
  <div
    ref="archiveRef"
    class="page-shell page-stack archive-page"
  >
    <section class="page-hero archive-hero">
      <div>
        <span class="eyebrow">Archive Timeline</span>
        <h1 class="section-title">
          按时间浏览全部更新
        </h1>
        <p class="section-subtitle">
          将文章按月份归档，方便快速查看内容演进路径与主题分布。
        </p>
      </div>
      <div class="metric-grid archive-stats">
        <article class="metric-card">
          <span class="metric-label">年份</span>
          <strong class="metric-value">{{ years.length }}</strong>
          <span class="metric-note">持续输出</span>
        </article>
        <article class="metric-card">
          <span class="metric-label">文章</span>
          <strong class="metric-value">{{ articles.length }}</strong>
          <span class="metric-note">实践导向</span>
        </article>
        <article class="metric-card">
          <span class="metric-label">月份</span>
          <strong class="metric-value">{{ groupedArticles.length }}</strong>
          <span class="metric-note">持续更新</span>
        </article>
      </div>
    </section>

    <!-- 年份快速导航 -->
    <div class="year-nav">
      <button
        v-for="year in years"
        :key="year"
        class="year-btn"
        :class="{ active: activeYear === year }"
        @click="scrollToYear(year)"
      >
        {{ year }}
      </button>
    </div>

    <!-- 时间轴 -->
    <div class="timeline-container">
      <div class="timeline-line"></div>
      
      <div
        v-for="(group, index) in groupedArticles"
        :key="group.month"
        :ref="el => { if (el && groupRefs.value) {
          if (!groupRefs.value[group.year]) groupRefs.value[group.year] = []
          if (!groupRefs.value[group.year].includes(el)) groupRefs.value[group.year].push(el)
        }}"
        class="timeline-group"
        :class="{ 'timeline-right': index % 2 === 0 }"
      >
        <!-- 时间轴节点 -->
        <div class="timeline-node">
          <div class="node-dot"></div>
          <div class="node-date">
            <span class="node-month">{{ group.month }}</span>
            <span class="node-count">{{ group.items.length }} 篇</span>
          </div>
        </div>

        <!-- 文章卡片 -->
        <div class="timeline-cards">
          <button
            v-for="article in group.items"
            :key="article.id"
            class="timeline-card glass-panel card-hover"
            @click="goToArticle(article.id)"
          >
            <div class="card-header">
              <span class="card-date">{{ formatDay(article.date) }}</span>
              <span class="card-views">{{ article.views }} 阅读</span>
            </div>
            <h3 class="card-title">{{ article.title }}</h3>
            <p class="card-summary">{{ article.summary }}</p>
            <div class="card-footer">
              <div class="card-tags">
                <span
                  v-for="tag in article.tags.slice(0, 3)"
                  :key="tag"
                  class="tag-pill tag-sm"
                  :class="getTagClass(tag)"
                >{{ tag }}</span>
              </div>
              <span class="card-time">{{ article.readingTime }} 分钟阅读</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import articles from '../mock/articles'
import { getTagClass } from '../composables/useArticleMeta'
import { animateIn, attachHoverLift, revealOnScroll, useGsapContext } from '../composables/useMotion'

const archiveRef = ref(null)
const router = useRouter()
const activeYear = ref(null)
const groupRefs = ref({})

const groupedArticles = computed(() => {
  const groups = {}
  const sorted = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date))
  sorted.forEach((article) => {
    const date = new Date(article.date)
    const year = date.getFullYear()
    const key = `${year}年${date.getMonth() + 1}月`
    if (!groups[key]) groups[key] = { month: key, year, items: [] }
    groups[key].items.push(article)
  })
  return Object.values(groups)
})

const years = computed(() => {
  const set = new Set()
  articles.forEach((article) => set.add(new Date(article.date).getFullYear()))
  return [...set].sort((a, b) => b - a)
})

const formatDay = (dateText) => {
  const date = new Date(dateText)
  return `${date.getMonth() + 1}月${String(date.getDate()).padStart(2, '0')}日`
}

const goToArticle = (id) => router.push(`/articles/${id}`)

const scrollToYear = (year) => {
  activeYear.value = year
  const elList = groupRefs.value[year]
  if (elList?.length > 0) {
    elList[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleScroll = () => {
  // 更新当前可见的年份
  const scrollTop = window.scrollY + 200
  for (const year of years.value) {
    const elList = groupRefs.value[year]
    if (elList?.length > 0 && elList[0].offsetTop <= scrollTop) {
      activeYear.value = year
      break
    }
  }
}

let detachHover = () => {}

onMounted(() => {
  detachHover = attachHoverLift(archiveRef.value?.querySelectorAll('.card-hover'))
  window.addEventListener('scroll', handleScroll, { passive: true })
  if (years.value.length > 0) activeYear.value = years.value[0]
})

onUnmounted(() => {
  detachHover()
  window.removeEventListener('scroll', handleScroll)
})

useGsapContext(() => {
  animateIn(archiveRef.value?.querySelectorAll('.archive-hero, .year-nav'), { stagger: 0.1 })
  revealOnScroll(archiveRef.value?.querySelectorAll('.timeline-group'), {
    trigger: archiveRef.value?.querySelector('.timeline-container')
  })
})
</script>

<style scoped>
.archive-page {
  gap: 24px;
  position: relative;
}

.archive-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1fr;
  gap: 18px;
}

.archive-stats {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

/* 年份导航 */
.year-nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  position: sticky;
  top: 80px;
  z-index: 10;
  padding: 12px 0;
  background: var(--bg);
}

.year-btn {
  padding: 8px 20px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.year-btn:hover {
  background: var(--surface-strong);
  color: var(--text-heading);
  border-color: var(--line-strong);
}

.year-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

/* 时间轴容器 */
.timeline-container {
  position: relative;
  padding: 20px 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--primary-soft), var(--line), var(--primary-soft));
  transform: translateX(-50%);
}

/* 时间轴组 */
.timeline-group {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  margin-bottom: 40px;
  position: relative;
}

.timeline-group.timeline-right .timeline-cards {
  grid-column: 3;
}

.timeline-group.timeline-right .timeline-node {
  grid-column: 2;
}

.timeline-group:not(.timeline-right) .timeline-cards {
  grid-column: 1;
}

.timeline-group:not(.timeline-right) .timeline-node {
  grid-column: 2;
}

/* 时间轴节点 */
.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.node-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary);
  border: 3px solid var(--bg);
  box-shadow: 0 0 0 3px var(--primary-soft);
  transition: transform 0.2s;
}

.timeline-group:hover .node-dot {
  transform: scale(1.2);
}

.node-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.node-month {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-heading);
  white-space: nowrap;
}

.node-count {
  font-size: 12px;
  color: var(--text-muted);
  padding: 2px 10px;
  background: var(--bg-muted);
  border-radius: 999px;
}

/* 时间轴卡片 */
.timeline-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-card {
  padding: 20px;
  border-radius: 20px;
  text-align: left;
  transition: all 0.3s;
  cursor: pointer;
}

.timeline-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-date {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  padding: 4px 12px;
  background: var(--primary-soft);
  border-radius: 999px;
}

.card-views {
  font-size: 13px;
  color: var(--text-muted);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-heading);
  margin-bottom: 8px;
  line-height: 1.4;
}

.card-summary {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.card-time {
  font-size: 12px;
  color: var(--text-subtle);
}

@media (max-width: 1080px) {
  .archive-hero {
    grid-template-columns: 1fr;
  }

  .timeline-line {
    left: 20px;
  }

  .timeline-group {
    grid-template-columns: auto 1fr;
    gap: 16px;
  }

  .timeline-group.timeline-right .timeline-cards,
  .timeline-group:not(.timeline-right) .timeline-cards {
    grid-column: 2;
  }

  .timeline-group.timeline-right .timeline-node,
  .timeline-group:not(.timeline-right) .timeline-node {
    grid-column: 1;
  }
}

@media (max-width: 640px) {
  .archive-stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .year-nav {
    gap: 4px;
  }

  .year-btn {
    padding: 6px 14px;
    font-size: 13px;
  }

  .timeline-card {
    padding: 16px;
  }

  .card-title {
    font-size: 16px;
  }
}
</style>
