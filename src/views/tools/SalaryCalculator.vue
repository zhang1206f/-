<template>
  <div class="tool-panel glass">
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
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const salary = ref(15000)
const workHours = ref(8)
const weekendOff = ref(true)

const earned = ref(0)
const elapsedSeconds = ref(0)
const isRunning = ref(false)
let intervalId = null
let startTime = null

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
  const now = Date.now()
  if (startTime) {
    const elapsed = Math.floor((now - startTime) / 1000)
    const totalSeconds = elapsed
    const rate = parseFloat(perSecond.value)
    if (!isNaN(rate)) {
      earned.value = totalSeconds * rate
    }
    elapsedSeconds.value = totalSeconds
  }
}

const handleStart = () => {
  if (isRunning.value) return
  if (intervalId) clearInterval(intervalId)
  isRunning.value = true
  // 使用 Date.now() 计算基准时间
  startTime = Date.now() - elapsedSeconds.value * 1000
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
  startTime = null
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
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
</style>
