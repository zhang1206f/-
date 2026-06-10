<template>
  <div ref="pageRef" class="page-shell page-stack admin-page">
    <!-- Hero 区域 -->
    <section class="page-hero admin-hero">
      <div>
        <span class="eyebrow">Dashboard</span>
        <h1 class="section-title">管理后台</h1>
        <p class="section-subtitle">管理文章内容与分类体系，支持数据导入导出。</p>
      </div>
      <div class="admin-hero__stats">
        <article class="metric-mini glass-panel">
          <span>文章总数</span>
          <strong>{{ allArticles.length }}</strong>
        </article>
        <article class="metric-mini glass-panel">
          <span>分类数</span>
          <strong>{{ categories.length }}</strong>
        </article>
      </div>
    </section>

    <!-- Tab 切换 -->
    <div class="admin-tabs">
      <button
        class="admin-tab"
        :class="{ active: activeTab === 'articles' }"
        @click="activeTab = 'articles'"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        文章管理
      </button>
      <button
        class="admin-tab"
        :class="{ active: activeTab === 'categories' }"
        @click="activeTab = 'categories'"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        分类管理
      </button>
    </div>

    <!-- ============ Tab 1: 文章管理 ============ -->
    <template v-if="activeTab === 'articles'">
      <!-- 操作栏 -->
      <section class="section-card admin-actions-bar">
        <div class="actions-left">
          <button class="btn-primary" @click="router.push('/editor/new')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            新建文章
          </button>
        </div>
        <div class="actions-right">
          <label class="btn-ghost import-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            导入数据
            <input
              ref="importInputRef"
              type="file"
              accept=".json"
              class="file-input-hidden"
              @change="handleImport"
            />
          </label>
          <button class="btn-ghost" @click="handleExport">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            导出数据
          </button>
        </div>
      </section>

      <!-- 状态筛选 -->
      <div class="status-filters">
        <button
          v-for="filter in statusFilters"
          :key="filter.key"
          class="status-filter-btn"
          :class="{ active: statusFilter === filter.key }"
          @click="statusFilter = filter.key"
        >
          {{ filter.label }}
          <span class="filter-count">{{ filter.count }}</span>
        </button>
      </div>

      <!-- 文章列表 -->
      <section class="section-card">
        <div v-if="filteredArticles.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p>暂无文章，点击「新建文章」开始创作。</p>
        </div>

        <div v-else class="article-list">
          <!-- 列表头 -->
          <div class="list-header">
            <span class="col-title">标题</span>
            <span class="col-category">分类</span>
            <span class="col-status">状态</span>
            <span class="col-date">日期</span>
            <span class="col-views">阅读</span>
            <span class="col-actions">操作</span>
          </div>

          <!-- 文章行 -->
          <div
            v-for="article in filteredArticles"
            :key="article.id"
            class="article-row"
          >
            <div class="col-title">
              <span class="article-title-text">{{ article.title }}</span>
            </div>
            <div class="col-category">
              <span class="tag-pill tag-sm">{{ getCategoryName(article.category) }}</span>
            </div>
            <div class="col-status">
              <span class="status-badge" :class="'status-badge--' + article.status">
                {{ statusLabel(article.status) }}
              </span>
            </div>
            <div class="col-date">
              <span class="date-text">{{ article.date }}</span>
            </div>
            <div class="col-views">
              <span class="views-text">{{ article.views }}</span>
            </div>
            <div class="col-actions">
              <button class="btn-sm btn-edit" @click="router.push('/editor/' + article.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                编辑
              </button>
              <div class="status-dropdown-wrap">
                <button class="btn-sm btn-status">
                  状态
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div class="status-dropdown">
                  <button
                    v-for="opt in statusOptions"
                    :key="opt.value"
                    class="dropdown-item"
                    :class="{ current: article.status === opt.value }"
                    @click="handleStatusChange(article.id, opt.value)"
                  >
                    <span class="status-badge status-badge--sm" :class="'status-badge--' + opt.value">
                      {{ opt.label }}
                    </span>
                  </button>
                </div>
              </div>
              <button class="btn-sm btn-delete" @click="handleDeleteArticle(article.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                删除
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ============ Tab 2: 分类管理 ============ -->
    <template v-if="activeTab === 'categories'">
      <section class="section-card admin-actions-bar">
        <div class="actions-left">
          <button class="btn-primary" @click="openAddCategory">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            新增分类
          </button>
        </div>
        <div class="actions-right">
          <span class="surface-badge">共 {{ categories.length }} 个分类</span>
        </div>
      </section>

      <section class="section-card">
        <div v-if="categories.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <p>暂无分类，点击「新增分类」添加。</p>
        </div>

        <div v-else class="category-grid">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="category-card glass-panel"
          >
            <div class="category-card__icon">{{ cat.icon || '?' }}</div>
            <div class="category-card__info">
              <h3>{{ cat.name }}</h3>
              <span class="surface-badge">{{ getArticleCountByCategory(cat.id) }} 篇文章</span>
            </div>
            <div class="category-card__actions">
              <button class="btn-sm btn-edit" @click="openEditCategory(cat)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                编辑
              </button>
              <button class="btn-sm btn-delete" @click="handleDeleteCategory(cat.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                删除
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ============ 分类编辑弹窗 ============ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showCategoryModal"
          class="modal-overlay"
          @click.self="showCategoryModal = false"
        >
          <div class="modal-panel glass-panel">
            <div class="modal-header">
              <h2>{{ editingCategory ? '编辑分类' : '新增分类' }}</h2>
              <button class="modal-close" @click="showCategoryModal = false">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <label class="field-label">分类名称</label>
              <div class="input-shell">
                <input
                  v-model="categoryForm.name"
                  placeholder="例如：Vue 实战"
                  @keyup.enter="saveCategory"
                />
              </div>
              <label class="field-label" style="margin-top: 16px">图标文字</label>
              <div class="input-shell">
                <input
                  v-model="categoryForm.icon"
                  placeholder="例如：Vue、CSS、JS"
                  @keyup.enter="saveCategory"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-ghost" @click="showCategoryModal = false">取消</button>
              <button class="btn-primary" :disabled="!categoryForm.name.trim()" @click="saveCategory">
                {{ editingCategory ? '保存修改' : '添加分类' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ============ 删除确认弹窗 ============ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showDeleteConfirm"
          class="modal-overlay"
          @click.self="cancelDelete"
        >
          <div class="modal-panel glass-panel delete-confirm-modal">
            <div class="modal-header">
              <h2>确认删除</h2>
              <button class="modal-close" @click="cancelDelete">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <p class="delete-confirm-text">{{ deleteConfirmMessage }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn-ghost" @click="cancelDelete">取消</button>
              <button class="btn-primary btn-danger" @click="confirmDelete">确认删除</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticlesStore } from '../stores/articles'
import { useCategoriesStore } from '../stores/categories'
import { animateIn, useGsapContext } from '../composables/useMotion'

const router = useRouter()
const articlesStore = useArticlesStore()
const categoriesStore = useCategoriesStore()

const pageRef = ref(null)
const importInputRef = ref(null)

// ========== Tab 切换 ==========
const activeTab = ref('articles')

// ========== 文章管理 ==========
const allArticles = computed(() => articlesStore.articles)

const statusFilter = ref('all')

const statusOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'archived', label: '已归档' }
]

