<template>
  <div class="page-shell page-stack home-page" ref="pageRef">
    <section class="page-hero hero-panel" ref="heroRef">
      <div class="hero-panel__glow"></div>
      <div class="hero-grid">
        <div class="hero-copy">
          <span class="eyebrow hero-chip">
            <span class="status-dot"></span>
            持续更新中的前端实战博客
          </span>
          <h1 class="section-title hero-title">
            把工程化思考、界面体验与可维护代码，
            <span class="text-gradient">压缩进每一篇文章。</span>
          </h1>
          <p class="section-subtitle hero-subtitle">
            这里记录 Vue 3、Vite、设计系统、性能优化和交互动效的落地经验，让复杂问题以更清晰、更优雅的方式被理解与复用。
          </p>

          <div class="hero-actions">
            <button class="btn-primary" @click="goArticles">
              浏览文章
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
            <button class="btn-secondary" @click="goAbout">认识作者</button>
          </div>

          <div class="hero-tags">
            <span class="tag-pill tag-vue">Vue 3</span>
            <span class="tag-pill tag-vite">Vite</span>
            <span class="tag-pill tag-js">JavaScript</span>
            <span class="tag-pill tag-css">Design System</span>
            <span class="tag-pill tag-best">GSAP Motion</span>
          </div>
        </div>

        <div class="hero-insight glass-panel" ref="insightRef">
          <div class="insight-head">
            <span class="surface-badge">Content Snapshot</span>
            <span class="insight-pill mono">live / curated</span>
          </div>

          <div class="insight-metrics">
            <article class="mini-metric" v-for="metric in heroMetrics" :key="metric.label">
              <span class="mini-metric__label">{{ metric.label }}</span>
              <strong class="mini-metric__value">{{ animatedValues[metric.key] }}{{ metric.suffix }}</strong>
              <small>{{ metric.note }}</small>
            </article>
          </div>

          <div class="hero-terminal">
            <div class="terminal-top">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="terminal-body">
              <div class="terminal-line" v-for="line in terminalLines" :key="line.text">
                <span class="terminal-prompt">{{ line.prompt }}</span>
                <span>{{ line.text }}</span>
              </div>
            </div>
          </div>

          <div class="insight-list">
            <button class="insight-story card-hover" v-for="item in highlightStories" :key="item.title" @click="goToArticle(item.id)">
              <span class="insight-story__tag tag-pill tag-sm" :class="getTagClass(item.tags[0])">{{ item.tags[0] }}</span>
              <strong>{{ item.title }}</strong>
              <small>{{ formatShortDate(item.date) }} · {{ item.readingTime }} 分钟阅读</small>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="metric-grid" ref="metricsRef">
      <article class="metric-card" v-for="card in dashboardCards" :key="card.label">
        <span class="metric-label">{{ card.label }}</span>
        <strong class="metric-value">{{ card.value }}</strong>
        <span class="metric-note">{{ card.note }}</span>
      </article>
    </section>

    <section class="section-card featured-section" ref="featuredRef">
      <div class="section-header">
        <div>
          <span class="eyebrow">Featured Story</span>
          <h2>本周推荐阅读</h2>
        </div>
        <button class="btn-link" @click="goToArticle(featuredArticle.id)">打开全文</button>
      </div>

      <div class="featured-layout">
        <button class="featured-card card-hover" @click="goToArticle(featuredArticle.id)">
          <div class="featured-cover" :style="{ background: getCoverGradient(featuredArticle) }">
            <span class="surface-badge featured-badge">精选文章</span>
          </div>
          <div class="featured-body">
            <div class="list-inline">
              <span class="tag-pill tag-sm" v-for="tag in featuredArticle.tags" :key="tag" :class="getTagClass(tag)">{{ tag }}</span>
            </div>
            <h3>{{ featuredArticle.title }}</h3>
            <p>{{ featuredArticle.summary }}</p>
            <div class="featured-meta">
              <span>{{ formatFullDate(featuredArticle.date) }}</span>
              <span class="sep">/</span>
              <span>{{ featuredArticle.readingTime }} 分钟</span>
              <span class="sep">/</span>
              <span>{{ featuredArticle.views }} 次阅读</span>
            </div>
          </div>
        </button>

        <div class="featured-side">
          <article class="glass-panel info-card" v-for="item in capabilityCards" :key="item.title">
            <span class="surface-badge">{{ item.kicker }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-card" ref="latestRef">
      <div class="section-header">
        <div>
          <span class="eyebrow">Latest Articles</span>
          <h2>最近更新</h2>
        </div>
        <router-link to="/articles" class="btn-link">查看全部</router-link>
      </div>

      <div class="article-grid">
        <button class="article-card glass-panel card-hover" v-for="article in latestArticles" :key="article.id" @click="goToArticle(article.id)">
          <div class="article-card__cover" :style="{ background: getCoverGradient(article) }"></div>
          <div class="article-card__body">
            <div class="list-inline">
              <span class="tag-pill tag-sm" v-for="tag in article.tags.slice(0, 2)" :key="tag" :class="getTagClass(tag)">{{ tag }}</span>
            </div>
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
            <div class="article-card__meta">
              <span>{{ formatShortDate(article.date) }}</span>
              <span>{{ article.readingTime }} 分钟</span>
            </div>
          </div>
        </button>
      </div>
    </section>

    <section class="section-grid bottom-grid">
      <article class="section-card" ref="workflowRef">
        <div class="section-header">
          <div>
            <span class="eyebrow">Workflow</span>
            <h2>内容输出的方法论</h2>
          </div>
        </div>

        <div class="workflow-list">
          <div class="workflow-item" v-for="(step, index) in workflowSteps" :key="step.title">
            <span class="workflow-item__index">{{ index + 1 }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </article>

      <article class="section-card cta-card" ref="ctaRef">
        <span class="eyebrow">Stay Connected</span>
        <h2>想继续深入某个主题？</h2>
        <p>可以从归档查看完整更新路径，也可以直接进入关于页了解我的工程背景与设计偏好。</p>
        <div class="cta-actions">
          <router-link to="/archive" class="btn-primary">查看归档</router-link>
          <router-link to="/about" class="btn-secondary">关于作者</router-link>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import articles from '../mock/articles'
import { formatFullDate, formatShortDate, getCoverGradient, getTagClass } from '../composables/useArticleMeta'
import { animateIn, attachHoverLift, gsap, revealOnScroll, useGsapContext } from '../composables/useMotion'

const router = useRouter()

const pageRef = ref(null)
const heroRef = ref(null)
const insightRef = ref(null)
const metricsRef = ref(null)
const featuredRef = ref(null)
const latestRef = ref(null)
const workflowRef = ref(null)
const ctaRef = ref(null)

const latestArticles = computed(() =>
  [...articles].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
)

const featuredArticle = computed(() => [...articles].sort((a, b) => b.views - a.views)[0])

const totalViews = articles.reduce((sum, item) => sum + item.views, 0)
const totalTags = new Set(articles.flatMap((item) => item.tags)).size

const heroMetrics = [
  { key: 'articles', label: '文章数', target: articles.length, suffix: '', note: '覆盖框架、体验、工程化' },
  { key: 'views', label: '累计阅读', target: totalViews, suffix: '+', note: '围绕真实项目问题展开' },
  { key: 'tags', label: '内容标签', target: totalTags, suffix: '', note: '多维度组织知识结构' }
]

const animatedValues = reactive({
  articles: 0,
  views: 0,
  tags: 0
})

const dashboardCards = [
  { label: '设计系统', value: '统一视觉语言', note: '颜色、排版、空间、状态同步升级' },
  { label: '交互动效', value: 'GSAP 驱动', note: '页面转场、入场、反馈与滚动揭示统一实现' },
  { label: '响应式体验', value: '全尺寸适配', note: '从移动端到桌面端保持清晰层级与密度' },
  { label: '内容组织', value: '可扫描阅读', note: '卡片、标签、元信息与导航路径更清楚' }
]

const capabilityCards = [
  { kicker: 'UI/UX', title: '以阅读动线组织界面', desc: '减少视觉噪音，强调标题、摘要、标签与下一步动作之间的优先级。' },
  { kicker: 'Motion', title: '让状态变化更自然', desc: '入场、悬浮与切页动效统一节奏，确保高品质且不打断阅读。' },
  { kicker: 'System', title: '用设计令牌保持一致性', desc: '所有色彩、圆角、阴影、表单与按钮状态都基于同一套规则输出。' }
]

const workflowSteps = [
  { title: '真实问题切入', desc: '从项目里的瓶颈、踩坑和取舍开始，而不是只堆概念。' },
  { title: '拆出稳定模式', desc: '把一次解决方案抽成可以迁移到其他项目的结构和准则。' },
  { title: '补充代码与交互语境', desc: '不仅讲 API，还讲为什么这样组织页面、状态和动效。' }
]

const terminalLines = [
  { prompt: '$', text: 'pnpm dev' },
  { prompt: '>', text: 'UI system loaded with responsive tokens' },
  { prompt: '$', text: 'pnpm motion:preview' },
  { prompt: '>', text: 'GSAP transitions ready for production' }
]

const highlightStories = computed(() => latestArticles.value.slice(0, 2))

const goArticles = () => router.push('/articles')
const goAbout = () => router.push('/about')
const goToArticle = (id) => router.push(`/articles/${id}`)

let detachHover = () => {}

onMounted(() => {
  detachHover = attachHoverLift(pageRef.value?.querySelectorAll('.card-hover'))
})

onUnmounted(() => {
  detachHover()
})

useGsapContext(() => {
  animateIn(heroRef.value?.querySelectorAll('.hero-chip, .hero-title, .hero-subtitle, .hero-actions, .hero-tags'), {
    stagger: 0.08
  })
  animateIn(insightRef.value, { x: 24, y: 0, delay: 0.18 })

  revealOnScroll(metricsRef.value?.querySelectorAll('.metric-card'), { trigger: metricsRef.value })
  revealOnScroll(featuredRef.value?.querySelectorAll('.featured-card, .info-card'), { trigger: featuredRef.value })
  revealOnScroll(latestRef.value?.querySelectorAll('.article-card'), { trigger: latestRef.value })
  revealOnScroll(workflowRef.value?.querySelectorAll('.workflow-item'), { trigger: workflowRef.value })
  revealOnScroll(ctaRef.value, { trigger: ctaRef.value })

  const counters = { articles: 0, views: 0, tags: 0 }
  gsap.to(counters, {
    articles: heroMetrics[0].target,
    views: heroMetrics[1].target,
    tags: heroMetrics[2].target,
    duration: 1.5,
    ease: 'power2.out',
    delay: 0.2,
    onUpdate: () => {
      animatedValues.articles = Math.round(counters.articles)
      animatedValues.views = Math.round(counters.views)
      animatedValues.tags = Math.round(counters.tags)
    }
  })
})
</script>

<style scoped>
.home-page {
  gap: 24px;
}

.hero-panel {
  padding: 0;
}

.hero-panel__glow {
  position: absolute;
  inset: auto auto -28% 55%;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: var(--gradient-hero);
  filter: blur(36px);
  opacity: 0.8;
  pointer-events: none;
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
  gap: 24px;
  padding: 40px;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.hero-title {
  max-width: 760px;
}

.hero-subtitle {
  max-width: 680px;
}

.hero-actions,
.hero-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-insight {
  padding: 24px;
  border-radius: 28px;
}

.insight-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.insight-pill {
  color: var(--text-subtle);
  font-size: 12px;
}

.insight-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.mini-metric {
  padding: 18px;
  border-radius: 22px;
  background: var(--bg-muted);
  border: 1px solid var(--line);
}

.mini-metric__label,
.mini-metric small {
  display: block;
  color: var(--text-subtle);
}

.mini-metric__value {
  display: block;
  margin: 10px 0 6px;
  color: var(--text-heading);
  font-size: 26px;
  letter-spacing: -0.04em;
}

.hero-terminal {
  margin-top: 18px;
  border-radius: 24px;
  overflow: hidden;
  background: #0a1020;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.terminal-top {
  display: flex;
  gap: 8px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.terminal-top span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.terminal-top span:nth-child(1) { background: #fb7185; }
.terminal-top span:nth-child(2) { background: #fbbf24; }
.terminal-top span:nth-child(3) { background: #4ade80; }

.terminal-body {
  padding: 18px;
  color: #dbe7ff;
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
}

.terminal-line {
  display: flex;
  gap: 10px;
}

.terminal-prompt {
  color: #7dd3fc;
  flex-shrink: 0;
}

.insight-list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.insight-story {
  padding: 16px;
  text-align: left;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--surface-strong);
}

.insight-story strong,
.featured-body h3,
.article-card__body h3,
.workflow-item h3,
.info-card h3 {
  display: block;
  color: var(--text-heading);
}

.insight-story small {
  display: block;
  margin-top: 8px;
  color: var(--text-subtle);
}

.featured-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  gap: 18px;
}

.featured-card {
  overflow: hidden;
  padding: 0;
  border-radius: 28px;
  border: 1px solid var(--line);
  background: var(--surface-strong);
}

.featured-cover {
  position: relative;
  min-height: 230px;
}

.featured-badge {
  position: absolute;
  left: 18px;
  top: 18px;
  color: #fff;
  background: rgba(15, 23, 42, 0.32);
}

.featured-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
}

.featured-body p,
.info-card p,
.article-card__body p,
.workflow-item p,
.cta-card p {
  color: var(--text-muted);
}

.featured-meta,
.article-card__meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: var(--text-subtle);
  font-size: 13px;
}

.featured-side {
  display: grid;
  gap: 16px;
}

.info-card {
  padding: 22px;
  border-radius: 24px;
}

.article-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.article-card {
  overflow: hidden;
  padding: 0;
  border-radius: 24px;
  text-align: left;
}

.article-card__cover {
  min-height: 140px;
}

.article-card__body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bottom-grid {
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
}

.workflow-list {
  display: grid;
  gap: 14px;
}

.workflow-item {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 16px;
  padding: 18px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
}

.workflow-item__index {
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: var(--gradient-brand);
  color: #fff;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
}

.cta-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
}

.cta-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 1080px) {
  .hero-grid,
  .featured-layout,
  .bottom-grid {
    grid-template-columns: 1fr;
  }

  .article-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-grid {
    padding: 24px;
  }

  .insight-metrics {
    grid-template-columns: 1fr;
  }

  .article-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-actions,
  .cta-actions {
    flex-direction: column;
  }

  .hero-actions :deep(a),
  .cta-actions :deep(a),
  .hero-actions button {
    width: 100%;
  }
}
</style>
