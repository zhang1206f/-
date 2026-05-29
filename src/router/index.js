import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Articles from '../views/Articles.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import Archive from '../views/Archive.vue'
import About from '../views/About.vue'
import Tools from '../views/Tools.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/articles', name: 'Articles', component: Articles },
  { path: '/articles/:id', name: 'ArticleDetail', component: ArticleDetail },
  { path: '/archive', name: 'Archive', component: Archive },
  { path: '/about', name: 'About', component: About },
  { path: '/tools', name: 'Tools', component: Tools }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
