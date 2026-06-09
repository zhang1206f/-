<template>
  <div
    ref="pageRef"
    class="page-shell page-stack home-page"
  >
    <!-- Hero 区 -->
    <section
      ref="heroRef"
      class="page-hero hero-section"
    >
      <div class="hero-content">
        <span class="eyebrow hero-chip">
          <span class="status-dot" />
          持续更新中的前端实战博客
        </span>
        <h1 class="section-title hero-title">
          用工程化思维，
          <span class="text-gradient">写可复用的前端经验</span>
        </h1>
        <p class="section-subtitle hero-subtitle">
          聚焦 Vue 3 生态与交互动效，每篇文章都来自真实项目实践
        </p>

        <div class="hero-actions">
          <button
            class="btn-primary"
            @click="goArticles"
          >
            浏览文章
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
          <button
            class="btn-secondary"
            @click="goAbout"
          >
            关于我
          </button>
        </div>

        <div class="hero-tags">
          <span class="tag-pill tag-vue">Vue 3</span>
          <span class="tag-pill tag-vite">Vite</span>
          <span class="tag-pill tag-css">设计系统</span>
          <span class="tag-pill tag-best">性能优化</span>
        </div>

        <div class="scroll-hint">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </section>

    <!-- 精选文章 -->
    <section
      ref="featuredRef"
      class="section-card featured-section"
    >
      <div class="section-header">
        <div>
          <span class="eyebrow">Featured Stories</span>
          <h2>精选文章</h2>
        </div>
        <button
          class="btn-link"
          @click="goArticles"
        >
          查看全部
        </button>
      </div>

      <div class="featured-grid">
        <button
          v-for="article in featuredArticles"
          :key="article.id"
          class="featured-card card-hover"
          @click="goToArticle(article.id)"
        >
          <div
            class="featured-cover"
            :style="{ background: getCoverGradient(article) }"
          >
            <span
              class="tag-pill tag-sm"
              :class="getTagClass(article.tags[0])"
            >{{ article.tags[0] }}</span>
          </div>
          <div class="featured-body">
            <h3>{{ article.title }}</h3>
            <p class="featured-summary">{{ article.summary }}</p>
            <div class="featured-meta">
              <span>{{ formatShortDate(article.date) }}</span>
              <span class="sep">/</span>
              <span>{{ article.readingTime }} 分钟</span>
              <span class="sep">/</span>
              <span>{{ article.views }} 次阅读</span>
            </div>
          </div>
        </button>
      </div>
    </section>

    <!-- 最新文章列表 -->
    <section
      ref="latestRef"
      class="section-card latest-section"
    >
      <div class="section-header">
        <div>
          <span class="eyebrow">Latest Articles</span>
          <h2>最新文章</h2>
        </div>
        <button
          class="btn-link"
          @click="goArticles"
        >
          查看全部
        </button>
      </div>

      <div class="latest-list">
        <button
          v-for="(article, index) in latestArticles"
          :key="article.id"
          class="latest-item card-hover"
          @click="goToArticle(article.id)"
        >
          <span class="latest-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="latest-content">
            <div class="latest-tags">
              <span
                v-for="tag in article.tags.slice(0, 2)"
                :key="tag"
                class="tag-pill tag-sm"
                :class="getTagClass(tag)"
              >{{ tag }}</span>
            </div>
            <h3>{{ article.title }}</h3>
            <p class="latest-summary">{{ article.summary }}</p>
            <div class="latest-meta">
              <span>{{ formatShortDate(article.date) }}</span>
              <span class="sep">/</span>
              <span>{{ article.readingTime }} 分钟</span>
            </div>
          </div>
        </button>
      </div>
    </section>

    <!-- 底部 CTA -->
    <section
      ref="ctaRef"
      class="section-card cta-section"
    >
      <div class="cta-content">
        <h2>想继续深入某个主题？</h2>
        <p>可以从归档查看完整更新路径，也可以直接进入关于页了解我的工程背景与设计偏好。</p>
        <div class="cta-actions">
          <router-link
            to="/archive"
            class="btn-primary"
          >
            查看归档
          </router-link>
          <router-link
            to="/about"
            class="btn-secondary"
          >
            关于作者
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import articles from '../mock/articles'
import { formatShortDate, getCoverGradient, getTagClass } from '../composables/useArticleMeta'
import { animateIn, attachHoverLift, attachMagneticButtons, gsap, revealOnScroll, useGsapContext } from '../composables/useMotion'

const router = useRouter()

