<template>
  <div class="tools-page">
    <!-- 工具导航 -->
    <div class="tools-nav">
      <button
        v-for="tool in tools"
        :key="tool.id"
        class="tool-tab"
        :class="{ active: activeTool === tool.id }"
        @click="activeTool = tool.id"
      >
        <span class="tool-icon" v-html="tool.icon"></span>
        <span class="tool-name">{{ tool.name }}</span>
      </button>
    </div>

    <!-- 代码格式化器 -->
    <div v-if="activeTool === 'formatter'" class="tool-panel glass">
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
          <button class="btn-ghost" @click="copyToClipboard(formatterOutput)">
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

    <!-- 颜色转换器 -->
    <div v-if="activeTool === 'color'" class="tool-panel glass">
      <div class="tool-header">
        <h2>颜色转换器</h2>
        <p class="tool-desc">HEX、RGB、HSL 颜色格式互转</p>
      </div>

      <div class="color-container">
        <div class="color-preview" :style="{ background: colorPreview }">
          <div class="color-hex">{{ colorHex }}</div>
        </div>

        <div class="color-inputs">
          <div class="color-field">
            <label>HEX</label>
            <div class="color-input-group">
              <input v-model="colorHex" @input="hexToRgb" placeholder="#6366f1" />
              <button class="btn-ghost" @click="copyToClipboard(colorHex)">复制</button>
            </div>
          </div>

          <div class="color-field">
            <label>RGB</label>
            <div class="color-input-group">
              <input v-model="colorRgb" @input="rgbToHex" placeholder="rgb(99, 102, 241)" />
              <button class="btn-ghost" @click="copyToClipboard(colorRgb)">复制</button>
            </div>
          </div>

          <div class="color-field">
            <label>HSL</label>
            <div class="color-input-group">
              <input v-model="colorHsl" readonly placeholder="hsl(239, 84%, 67%)" />
              <button class="btn-ghost" @click="copyToClipboard(colorHsl)">复制</button>
            </div>
          </div>
        </div>

        <div class="color-slider">
          <label>色调</label>
          <input type="range" v-model.number="hue" min="0" max="360" @input="updateFromHsl" />
          <span>{{ hue }}°</span>
        </div>
      </div>
    </div>

    <!-- 时间戳转换器 -->
    <div v-if="activeTool === 'timestamp'" class="tool-panel glass">
      <div class="tool-header">
        <h2>时间戳转换器</h2>
        <p class="tool-desc">Unix 时间戳与日期时间互转</p>
      </div>

      <div class="timestamp-container">
        <div class="ts-section">
          <h3>当前时间</h3>
          <div class="ts-current">
            <div class="ts-value">{{ currentTimestamp }}</div>
            <div class="ts-date">{{ currentDate }}</div>
            <button class="btn-ghost" @click="copyToClipboard(String(currentTimestamp))">复制</button>
          </div>
        </div>

        <div class="ts-section">
          <h3>时间戳转日期</h3>
          <div class="ts-input-row">
            <input v-model="timestampInput" placeholder="输入时间戳" @input="timestampToDate" />
            <select v-model="timestampUnit">
              <option value="s">秒</option>
              <option value="ms">毫秒</option>
            </select>
            <button class="btn-primary" @click="timestampToDate">转换</button>
          </div>
          <div v-if="timestampResult" class="ts-result">{{ timestampResult }}</div>
        </div>

        <div class="ts-section">
          <h3>日期转时间戳</h3>
          <div class="ts-input-row">
            <input v-model="dateInput" type="datetime-local" @input="dateToTimestamp" />
            <button class="btn-primary" @click="dateToTimestamp">转换</button>
          </div>
          <div v-if="dateResult" class="ts-result">
            <span>秒：{{ dateResult }}</span>
            <button class="btn-ghost" @click="copyToClipboard(String(dateResult))">复制</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 工资计算器 -->
    <div v-if="activeTool === 'salary'" class="tool-panel glass">
      <div class="tool-header">
        <h2>工资计算器</h2>
        <p class="tool-desc">实时计算你的工作收入</p>
      </div>

      <div class="salary-container">
        <div class="salary-hero">
          <div class="earned-wrap">
            <span class="currency">¥</span>
            <span class="earned-number">{{ formattedEarned }}</span>
          </div>
          <div class="counter-label">已经赚了这么多</div>
          <div class="sub-info">
            <span>时薪 <strong>{{ hourlyRate }}</strong> 元</span>
            <span class="dot">·</span>
            <span>日薪 <strong>{{ dailyRate }}</strong> 元</span>
            <span class="dot">·</span>
            <span>每秒 <strong>{{ perSecond }}</strong> 元</span>
          </div>
          <div class="timer-display">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {{ timerDisplay }}
          </div>
          <div class="counter-controls">
            <button v-if="!isRunning" class="btn-primary" @click="handleStart">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              开始
            </button>
            <button v-else class="btn-pause" @click="handlePause">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              暂停
            </button>
            <button class="btn-ghost" @click="handleReset">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
            </button>
          </div>
        </div>

        <div class="salary-settings">
          <div class="form-item">
            <label>月薪</label>
            <div class="input-group">
              <input v-model.number="salary" type="number" min="0" step="1000" />
              <span class="suffix">元</span>
            </div>
          </div>
          <div class="form-item">
            <label>日工作时长</label>
            <div class="input-group">
              <input v-model.number="workHours" type="number" min="1" max="24" step="1" />
              <span class="suffix">小时</span>
            </div>
          </div>
          <div class="form-item">
            <label>双休</label>
            <div class="switch-group">
              <label class="switch">
                <input type="checkbox" v-model="weekendOff" />
                <span class="slider"></span>
              </label>
              <span>{{ weekendOff ? '是' : '否' }}</span>
            </div>
          </div>
        </div>

        <div class="references">
          <div class="ref-list">
            <div v-for="refItem in references" :key="refItem.label" class="ref-badge">
              <span class="ref-text">{{ refItem.label }}</span>
              <span class="ref-value">{{ refItem.time }}</span>
            </div>
            <div v-if="totalEarned > 0" class="ref-badge ref-total">
              <span class="ref-text">当前已赚</span>
              <span class="ref-value">¥{{ totalEarned.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Markdown 预览器 -->
    <div v-if="activeTool === 'markdown'" class="tool-panel glass">
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
          <button class="btn-ghost" @click="copyToClipboard(markdownInput)">复制源码</button>
          <button class="btn-ghost" @click="copyToClipboard(renderedMarkdown)">复制 HTML</button>
          <button class="btn-ghost" @click="markdownInput = ''">清空</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const tools = [
  {
    id: 'formatter',
    name: '代码格式化',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>'
  },
  {
    id: 'color',
    name: '颜色转换',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" /></svg>'
  },
  {
    id: 'timestamp',
    name: '时间戳转换',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>'
  },
  {
    id: 'salary',
    name: '工资计算器',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>'
  },
  {
    id: 'markdown',
    name: 'Markdown 预览',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>'
  }
]

const activeTool = ref('formatter')

// 代码格式化器
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

// 颜色转换器
const colorHex = ref('#6366f1')
const colorRgb = ref('rgb(99, 102, 241)')
const colorHsl = ref('hsl(239, 84%, 67%)')
const hue = ref(239)

const colorPreview = computed(() => colorHex.value)

const hexToRgb = () => {
  try {
    const hex = colorHex.value.replace('#', '')
    if (hex.length !== 6) return

    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    colorRgb.value = `rgb(${r}, ${g}, ${b})`
    
    // 转换为 HSL
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255
    const max = Math.max(rNorm, gNorm, bNorm)
    const min = Math.min(rNorm, gNorm, bNorm)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) * 60; break
        case gNorm: h = ((bNorm - rNorm) / d + 2) * 60; break
        case bNorm: h = ((rNorm - gNorm) / d + 4) * 60; break
      }
    }

    hue.value = Math.round(h)
    colorHsl.value = `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
  } catch (error) {
    console.error('转换失败:', error)
  }
}

const rgbToHex = () => {
  try {
    const match = colorRgb.value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (!match) return

    const r = parseInt(match[1])
    const g = parseInt(match[2])
    const b = parseInt(match[3])

    const toHex = (n) => n.toString(16).padStart(2, '0')
    colorHex.value = `#${toHex(r)}${toHex(g)}${toHex(b)}`
    
    // 更新 HSL
    hexToRgb()
  } catch (error) {
    console.error('转换失败:', error)
  }
}

