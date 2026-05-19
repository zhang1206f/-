<template>
  <div class="tools-page">
    <div class="counter-hero">
      <div class="earned-wrap">
        <span class="currency">¥</span>
        <span class="earned-number" :class="{ jumping: isRunning }">{{ formattedEarned }}</span>
      </div>
      <div class="counter-label">已经赚了这么多</div>

      <div class="sub-info">
        <span>时薪 <strong class="accent">{{ hourlyRate }}</strong> 元</span>
        <span class="dot">·</span>
        <span>日薪 <strong>{{ dailyRate }}</strong> 元</span>
        <span class="dot">·</span>
        <span>每秒 <strong class="accent">{{ perSecond }}</strong> 元</span>
      </div>

      <div class="timer-display">⏱ {{ timerDisplay }}</div>

      <div class="counter-controls">
        <a-button
          v-if="!isRunning"
          type="primary"
          size="large"
          class="ctrl-btn start"
          @click="handleStart"
        >
          ▶ 开始
        </a-button>
        <a-button
          v-else
          size="large"
          class="ctrl-btn pause"
          @click="handlePause"
        >
          ⏸ 暂停
        </a-button>
        <a-button size="large" class="ctrl-btn reset" @click="handleReset">
          ⟲
        </a-button>
      </div>
    </div>

    <div class="settings-row">
      <div class="form-item">
        <label>💼 上班时间</label>
        <div class="input-suffix">
          <a-input-number
            v-model:value="workHours"
            :min="1"
            :max="24"
            :step="1"
            controls
          />
          <span class="suffix">小时/天</span>
        </div>
      </div>

      <div class="form-item">
        <label>📅 双休</label>
        <a-switch v-model:checked="weekendOff" checked-children="休" un-checked-children="上" />
      </div>

      <div class="form-item">
        <label>💰 月薪</label>
        <div class="input-suffix">
          <a-input-number
            v-model:value="salary"
            :min="0"
            :max="999999"
            :step="1000"
            controls
          />
          <span class="suffix">元</span>
        </div>
      </div>
    </div>

    <div class="references">
      <div class="ref-list">
        <div class="ref-item" v-for="ref in references" :key="ref.label">
          <span class="ref-icon">{{ ref.icon }}</span>
          <span class="ref-text">{{ ref.label }}</span>
          <span class="ref-value">{{ ref.time }}</span>
        </div>
        <div v-if="totalEarned > 0" class="ref-item ref-total">
          <span class="ref-icon">💰</span>
          <span class="ref-text">当前已赚</span>
          <span class="ref-value">¥{{ totalEarned.toFixed(2) }}</span>
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
    if (secs < 60) return `${secs} 秒`
    if (secs < 3600) return `${Math.round(secs / 60)} 分钟`
    if (secs < 86400) return `${(secs / 3600).toFixed(1)} 小时`
    return `${(secs / 86400).toFixed(1)} 天`
  }

  return [
    { icon: '☕', label: '一杯咖啡 30 元', time: calc(30) },
    { icon: '🍔', label: '一顿外卖 40 元', time: calc(40) },
    { icon: '🎬', label: '一张电影票 60 元', time: calc(60) },
    { icon: '📚', label: '一本书 80 元', time: calc(80) },
    { icon: '👕', label: '一件衣服 300 元', time: calc(300) },
    { icon: '🎧', label: '一副耳机 1500 元', time: calc(1500) },
    { icon: '📱', label: '一部手机 6000 元', time: calc(6000) },
    { icon: '✈️', label: '一趟旅行 10000 元', time: calc(10000) }
  ]
})

const tick = () => {
  const rate = parseFloat(perSecond.value)
  if (!isNaN(rate)) {
    earned.value += rate
  }
  elapsedSeconds.value++
}

const handleStart = () => {
  if (isRunning.value) return
  if (intervalId) clearInterval(intervalId)
  isRunning.value = true
  intervalId = setInterval(tick, 1000)
}

const handlePause = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  isRunning.value = false
}

const handleReset = () => {
  handlePause()
  earned.value = 0
  elapsedSeconds.value = 0
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.tools-page {
  padding: 16px 0;
  max-width: 720px;
  margin: 0 auto;
}

/* ===== Counter Hero ===== */
.counter-hero {
  text-align: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 20px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.counter-hero::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(79, 70, 229, 0.12);
  top: -80px;
  right: -80px;
  filter: blur(60px);
}

.counter-hero::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.08);
  bottom: -60px;
  left: -60px;
  filter: blur(50px);
}

.earned-wrap {
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.currency {
  font-size: 32px;
  font-weight: 300;
  color: rgba(255,255,255,0.6);
  vertical-align: top;
  margin-right: 4px;
  line-height: 1;
}

.earned-number {
  font-size: 72px;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
  letter-spacing: -3px;
  display: inline-block;
  line-height: 1;
}

.earned-number.jumping {
  animation: pulse 0.12s ease;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.04); }
  100% { transform: scale(1); }
}

.counter-label {
  font-size: 16px;
  color: rgba(255,255,255,0.45);
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.sub-info {
  font-size: 15px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.sub-info strong {
  color: rgba(255,255,255,0.85);
  font-weight: 600;
}

.sub-info .accent {
  color: #818cf8;
}

.dot {
  margin: 0 10px;
  color: rgba(255,255,255,0.2);
}

.timer-display {
  font-size: 20px;
  color: rgba(255,255,255,0.4);
  font-variant-numeric: tabular-nums;
  letter-spacing: 2px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.counter-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.ctrl-btn {
  min-width: 100px;
  border-radius: 12px;
  font-size: 16px;
  height: auto;
  padding: 10px 28px;
  border: none;
}

.ctrl-btn.start {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 4px 14px rgba(79,70,229,0.35);
  color: #fff;
}

.ctrl-btn.start:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79,70,229,0.45);
}

.ctrl-btn.pause {
  background: rgba(255,255,255,0.12);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.15);
}

.ctrl-btn.pause:hover {
  background: rgba(255,255,255,0.2);
}

.ctrl-btn.reset {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.5);
  min-width: auto;
  padding: 10px 18px;
}

.ctrl-btn.reset:hover {
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.8);
}

/* ===== Settings Row ===== */
.settings-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.settings-row .form-item {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 18px;
}

.settings-row .form-item label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #999;
  margin-bottom: 10px;
}

.input-suffix {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-suffix :deep(.ant-input-number) {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 18px;
  font-weight: 600;
}

.input-suffix :deep(.ant-input-number-input) {
  padding-left: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-h);
}

.suffix {
  font-size: 13px;
  color: #bbb;
  white-space: nowrap;
}

.form-item :deep(.ant-switch) {
  transform: scale(1.15);
  transform-origin: left center;
}

/* ===== References ===== */
.references {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
}

.ref-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.ref-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--bg-alt);
  border-radius: 10px;
  font-size: 14px;
}

.ref-icon {
  flex-shrink: 0;
  font-size: 15px;
}

.ref-text {
  flex: 1;
  color: #999;
  font-size: 13px;
}

.ref-value {
  font-weight: 600;
  color: var(--text-h);
  font-size: 13px;
  white-space: nowrap;
}

.ref-total {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #eef2ff, #faf5ff);
  border: 1px solid #e0e7ff;
}

.ref-total .ref-value {
  color: var(--primary);
  font-size: 15px;
}

@media (max-width: 640px) {
  .settings-row {
    flex-direction: column;
  }
  .earned-number {
    font-size: 48px;
    letter-spacing: -2px;
  }
  .currency {
    font-size: 24px;
  }
  .ref-list {
    grid-template-columns: 1fr;
  }
}
</style>
