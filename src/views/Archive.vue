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
      </div>
    </section>

    <section class="section-card">
      <div class="archive-list">
        <div
          v-for="group in groupedArticles"
          :key="group.month"
          class="archive-group"
        >
          <div class="archive-month">
            <span class="archive-month__year">{{ group.month.split('年')[0] }}</span>
            <strong>{{ group.month }}</strong>
          </div>
          <div class="archive-items">
            <button
              v-for="article in group.items"
              :key="article.id"
              class="archive-item glass-panel card-hover"
              @click="goToArticle(article.id)"
            >
              <div class="archive-item__date">
                <span>{{ formatDay(article.date) }}</span>
                <small>{{ article.readingTime }} 分钟</small>
              </div>
              <div class="archive-item__body">
                <h3>{{ article.title }}</h3>
                <p>{{ article.summary }}</p>
                <div class="list-inline">
                  <span
                    v-for="tag in article.tags.slice(0, 3)"
                    :key="tag"
                    class="tag-pill tag-sm"
                    :class="getTagClass(tag)"
                  >{{ tag }}</span>
                </div>
              </div>
              <div class="archive-item__meta">
                <span>{{ article.views }}</span>
                <small>views</small>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
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

const groupedArticles = computed(() => {
  const groups = {}
  const sorted = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date))
  sorted.forEach((article) => {
    const date = new Date(article.date)
    const key = `${date.getFullYear()}年${date.getMonth() + 1}月`
    if (!groups[key]) groups[key] = []
    groups[key].push(article)
  })
  return Object.entries(groups).map(([month, items]) => ({ month, items }))
})

const years = computed(() => {
  const set = new Set()
  articles.forEach((article) => set.add(new Date(article.date).getFullYear()))
  return [...set]
})

const formatDay = (dateText) => `${String(new Date(dateText).getDate()).padStart(2, '0')}日`
const goToArticle = (id) => router.push(`/articles/${id}`)

let detachHover = () => {}

onMounted(() => {
  detachHover = attachHoverLift(archiveRef.value?.querySelectorAll('.card-hover'))
})

onUnmounted(() => {
  detachHover()
})

useGsapContext(() => {
  animateIn(archiveRef.value?.querySelectorAll('.archive-hero, .archive-group'), { stagger: 0.1 })
  revealOnScroll(archiveRef.value?.querySelectorAll('.archive-item'), {
    trigger: archiveRef.value?.querySelector('.archive-list')
  })
})
</script>

<style scoped>
.archive-page {
  gap: 24px;
}

.archive-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 18px;
}

.archive-stats {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.archive-list {
  display: grid;
  gap: 26px;
}

.archive-group {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 18px;
}

.archive-month {
  position: sticky;
  top: 100px;
  align-self: start;
}

.archive-month__year {
  display: block;
  margin-bottom: 12px;
  color: var(--text-subtle);
  font-size: 44px;
  font-family: 'Space Grotesk', sans-serif;
  line-height: 1;
}

.archive-month strong {
  color: var(--primary);
  font-size: 20px;
}

.archive-items {
  display: grid;
  gap: 14px;
}

.archive-item {
  display: grid;
  grid-template-columns: 88px 1fr 64px;
  gap: 16px;
  align-items: center;
  padding: 18px;
  text-align: left;
  border-radius: 24px;
}

.archive-item__date span,
.archive-item__meta span {
  display: block;
  color: var(--text-heading);
  font-weight: 700;
}

.archive-item__date small,
.archive-item__meta small {
  color: var(--text-subtle);
}

.archive-item__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.archive-item__body h3 {
  color: var(--text-heading);
}

.archive-item__body p {
  color: var(--text-muted);
}

.archive-item__meta {
  text-align: right;
}

@media (max-width: 1080px) {
  .archive-hero,
  .archive-group {
    grid-template-columns: 1fr;
  }

  .archive-month {
    position: static;
  }
}

@media (max-width: 640px) {
  .archive-stats,
  .archive-item {
    grid-template-columns: 1fr;
  }

  .archive-item__meta {
    text-align: left;
  }
}
</style>
