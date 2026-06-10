<template>
  <div
    ref="pageRef"
    class="page-shell page-stack editor-page"
  >
    <!-- 未找到文章 -->
    <div
      v-if="editMode && !article"
      class="section-card empty-state"
    >
      文章不存在或已被移除。
    </div>

    <template v-else>
      <section class="page-hero">
        <div class="page-hero__row">
          <button
            class="btn-ghost editor-back"
            @click="goBack"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            返回
          </button>
          <div class="page-hero__actions">
            <button
              class="btn-ghost"
              :disabled="saving"
              @click="saveDraft"
            >
              保存草稿
            </button>
            <button
              class="btn-primary"
              :disabled="saving"
              @click="publishArticle"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 2 11 13" />
                <path d="m22 2-7 20-4-9-9-4 20-7z" />
              </svg>
              发布
            </button>
          </div>
        </div>
        <span class="eyebrow">Article Editor</span>
        <h1 class="section-title">
          {{ editMode ? '编辑文章' : '新建文章' }}
        </h1>
      </section>

      <!-- 主编辑区域：左右分栏 -->
      <section class="section-card editor-layout">
        <!-- 左侧：表单 + Markdown 编辑器 -->
        <div class="editor-left">
          <div class="form-stack">
            <!-- 标题 -->
            <div class="form-field">
              <label class="field-label">文章标题</label>
              <div class="input-shell">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M4 7V4h16v3" />
                  <path d="M9 20h6" />
                  <path d="M12 4v16" />
                </svg>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="请输入文章标题"
                />
              </div>
            </div>

            <!-- 摘要 -->
            <div class="form-field">
              <label class="field-label">文章摘要</label>
              <div class="input-shell textarea-shell">
                <textarea
                  v-model="form.summary"
                  rows="3"
                  placeholder="简短描述文章内容，用于列表展示和 SEO"
                />
              </div>
            </div>

            <!-- 分类 & 标签 -->
            <div class="form-row">
              <div class="form-field form-field--half">
                <label class="field-label">分类</label>
                <div class="input-shell select-shell">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                  </svg>
                  <select v-model="form.category">
                    <option
                      :value="null"
                      disabled
                    >
                      选择分类
                    </option>
                    <option
                      v-for="cat in categoriesStore.categories"
                      :key="cat.id"
                      :value="cat.id"
                    >
                      {{ cat.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-field form-field--half">
                <label class="field-label">标签（逗号分隔）</label>
                <div class="input-shell">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                    <path d="M7 7h.01" />
                  </svg>
                  <input
                    v-model="form.tagsInput"
                    type="text"
                    placeholder="Vue, 前端, CSS"
                  />
                </div>
              </div>
            </div>

            <!-- 封面颜色 -->
            <div class="form-field">
              <label class="field-label">封面颜色</label>
              <div class="color-picker">
                <button
                  v-for="color in presetColors"
                  :key="color.value"
                  class="color-swatch"
                  :class="{ active: form.coverColor === color.value }"
                  :style="{ background: color.value }"
                  :title="color.label"
                  @click="form.coverColor = color.value"
                />
                <div class="color-input-wrapper">
                  <input
                    v-model="form.coverColor"
                    type="color"
                    class="color-input"
                    title="自定义颜色"
                  />
                  <span class="color-hex">{{ form.coverColor }}</span>
                </div>
              </div>
            </div>

            <!-- 标签预览 -->
            <div
              v-if="parsedTags.length"
              class="form-field"
            >
              <label class="field-label">标签预览</label>
              <div class="list-inline">
                <span
                  v-for="tag in parsedTags"
                  :key="tag"
                  class="tag-pill tag-sm"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Markdown 编辑区 -->
          <div class="editor-markdown">
            <div class="editor-markdown__header">
              <label class="field-label">Markdown 内容</label>
              <span class="surface-badge">{{ contentLength }} 字符</span>
            </div>
            <div class="textarea-wrapper">
              <textarea
                ref="textareaRef"
                v-model="form.content"
                class="markdown-textarea"
                placeholder="在此输入 Markdown 内容...

# 标题
## 二级标题

正文内容，支持 **加粗** 和 *斜体*。

```javascript
const code = 'example'
```

- 列表项 1
- 列表项 2"
                spellcheck="false"
              />
            </div>
          </div>
        </div>

        <!-- 右侧：实时预览 -->
        <div class="editor-right">
          <div class="preview-header">
            <span class="eyebrow">Preview</span>
            <span class="surface-badge">实时预览</span>
          </div>
          <div
            class="article-preview glass-panel"
            v-html="previewHtml"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticlesStore } from '../stores/articles'
import { useCategoriesStore } from '../stores/categories'
import { useMarkdown } from '../composables/useMarkdown'
import { useToast } from '../composables/useToast'
import { animateIn, useGsapContext } from '../composables/useMotion'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()
const categoriesStore = useCategoriesStore()
const { renderMarkdown } = useMarkdown()
const { showToast } = useToast()

/* ===== 引用 ===== */
const pageRef = ref(null)
const textareaRef = ref(null)
const saving = ref(false)

/* ===== 编辑模式判断 ===== */
const editMode = computed(() => !!route.params.id)
const article = computed(() =>
  editMode.value ? articlesStore.getArticleById(route.params.id) : null
)

/* ===== 预设颜色 ===== */
const presetColors = [
  { value: 'linear-gradient(135deg, #6d7cff, #4fd1c5)', label: '蓝绿渐变' },
  { value: 'linear-gradient(135deg, #8b5cf6, #ec4899)', label: '紫粉渐变' },
  { value: 'linear-gradient(135deg, #f59e0b, #ef4444)', label: '橙红渐变' },
  { value: 'linear-gradient(135deg, #10b981, #06b6d4)', label: '青绿渐变' },
  { value: 'linear-gradient(135deg, #0f172a, #334155)', label: '深色渐变' },
  { value: 'linear-gradient(135deg, #ec4899, #8b5cf6)', label: '粉紫渐变' }
]

/* ===== 表单数据 ===== */
const form = reactive({
  title: '',
  summary: '',
  category: null,
  tagsInput: '',
  coverColor: presetColors[0].value,
  content: ''
})

/* ===== 派生数据 ===== */
const parsedTags = computed(() =>
  form.tagsInput
    .split(/[,，]/)
    .map(t => t.trim())
    .filter(Boolean)
)

const previewHtml = computed(() => renderMarkdown(form.content))

const contentLength = computed(() => form.content.length)

/* ===== 初始化：编辑模式下填充表单 ===== */
function fillFormFromArticle(a) {
  if (!a) return
  form.title = a.title || ''
  form.summary = a.summary || ''
  form.category = a.category ?? null
  form.tagsInput = Array.isArray(a.tags) ? a.tags.join(', ') : ''
  form.coverColor = a.coverImage || presetColors[0].value
  form.content = a.content || ''
}

onMounted(() => {
  if (editMode.value && article.value) {
    fillFormFromArticle(article.value)
  }
})

/* 监听路由参数变化（从一篇文章切换到另一篇） */
watch(
  () => route.params.id,
  () => {
    if (editMode.value && article.value) {
      fillFormFromArticle(article.value)
    } else {
      resetForm()
    }
  }
)

/* ===== 重置表单 ===== */
function resetForm() {
  form.title = ''
  form.summary = ''
  form.category = null
  form.tagsInput = ''
  form.coverColor = presetColors[0].value
  form.content = ''
}

/* ===== 构建文章数据 ===== */
function buildArticleData(status) {
  return {
    title: form.title.trim(),
    summary: form.summary.trim(),
    category: form.category,
    tags: parsedTags.value,
    coverImage: form.coverColor,
    content: form.content,
    status
  }
}

/* ===== 保存草稿 ===== */
function saveDraft() {
  if (!validateForm()) return
  saving.value = true

  try {
    const data = buildArticleData('draft')
    if (editMode.value) {
      articlesStore.updateArticle(route.params.id, data)
      showToast('草稿已保存')
    } else {
      const newArticle = articlesStore.addArticle(data)
      showToast('草稿已创建')
      router.replace(`/editor/${newArticle.id}`)
    }
  } catch (e) {
    showToast('保存失败，请重试')
    console.error('Save draft error:', e)
  } finally {
    saving.value = false
  }
}

/* ===== 发布文章 ===== */
function publishArticle() {
  if (!validateForm()) return
  saving.value = true

  try {
    const data = buildArticleData('published')
    if (editMode.value) {
      articlesStore.updateArticle(route.params.id, data)
      showToast('文章已发布')
      router.push('/articles')
    } else {
      articlesStore.addArticle(data)
      showToast('文章已发布')
      router.push('/articles')
    }
  } catch (e) {
    showToast('发布失败，请重试')
    console.error('Publish error:', e)
  } finally {
    saving.value = false
  }
}

/* ===== 表单验证 ===== */
function validateForm() {
  if (!form.title.trim()) {
    showToast('请输入文章标题')
    textareaRef.value?.focus()
    return false
  }
  if (!form.content.trim()) {
    showToast('请输入文章内容')
    textareaRef.value?.focus()
    return false
  }
  return true
}

/* ===== 返回 ===== */
function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/articles')
  }
}

