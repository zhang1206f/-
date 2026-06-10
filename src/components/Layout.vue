<template>
  <div class="layout-root">
    <div class="layout-orb orb-a" />
    <div class="layout-orb orb-b" />
    <div class="layout-grid" />

    <div
      ref="progressRef"
      class="scroll-progress"
    />

    <header class="site-header">
      <div class="site-header__inner">
        <router-link
          to="/"
          class="brand"
          @click="mobileOpen = false"
        >
          <span class="brand-mark">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </span>
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
          <button
            class="btn-ghost nav-toggle-theme"
            :title="`切换${isDark ? '浅色' : '暗色'}模式`"
            @click="toggleTheme"
          >
            <svg
              v-if="isDark"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle
                cx="12"
                cy="12"
                r="4"
              />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3c0 .3-.01.61-.01.92A8.87 8.87 0 0 0 21 12.79z" />
            </svg>
          </button>

          <button
            class="btn-ghost nav-burger"
            :aria-expanded="mobileOpen"
            aria-label="切换导航菜单"
            @click="mobileOpen = !mobileOpen"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        class="mobile-panel glass-panel"
        :class="{ open: mobileOpen }"
      >
        <div class="mobile-panel-inner">
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
      </div>
    </header>

    <main class="site-main">
      <router-view v-slot="{ Component, route: currentRoute }">
        <transition
          mode="out-in"
          :css="false"
          @enter="onEnter"
          @leave="onLeave"
        >
          <component
            :is="Component"
            :key="currentRoute.fullPath"
            class="route-screen"
          />
        </transition>
      </router-view>
    </main>

    <footer
      ref="footerRef"
      class="site-footer"
    >
      <div class="site-footer__inner">
        <span class="footer-copy">© {{ currentYear }} 清风博客</span>
        <span class="footer-powered">Vue 3 · Vite · GSAP</span>
      </div>
    </footer>

    <!-- 返回顶部按钮 -->
    <button
      class="back-to-top"
      :class="{ visible: showBackToTop }"
      aria-label="返回顶部"
      @click="scrollToTop"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../composables/useMotion'
import { useTheme } from '../composables/useTheme'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const mobileOpen = ref(false)
const currentYear = new Date().getFullYear()

const menuItems = [
  { path: '/', label: '首页', desc: '品牌首页与内容概览' },
  { path: '/articles', label: '文章', desc: '按主题筛选与浏览内容' },
  { path: '/archive', label: '归档', desc: '按时间线查看更新记录' },
  { path: '/tools', label: '小工具', desc: '交互式效率与趣味工具' },
  { path: '/monitor', label: '监控', desc: '实时资源与网络监控' },
  { path: '/admin', label: '管理', desc: '文章与知识库管理' },
  { path: '/about', label: '关于', desc: '作者简介与能力画像' }
]

const isActive = (path) => (path === '/' ? route.path === '/' : route.path.startsWith(path))

const progressRef = ref(null)
const footerRef = ref(null)
const showBackToTop = ref(false)

const handleScroll = () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
  if (progressRef.value) {
    progressRef.value.style.width = `${Math.min(pct * 100, 100)}%`
  }
  showBackToTop.value = window.scrollY > 500
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
  gsap.from(footerRef.value, {
    opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: footerRef.value, start: 'top 92%', once: true }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const onEnter = (el, done) => {
  if (prefersReducedMotion()) {
    el.style.opacity = '1'
    done()
    return
  }

  let called = false
  const safeDone = () => { if (!called) { called = true; done() } }
  const timer = setTimeout(safeDone, 200)

  gsap.fromTo(
    el,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out', onComplete: () => { clearTimeout(timer); safeDone(); ScrollTrigger.refresh() } }
  )
}

const onLeave = (el, done) => {
  if (prefersReducedMotion()) {
    done()
    return
  }

  let called = false
  const safeDone = () => { if (!called) { called = true; done() } }
  const timer = setTimeout(safeDone, 250)

  gsap.to(el, {
    opacity: 0,
    duration: 0.12,
    ease: 'power2.in',
    onComplete: () => { clearTimeout(timer); safeDone() }
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

.scroll-progress {
  position: fixed;
  top: 0; left: 0;
  width: 0%;
  height: 2px;
  background: var(--gradient-brand);
  z-index: 100;
  pointer-events: none;
  transition: opacity 0.3s;
}

.site-header {
  position: relative;
  padding: 0 24px;
  z-index: 20;
}

.site-header__inner {
  width: min(100%, var(--container));
  margin: 0 auto;
  min-height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 0 4px;
  border-bottom: 1px solid var(--line);
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
  width: min(100%, var(--container));
  margin: 12px auto 0;
  padding: 10px;
  border-radius: 22px;
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  overflow: hidden;
  transition: grid-template-rows 280ms ease, opacity 280ms ease;
}

.mobile-panel.open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.mobile-panel-inner {
  display: grid;
  gap: 6px;
  min-height: 0;
  overflow: hidden;
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
  padding: 0 24px 32px;
}

.site-footer__inner {
  width: min(100%, var(--container));
  margin: 0 auto;
  padding: 20px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--line);
}

.footer-copy { font-size: 13px; color: var(--text-subtle); }
.footer-powered { font-size: 12px; color: var(--text-subtle); font-family: 'JetBrains Mono', monospace; }

@media (max-width: 980px) {
  .site-nav {
    display: none;
  }

  .nav-burger {
    display: inline-flex;
    flex-direction: column;
    gap: 4px;
  }

  .mobile-panel-inner {
    gap: 6px;
  }

  .site-footer__inner {
    flex-direction: column;
    gap: 6px;
    text-align: center;
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

/* ===== 返回顶部按钮 ===== */
.back-to-top {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 80;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface-strong);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transform: translateY(16px);
  transition: opacity var(--transition-base), visibility var(--transition-base), transform var(--transition-base), color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.back-to-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.back-to-top:hover {
  color: var(--primary);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
