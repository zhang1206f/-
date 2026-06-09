<template>
  <div class="tool-panel glass">
    <div class="tool-header">
      <h2>代码格式化器</h2>
      <p class="tool-desc">支持 JavaScript、TypeScript、CSS、HTML 代码格式化</p>
    </div>

    <div class="formatter-container">
      <div class="editor-section">
        <div class="editor-header">
          <span>输入代码</span>
          <div class="editor-actions">
            <select v-model="formatterLang" class="lang-select">
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
            </select>
            <button class="btn-ghost" @click="formatterInput = ''">清空</button>
          </div>
        </div>
        <textarea
          v-model="formatterInput"
          class="code-editor"
          placeholder="粘贴需要格式化的代码..."
          spellcheck="false"
        ></textarea>
      </div>

      <div class="editor-controls">
        <button class="btn-primary" @click="formatCode">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          格式化
        </button>
        <button class="btn-ghost" @click="handleCopy(formatterOutput)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          复制结果
        </button>
      </div>

      <div class="editor-section">
        <div class="editor-header">
          <span>格式化结果</span>
        </div>
        <textarea
          v-model="formatterOutput"
          class="code-editor output"
          readonly
          placeholder="格式化后的代码将显示在这里..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

const formatterLang = ref('javascript')
const formatterInput = ref('')
const formatterOutput = ref('')

const formatCode = () => {
  try {
    const code = formatterInput.value
    if (!code.trim()) {
      formatterOutput.value = ''
      return
    }

    // 简单的代码格式化
    let formatted = code

    // 移除多余空行
    formatted = formatted.replace(/\n{3,}/g, '\n\n')

    // 缩进格式化
    const lines = formatted.split('\n')
    let indentLevel = 0
    const indentSize = 2

    const formattedLines = lines.map(line => {
      const trimmed = line.trim()

      // 减少缩进
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')') ||
          trimmed.startsWith('</') || trimmed.startsWith('case ') || trimmed.startsWith('default:')) {
        indentLevel = Math.max(0, indentLevel - 1)
      }

      const indent = ' '.repeat(indentLevel * indentSize)

      // 增加缩进
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(') ||
          (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>'))) {
        indentLevel++
      }

      return indent + trimmed
    })

    formatterOutput.value = formattedLines.join('\n')
  } catch (error) {
    formatterOutput.value = '格式化失败: ' + error.message
  }
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
.formatter-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-heading);
}

.editor-actions {
  display: flex;
  gap: 8px;
}

.lang-select {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-heading);
  font-size: 13px;
}

.code-editor {
  width: 100%;
  min-height: 200px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-heading);
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.code-editor:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-soft);
}

.code-editor.output {
  background: var(--surface-strong);
  cursor: default;
}

.editor-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
