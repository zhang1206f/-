<template>
  <div class="layout-root">
    <nav class="nav" :class="{ 'nav-scrolled': scrolled }">
      <div class="nav-inner">
        <router-link to="/" class="nav-logo">清风</router-link>

        <div class="nav-links" :class="{ open: mobileOpen }">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: isActive(item.path) }"
            @click="mobileOpen = false"
          >
            {{ item.label }}
          </router-link>
        </div>

        <div class="nav-actions">
          <button class="theme-btn" @click="toggleTheme" :title="isDark ? '切换亮色模式' : '切换暗色模式'">
            <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          <button class="hamburger" @click="mobileOpen = !mobileOpen" :class="{ open: mobileOpen }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>

    <main class="main">
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <p>&copy; 2026 清风博客</p>
        <span class="footer-dot">·</span>
        <p>Built with Vue 3 + Vite</p>
        <span class="footer-dot">·</span>
        <p>前端实战笔记</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const mobileOpen = ref(false)
const scrolled = ref(false)

let scrollHandler = null

onMounted(() => {
  scrollHandler = () => {
    scrolled.value = window.scrollY > 20
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
})

onUnmounted(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
})

const menuItems = [
  { path: '/', label: '首页' },
  { path: '/articles', label: '文章' },
  { path: '/archive', label: '归档' },
  { path: '/tools', label: '小工具' },
  { path: '/about', label: '关于' }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.layout-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  position: fixed;
  top: 16px;
  left: 24px;
  right: 24px;
  z-index: 1000;
  border-radius: var(--radius);
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  transition: all 0.3s ease, background 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.nav-scrolled {
  box-shadow: var(--shadow-md);
  border-color: var(--border-active);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: var(--nav-height);
}

.nav-logo {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px;
  font-weight: 700;
  background: var(--accent-gradient-2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--text-h);
  background: var(--bg-alt);
}

.nav-link.active {
  color: var(--primary);
  background: rgba(37,99,235,0.08);
}

.dark .nav-link.active {
  background: rgba(59,130,246,0.1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-alt);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.theme-btn:hover {
  color: var(--primary);
  border-color: var(--border-active);
  background: var(--bg-alt);
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger span {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--text-secondary);
  border-radius: 2px;
  transition: all 0.2s ease;
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(4px, 4px);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(4px, -4px);
}

.main {
  flex: 1;
  padding: calc(var(--nav-height) + 40px) 24px 40px;
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.footer {
  padding: 32px 24px;
  border-top: 1px solid var(--border);
  background: var(--bg-alt);
  transition: background 0.3s ease;
}

.footer-inner {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.footer-inner p {
  margin: 0;
}

.footer-dot {
  opacity: 0.3;
}

@media (max-width: 860px) {
  .nav {
    left: 16px;
    right: 16px;
    top: 12px;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: calc(100% + 8px);
    left: 8px;
    right: 8px;
    flex-direction: column;
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 8px;
    gap: 2px;
    box-shadow: var(--shadow-lg);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    padding: 12px 16px;
  }

  .hamburger {
    display: flex;
  }

  .main {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
