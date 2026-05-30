<template>
  <div class="layout-root">
    <div class="layout-orb orb-a"></div>
    <div class="layout-orb orb-b"></div>
    <div class="layout-grid"></div>

    <header class="site-header" :class="{ scrolled }">
      <div class="site-header__inner">
        <router-link to="/" class="brand" @click="mobileOpen = false">
          <span class="brand-mark">Q</span>
          <span class="brand-copy">
            <strong>清风博客</strong>
            <small>Frontend Notes & Motion UI</small>
          </span>
        </router-link>

        <nav class="site-nav">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="site-nav__link"
            :class="{ active: isActive(item.path) }"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="site-actions">
          <button class="btn-ghost nav-toggle-theme" :title="`切换${isDark ? '浅色' : '暗色'}模式`" @click="toggleTheme">
            <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3c0 .3-.01.61-.01.92A8.87 8.87 0 0 0 21 12.79z"></path>
            </svg>
          </button>

          <router-link to="/articles" class="btn-primary nav-cta">开始阅读</router-link>

          <button
            class="btn-ghost nav-burger"
            :aria-expanded="mobileOpen"
            aria-label="切换导航菜单"
            @click="mobileOpen = !mobileOpen"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div class="mobile-panel glass-panel" :class="{ open: mobileOpen }">
        <router-link
          v-for="item in menuItems"
          :key="`${item.path}-mobile`"
          :to="item.path"
          class="mobile-link"
          :class="{ active: isActive(item.path) }"
          @click="mobileOpen = false"
        >
          <span>{{ item.label }}</span>
          <small>{{ item.desc }}</small>
        </router-link>
      </div>
    </header>

    <main class="site-main">
      <router-view v-slot="{ Component, route: currentRoute }">
        <transition mode="out-in" :css="false" @enter="onEnter" @leave="onLeave">
          <component :is="Component" :key="currentRoute.fullPath" class="route-screen" />
        </transition>
      </router-view>
    </main>

    <footer class="site-footer">
      <div class="site-footer__inner">
        <div class="footer-brand">
          <span class="eyebrow">Crafted Experience</span>
          <h3>让技术内容也拥有产品级视觉与交互表达。</h3>
          <p>基于 Vue 3、Vite、Ant Design Vue 与 GSAP 构建，覆盖响应式、主题切换、页面转场与沉浸式阅读体验。</p>
        </div>

        <div class="footer-meta">
          <div class="footer-card glass-panel">
            <span class="footer-label">当前主题</span>
            <strong>{{ isDark ? 'Dark Mode' : 'Light Mode' }}</strong>
            <small>{{ themeLabel }}</small>
          </div>
          <div class="footer-card glass-panel">
            <span class="footer-label">内容定位</span>
            <strong>前端实战笔记</strong>
            <small>Vue 3 / 工程化 / UI 动效</small>
          </div>
          <div class="footer-card glass-panel">
            <span class="footer-label">版权</span>
            <strong>© 2026 清风博客</strong>
            <small>Designed for all screens</small>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { gsap, prefersReducedMotion } from '../composables/useMotion'
import { useTheme } from '../composables/useTheme'

const route = useRoute()
const { isDark, themeLabel, toggleTheme } = useTheme()
const mobileOpen = ref(false)
const scrolled = ref(false)

const menuItems = [
  { path: '/', label: '首页', desc: '品牌首页与内容概览' },
  { path: '/articles', label: '文章', desc: '按主题筛选与浏览内容' },
  { path: '/archive', label: '归档', desc: '按时间线查看更新记录' },
  { path: '/tools', label: '小工具', desc: '交互式效率与趣味工具' },
  { path: '/about', label: '关于', desc: '作者简介与能力画像' }
]

const isActive = (path) => (path === '/' ? route.path === '/' : route.path.startsWith(path))

const handleScroll = () => {
  scrolled.value = window.scrollY > 10
}

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  }
)

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const onEnter = (el, done) => {
  if (prefersReducedMotion()) {
    done()
    return
  }

  gsap.fromTo(
    el,
    { opacity: 0, y: 28, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.56, ease: 'power2.out', onComplete: done }
  )
}

