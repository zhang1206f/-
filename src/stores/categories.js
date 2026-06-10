import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'blog-categories'

const defaultCategories = [
  { id: 1, name: 'Vue 实战', icon: 'Vue' },
  { id: 2, name: '工程化', icon: 'Vite' },
  { id: 3, name: 'CSS', icon: 'CSS' },
  { id: 4, name: 'JavaScript', icon: 'JS' }
]

function loadCategories() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function saveCategories(categories) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
}

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref(loadCategories() || [...defaultCategories])

  function persist() {
    saveCategories(categories.value)
  }

  function getCategoryById(id) {
    return categories.value.find(c => c.id === id)
  }

  function addCategory(category) {
    const maxId = categories.value.reduce((max, c) => Math.max(max, c.id), 0)
    const newCategory = { ...category, id: maxId + 1 }
    categories.value.push(newCategory)
    persist()
    return newCategory
  }

  function updateCategory(id, updates) {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
      persist()
      return true
    }
    return false
  }

  function deleteCategory(id) {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      persist()
      return true
    }
    return false
  }

  return {
    categories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
  }
})