const statusFilters = computed(() => [
  { key: 'all', label: '全部', count: allArticles.value.length },
  { key: 'draft', label: '草稿', count: allArticles.value.filter(a => a.status === 'draft').length },
  { key: 'published', label: '已发布', count: allArticles.value.filter(a => a.status === 'published').length },
  { key: 'archived', label: '已归档', count: allArticles.value.filter(a => a.status === 'archived').length }
])

const filteredArticles = computed(() => {
  if (statusFilter.value === 'all') return allArticles.value
  return allArticles.value.filter(a => a.status === statusFilter.value)
})

function getCategoryName(id) {
  const cat = categoriesStore.getCategoryById(id)
  return cat ? cat.name : '未分类'
}

function statusLabel(status) {
  const map = { draft: '草稿', published: '已发布', archived: '已归档' }
  return map[status] || status
}

// ========== 删除确认弹窗 ==========
const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)
const deleteTargetType = ref('article') // 'article' | 'category'
const deleteConfirmMessage = ref('')

function handleDeleteArticle(id) {
  deleteTargetId.value = id
  deleteTargetType.value = 'article'
  deleteConfirmMessage.value = '确定要删除这篇文章吗？此操作不可撤销。'
  showDeleteConfirm.value = true
}

function confirmDelete() {
  if (deleteTargetType.value === 'article') {
    articlesStore.deleteArticle(deleteTargetId.value)
  } else {
    categoriesStore.deleteCategory(deleteTargetId.value)
  }
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

function cancelDelete() {
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

function handleStatusChange(id, newStatus) {
  articlesStore.updateArticle(id, { status: newStatus })
}

// ========== 导出 ==========
function handleExport() {
  const data = {
    ...articlesStore.exportData(),
    categories: categoriesStore.categories
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `blog-data-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// ========== 导入 ==========
function handleImport(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      const result = articlesStore.importData(data)
      if (data.categories && Array.isArray(data.categories)) {
        data.categories.forEach(cat => {
          if (!categoriesStore.getCategoryById(cat.id)) {
            categoriesStore.addCategory(cat)
          }
        })
      }
      alert(`导入完成：${result.imported} 篇文章已导入，${result.skipped} 篇跳过`)
    } catch {
      alert('文件格式错误，请确认为有效的 JSON 文件。')
    }
  }
  reader.readAsText(file)
  // 重置 input 以便重复导入同一文件
  event.target.value = ''
}

// ========== 分类管理 ==========
const categories = computed(() => categoriesStore.categories)
const showCategoryModal = ref(false)
const editingCategory = ref(null)
const categoryForm = ref({ name: '', icon: '' })

function getArticleCountByCategory(categoryId) {
  return allArticles.value.filter(a => a.category === categoryId).length
}

function openAddCategory() {
  editingCategory.value = null
  categoryForm.value = { name: '', icon: '' }
  showCategoryModal.value = true
}

function openEditCategory(cat) {
  editingCategory.value = cat
  categoryForm.value = { name: cat.name, icon: cat.icon }
  showCategoryModal.value = true
}

function saveCategory() {
  const name = categoryForm.value.name.trim()
  if (!name) return

  if (editingCategory.value) {
    categoriesStore.updateCategory(editingCategory.value.id, {
      name,
      icon: categoryForm.value.icon.trim()
    })
  } else {
    categoriesStore.addCategory({
      name,
      icon: categoryForm.value.icon.trim()
    })
  }
  showCategoryModal.value = false
}

function handleDeleteCategory(id) {
  const count = getArticleCountByCategory(id)
  const msg = count > 0
    ? `该分类下有 ${count} 篇文章，删除后这些文章将变为「未分类」。确定删除吗？`
    : '确定要删除这个分类吗？'
  deleteTargetId.value = id
  deleteTargetType.value = 'category'
  deleteConfirmMessage.value = msg
  showDeleteConfirm.value = true
}

// ========== GSAP 入场动画 ==========
useGsapContext(() => {
  animateIn(pageRef.value?.querySelector('.admin-hero'), { y: 16 })
})
</script>

<style scoped>
/* ===== 页面基础 ===== */
.admin-page {
  gap: 24px;
}

.admin-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 18px;
  align-items: start;
}

.admin-hero__stats {
  display: grid;
  gap: 14px;
}

.metric-mini {
  padding: 20px;
  border-radius: 24px;
}

.metric-mini span {
  color: var(--text-subtle);
  font-size: 13px;
}

.metric-mini strong {
  display: block;
  margin-top: 10px;
  color: var(--text-heading);
  font-size: 34px;
  letter-spacing: -0.04em;
  font-family: var(--title-font);
}

/* ===== Tab 切换 ===== */
.admin-tabs {
  display: flex;
  gap: 8px;
  padding: 4px;
  border-radius: 18px;
  background: var(--bg-muted);
  border: 1px solid var(--line);
}

.admin-tab {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 14px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-muted);
  font-size: 15px;
  font-weight: 600;
  transition: all var(--transition-base);
}

.admin-tab:hover {
  color: var(--text-heading);
  background: var(--surface-strong);
}

.admin-tab.active {
  color: var(--text-heading);
  background: var(--surface-strong);
  border-color: var(--line);
  box-shadow: var(--shadow-sm);
}

.admin-tab svg {
  flex-shrink: 0;
}

/* ===== 操作栏 ===== */
.admin-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 28px;
  flex-wrap: wrap;
}

.actions-left,
.actions-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.import-label {
  position: relative;
  cursor: pointer;
}

.file-input-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

/* ===== 状态筛选 ===== */
.status-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface-strong);
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  transition: all var(--transition-base);
  cursor: pointer;
}

.status-filter-btn:hover {
  border-color: var(--line-strong);
  color: var(--text-heading);
}

.status-filter-btn.active {
  color: var(--primary);
  border-color: var(--line-strong);
  background: var(--primary-soft);
}

.filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--bg-muted);
  font-size: 12px;
  font-weight: 700;
}

.status-filter-btn.active .filter-count {
  background: var(--primary);
  color: #fff;
}

/* ===== 文章列表 ===== */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.list-header {
  display: grid;
  grid-template-columns: minmax(0, 2fr) 120px 100px 120px 80px 200px;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--line);
  color: var(--text-subtle);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.article-row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) 120px 100px 120px 80px 200px;
  gap: 16px;
  padding: 16px 20px;
  align-items: center;
  border-bottom: 1px solid var(--line);
  transition: background var(--transition-fast);
}

.article-row:last-child {
  border-bottom: none;
}

.article-row:hover {
  background: var(--bg-muted);
}

.article-title-text {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--text-heading);
  font-weight: 600;
  font-size: 15px;
}

.date-text {
  color: var(--text-muted);
  font-size: 13px;
}

.views-text {
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  font-family: var(--title-font);
}

/* ===== 状态标签 ===== */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status-badge--draft {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.status-badge--published {
  background: rgba(22, 163, 74, 0.12);
  color: #16a34a;
  border: 1px solid rgba(22, 163, 74, 0.2);
}

.status-badge--archived {
  background: rgba(107, 122, 144, 0.12);
  color: var(--text-muted);
  border: 1px solid var(--line);
}

.status-badge--sm {
  padding: 2px 8px;
  font-size: 11px;
}

/* ===== 行操作按钮 ===== */
.col-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.btn-sm {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  transition: all var(--transition-fast);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-sm:hover {
  border-color: var(--line-strong);
}

.btn-edit:hover {
  color: var(--primary);
  border-color: var(--line-strong);
}

.btn-delete {
  color: var(--danger);
  border-color: rgba(239, 68, 68, 0.15);
  background: rgba(239, 68, 68, 0.06);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--danger);
}

/* ===== 删除确认弹窗 ===== */
.delete-confirm-modal {
  max-width: 420px;
}

.delete-confirm-text {
  color: var(--text-muted);
  line-height: 1.6;
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-color: #ef4444;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border-color: #dc2626;
}

/* ===== 状态下拉 ===== */
.status-dropdown-wrap {
  position: relative;
}

.btn-status {
  gap: 4px;
}

.status-dropdown-wrap:hover .status-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.status-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  min-width: 100px;
  padding: 4px;
  border-radius: 12px;
  background: var(--surface-strong);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-md);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.18s ease;
  z-index: 20;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 6px 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.dropdown-item:hover {
  background: var(--bg-muted);
}

.dropdown-item.current {
  background: var(--primary-soft);
}

/* ===== 空状态 ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 24px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--line-strong);
  background: var(--bg-muted);
  color: var(--text-muted);
  text-align: center;
}

.empty-state svg {
  color: var(--text-subtle);
  opacity: 0.5;
}

.empty-state p {
  font-size: 15px;
}

/* ===== 分类管理 ===== */
.category-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.category-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 20px;
  transition: all var(--transition-base);
}

.category-card:hover {
  border-color: var(--line-strong);
  box-shadow: var(--shadow-sm);
}

.category-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 18px;
  font-weight: 800;
  flex-shrink: 0;
  font-family: var(--title-font);
}

.category-card__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-card__info h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-card__info .surface-badge {
  align-self: flex-start;
  padding: 4px 10px;
  font-size: 12px;
}

.category-card__actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

/* ===== 弹窗 ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(9, 11, 17, 0.46);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  padding: 24px;
}

.modal-panel {
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
  padding: 0;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 0;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 700;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.modal-close:hover {
  color: var(--text-heading);
  border-color: var(--line-strong);
}

.modal-body {
  padding: 24px 28px;
}

.modal-body .input-shell {
  width: 100%;
  min-height: 48px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 28px 24px;
}

.modal-footer .btn-primary {
  min-height: 42px;
  padding: 0 24px;
}

.modal-footer .btn-ghost {
  min-height: 42px;
}

/* 弹窗过渡动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.24s ease;
}

.modal-fade-enter-active .modal-panel,
.modal-fade-leave-active .modal-panel {
  transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.24s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-panel,
.modal-fade-leave-to .modal-panel {
  transform: translateY(16px) scale(0.97);
  opacity: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 1080px) {
  .admin-hero {
    grid-template-columns: 1fr;
  }

  .admin-hero__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .list-header {
    display: none;
  }

  .article-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 16px 20px;
  }

  .article-title-text {
    -webkit-line-clamp: 2;
  }

  .article-row .col-category,
  .article-row .col-status {
    display: inline-flex;
  }

  .article-row .col-date,
  .article-row .col-views {
    display: inline-flex;
    align-items: center;
    color: var(--text-muted);
    font-size: 13px;
  }

  .article-row .col-date::after {
    content: '\00b7';
    margin: 0 4px;
    color: var(--text-subtle);
  }

  .article-row .col-meta-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .col-actions {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .admin-hero__stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .admin-actions-bar {
    padding: 16px 20px;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .category-card__actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .admin-hero__stats {
    grid-template-columns: 1fr;
  }

  .admin-tabs {
    flex-direction: column;
  }

  .status-filters {
    gap: 6px;
  }

  .status-filter-btn {
    min-height: 36px;
    padding: 0 12px;
    font-size: 13px;
  }

  .actions-left,
  .actions-right {
    width: 100%;
  }

  .actions-left .btn-primary,
  .actions-right .btn-ghost {
    flex: 1;
  }
}
</style>