/* ===== GSAP 入场动画 ===== */
useGsapContext(() => {
  animateIn(pageRef.value?.querySelector('.page-hero'), { y: 16 })
  animateIn(pageRef.value?.querySelector('.editor-layout'), { y: 20, delay: 0.12 })
})
</script>

<style scoped>
.editor-page {
  gap: 24px;
}

/* ===== Hero 区域 ===== */
.editor-page .page-hero {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.page-hero__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-hero__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.editor-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 42px;
  padding: 0 16px;
  font-size: 14px;
}

/* ===== 左右分栏布局 ===== */
.editor-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

/* ===== 左侧面板 ===== */
.editor-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-field--half {
  min-width: 0;
}

/* ===== 输入框样式 ===== */
.input-shell {
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input-shell:focus-within {
  border-color: var(--line-strong);
  box-shadow: var(--shadow-focus);
}

.input-shell input,
.input-shell textarea,
.select-shell select {
  min-height: 24px;
  font-size: 15px;
}

.input-shell svg {
  color: var(--text-subtle);
  flex-shrink: 0;
}

.textarea-shell textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.7;
}

/* ===== 选择框 ===== */
.select-shell {
  position: relative;
}

.select-shell select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  padding-right: 36px;
  cursor: pointer;
  background: transparent;
  border: none;
  color: var(--text-heading);
  outline: none;
}

