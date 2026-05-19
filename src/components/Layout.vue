<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <router-link to="/" class="logo">清风博客</router-link>
      <div class="nav-container">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          theme="dark"
          :items="menuItems"
          @click="handleMenuClick"
          class="nav-menu"
        />
      </div>

      <div class="header-right">
        <a-button type="text" shape="circle" class="icon-btn" @click="handleSearch">
          <template #icon><SearchOutlined /></template>
        </a-button>
        <a-button type="primary" class="action-btn" @click="goArticles">最新文章</a-button>
      </div>
    </a-layout-header>

    <a-layout-content class="content">
      <router-view />
    </a-layout-content>

    <a-layout-footer class="footer">
      <div class="footer-inner">
        <div class="footer-col">
          <h4>清风博客</h4>
          <p class="footer-bio">这是一个专注于前端实战、性能优化、工具链与 Vue 生态的技术博客。</p>
        </div>
        <div class="footer-col">
          <h4>快速导航</h4>
          <router-link to="/">首页</router-link>
          <router-link to="/articles">文章</router-link>
          <router-link to="/archive">归档</router-link>
          <router-link to="/about">关于我</router-link>
        </div>
        <div class="footer-col">
          <h4>联系我</h4>
          <a href="https://github.com" target="_blank">GitHub</a>
          <a href="https://twitter.com" target="_blank">Twitter / X</a>
          <a href="mailto:hello@qingfeng.me">Email</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 清风博客</span>
        <span class="sep">·</span>
        <span>Built with Vue 3 + Vite</span>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { SearchOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const current = ref([route.path])

watch(
  () => route.path,
  (path) => {
    current.value = [path]
  }
)

const menuItems = [
  { key: '/', label: '首页' },
  { key: '/articles', label: '文章' },
  { key: '/archive', label: '归档' },
  { key: '/tools', label: '小工具' },
  { key: '/about', label: '关于我' }
]

const handleMenuClick = ({ key }) => {
  router.push(key)
}

const handleSearch = () => {
  router.push('/articles')
}

const goArticles = () => {
  router.push('/articles')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background: transparent;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 72px;
  background: rgba(8, 15, 41, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.logo {
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-decoration: none;
}

.nav-container {
  flex: 1;
  margin: 0 24px;
}

.nav-menu {
  width: 100%;
  border-bottom: none;
  background: transparent;
}

.nav-menu :deep(.ant-menu-item) {
  font-size: 15px;
  padding: 0 18px;
}

.nav-menu :deep(.ant-menu-item-selected) {
  background: rgba(255, 255, 255, 0.08) !important;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  color: rgba(255, 255, 255, 0.72);
}

.action-btn {
  border-radius: 999px;
  padding: 0 18px;
}

.content {
  padding: 100px 24px 40px;
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  min-height: calc(100vh - 240px);
}

.footer {
  background: rgba(8, 15, 41, 0.96);
  padding: 56px 24px 24px;
  color: rgba(255, 255, 255, 0.7);
}

.footer-inner {
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 36px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-col h4 {
  color: #fff;
  font-size: 16px;
  margin-bottom: 14px;
}

.footer-bio {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
}

.footer-col a,
.footer-col router-link {
  display: block;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  margin-bottom: 10px;
  transition: color 0.2s;
}

.footer-col a:hover,
.footer-col router-link:hover {
  color: #fff;
}

.footer-bottom {
  max-width: 1240px;
  margin: 24px auto 0;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.38);
}

@media (max-width: 860px) {
  .header {
    padding: 0 18px;
    height: auto;
    flex-wrap: wrap;
    gap: 12px;
  }

  .nav-container {
    margin: 0;
    width: 100%;
  }

  .content {
    padding-top: 120px;
  }

  .footer-inner {
    grid-template-columns: 1fr;
  }
}

.sep {
  margin: 0 12px;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .header {
    padding: 0 16px;
  }
  .content {
    padding: 80px 16px 24px;
  }
}
</style>
