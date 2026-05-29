<template>
  <div class="home">
    <section class="hero-wrap" ref="heroRef">
      <div class="hero-panel">
        <div class="hero-copy">
          <p class="hero-eyebrow">· 前端实战笔记</p>
          <h1 class="hero-title">
            清风的前端<br />
            <span class="text-gradient">实战笔记</span>
          </h1>
          <p class="hero-desc">
            从 Vue 组件到性能优化，从构建工具到工程化体系，<br />
            每一篇都凝练为可复制的实战经验。
          </p>
          <div class="hero-actions">
            <button class="btn-primary" @click="goArticles">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              浏览文章
            </button>
            <button class="btn-outline" @click="goAbout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              关于我
            </button>
          </div>
          <div class="hero-tags">
            <span class="tag-pill" v-for="t in heroTags" :key="t">{{ t }}</span>
          </div>
        </div>
        <div class="hero-code">
          <div class="code-window">
            <div class="code-header">
              <div class="code-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="code-filename">app.vue</span>
            </div>
            <div class="code-body">
              <pre><span class="kw">import</span> { <span class="fn">ref</span> } <span class="kw">from</span> <span class="str">'vue'</span>

<span class="kw">const</span> <span class="fn">blog</span> = <span class="fn">ref</span>({
  <span class="prop">name</span>: <span class="str">'清风博客'</span>,
  <span class="prop">focus</span>: <span class="str">'前端实战'</span>,
  <span class="prop">since</span>: <span class="num">2021</span>,
  <span class="prop">articles</span>: <span class="num">5</span>
})

<span class="kw">function</span> <span class="fn">learn</span>() {
  <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">`${blog.name} — ${blog.focus}`</span>)
}