const updateFromHsl = () => {
  try {
    const h = hue.value
    const match = colorHsl.value.match(/hsl\(\d+,\s*(\d+)%,\s*(\d+)%\)/)
    const s = match ? parseInt(match[1]) : 84
    const l = match ? parseInt(match[2]) : 67
    
    const hNorm = h / 360
    const sNorm = s / 100
    const lNorm = l / 100

    let r, g, b

    if (sNorm === 0) {
      r = g = b = lNorm
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm
      const p = 2 * lNorm - q
      r = hue2rgb(p, q, hNorm + 1/3)
      g = hue2rgb(p, q, hNorm)
      b = hue2rgb(p, q, hNorm - 1/3)
    }

    const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0')
    colorHex.value = `#${toHex(r)}${toHex(g)}${toHex(b)}`
    colorRgb.value = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
    colorHsl.value = `hsl(${h}, ${s}%, ${l}%)`
  } catch (error) {
    console.error('转换失败:', error)
  }
}

// 时间戳转换器
const currentTimestamp = ref(Math.floor(Date.now() / 1000))
const currentDate = ref(new Date().toLocaleString())
const timestampInput = ref('')
const timestampUnit = ref('s')
const timestampResult = ref('')
const dateInput = ref('')
const dateResult = ref('')

// 更新当前时间
let timeInterval = setInterval(() => {
  currentTimestamp.value = Math.floor(Date.now() / 1000)
  currentDate.value = new Date().toLocaleString()
}, 1000)

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

