import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页', preload: true }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('../views/Articles.vue'),
    meta: { title: '文章列表' }
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetail.vue'),
    meta: { title: '文章详情' }
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('../views/Archive.vue'),
    meta: { title: '归档' }
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('../views/Tools.vue'),
    meta: { title: '工具', preload: false }
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: () => import('../views/MonitorView.vue'),
    meta: { title: '监控', preload: false }
  },
  {
    path: '/editor/new',
    name: 'EditorNew',
    component: () => import('../views/Editor.vue'),
    meta: { title: '新建文章' }
  },
  {
    path: '/editor/:id',
    name: 'EditorEdit',
    component: () => import('../views/Editor.vue'),
    meta: { title: '编辑文章' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { title: '管理后台', preload: false }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { title: '关于' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title 
    ? `${to.meta.title} — 清风博客` 
    : '清风博客 — 前端实战笔记'
  next()
})

export default router