<span class="fn">learn</span>()</pre>
            </div>
          </div>
        </div>
      </div>

      <div class="hero-metrics">
        <div class="metric-card" v-for="stat in stats" :key="stat.label">
          <component :is="stat.icon" class="metric-icon" />
          <div class="metric-value">{{ stat.value }}</div>
          <div class="metric-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <section class="section" ref="highlightsRef">
      <div class="section-inner">
        <div class="highlights-grid">
          <div class="highlight-card glass" v-for="item in highlights" :key="item.title">
            <div class="hl-icon"><component :is="item.icon" /></div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" ref="featuredRef">
      <div class="section-inner">
        <div class="sec-header">
          <h2>精选文章</h2>
          <router-link to="/articles" class="sec-more">查看全部 →</router-link>
        </div>
        <div class="featured-card" @click="goToArticle(featured.id)">
          <div class="feat-cover" :style="{ background: featured.coverColor }">
            <div class="feat-cover-content">
              <span class="feat-badge">置顶</span>
            </div>
          </div>
          <div class="feat-body">
            <div class="feat-tags">
              <span class="tag-pill" v-for="tag in featured.tags" :key="tag" :class="tagClass(tag)">{{ tag }}</span>
            </div>
            <h3 class="feat-title">{{ featured.title }}</h3>
            <p class="feat-summary">{{ featured.summary }}</p>
            <div class="feat-meta">
              <span>{{ featured.date }}</span>
              <span class="sep">·</span>
              <span>{{ featured.readingTime }} 分钟</span>
              <span class="sep">·</span>
              <span>{{ featured.views }} 次阅读</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" ref="postsRef">
      <div class="section-inner">
        <div class="sec-header">
          <h2>最新文章</h2>
          <router-link to="/articles" class="sec-more">查看全部 →</router-link>
        </div>
        <div class="posts-grid">
          <div class="post-card glass" v-for="article in latestArticles" :key="article.id" @click="goToArticle(article.id)">
            <div class="post-cover" :style="{ background: article.coverColor }">
              <span class="post-reading">{{ article.readingTime }} min</span>
            </div>
            <div class="post-body">
              <div class="post-tags">
                <span class="tag-pill tag-sm" v-for="tag in article.tags.slice(0, 2)" :key="tag" :class="tagClass(tag)">{{ tag }}</span>
              </div>
              <h3 class="post-title">{{ article.title }}</h3>
              <p class="post-summary">{{ article.summary }}</p>
              <div class="post-footer">
                <span>{{ formatDate(article.date) }}</span>
                <span>{{ article.views }} 次阅读</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" ref="timelineRef">
      <div class="section-inner">
        <div class="sec-header">
          <h2>归档时间线</h2>
          <router-link to="/archive" class="sec-more">查看完整归档 →</router-link>
        </div>
        <div class="timeline glass">
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

    <section class="section" ref="tagsRef">
      <div class="section-inner">
        <div class="sec-header">
          <h2>标签云</h2>
        </div>
        <div class="tags-cloud">
          <span
            v-for="tag in tagCloud"
            :key="tag.name"
            class="tag-pill tag-cloud"
            :style="{ fontSize: tag.size + 'px' }"
            :class="tagClass(tag.name)"
            @click="searchTag(tag.name)"
          >
            {{ tag.name }}
            <sup>{{ tag.count }}</sup>
          </span>
        </div>
      </div>
    </section>

    <section class="section" ref="popularRef">
      <div class="section-inner">
        <div class="sec-header">
          <h2>热门文章</h2>
        </div>
        <div class="popular-grid">
          <div class="popular-card glass" v-for="(article, idx) in popularArticles" :key="article.id" @click="goToArticle(article.id)">
            <div class="pop-rank" :class="`rank-${idx + 1}`">{{ idx + 1 }}</div>
            <div class="pop-body">
              <h4>{{ article.title }}</h4>
              <div class="pop-meta">
                <span>{{ article.views }} 次阅读</span>
                <span class="sep">·</span>
                <span>{{ article.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section connect-section" ref="connectRef">
      <div class="section-inner">
        <div class="connect-card glass">
          <h2>保持联系</h2>
          <p class="connect-desc">
            如果你对文章内容有任何疑问或建议，欢迎通过以下方式找到我。
          </p>
          <div class="connect-links">
            <a class="btn-primary" href="mailto:hello@qingfeng.me" target="_blank">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Email
            </a>
            <a class="btn-outline" href="https://github.com" target="_blank">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  FileTextOutlined, TagsOutlined, EyeOutlined, ClockCircleOutlined,
  ThunderboltOutlined, ExperimentOutlined, RocketOutlined, ToolOutlined
} from '@ant-design/icons-vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import articles from '../mock/articles'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref(null)
const highlightsRef = ref(null)
const featuredRef = ref(null)
const postsRef = ref(null)
const timelineRef = ref(null)
const tagsRef = ref(null)
const popularRef = ref(null)
const connectRef = ref(null)
let ctx = null

const router = useRouter()

const heroTags = ['Vue 3', 'Vite', 'JavaScript', 'CSS', 'Node.js']

const highlights = [
  { icon: ThunderboltOutlined, title: '实战优先', desc: '每篇文章都以真实项目为载体，避免空洞理论。' },
  { icon: ExperimentOutlined, title: '落地经验', desc: '用最直接的方式拆解问题和解决方案。' },
  { icon: RocketOutlined, title: '性能优化', desc: '聚焦前端性能、构建体验与用户可感知速度。' },
  { icon: ToolOutlined, title: '工具链', desc: '覆盖 Vite、组件化、部署与工程化实践。' }
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
    { icon: FileTextOutlined, value: articles.length, label: '文章总数' },
    { icon: TagsOutlined, value: allTags.size, label: '标签数量' },
    { icon: EyeOutlined, value: articles.reduce((s, a) => s + a.views, 0), label: '累计阅读' },
    { icon: ClockCircleOutlined, value: articles.reduce((s, a) => s + a.readingTime, 0), label: '总阅读时长' }
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
    name, count,
    size: 13 + (count / maxCount) * 6
  }))
})

const tagClass = (tag) => {
  const map = {
    Vue: 'tag-vue', 前端: 'tag-frontend', 经验分享: 'tag-exp',
    Vite: 'tag-vite', 构建工具: 'tag-build', 体验: 'tag-exp',
    'Ant Design Vue': 'tag-antd', 'UI 组件': 'tag-ui', CSS: 'tag-css',
    Grid: 'tag-css', 踩坑: 'tag-bug', JavaScript: 'tag-js',
    异步编程: 'tag-js', 最佳实践: 'tag-best'
  }
  return map[tag] || ''
}