const timestampToDate = () => {
  try {
    let ts = parseInt(timestampInput.value)
    if (isNaN(ts)) {
      timestampResult.value = '请输入有效的时间戳'
      return
    }
    
    if (timestampUnit.value === 's') {
      ts *= 1000
    }
    
    const date = new Date(ts)
    timestampResult.value = date.toLocaleString()
  } catch (error) {
    timestampResult.value = '转换失败: ' + error.message
  }
}

const dateToTimestamp = () => {
  try {
    if (!dateInput.value) return
    const date = new Date(dateInput.value)
    dateResult.value = Math.floor(date.getTime() / 1000)
  } catch (error) {
    dateResult.value = '转换失败'
  }
}

// 工资计算器
const salary = ref(15000)
const workHours = ref(8)
const weekendOff = ref(true)

const earned = ref(0)
const elapsedSeconds = ref(0)
const isRunning = ref(false)
let intervalId = null

const workDaysPerMonth = computed(() => weekendOff.value ? 21.75 : 30)
const totalMonthlyHours = computed(() => workDaysPerMonth.value * workHours.value)

const hourlyRate = computed(() => {
  if (totalMonthlyHours.value === 0) return '0.00'
  return (salary.value / totalMonthlyHours.value).toFixed(2)
})

const dailyRate = computed(() => {
  if (workDaysPerMonth.value === 0) return '0'
  return Math.round(salary.value / workDaysPerMonth.value)
})

const perSecond = computed(() => {
  const rate = parseFloat(hourlyRate.value)
  if (isNaN(rate) || rate === 0) return '0.0000'
  return (rate / 3600).toFixed(4)
})

const totalEarned = computed(() => earned.value)

