<template>
  <div class="tools-page">
    <div class="counter-hero glass">
      <div class="earned-wrap">
        <span class="currency">¥</span>
        <span class="earned-number">{{ formattedEarned }}</span>
      </div>
      <div class="counter-label">
        已经赚了这么多
      </div>

      <div class="sub-info">
        <span>时薪 <strong class="accent">{{ hourlyRate }}</strong> 元</span>
        <span class="dot">·</span>
        <span>日薪 <strong>{{ dailyRate }}</strong> 元</span>
        <span class="dot">·</span>
        <span>每秒 <strong class="accent">{{ perSecond }}</strong> 元</span>
      </div>

      <div class="timer-display">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><circle
          cx="12"
          cy="12"
          r="10"
        /><polyline points="12 6 12 12 16 14" /></svg> {{ timerDisplay }}
      </div>

      <div class="counter-controls">
        <button
          v-if="!isRunning"
          class="btn-primary"
          @click="handleStart"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          ><polygon points="5 3 19 12 5 21 5 3" /></svg>
          开始
        </button>
        <button
          v-else
          class="btn-pause"
          @click="handlePause"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          ><rect
            x="6"
            y="4"
            width="4"
            height="16"
          /><rect
            x="14"
            y="4"
            width="4"
            height="16"
          /></svg>
          暂停
        </button>
        <button
          class="btn-ghost"
          @click="handleReset"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
        </button>
      </div>
    </div>

    <div class="settings-panel glass">
      <div class="settings-row">
        <div class="form-item">
          <label>上班时间</label>
          <div class="input-group">
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
          <label>双休</label>
          <a-switch
            v-model:checked="weekendOff"
            checked-children="休"
            un-checked-children="上"
          />
        </div>

        <div class="form-item">
          <label>月薪</label>
          <div class="input-group">
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
    </div>

    <div class="references glass">
      <div class="ref-list">
        <div
          v-for="refItem in references"
          :key="refItem.label"
          class="ref-badge"
        >
          <span class="ref-text">{{ refItem.label }}</span>
          <span class="ref-value">{{ refItem.time }}</span>
        </div>
        <div
          v-if="totalEarned > 0"
          class="ref-badge ref-total"
        >
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

onUnmounted(() => { if (intervalId) clearInterval(intervalId) })
</script>

<style scoped>
.tools-page { padding: 16px 0; max-width: 680px; margin: 0 auto; }

.counter-hero {
  text-align: center;
  padding: 36px 24px;
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.counter-hero::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: var(--primary-soft);
  top: -100px;
  right: -80px;
  filter: blur(60px);
}

.earned-wrap {
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
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
  position: relative;
  z-index: 1;
}

.sub-info {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

.sub-info strong { color: var(--text-heading); font-weight: 600; }
.sub-info .accent { color: var(--primary); }
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
  position: relative;
  z-index: 1;
}

.counter-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.counter-controls .btn-primary,
.counter-controls .btn-pause,
.counter-controls .btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: inherit;
}

.counter-controls .btn-primary {
  background: var(--gradient-brand);
  color: #fff;
  box-shadow: 0 18px 40px rgba(109, 124, 255, 0.28);
}

.counter-controls .btn-primary:hover { transform: translateY(-2px); }

.counter-controls .btn-pause {
  background: var(--bg-muted);
  color: var(--text-heading);
  border: 1px solid var(--line);
}

.counter-controls .btn-pause:hover { border-color: var(--primary); }

.counter-controls .btn-ghost {
  padding: 10px 16px;
  background: var(--bg-muted);
  color: var(--text-muted);
  border: 1px solid var(--line);
}

.counter-controls .btn-ghost:hover { color: var(--text-heading); border-color: var(--line-strong); }

.settings-panel {
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 20px;
}

.settings-row {
  display: flex;
  gap: 16px;
}

.form-item { flex: 1; }

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

.input-group :deep(.ant-input-number) {
  flex: 1;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-muted);
}

.input-group :deep(.ant-input-number-input) {
  padding: 6px 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-heading);
  background: transparent;
}

.suffix { font-size: 13px; color: var(--text-muted); white-space: nowrap; }

.form-item :deep(.ant-switch) {
  margin-top: 4px;
}

.references {
  border-radius: var(--radius-md);
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
  background: var(--bg-muted);
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

@media (max-width: 640px) {
  .settings-row { flex-direction: column; }
  .earned-number { font-size: 44px; letter-spacing: -1px; }
  .currency { font-size: 22px; }
  .ref-badge { width: 100%; }
}
</style>