const formatDate = (d) => {
  const date = new Date(d)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const formatDay = (d) => {
  const date = new Date(d)
  return `${String(date.getDate()).padStart(2, '0')}日`
}

const goToArticle = (id) => { router.push(`/articles/${id}`) }
const searchTag = (tag) => { router.push({ path: '/articles', query: { tag } }) }
const goArticles = () => { router.push('/articles') }
const goAbout = () => { router.push('/about') }

onMounted(() => {
  ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from(heroRef.value?.querySelector('.hero-copy'), { opacity: 0, y: 30, duration: 0.7 })
      .from(heroRef.value?.querySelector('.hero-code'), { opacity: 0, x: 30, duration: 0.7 }, '-=0.5')
      .from(heroRef.value?.querySelectorAll('.metric-card'), { opacity: 0, y: 20, stagger: 0.08, duration: 0.5 }, '-=0.3')
      .from(heroRef.value?.querySelectorAll('.hero-tags .tag-pill'), { opacity: 0, scale: 0.8, stagger: 0.04, duration: 0.3 }, '-=0.2')

    gsap.from(highlightsRef.value?.querySelectorAll('.highlight-card'), {
      scrollTrigger: { trigger: highlightsRef.value, start: 'top 88%' },
      opacity: 0, y: 30, stagger: 0.1, duration: 0.6
    })

    gsap.from(featuredRef.value?.querySelector('.featured-card'), {
      scrollTrigger: { trigger: featuredRef.value, start: 'top 88%' },
      opacity: 0, y: 40, duration: 0.7
    })

    gsap.from(postsRef.value?.querySelectorAll('.post-card'), {
      scrollTrigger: { trigger: postsRef.value, start: 'top 85%' },
      opacity: 0, y: 30, stagger: 0.08, duration: 0.6
    })

    gsap.from(timelineRef.value?.querySelectorAll('.tl-group'), {
      scrollTrigger: { trigger: timelineRef.value, start: 'top 85%' },
      opacity: 0, y: 20, stagger: 0.15, duration: 0.5
    })

    gsap.from(tagsRef.value?.querySelectorAll('.tag-cloud'), {
      scrollTrigger: { trigger: tagsRef.value, start: 'top 88%' },
      opacity: 0, scale: 0.85, stagger: 0.04, duration: 0.3
    })

    gsap.from(popularRef.value?.querySelectorAll('.popular-card'), {
      scrollTrigger: { trigger: popularRef.value, start: 'top 85%' },
      opacity: 0, y: 20, stagger: 0.1, duration: 0.5
    })

    gsap.from(connectRef.value?.querySelector('.connect-card'), {
      scrollTrigger: { trigger: connectRef.value, start: 'top 88%' },
      opacity: 0, y: 30, duration: 0.7
    })
  })
})

onUnmounted(() => { ctx?.revert() })
</script>

<style scoped>
.home { overflow-x: hidden; }

.section-inner { max-width: 1200px; margin: 0 auto; }

.section { padding: 64px 0; }
.section:first-of-type { padding-top: 48px; }

.sec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.sec-header h2 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}

.sec-more {
  font-size: 14px;
  color: var(--primary);
  font-weight: 500;
}

/* ========== HERO ========== */
.hero-wrap {
  padding: 48px 0 32px;
  margin: 0;
  position: relative;
}

.hero-panel {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  align-items: center;
}

.hero-copy { text-align: left; }

.hero-eyebrow {
  font-size: 13px;
  color: var(--primary);
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.hero-title {
  font-size: 44px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.hero-desc {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 28px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.hero-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-cloud { cursor: pointer; transition: all 0.2s ease; }
.tag-cloud:hover { transform: scale(1.08); }

/* ===== Code Window ===== */
.hero-code { min-height: 340px; }

.code-window {
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  background: rgba(9,9,11,0.95);
  box-shadow: var(--shadow-lg);
}

.code-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(24,24,27,0.8);
  border-bottom: 1px solid rgba(161,161,170,0.1);
}

.code-dots { display: flex; gap: 6px; }
.code-dots span {
  width: 10px; height: 10px;
  border-radius: 50%;
}
.code-dots span:nth-child(1) { background: #ef4444; }
.code-dots span:nth-child(2) { background: #eab308; }
.code-dots span:nth-child(3) { background: #22c55e; }

.code-filename {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: 'DM Sans', monospace;
}

.code-body {
  padding: 20px;
  overflow-x: auto;
}

.code-body pre {
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #e4e4e7;
}

.code-body .kw { color: #93c5fd; }
.code-body .fn { color: #6ee7b7; }
.code-body .str { color: #fde68a; }
.code-body .prop { color: #c4b5fd; }
.code-body .num { color: #fca5a5; }

/* ===== Stats Metrics ===== */
.hero-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 40px;
}

.metric-card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.2s ease;
}

.metric-card:hover {
  border-color: var(--border-active);
  transform: translateY(-2px);
}

.metric-icon { font-size: 20px; color: var(--primary); }
.metric-value { font-size: 28px; font-weight: 700; color: var(--text-h); letter-spacing: -0.02em; }
.metric-label { font-size: 13px; color: var(--text-secondary); }

/* ===== Highlights ===== */
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.highlight-card {
  padding: 28px 24px;
  border-radius: var(--radius);
  transition: all 0.25s ease;
  cursor: default;
}

.highlight-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-active);
  box-shadow: var(--shadow-glow);
}

.highlight-card .hl-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(37,99,235,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--primary);
  margin-bottom: 16px;
}

.highlight-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.highlight-card p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}

/* ===== Featured ===== */
.featured-card {
  display: grid;
  grid-template-columns: 340px 1fr;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--bg-card);
  transition: all 0.25s ease;
}

.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-active);
}

.feat-cover {
  display: flex;
  align-items: flex-end;
  padding: 28px;
  min-height: 260px;
}

.feat-badge {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  color: #fff;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.feat-body { padding: 32px 32px 32px 0; }

.feat-tags { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }

.feat-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 14px;
  line-height: 1.2;
}

.feat-summary {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 18px;
}

.feat-meta {
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  gap: 6px;
  align-items: center;
}

/* ===== Post Cards ===== */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.post-card {
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-active);
  box-shadow: var(--shadow-glow);
}

