<template>
  <div class="tool-panel glass">
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
          <button class="btn-ghost" @click="handleCopy(String(currentTimestamp))">复制</button>
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
          <button class="btn-ghost" @click="handleCopy(String(dateResult))">复制</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

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
  } catch {
    dateResult.value = '转换失败'
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
</style>
