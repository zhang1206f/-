import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import rawArticles from '../mock/articles.js'

const STORAGE_KEY = 'blog-articles'

function readingTime(text) {
  const words = text.replace(/```[\s\S]*?```/g, '').length
  return Math.max(1, Math.ceil(words / 400))
}

function enrichArticle(a) {
  return {
    ...a,
    readingTime: readingTime(a.content),
    category: a.category || null,
    status: a.status || 'published',
    updatedAt: a.updatedAt || a.date,
    sortOrder: a.sortOrder || 0,
    coverImage: a.coverImage || ''
  }
}

// 默认分类 ID 列表，用于循环分配给默认文章
const defaultCategoryIds = [1, 2, 3, 4]

const defaultArticles = rawArticles.map((a, i) =>
  enrichArticle({
    ...a,
    category: defaultCategoryIds[i % defaultCategoryIds.length],
    status: 'published',
    updatedAt: a.date,
    sortOrder: i
  })
)

function loadArticles() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        return parsed.map(enrichArticle)
      }
    }
    return null
  } catch {
    return null
  }
}

function saveArticles(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
}

export const useArticlesStore = defineStore('articles', () => {
  const raw = loadArticles()
  const articles = ref(Array.isArray(raw) ? raw : defaultArticles)

  const publishedArticles = computed(() => {
    const list = Array.isArray(articles.value) ? articles.value : []
    return list
      .filter(a => a.status === 'published')
      .sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0) || b.date.localeCompare(a.date))
  })

  const draftArticles = computed(() => {
    const list = Array.isArray(articles.value) ? articles.value : []
    return list.filter(a => a.status === 'draft')
  })

  const archivedArticles = computed(() => {
    const list = Array.isArray(articles.value) ? articles.value : []
    return list.filter(a => a.status === 'archived')
  })

  function persist() {
    saveArticles(articles.value)
  }

  function getArticleById(id) {
    return articles.value.find(a => a.id === Number(id))
  }

  function addArticle(article) {
    const maxId = articles.value.reduce((max, a) => Math.max(max, a.id), 0)
    const now = new Date().toISOString().split('T')[0]
    const newArticle = enrichArticle({
      ...article,
      id: maxId + 1,
      date: article.date || now,
      updatedAt: now,
      views: 0,
      sortOrder: articles.value.length
    })
    articles.value.unshift(newArticle)
    persist()
    return newArticle
  }

  function updateArticle(id, updates) {
    const index = articles.value.findIndex(a => a.id === Number(id))
    if (index !== -1) {
      const now = new Date().toISOString().split('T')[0]
      articles.value[index] = enrichArticle({
        ...articles.value[index],
        ...updates,
        updatedAt: now
      })
      if (updates.content) {
        articles.value[index].readingTime = readingTime(updates.content)
      }
      persist()
      return articles.value[index]
    }
    return null
  }

  function deleteArticle(id) {
    const index = articles.value.findIndex(a => a.id === Number(id))
    if (index !== -1) {
      articles.value.splice(index, 1)
      persist()
      return true
    }
    return false
  }

  function importData(data, mode = 'merge') {
    let imported = 0
    let skipped = 0
    if (mode === 'replace') {
      articles.value = (data.articles || []).map(enrichArticle)
      imported = articles.value.length
    } else {
      const existingIds = new Set(articles.value.map(a => a.id))
      for (const a of (data.articles || [])) {
        if (existingIds.has(a.id)) {
          skipped++
        } else {
          articles.value.push(enrichArticle(a))
          imported++
        }
      }
    }
    persist()
    return { imported, skipped }
  }

  function exportData() {
    return {
      version: '2.0',
      exportDate: new Date().toISOString(),
      articles: articles.value
    }
  }

  return {
    articles,
    publishedArticles,
    draftArticles,
    archivedArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle,
    importData,
    exportData
  }
})
