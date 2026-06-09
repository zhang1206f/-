<template>
  <div class="tool-panel glass">
    <div class="tool-header">
      <h2>Markdown 预览器</h2>
      <p class="tool-desc">实时预览 Markdown 渲染效果</p>
    </div>

    <div class="markdown-container">
      <div class="md-toolbar">
        <button class="md-btn" @click="insertMarkdown('**', '**')" title="粗体">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        </button>
        <button class="md-btn" @click="insertMarkdown('*', '*')" title="斜体">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </button>
        <button class="md-btn" @click="insertMarkdown('`', '`')" title="行内代码">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </button>
        <button class="md-btn" @click="insertMarkdown('```\n', '\n```')" title="代码块">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>
        </button>
        <button class="md-btn" @click="insertMarkdown('[', '](url)')" title="链接">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
        <button class="md-btn" @click="insertMarkdown('# ', '')" title="标题">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 10l4 2-4 2"/></svg>
        </button>
        <button class="md-btn" @click="insertMarkdown('- ', '')" title="列表">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
        <button class="md-btn" @click="insertMarkdown('> ', '')" title="引用">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 8H6a2 2 0 00-2 2v2a2 2 0 002 2h2v2a2 2 0 01-2 2H5v2h1a4 4 0 004-4V8zm10 0h-4a2 2 0 00-2 2v2a2 2 0 002 2h2v2a2 2 0 01-2 2h-1v2h1a4 4 0 004-4V8z"/></svg>
        </button>
        <div class="md-divider"></div>
        <select v-model="mdViewMode" class="md-view-select">
          <option value="split">分屏</option>
          <option value="edit">仅编辑</option>
          <option value="preview">仅预览</option>
        </select>
      </div>

      <div class="md-editor-area" :class="mdViewMode">
        <div v-if="mdViewMode !== 'preview'" class="md-input-wrap">
          <textarea
            ref="mdTextarea"
            v-model="markdownInput"
            class="md-textarea"
            placeholder="输入 Markdown 内容..."
            spellcheck="false"
          ></textarea>
        </div>
        <div v-if="mdViewMode !== 'edit'" class="md-preview-wrap">
          <div class="md-preview-label">预览</div>
          <div class="md-preview" v-html="renderedMarkdown"></div>
        </div>
      </div>

      <div class="md-footer">
        <span class="md-stats">字数: {{ markdownInput.length }} | 行数: {{ markdownLineCount }}</span>
        <button class="btn-ghost" @click="handleCopy(markdownInput)">复制源码</button>
        <button class="btn-ghost" @click="handleCopy(renderedMarkdown)">复制 HTML</button>
        <button class="btn-ghost" @click="markdownInput = ''">清空</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMarkdown } from '../../composables/useMarkdown'
import { useToast } from '../../composables/useToast'

const { renderMarkdown } = useMarkdown()
const { showToast } = useToast()

const markdownInput = ref(`# Hello Markdown

这是一个 **Markdown 预览器** 工具。

## 功能特性

- 实时预览
- 支持常见 Markdown 语法
- 分屏/编辑/预览三种模式

### 代码示例

\`\`\`javascript
const greeting = 'Hello World'
console.log(greeting)
\`\`\`

> 引用文本示例

[链接示例](https://example.com)
`)
const mdViewMode = ref('split')
const mdTextarea = ref(null)

const markdownLineCount = computed(() => {
  return markdownInput.value ? markdownInput.value.split('\n').length : 0
})

const renderedMarkdown = computed(() => renderMarkdown(markdownInput.value))

const insertMarkdown = (before, after) => {
  const textarea = mdTextarea.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = markdownInput.value.substring(start, end)
  const replacement = before + (selected || '文本') + after

  markdownInput.value = markdownInput.value.substring(0, start) + replacement + markdownInput.value.substring(end)

  // 重新聚焦并设置光标位置
  setTimeout(() => {
    textarea.focus()
    const cursorPos = start + before.length + (selected ? selected.length : 2)
    textarea.setSelectionRange(cursorPos, cursorPos)
  }, 0)
}

const handleCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast('已复制到剪贴板')
  } catch {
    // 静默处理
  }
}
</script>

<style scoped>
.markdown-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.md-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: var(--bg-muted);
  border-radius: 12px;
  flex-wrap: wrap;
}

.md-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.md-btn:hover {
  background: var(--surface-strong);
  color: var(--text-heading);
}

.md-divider {
  width: 1px;
  height: 24px;
  background: var(--line);
  margin: 0 4px;
}

.md-view-select {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-heading);
  font-size: 13px;
  margin-left: auto;
}

.md-editor-area {
  display: grid;
  gap: 12px;
  min-height: 400px;
}

.md-editor-area.split {
  grid-template-columns: 1fr 1fr;
}

.md-editor-area.edit,
.md-editor-area.preview {
  grid-template-columns: 1fr;
}

.md-input-wrap,
.md-preview-wrap {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}

.md-preview-label {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-muted);
  border-bottom: 1px solid var(--line);
}

.md-textarea {
  flex: 1;
  min-height: 360px;
  padding: 16px;
  border: none;
  background: var(--bg-muted);
  color: var(--text-heading);
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.md-preview {
  flex: 1;
  padding: 16px;
  background: var(--surface-strong);
  overflow-y: auto;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-heading);
}

.md-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.md-stats {
  font-size: 13px;
  color: var(--text-muted);
  margin-right: auto;
}

/* Markdown 渲染样式 */
.md-preview :deep(.md-h1) {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--line);
  color: var(--text-heading);
}

.md-preview :deep(.md-h2) {
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0 12px 0;
  color: var(--text-heading);
}

.md-preview :deep(.md-h3) {
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 8px 0;
  color: var(--text-heading);
}

.md-preview :deep(.md-p) {
  margin: 0 0 12px 0;
}

.md-preview :deep(strong) {
  font-weight: 700;
  color: var(--text-heading);
}

.md-preview :deep(em) {
  font-style: italic;
}

.md-preview :deep(.md-link) {
  color: var(--primary);
  text-decoration: none;
}

.md-preview :deep(.md-link:hover) {
  text-decoration: underline;
}

.md-preview :deep(.md-code-block) {
  background: var(--bg-muted);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.md-preview :deep(.md-inline-code) {
  background: var(--bg-muted);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
}

.md-preview :deep(.md-blockquote) {
  border-left: 4px solid var(--primary);
  padding: 8px 16px;
  margin: 12px 0;
  background: var(--primary-soft);
  border-radius: 0 8px 8px 0;
  color: var(--text-muted);
}

.md-preview :deep(.md-ul),
.md-preview :deep(.md-ol) {
  padding-left: 24px;
  margin: 8px 0;
}

.md-preview :deep(.md-li) {
  margin: 4px 0;
  list-style: disc;
}

.md-preview :deep(.md-oli) {
  margin: 4px 0;
  list-style: decimal;
}

.md-preview :deep(.md-hr) {
  border: none;
  border-top: 2px solid var(--line);
  margin: 20px 0;
}

.md-preview :deep(.md-img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 8px 0;
}

.md-preview :deep(.md-empty) {
  color: var(--text-muted);
  font-style: italic;
}
</style>
