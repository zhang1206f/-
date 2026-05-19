<template>
  <div class="archive">
    <div class="archive-hero">
      <div>
        <h1>📚 文章归档</h1>
        <p class="page-desc">共 {{ articles.length }} 篇文章，按时间顺序分类整理，方便复盘与回顾。</p>
      </div>
      <div class="archive-stats">
        <div><strong>{{ years.length }}</strong> 年份</div>
        <div><strong>{{ articles.length }}</strong> 篇文章</div>
        <div><strong>{{ tagCount }}</strong> 个标签</div>
      </div>
    </div>

    <div class="year-pills">
      <span v-for="year in years" :key="year" class="year-pill">{{ year }}</span>
    </div>

    <div v-for="group in groupedArticles" :key="group.month" class="archive-group">
      <h2 class="group-title">{{ group.month }}</h2>
      <div class="group-items">
        <div
          v-for="article in group.items"
          :key="article.id"
          class="archive-item"
          @click="goToArticle(article.id)"
        >
          <div class="item-left">
            <span class="item-date">{{ formatDay(article.date) }}</span>
            <span class="item-dot"></span>
          </div>
          <div class="item-body">
            <span class="item-title">{{ article.title }}</span>
            <div class="item-meta">
              <span>{{ article.readingTime }} 分钟</span>
              <span class="meta-sep">·</span>
              <span>{{ article.views }} 次阅读</span>
              <span class="meta-sep">·</span>
              <span class="item-tags">{{ article.tags.join(' / ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import articles from '../mock/articles'

const router = useRouter()

const groupedArticles = computed(() => {
  const groups = {}
  const sorted = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date))
  for (const a of sorted) {
    const d = new Date(a.date)
    const key = `${d.getFullYear()}年${d.getMonth() + 1}月`
    if (!groups[key]) groups[key] = []
    groups[key].push(a)
  }
  return Object.entries(groups).map(([month, items]) => ({ month, items }))
})

const years = computed(() => {
  const set = new Set()
  articles.forEach((a) => set.add(new Date(a.date).getFullYear()))
  return [...set].sort((a, b) => b - a)
})

const tagCount = computed(() => {
  const tags = new Set()
  articles.forEach((article) => article.tags.forEach((tag) => tags.add(tag)))
  return tags.size
})

const formatDay = (d) => {
  const date = new Date(d)
  return `${String(date.getDate()).padStart(2, '0')}日`
}

const goToArticle = (id) => {
  router.push(`/articles/${id}`)
}

const articlesCount = computed(() => articles.length)
</script>

<style scoped>
.archive {
  padding: 24px 0;
  max-width: 900px;
  margin: 0 auto;
}

.archive-hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  padding: 28px 30px;
  background: rgba(255,255,255,0.96);
  border-radius: 28px;
  border: 1px solid rgba(148,163,184,0.16);
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
}

.archive-hero h1 {
  font-size: 32px;
  margin: 0 0 10px;
}

.page-desc {
  color: #64748b;
  margin: 0;
  font-size: 15px;
}

.archive-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.archive-stats div {
  padding: 18px 20px;
  border-radius: 18px;
  background: #eef2ff;
  color: #334155;
  font-weight: 600;
}

.year-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;
}

.year-pill {
  background: rgba(99,102,241,0.12);
  color: #4f46e5;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
}

.archive-group {
  margin-bottom: 28px;
}

.group-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--primary);
}

.group-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.archive-item {
  display: flex;
  gap: 18px;
  padding: 18px 22px;
  border-radius: 22px;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(148,163,184,0.16);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.archive-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.item-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 56px;
}

.item-date {
  font-size: 14px;
  color: #64748b;
}

.item-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary);
}

.item-body {
  flex: 1;
  min-width: 0;
}

.item-title {
  display: block;
  font-size: 17px;
  font-weight: 600;
  color: #111827;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  color: #64748b;
  font-size: 13px;
}

.meta-sep {
  margin: 0 5px;
}

.item-tags {
  color: #475569;
}

@media (max-width: 860px) {
  .archive-hero {
    flex-direction: column;
  }

  .archive-stats {
    grid-template-columns: 1fr;
  }
}
</style>