const pageRef = ref(null)
const heroRef = ref(null)
const featuredRef = ref(null)
const latestRef = ref(null)
const ctaRef = ref(null)

// 精选文章：按阅读量排序取前2篇
const featuredArticles = computed(() =>
  [...articles].sort((a, b) => b.views - a.views).slice(0, 2)
)

// 最新文章：按日期排序取前3篇
const latestArticles = computed(() =>
  [...articles].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
)

const goArticles = () => router.push('/articles')
const goAbout = () => router.push('/about')
const goToArticle = (id) => router.push(`/articles/${id}`)

let detachHover = () => {}
let detachMagnet = () => {}

onMounted(() => {
  detachHover = attachHoverLift(pageRef.value?.querySelectorAll('.card-hover'))
  detachMagnet = attachMagneticButtons(heroRef.value?.querySelectorAll('.btn-primary, .btn-secondary'))
})

onUnmounted(() => {
  detachHover()
  detachMagnet()
})

useGsapContext(() => {
  animateIn(heroRef.value?.querySelectorAll('.hero-chip, .hero-title, .hero-subtitle, .hero-actions, .hero-tags, .scroll-hint'), {
    stagger: 0.08
  })

  revealOnScroll(featuredRef.value?.querySelectorAll('.featured-card'), { trigger: featuredRef.value })
  revealOnScroll(latestRef.value?.querySelectorAll('.latest-item'), { trigger: latestRef.value })
  revealOnScroll(ctaRef.value, { trigger: ctaRef.value })
})
</script>

<style scoped>
.home-page {
  gap: 24px;
}

.hero-section {
  padding: 0;
  background: 
    radial-gradient(ellipse at 50% 0%, rgba(109, 124, 255, 0.08), transparent 60%),
    var(--gradient-panel);
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px;
  min-height: calc(100vh - 72px);
  gap: 24px;
}

.hero-title {
  max-width: 760px;
  font-size: clamp(32px, 5vw, 56px);
}

.hero-subtitle {
  max-width: 680px;
  margin: 0 auto;
}

.hero-actions,
.hero-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.scroll-hint {
  margin-top: 24px;
  color: var(--text-subtle);
  animation: bounce 2s infinite, fadeInOut 3s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.featured-card {
  overflow: hidden;
  padding: 0;
  border-radius: 24px;
  border: 1px solid var(--line);
  background: var(--surface-strong);
  text-align: left;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.featured-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.featured-cover {
  position: relative;
  min-height: 180px;
  display: flex;
  align-items: flex-start;
  padding: 18px;
  overflow: hidden;
}

.featured-cover::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 300%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.featured-card:hover .featured-cover::before {
  left: 100%;
}

.featured-cover .tag-pill {
  background: rgba(15, 23, 42, 0.32);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.18);
}

.featured-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.featured-body h3 {
  color: var(--text-heading);
}

.featured-summary {
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: var(--text-subtle);
  font-size: 13px;
}

.latest-section {
  line-height: 1px;
  border-radius: 9px;
}

.latest-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.latest-item {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 20px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  text-align: left;
  transition: all 0.3s ease;
  position: relative;
}

.latest-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--line), transparent);
}

.latest-item:last-child::after {
  display: none;
}

.latest-item:hover {
  background: var(--surface-strong);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.latest-index {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 48px;
  font-weight: 700;
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4px;
}

.latest-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.latest-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.latest-content h3 {
  color: var(--text-heading);
}

.latest-summary {
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.latest-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: var(--text-subtle);
  font-size: 13px;
}

.cta-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 60px 24px;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(ellipse at center, rgba(109, 124, 255, 0.05) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

.cta-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(109, 124, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(79, 209, 197, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
  z-index: 1;
}

.cta-content p {
  color: var(--text-muted);
}

.cta-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 1080px) {
  .featured-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 40px 16px;
    min-height: calc(100vh - 60px);
  }

  .latest-item {
    grid-template-columns: 60px 1fr;
    gap: 16px;
    padding: 16px;
  }

  .latest-index {
    font-size: 36px;
  }

  .cta-section {
    padding: 40px 16px;
  }
}

@media (max-width: 640px) {
  .hero-actions,
  .cta-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero-actions button,
  .cta-actions a {
    width: 100%;
  }

  .latest-item {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }

  .latest-index {
    font-size: 24px;
    justify-content: flex-start;
  }

  .featured-card {
    border-radius: 16px;
  }

  .latest-item {
    border-radius: 16px;
  }
}
</style>