.select-shell::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--text-subtle);
  pointer-events: none;
}

/* ===== 封面颜色选择 ===== */
.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.active {
  border-color: var(--text-heading);
  box-shadow: 0 0 0 3px var(--primary-soft);
  transform: scale(1.1);
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border-radius: 10px;
  background: var(--bg-muted);
  border: 1px solid var(--line);
}

.color-input {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
  background: none;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}

.color-hex {
  font-size: 12px;
  color: var(--text-subtle);
  font-family: 'JetBrains Mono', monospace;
}

/* ===== Markdown 编辑区 ===== */
.editor-markdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.editor-markdown__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.textarea-wrapper {
  position: relative;
}

.markdown-textarea {
  width: 100%;
  min-height: 500px;
  padding: 18px;
  border-radius: 16px;
  background: var(--surface-strong);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
  color: var(--text-heading);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.8;
  resize: vertical;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  tab-size: 2;
}

.markdown-textarea:focus {
  border-color: var(--line-strong);
  box-shadow: var(--shadow-focus);
}

.markdown-textarea::placeholder {
  color: var(--text-subtle);
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ===== 右侧预览面板 ===== */
.editor-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 100px;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.article-preview {
  min-height: 500px;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  padding: 32px;
  border-radius: 24px;
}

/* ===== 预览内容排版 ===== */
.article-preview :deep(h1) {
  margin-top: 1.6em;
  font-size: 28px;
}

.article-preview :deep(h2) {
  margin-top: 1.5em;
  font-size: 24px;
}

.article-preview :deep(h3) {
  margin-top: 1.4em;
  font-size: 20px;
}

.article-preview :deep(p),
.article-preview :deep(li) {
  color: var(--text);
  font-size: 15px;
  line-height: 1.85;
}

.article-preview :deep(p) {
  margin: 14px 0;
}

.article-preview :deep(strong) {
  color: var(--text-heading);
}

.article-preview :deep(a) {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.article-preview :deep(a:hover) {
  opacity: 0.8;
}

.article-preview :deep(code) {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 6px;
  background: var(--primary-soft);
  color: var(--primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.88em;
}

.article-preview :deep(pre) {
  margin: 18px 0;
  padding: 16px;
  overflow-x: auto;
  border-radius: 14px;
  background: #0a1020;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.article-preview :deep(pre code) {
  display: block;
  padding: 0;
  background: transparent;
  color: #dbe7ff;
  font-size: 13px;
  line-height: 1.75;
}

.article-preview :deep(ul),
.article-preview :deep(ol) {
  padding-left: 22px;
  margin: 12px 0;
}

.article-preview :deep(li) {
  margin: 6px 0;
}

.article-preview :deep(blockquote) {
  margin: 18px 0;
  padding: 14px 20px;
  border-left: 3px solid var(--primary);
  background: var(--primary-soft);
  border-radius: 0 12px 12px 0;
  color: var(--text-muted);
}

.article-preview :deep(blockquote p) {
  margin: 0;
}

.article-preview :deep(hr) {
  border: none;
  height: 1px;
  background: var(--line);
  margin: 24px 0;
}

.article-preview :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 18px 0;
}

.article-preview :deep(th),
.article-preview :deep(td) {
  padding: 10px 14px;
  border: 1px solid var(--line);
  text-align: left;
  font-size: 14px;
}

.article-preview :deep(th) {
  background: var(--bg-muted);
  font-weight: 700;
  color: var(--text-heading);
}

.article-preview :deep(img) {
  max-width: 100%;
  border-radius: 12px;
  margin: 16px 0;
}

/* ===== 空预览占位 ===== */
.article-preview :deep(:first-child) {
  margin-top: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 1080px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }

  .editor-right {
    position: static;
  }

  .article-preview {
    max-height: none;
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .page-hero__row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-hero__actions {
    width: 100%;
    justify-content: flex-end;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .markdown-textarea {
    min-height: 350px;
  }

  .article-preview {
    padding: 24px;
  }

  .color-picker {
    gap: 8px;
  }
}

@media (max-width: 640px) {
  .editor-back {
    min-height: 38px;
    padding: 0 12px;
    font-size: 13px;
  }

  .page-hero__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .page-hero__actions .btn-ghost,
  .page-hero__actions .btn-primary {
    justify-content: center;
  }
}
</style>
