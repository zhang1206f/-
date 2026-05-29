<template>
  <div class="archive" ref="archiveRef">
    <div class="archive-hero glass">
      <div>
        <h1>文章归档</h1>
        <p class="page-desc">共 {{ articles.length }} 篇文章，按时间分类整理</p>
      </div>
      <div class="archive-stats">
        <div class="stat-item"><strong>{{ years.length }}</strong> 年份</div>
        <div class="stat-item"><strong>{{ articles.length }}</strong> 篇</div>
        <div class="stat-item"><strong>{{ tagCount }}</strong> 标签</div>
      </div>
    </div>

    <div class="archive-groups">
      <div v-for="group in groupedArticles" :key="group.month" class="archive-group">
        <div class="group-year-deco">{{ group.month.split('年')[0] }}</div>
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
                <span class="sep">·</span>
                <span>{{ article.views }} 次阅读</span>
                <span class="sep">·</span>
                <span class="item-tags">{{ article.tags.join(' / ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import articles from '../mock/articles'

const archiveRef = ref(null)
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(archiveRef.value?.querySelector('.archive-hero'), { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' })
    gsap.from(archiveRef.value?.querySelectorAll('.archive-group'), { opacity: 0, y: 20, stagger: 0.15, duration: 0.5, ease: 'power2.out' })
  })
})

onUnmounted(() => { ctx?.revert() })

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

const goToArticle = (id) => { router.push(`/articles/${id}`) }
</script>

<style scoped>
.archive { padding: 24px 0; max-width: 860px; margin: 0 auto; }

.archive-hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  padding: 28px 30px;
  border-radius: var(--radius-lg);
  margin-bottom: 32px;
}

.archive-hero h1 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px;
}

.page-desc { color: var(--text-secondary); margin: 0; font-size: 15px; }

.archive-stats { display: flex; gap: 12px; }

.stat-item {
  padding: 12px 18px;
  border-radius: var(--radius-sm);
  background: var(--bg-alt);
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.stat-item strong {
  display: block;
  font-size: 20px;
  color: var(--text-h);
  font-weight: 700;
}

.archive-group { position: relative; margin-bottom: 36px; padding-left: 24px; }

.group-year-deco {
  position: absolute;
  left: -4px;
  top: -16px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 80px;
  font-weight: 700;
  color: var(--border);
  line-height: 1;
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
  letter-spacing: -0.04em;
}

.group-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.group-items { display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }

.archive-item {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-radius: var(--radius);
  background: var(--bg-card);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.archive-item:hover {
  border-color: var(--border-active);
  transform: translateX(4px);
}

.item-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 48px;
}

.item-date { font-size: 14px; color: var(--text-secondary); font-weight: 500; }

.item-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--primary);
}

.item-body { flex: 1; min-width: 0; }

.item-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-h);
  margin-bottom: 6px;
}

.archive-item:hover .item-title { color: var(--primary); }

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 13px;
  align-items: center;
}

.item-tags { color: var(--text-secondary); }

@media (max-width: 860px) {
  .archive-hero { flex-direction: column; }
  .archive-stats { width: 100%; }
  .stat-item { flex: 1; text-align: center; }
  .group-year-deco { font-size: 56px; left: 0; }
}

@media (max-width: 640px) {
  .archive-item { padding: 14px 16px; }
  .group-year-deco { display: none; }
}
</style>