.post-cover {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.post-reading {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 11px;
  color: #fff;
  background: rgba(0,0,0,0.25);
  padding: 2px 10px;
  border-radius: 999px;
  backdrop-filter: blur(4px);
}

.post-body {
  padding: 18px 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-tags { display: flex; gap: 4px; margin-bottom: 10px; }

.post-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-summary {
  font-size: 13px;
  color: var(--text-secondary);
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
  color: var(--text-secondary);
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

/* ===== Timeline ===== */
.timeline {
  border-radius: var(--radius);
  padding: 24px 28px;
}

.tl-group { margin-bottom: 24px; }
.tl-group:last-child { margin-bottom: 0; }

.tl-month {
  font-size: 17px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 12px;
}

.tl-items { display: flex; flex-direction: column; gap: 2px; }

.tl-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.tl-item:hover { background: var(--bg-alt); }

.tl-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-0 { background: var(--primary); }
.dot-1 { background: #06b6d4; }
.dot-2 { background: #10b981; }
.dot-3 { background: #eab308; }
.dot-4 { background: #f43f5e; }

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

.tl-item:hover .tl-title { color: var(--primary); }

.tl-day {
  font-size: 13px;
  color: var(--text-secondary);
  flex-shrink: 0;
  margin-left: 12px;
}

/* ===== Tags Cloud ===== */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding: 20px 0;
}

.tags-cloud sup {
  font-size: 10px;
  opacity: 0.6;
  margin-left: 2px;
}

/* ===== Popular ===== */
.popular-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.popular-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.popular-card:hover {
  transform: translateY(-3px);
  border-color: var(--border-active);
}

.pop-rank {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
  color: #fff;
}

.rank-1 { background: linear-gradient(135deg, #2563EB, #06b6d4); }
.rank-2 { background: linear-gradient(135deg, #71717a, #52525b); }
.rank-3 { background: linear-gradient(135deg, #1d4ed8, #2563EB); }
.rank-4 { background: #2563EB; }

.pop-body { flex: 1; min-width: 0; }

.pop-body h4 {
  font-size: 15px;
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.popular-card:hover .pop-body h4 { color: var(--primary); }

.pop-meta {
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  gap: 6px;
  align-items: center;
}

/* ===== Connect ===== */
.connect-section { padding-bottom: 0; }

.connect-card {
  text-align: center;
  padding: 48px 32px;
  border-radius: var(--radius-lg);
}

.connect-card h2 { font-size: 26px; margin-bottom: 14px; }

.connect-desc {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.7;
  max-width: 460px;
  margin: 0 auto 28px;
}

.connect-links {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.connect-links .btn-primary,
.connect-links .btn-outline {
  text-decoration: none;
}

/* ===== Responsive ===== */
@media (max-width: 1080px) {
  .hero-panel { grid-template-columns: 1fr; }
  .hero-code { min-height: auto; }
  .highlights-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-metrics { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 860px) {
  .hero-title { font-size: 32px; }
  .featured-card { grid-template-columns: 1fr; }
  .feat-cover { min-height: 180px; }
  .feat-body { padding: 20px; }
  .posts-grid { grid-template-columns: 1fr; }
  .popular-grid { grid-template-columns: 1fr; }
  .section { padding: 40px 0; }
}

@media (max-width: 640px) {
  .hero-metrics { grid-template-columns: 1fr; }
  .highlights-grid { grid-template-columns: 1fr; }
  .hero-actions { flex-direction: column; }
  .hero-title { font-size: 28px; }
}
</style>