const onLeave = (el, done) => {
  if (prefersReducedMotion()) {
    done()
    return
  }

  gsap.to(el, {
    opacity: 0,
    y: -18,
    filter: 'blur(8px)',
    duration: 0.28,
    ease: 'power2.in',
    onComplete: done
  })
}
</script>

<style scoped>
.layout-root {
  position: relative;
  min-height: 100vh;
}

.layout-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.34;
  pointer-events: none;
  z-index: 0;
}

.orb-a {
  top: 90px;
  left: 4%;
  width: 260px;
  height: 260px;
  background: rgba(109, 124, 255, 0.26);
}

.orb-b {
  right: 4%;
  bottom: 12%;
  width: 320px;
  height: 320px;
  background: rgba(34, 193, 195, 0.18);
}

.layout-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, transparent, rgba(109, 124, 255, 0.03));
  z-index: 0;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 18px 24px 0;
  transition: padding var(--transition-base);
}

.site-header.scrolled {
  padding-top: 10px;
}

.site-header__inner {
  width: min(100%, var(--container));
  margin: 0 auto;
  min-height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 12px 18px;
  border-radius: 24px;
  background: var(--backdrop);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.brand-mark {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: var(--gradient-brand);
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  box-shadow: 0 18px 36px rgba(109, 124, 255, 0.28);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-copy strong {
  color: var(--text-heading);
  font-size: 15px;
  line-height: 1.2;
}

.brand-copy small {
  color: var(--text-subtle);
  font-size: 12px;
  line-height: 1.2;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.34);
  border: 1px solid rgba(148, 163, 184, 0.14);
}

.dark .site-nav {
  background: rgba(15, 23, 42, 0.5);
}

.site-nav__link {
  min-height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  border-radius: 12px;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 700;
  transition: all var(--transition-base);
}

.site-nav__link:hover,
.site-nav__link.active {
  color: var(--primary);
  background: var(--primary-soft);
}

.site-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-toggle-theme {
  width: 46px;
  padding: 0;
}

.nav-cta {
  min-width: 112px;
}

.nav-burger {
  display: none;
  width: 46px;
  padding: 0;
}

.nav-burger span {
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
}

.mobile-panel {
  display: none;
  width: min(100%, var(--container));
  margin: 12px auto 0;
  padding: 10px;
  border-radius: 22px;
}

.mobile-link {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
  border-radius: 16px;
  color: var(--text-muted);
  transition: all var(--transition-base);
}

.mobile-link span {
  color: var(--text-heading);
  font-weight: 700;
}

.mobile-link small {
  color: var(--text-subtle);
  font-size: 12px;
}

.mobile-link.active {
  background: var(--primary-soft);
  border-color: var(--line-strong);
}

.site-main {
  position: relative;
  z-index: 1;
  padding-top: 28px;
}

.route-screen {
  width: 100%;
}

.site-footer {
  position: relative;
  z-index: 1;
  padding: 0 24px 32px;
}

.site-footer__inner {
  width: min(100%, var(--container));
  margin: 0 auto;
  padding: 28px;
  border-radius: 28px;
  border: 1px solid var(--line);
  background: var(--gradient-panel);
  box-shadow: var(--shadow-md);
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-brand h3 {
  max-width: 560px;
  font-size: clamp(24px, 3vw, 36px);
}

.footer-brand p {
  max-width: 620px;
  color: var(--text-muted);
}

.footer-meta {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.footer-card {
  padding: 20px;
  border-radius: 22px;
}

.footer-label {
  display: block;
  color: var(--text-subtle);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.footer-card strong {
  display: block;
  margin-top: 10px;
  color: var(--text-heading);
  font-size: 18px;
}

.footer-card small {
  display: block;
  margin-top: 8px;
  color: var(--text-muted);
}

@media (max-width: 980px) {
  .site-nav,
  .nav-cta {
    display: none;
  }

  .nav-burger {
    display: inline-flex;
    flex-direction: column;
    gap: 4px;
  }

  .mobile-panel.open {
    display: grid;
    gap: 6px;
  }

  .site-footer__inner {
    grid-template-columns: 1fr;
  }

  .footer-meta {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .site-header,
  .site-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .site-header__inner {
    padding: 10px 14px;
  }
}

@media (max-width: 560px) {
  .brand-copy small {
    display: none;
  }
}
</style>
