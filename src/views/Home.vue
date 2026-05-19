<template>
  <div class="home">
    <section class="hero-wrap">
      <div class="hero-bg">
        <div class="hero-shape shape-1"></div>
        <div class="hero-shape shape-2"></div>
      </div>
      <div class="hero-inner">
        <div class="hero-panel">
          <div class="hero-copy">
            <p class="hero-eyebrow">为你打造可落地的前端实践指南</p>
            <h1 class="hero-title">清风的前端笔记，直击实战难题</h1>
            <p class="hero-sub">
              从 Vue 组件到性能优化，从构建工具到工程化体系，
              每一篇都凝练为可复制的实战经验。
            </p>
            <p class="hero-desc">
              这里记录我多年前端沉淀：解决真实项目痛点、复盘常见坑位、提供可直接落地的开发策略。
            </p>
            <div class="hero-actions">
              <a-button type="primary" size="large" class="hero-btn primary" @click="goArticles">
                📖 浏览文章
              </a-button>
              <a-button size="large" class="hero-btn outline" @click="goAbout">
                👤 关于我
              </a-button>
            </div>
            <div class="hero-tags">
              <span class="hero-tag" v-for="t in heroTags" :key="t">{{ t }}</span>
            </div>
          </div>
          <div class="hero-summary-card">
            <div class="hero-summary-header">
              <span>本周热点</span>
              <strong>前端性能优化策略</strong>
            </div>
            <p class="hero-summary-text">
              深入分析页面加载、资源优先级、SSR 与缓存策略，让用户体验和开发效率同时提升。
            </p>
            <div class="hero-summary-list">
              <span>• 组件按需渲染</span>
              <span>• 构建体积分析</span>
              <span>• 线上性能调优</span>
            </div>
          </div>
        </div>
        <div class="hero-metrics">
          <div v-for="stat in stats" :key="stat.label" class="hero-metric">
            <span>{{ stat.icon }}</span>
            <strong>{{ stat.value }}</strong>
            <small>{{ stat.label }}</small>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-highlights">
      <div class="section-inner">
        <div class="highlights-grid">
          <div class="highlight-card" v-for="item in highlights" :key="item.title">
            <div class="highlight-icon">{{ item.icon }}</div>
            <h3 class="highlight-title">{{ item.title }}</h3>
            <p class="highlight-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-featured">
      <div class="section-inner">
        <div class="sec-header">
          <h2>⭐ 精选文章</h2>
          <router-link to="/articles" class="sec-more">查看全部 →</router-link>
        </div>
        <div class="featured-card" @click="goToArticle(featured.id)">
          <div class="feat-cover" :style="{ background: featured.coverColor }">
            <div class="feat-cover-content">
              <span class="feat-icon">📌</span>
              <span class="feat-badge">置顶</span>
            </div>
          </div>
          <div class="feat-body">
            <div class="feat-tags">
              <a-tag v-for="tag in featured.tags" :key="tag" :color="tagColor(tag)">{{ tag }}</a-tag>
            </div>
            <h3 class="feat-title">{{ featured.title }}</h3>
            <p class="feat-summary">{{ featured.summary }}</p>
            <div class="feat-meta">
              <span class="feat-date">{{ featured.date }}</span>
              <span class="feat-sep">·</span>
              <span>📖 {{ featured.readingTime }} 分钟</span>
              <span class="feat-sep">·</span>
              <span>👁 {{ featured.views }} 次阅读</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-latest">
      <div class="section-inner">
        <div class="sec-header">
          <h2>📝 最新文章</h2>
          <router-link to="/articles" class="sec-more">查看全部 →</router-link>
        </div>
        <a-row :gutter="[24, 24]">
          <a-col :xs="24" :sm="12" :lg="8" v-for="article in latestArticles" :key="article.id">
            <div class="post-card" @click="goToArticle(article.id)">
              <div class="post-cover" :style="{ background: article.coverColor }">
                <span class="post-cover-icon">📄</span>
                <span class="post-reading">{{ article.readingTime }} min</span>
              </div>
              <div class="post-body">
                <div class="post-tags">
                  <a-tag v-for="tag in article.tags.slice(0, 2)" :key="tag" :color="tagColor(tag)">{{ tag }}</a-tag>
                </div>
                <h3 class="post-title">{{ article.title }}</h3>
                <p class="post-summary">{{ article.summary }}</p>
                <div class="post-footer">
                  <span class="post-date">{{ formatDate(article.date) }}</span>
                  <span class="post-views">👁 {{ article.views }}</span>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </section>

    <section class="section section-archive">
      <div class="section-inner">
        <div class="sec-header">
          <h2>📚 归档时间线</h2>
          <router-link to="/archive" class="sec-more">查看完整归档 →</router-link>
        </div>
        <div class="timeline">
          <div v-for="group in archiveGroups" :key="group.month" class="tl-group">
            <div class="tl-month">{{ group.month }}</div>
            <div class="tl-items">
              <div
                v-for="(item, i) in group.items"
                :key="item.id"
                class="tl-item"
                @click="goToArticle(item.id)"
              >
                <div class="tl-dot" :class="`dot-${i % 5}`"></div>
                <div class="tl-body">
                  <span class="tl-title">{{ item.title }}</span>
                  <span class="tl-day">{{ formatDay(item.date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-tags">
      <div class="section-inner">
        <div class="sec-header">
          <h2>🏷️ 标签云</h2>
        </div>
        <div class="tags-cloud">
          <a-tag
            v-for="tag in tagCloud"
            :key="tag.name"
            :color="tag.color"
            class="cloud-tag"
            :style="{ fontSize: tag.size + 'px' }"
            @click="searchTag(tag.name)"
          >
            {{ tag.name }} ({{ tag.count }})
          </a-tag>
        </div>
      </div>
    </section>

    <section class="section section-popular">
      <div class="section-inner">
        <div class="sec-header">
          <h2>🔥 热门文章</h2>
        </div>
        <a-row :gutter="[24, 24]">
          <a-col :xs="24" :md="12" v-for="(article, idx) in popularArticles" :key="article.id">
            <div class="popular-card" @click="goToArticle(article.id)">
              <div class="pop-rank" :class="`rank-${idx + 1}`">{{ idx + 1 }}</div>
              <div class="pop-body">
                <h4 class="pop-title">{{ article.title }}</h4>
                <div class="pop-meta">
                  <span>👁 {{ article.views }}</span>
                  <span class="pop-sep">·</span>
                  <span>{{ article.date }}</span>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </section>

    <section class="section section-connect">
      <div class="section-inner">
        <div class="connect-card">
          <h2>💬 保持联系</h2>
          <p class="connect-desc">
            如果你对文章内容有任何疑问或建议，欢迎通过以下方式找到我。
            也欢迎在 GitHub 上关注我的项目，一起交流学习。
          </p>
          <div class="connect-links">
            <a-button class="connect-btn" href="mailto:hello@qingfeng.me" target="_blank">
              <template #icon><MailOutlined /></template>
              Email
            </a-button>
            <a-button class="connect-btn" href="https://github.com" target="_blank">
              <template #icon><GithubOutlined /></template>
              GitHub
            </a-button>
            <a-button class="connect-btn" href="https://twitter.com" target="_blank">
              <template #icon><TwitterOutlined /></template>
              Twitter
            </a-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MailOutlined, GithubOutlined, TwitterOutlined } from '@ant-design/icons-vue'
import articles from '../mock/articles'

const router = useRouter()

const heroTags = ['Vue 3', 'Vite', 'JavaScript', 'CSS', 'Node.js']

const highlights = [
  { icon: '⚡', title: '实战优先', desc: '每篇文章都以真实项目为载体，避免空洞理论。' },
  { icon: '🧠', title: '落地经验', desc: '用最直接的方式拆解问题和解决方案。' },
  { icon: '🚀', title: '性能优化', desc: '聚焦前端性能、构建体验与用户可感知速度。' },
  { icon: '🔧', title: '工具链', desc: '覆盖 Vite、组件化、部署与工程化实践。' }
]

const featured = computed(() => {
  return [...articles].sort((a, b) => b.views - a.views)[0]
})

const latestArticles = computed(() => {
  return [...articles].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
})

const popularArticles = computed(() => {
  return [...articles].sort((a, b) => b.views - a.views).slice(0, 4)
})

const stats = computed(() => {
  const allTags = new Set()
  articles.forEach(a => a.tags.forEach(t => allTags.add(t)))
  return [
    { icon: '📝', value: articles.length, label: '文章总数', color: '#4f46e5' },
    { icon: '🏷️', value: allTags.size, label: '标签数量', color: '#f59e0b' },
    { icon: '👁', value: articles.reduce((s, a) => s + a.views, 0), label: '累计阅读', color: '#10b981' },
    { icon: '⏱️', value: articles.reduce((s, a) => s + a.readingTime, 0), label: '总阅读时长', color: '#f43f5e' }
  ]
})

const archiveGroups = computed(() => {
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

const tagCloud = computed(() => {
  const map = {}
  articles.forEach(a => a.tags.forEach(t => {
    if (!map[t]) map[t] = 0
    map[t]++
  }))
  const maxCount = Math.max(...Object.values(map))
  return Object.entries(map).map(([name, count]) => ({
    name,
    count,
    color: tagColor(name),
    size: 14 + (count / maxCount) * 8
  }))
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
  最佳实践: 'orange'
}

const tagColor = (tag) => tagPalette[tag] || 'blue'

const formatDate = (d) => {
  const date = new Date(d)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const formatDay = (d) => {
  const date = new Date(d)
  return `${String(date.getDate()).padStart(2, '0')}日`
}

const goToArticle = (id) => {
  router.push(`/articles/${id}`)
}

const searchTag = (tag) => {
  router.push({ path: '/articles', query: { tag } })
}

const goArticles = () => {
  router.push('/articles')
}

const goAbout = () => {
  router.push('/about')
}
</script>

<style scoped>
.home {
  overflow: hidden;
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
}

/* ============ HERO ============ */
.hero-wrap {
  position: relative;
  text-align: center;
  padding: 60px 0 50px;
  margin: -24px -32px 0;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  z-index: 0;
}

.hero-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: #4f46e5;
  top: -100px;
  right: -100px;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: #f59e0b;
  bottom: -80px;
  left: -80px;
}

.hero-inner {
  position: relative;
  z-index: 1;
  padding: 0 24px;
}

.hero-avatar {
  margin-bottom: 20px;
}

.avatar-el {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 32px;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  border: 3px solid rgba(255,255,255,0.15);
}

.hero-title {
  font-size: 40px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.hero-name {
  background: linear-gradient(135deg, #667eea, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 18px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 12px;
}

.hero-desc {
  font-size: 15px;
  color: rgba(255,255,255,0.45);
  line-height: 1.8;
  max-width: 520px;
  margin: 0 auto 28px;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 28px;
}

.hero-btn {
  border-radius: 10px;
  font-size: 16px;
  padding: 8px 28px;
  height: auto;
}

.hero-btn.primary {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border: none;
  box-shadow: 0 4px 14px rgba(79,70,229,0.4);
}

.hero-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79,70,229,0.5);
}

.hero-btn.outline {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.85);
}

.hero-btn.outline:hover {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.3);
  color: #fff;
}

.hero-tags {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-tag {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.06);
  padding: 4px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.08);
}

/* ============ SECTION COMMON ============ */
.section {
  padding: 56px 0;
}

.section:nth-child(even) {
  background: var(--bg-alt);
}

.sec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.sec-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.sec-more {
  font-size: 14px;
  color: var(--primary);
  transition: opacity 0.2s;
}

.sec-more:hover {
  opacity: 0.7;
}

/* ============ STATS ============ */
.stat-card {
  text-align: center;
  padding: 28px 16px;
  background: var(--bg-card);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s, box-shadow 0.25s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  font-size: 28px;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-h);
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

/* ============ FEATURED ============ */
.featured-card {
  display: flex;
  gap: 28px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s, box-shadow 0.25s;
  border: 1px solid var(--border);
}

.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feat-cover {
  width: 280px;
  min-height: 200px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.feat-cover-content {
  text-align: center;
}

.feat-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 8px;
}

.feat-badge {
  font-size: 12px;
  color: #fff;
  background: rgba(0,0,0,0.3);
  padding: 2px 12px;
  border-radius: 12px;
}

.feat-body {
  padding: 28px 28px 28px 0;
  flex: 1;
}

.feat-tags {
  margin-bottom: 12px;
}

.feat-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
}

.feat-summary {
  font-size: 15px;
  color: #888;
  line-height: 1.7;
  margin-bottom: 16px;
}

.feat-meta {
  font-size: 14px;
  color: #bbb;
}

.feat-sep {
  margin: 0 10px;
  color: #e0e0e0;
}

/* ============ LATEST POST CARDS ============ */
.post-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s, box-shadow 0.25s;
  border: 1px solid var(--border);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.post-cover {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.post-cover-icon {
  font-size: 32px;
}

.post-reading {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 11px;
  color: #fff;
  background: rgba(0,0,0,0.3);
  padding: 1px 10px;
  border-radius: 10px;
}

.post-body {
  padding: 16px 18px 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-tags {
  margin-bottom: 8px;
  display: flex;
  gap: 4px;
}

.post-title {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-summary {
  font-size: 13px;
  color: #999;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #bbb;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

/* ============ ARCHIVE TIMELINE ============ */
.timeline {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 24px 32px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
}

.tl-group {
  margin-bottom: 24px;
}

.tl-group:last-child {
  margin-bottom: 0;
}

.tl-month {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 12px;
}

.tl-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tl-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.tl-item:hover {
  background: var(--bg-alt);
}

.tl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-0 { background: #4f46e5; }
.dot-1 { background: #f59e0b; }
.dot-2 { background: #10b981; }
.dot-3 { background: #f43f5e; }
.dot-4 { background: #8b5cf6; }

.tl-body {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
}

.tl-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-h);
}

.tl-item:hover .tl-title {
  color: var(--primary);
}

.tl-day {
  font-size: 13px;
  color: #bbb;
  flex-shrink: 0;
  margin-left: 12px;
}

/* ============ TAGS CLOUD ============ */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 20px 0;
}

.cloud-tag {
  padding: 6px 18px;
  cursor: pointer;
  transition: transform 0.2s;
  border-radius: 20px;
}

.cloud-tag:hover {
  transform: scale(1.12);
}

/* ============ POPULAR ============ */
.popular-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 20px;
  background: var(--bg-card);
  border-radius: var(--radius);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid var(--border);
}

.popular-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.pop-rank {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  color: #fff;
}

.rank-1 { background: linear-gradient(135deg, #f59e0b, #f97316); }
.rank-2 { background: linear-gradient(135deg, #94a3b8, #64748b); }
.rank-3 { background: linear-gradient(135deg, #d97706, #92400e); }
.rank-4 { background: #4f46e5; }
.rank-5 { background: #10b981; }

.pop-body {
  flex: 1;
  min-width: 0;
}

.pop-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.popular-card:hover .pop-title {
  color: var(--primary);
}

.pop-meta {
  font-size: 13px;
  color: #bbb;
}

.pop-sep {
  margin: 0 8px;
}

/* ============ CONNECT ============ */
.connect-card {
  text-align: center;
  padding: 48px 32px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: var(--radius-lg);
  color: #fff;
}

.connect-card h2 {
  color: #fff;
  font-size: 28px;
  margin-bottom: 16px;
}

.connect-desc {
  color: rgba(255,255,255,0.55);
  font-size: 15px;
  line-height: 1.7;
  max-width: 500px;
  margin: 0 auto 28px;
}

.connect-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.connect-btn {
  padding: 8px 24px;
  height: auto;
  font-size: 15px;
  border-radius: 10px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.8);
}

.connect-btn:hover {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.25);
  color: #fff;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 768px) {
  .hero-wrap {
    margin: -24px -16px 0;
    padding: 40px 0 36px;
  }
  .hero-title {
    font-size: 28px;
  }
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  .featured-card {
    flex-direction: column;
  }
  .feat-cover {
    width: 100%;
    height: 140px;
  }
  .feat-body {
    padding: 16px;
  }
  .section {
    padding: 36px 0;
  }
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
  gap: 32px;
  align-items: stretch;
}

.hero-copy {
  text-align: left;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #c7d2fe;
  margin-bottom: 18px;
}

.hero-summary-card {
  border-radius: 28px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.14);
  padding: 28px 24px;
  backdrop-filter: blur(16px);
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-summary-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}

.hero-summary-header span {
  font-size: 13px;
  color: #c7d2fe;
}

.hero-summary-header strong {
  font-size: 22px;
  line-height: 1.2;
}

.hero-summary-text {
  color: rgba(255,255,255,0.72);
  line-height: 1.9;
  margin-bottom: 18px;
}

.hero-summary-list {
  display: grid;
  gap: 10px;
  color: rgba(255,255,255,0.82);
  font-size: 14px;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-top: 34px;
}

.hero-metric {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 24px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero-metric span:first-child {
  font-size: 20px;
}

.hero-metric strong {
  font-size: 24px;
  color: #fff;
}

.hero-metric small {
  color: rgba(255,255,255,0.72);
}

.section-highlights {
  padding-top: 0;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.highlight-card {
  background: #fff;
  border-radius: 24px;
  border: 1px solid rgba(148,163,184,0.16);
  box-shadow: var(--shadow-sm);
  padding: 26px 22px;
  transition: transform 0.25s, box-shadow 0.25s;
}

.highlight-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.highlight-icon {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(99,102,241,0.08);
  font-size: 22px;
  margin-bottom: 16px;
}

.highlight-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}

.highlight-desc {
  color: #64748b;
  line-height: 1.8;
  font-size: 14px;
}

.featured-card {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  border-radius: 28px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%);
  border: 1px solid rgba(148,163,184,0.16);
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s, box-shadow 0.25s;
}

.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feat-cover {
  padding: 34px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  min-height: 260px;
}

.feat-cover-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feat-badge {
  background: rgba(255,255,255,0.18);
  color: #fff;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
}

.feat-body {
  padding: 34px 32px 34px 0;
}

.feat-tags {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feat-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.15;
}

.feat-summary {
  color: #475569;
  line-height: 1.85;
  margin-bottom: 22px;
}

@media (max-width: 1080px) {
  .hero-panel {
    grid-template-columns: 1fr;
  }

  .hero-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .highlights-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .featured-card {
    grid-template-columns: 1fr;
  }

  .feat-cover {
    min-height: 200px;
  }

  .feat-body {
    padding: 16px;
  }

  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}

@media (max-width: 640px) {
  .hero-metrics {
    grid-template-columns: 1fr;
  }

  .highlight-card {
    padding: 22px;
  }

  .hero-tags {
    justify-content: center;
  }
}
</style>