const formattedEarned = computed(() => {
  return totalEarned.value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

const timerDisplay = computed(() => {
  const h = Math.floor(elapsedSeconds.value / 3600)
  const m = Math.floor((elapsedSeconds.value % 3600) / 60)
  const s = elapsedSeconds.value % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const references = computed(() => {
  const rate = parseFloat(perSecond.value)
  if (isNaN(rate) || rate === 0) return []

  const calc = (price) => {
    const secs = Math.round(price / rate)
    if (secs < 60) return `${secs}秒`
    if (secs < 3600) return `${Math.round(secs / 60)}分钟`
    if (secs < 86400) return `${(secs / 3600).toFixed(1)}小时`
    return `${(secs / 86400).toFixed(1)}天`
  }

  return [
    { label: '一杯咖啡 ¥30', time: calc(30) },
    { label: '一顿外卖 ¥40', time: calc(40) },
    { label: '一张电影票 ¥60', time: calc(60) },
    { label: '一本书 ¥80', time: calc(80) },
    { label: '一件衣服 ¥300', time: calc(300) },
    { label: '一副耳机 ¥1500', time: calc(1500) },
    { label: '一部手机 ¥6000', time: calc(6000) },
    { label: '一趟旅行 ¥10000', time: calc(10000) }
  ]
})

const tick = () => {
  const rate = parseFloat(perSecond.value)
  if (!isNaN(rate)) earned.value += rate
  elapsedSeconds.value++
}

const handleStart = () => {
  if (isRunning.value) return
  if (intervalId) clearInterval(intervalId)
  isRunning.value = true
  intervalId = setInterval(tick, 1000)
}

const handlePause = () => {
  if (intervalId) { clearInterval(intervalId); intervalId = null }
  isRunning.value = false
}

const handleReset = () => {
  handlePause()
  earned.value = 0
  elapsedSeconds.value = 0
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// Markdown 预览器
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

const renderedMarkdown = computed(() => {
  return parseMarkdown(markdownInput.value)
})

const parseMarkdown = (text) => {
  if (!text) return '<p class="md-empty">输入 Markdown 内容开始预览...</p>'
  
  let html = text
  
  // 转义 HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  
  // 代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="md-code-block"><code class="lang-${lang || 'text'}">${code.trim()}</code></pre>`
  })
  
  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
  
  // 标题
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
  
  // 粗体和斜体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  
  // 删除线
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')
  
  // 链接和图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img class="md-img" src="$2" alt="$1" />')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="md-link" href="$2" target="_blank">$1</a>')
  
  // 引用
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
  
  // 无序列表
  html = html.replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
  html = html.replace(/(<li class="md-li">.*<\/li>\n?)+/g, '<ul class="md-ul">$&</ul>')
  
  // 有序列表
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>')
  html = html.replace(/(<li class="md-oli">.*<\/li>\n?)+/g, '<ol class="md-ol">$&</ol>')
  
  // 水平线
  html = html.replace(/^---$/gm, '<hr class="md-hr" />')
  
  // 段落
  html = html.replace(/\n\n/g, '</p><p class="md-p">')
  html = '<p class="md-p">' + html + '</p>'
  
  // 清理空段落
  html = html.replace(/<p class="md-p"><\/p>/g, '')
  html = html.replace(/<p class="md-p">\s*<(h[1-3]|pre|ul|ol|blockquote|hr)/g, '<$1')
  html = html.replace(/<\/(h[1-3]|pre|ul|ol|blockquote)>\s*<\/p>/g, '</$1>')
  
  // 换行
  html = html.replace(/\n/g, '<br />')
  
  return html
}

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
</script>

<style scoped>
.tools-page {
  padding: 16px 0;
  max-width: 900px;
  margin: 0 auto;
}

.tools-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tool-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tool-tab:hover {
  background: var(--surface-strong);
  color: var(--text-heading);
}

.tool-tab.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.tool-icon {
  display: flex;
  align-items: center;
}

.tool-name {
  font-size: 14px;
  font-weight: 600;
}

.tool-panel {
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
}

.tool-header {
  margin-bottom: 24px;
}

.tool-header h2 {
  font-size: 24px;
  color: var(--text-heading);
  margin-bottom: 8px;
}

.tool-desc {
  color: var(--text-muted);
  font-size: 14px;
}

/* 代码格式化器 */
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

/* 颜色转换器 */
.color-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.color-preview {
  height: 120px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.color-hex {
  background: rgba(0, 0, 0, 0.4);
  padding: 8px 16px;
  border-radius: 8px;
  color: #fff;
  font-family: monospace;
  font-size: 18px;
  font-weight: 600;
}

.color-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.color-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-field label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-heading);
}

.color-input-group {
  display: flex;
  gap: 8px;
}

.color-input-group input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-heading);
  font-size: 14px;
  outline: none;
}

.color-input-group input:focus {
  border-color: var(--primary);
}

.color-slider {
  display: flex;
  align-items: center;
  gap: 16px;
}

.color-slider label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-heading);
  min-width: 40px;
}

.color-slider input[type="range"] {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  border-radius: 4px;
  outline: none;
}

.color-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #ccc;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.color-slider span {
  font-size: 14px;
  color: var(--text-muted);
  min-width: 40px;
}

/* 时间戳转换器 */
.timestamp-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.ts-section h3 {
  font-size: 16px;
  color: var(--text-heading);
  margin-bottom: 12px;
}

.ts-current {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-muted);
  border-radius: 12px;
  flex-wrap: wrap;
}

.ts-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
  font-family: monospace;
}

.ts-date {
  color: var(--text-muted);
  font-size: 14px;
}

.ts-input-row {
  display: flex;
  gap: 8px;
}

.ts-input-row input,
.ts-input-row select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-heading);
  font-size: 14px;
  outline: none;
}

.ts-input-row input {
  flex: 1;
}

.ts-input-row input:focus,
.ts-input-row select:focus {
  border-color: var(--primary);
}

.ts-result {
  margin-top: 12px;
  padding: 12px 16px;
  background: var(--surface-strong);
  border-radius: 10px;
  color: var(--text-heading);
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 工资计算器 */
.salary-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.salary-hero {
  text-align: center;
  padding: 36px 24px;
  background: var(--bg-muted);
  border-radius: 16px;
}

.earned-wrap {
  margin-bottom: 8px;
}

.currency {
  font-size: 28px;
  font-weight: 300;
  color: var(--text-muted);
  vertical-align: top;
  margin-right: 4px;
  line-height: 1;
}

.earned-number {
  font-size: 64px;
  font-weight: 700;
  color: var(--text-heading);
  font-variant-numeric: tabular-nums;
  letter-spacing: -2px;
  line-height: 1;
}

.counter-label {
  font-size: 15px;
  color: var(--text-muted);
  margin-bottom: 18px;
}

.sub-info {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

.sub-info strong { color: var(--text-heading); font-weight: 600; }
.dot { opacity: 0.3; }

.timer-display {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
  margin-bottom: 22px;
}

.counter-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.salary-settings {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.form-item {
  flex: 1;
  min-width: 120px;
}

.form-item label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-heading);
  font-size: 14px;
  outline: none;
}

.input-group input:focus {
  border-color: var(--primary);
}

.suffix {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
}

.switch-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--line);
  transition: .3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.references {
  background: var(--bg-muted);
  border-radius: 16px;
  padding: 20px;
}

.ref-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ref-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--surface-strong);
  border: 1px solid var(--line);
  font-size: 13px;
}

.ref-text { color: var(--text-muted); }
.ref-value { font-weight: 600; color: var(--text-heading); white-space: nowrap; }

.ref-total {
  background: var(--primary-soft);
  border-color: var(--line-strong);
}

.ref-total .ref-value { color: var(--primary); }

/* 通用按钮样式 */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-strong);
  transform: translateY(-2px);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-muted);
  color: var(--text-muted);
  border: 1px solid var(--line);
}

.btn-ghost:hover {
  color: var(--text-heading);
  border-color: var(--line-strong);
}

.btn-pause {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-heading);
}

.btn-pause:hover {
  border-color: var(--primary);
}

/* Markdown 预览器 */
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

@media (max-width: 640px) {
  .tools-nav {
    gap: 4px;
  }
  .tool-tab {
    padding: 8px 12px;
    font-size: 13px;
  }
  .tool-name {
    display: none;
  }
  .tool-panel {
    padding: 20px;
  }
  .ts-input-row {
    flex-direction: column;
  }
  .salary-settings {
    flex-direction: column;
  }
  .earned-number {
    font-size: 44px;
    letter-spacing: -1px;
  }
  .currency {
    font-size: 22px;
  }
  .md-editor-area.split {
    grid-template-columns: 1fr;
  }
  .md-textarea {
    min-height: 200px;
  }
}
</style>
