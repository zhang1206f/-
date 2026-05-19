<template>
  <div class="tools-page">
    <h1>⏱ 时薪计时器</h1>
    <p class="page-desc">输入你的薪资参数，看看时间到底值多少钱</p>

    <div class="tools-layout">
      <!-- 左：设置 -->
      <div class="settings-panel">
        <h3>⚙️ 薪资设置</h3>

        <div class="form-item">
          <label>税前月薪（元）</label>
          <a-input-number
            v-model:value="salary"
            :min="0"
            :max="999999"
            :step="1000"
            style="width: 100%"
            placeholder="例如 15000"
          />
        </div>

        <div class="form-item">
          <label>月工作天数</label>
          <a-input-number
            v-model:value="workDays"
            :min="1"
            :max="31"
            :step="0.5"
            style="width: 100%"
          />
          <span class="form-hint">法定平均 21.75 天</span>
        </div>

        <div class="form-item">
          <label>每日工时（小时）</label>
          <a-input-number
            v-model:value="workHours"
            :min="1"
            :max="24"
            :step="0.5"
            style="width: 100%"
          />
        </div>

        <div class="form-item">
          <label>年终奖月数</label>
          <a-input-number
            v-model:value="bonusMonths"
            :min="0"
            :max="24"
            :step="1"
            style="width: 100%"
          />
          <span class="form-hint">例如 2 个月 = 额外 2 个月薪</span>
        </div>

        <div class="form-item">
          <label>月社保公积金（元）</label>
          <a-input-number
            v-model:value="insurance"
            :min="0"
            :max="99999"
            :step="100"
            style="width: 100%"
            placeholder="个人缴纳部分"
          />
        </div>

        <div class="form-item">
          <label>月个税（元）</label>
          <a-input-number
            v-model:value="tax"
            :min="0"
            :max="99999"
            :step="100"
            style="width: 100%"
          />
        </div>
      </div>

      <!-- 右：计时器 -->
      <div class="counter-panel">
        <div class="counter-display">
          <div class="earned-wrap">
            <span class="currency">¥</span>
            <span class="earned-number" :class="{ jumping: isRunning }">{{ formattedEarned }}</span>
          </div>
          <div class="counter-label">已赚金额（实时累计）</div>

          <div class="sub-info">
            <span>时薪 <strong>{{ hourlyRate }}</strong> 元/时</span>
            <span class="sub-sep">·</span>
            <span>日薪 <strong>{{ dailyRate }}</strong> 元</span>
            <span class="sub-sep">·</span>
            <span>秒薪 <strong class="per-second">{{ perSecond }}</strong> 元</span>
          </div>

          <div class="timer-display">⏱ {{ timerDisplay }}</div>
        </div>

        <div class="counter-controls">
          <a-button
            v-if="!isRunning"
            type="primary"
            size="large"
            class="ctrl-btn"
            @click="handleStart"
          >
            ▶ 开始计时
          </a-button>
          <a-button
            v-else
            size="large"
            class="ctrl-btn pause"
            @click="handlePause"
          >
            ⏸ 暂停
          </a-button>
          <a-button size="large" class="ctrl-btn" ghost @click="handleReset">
            🔄 重置
          </a-button>
        </div>

        <a-divider />

        <div class="references">
          <h4>💡 参考换算</h4>
          <div class="ref-list">
            <div class="ref-item" v-for="ref in references" :key="ref.label">
              <span class="ref-icon">{{ ref.icon }}</span>
              <span class="ref-text">{{ ref.label }}</span>
              <span class="ref-value">{{ ref.time }}</span>
            </div>
            <div v-if="totalEarned > 0" class="ref-item ref-total">
              <span class="ref-icon">💰</span>
              <span class="ref-text">当前已赚</span>
              <span class="ref-value highlight">¥{{ totalEarned.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const salary = ref(15000)
const workDays = ref(21.75)
const workHours = ref(8)
const bonusMonths = ref(0)
const insurance = ref(0)
const tax = ref(0)

const earned = ref(0)
const elapsedSeconds = ref(0)
const isRunning = ref(false)
let intervalId = null

const netMonthly = computed(() => salary.value - insurance.value - tax.value)

const totalWorkHoursPerYear = computed(() => workDays.value * workHours.value * 12)

const annualNet = computed(() => netMonthly.value * 12 + (salary.value / 12) * bonusMonths.value * 12)

const hourlyRate = computed(() => {
  if (totalWorkHoursPerYear.value === 0) return '0.00'
  return (annualNet.value / totalWorkHoursPerYear.value).toFixed(2)
})

const dailyRate = computed(() => {
  const h = parseFloat(hourlyRate.value)
  if (isNaN(h)) return '0.00'
  return (h * workHours.value).toFixed(0)
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
  padding: 24px 0;
}

.tools-page h1 {
  font-size: 28px;
  margin-bottom: 4px;
}

.page-desc {
  color: #999;
  font-size: 15px;
  margin-bottom: 32px;
}

.tools-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 32px;
  align-items: start;
}

/* Settings */
.settings-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  position: sticky;
  top: 88px;
}

.settings-panel h3 {
  font-size: 18px;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-h);
  margin-bottom: 6px;
}

.form-hint {
  display: block;
  font-size: 12px;
  color: #bbb;
  margin-top: 4px;
}

/* Counter */
.counter-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
}

.counter-display {
  text-align: center;
  padding: 20px 0 28px;
}

.earned-wrap {
  margin-bottom: 8px;
}

.currency {
  font-size: 28px;
  font-weight: 300;
  color: var(--text-h);
  vertical-align: top;
  margin-right: 2px;
}

.earned-number {
  font-size: 64px;
  font-weight: 700;
  color: var(--text-h);
  font-variant-numeric: tabular-nums;
  letter-spacing: -2px;
  transition: transform 0.1s;
  display: inline-block;
}

.earned-number.jumping {
  animation: pulse 0.15s ease;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

.counter-label {
  font-size: 16px;
  color: #999;
  margin-bottom: 14px;
}

.sub-info {
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
}

.sub-sep {
  margin: 0 10px;
  color: #ddd;
}

.per-second {
  color: var(--primary);
}

.timer-display {
  font-size: 18px;
  color: #666;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
}

.counter-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.ctrl-btn {
  min-width: 130px;
  border-radius: 10px;
  font-size: 16px;
  height: auto;
  padding: 8px 24px;
}

.ctrl-btn.pause {
  background: #f59e0b;
  border-color: #f59e0b;
  color: #fff;
}

.ctrl-btn.pause:hover {
  background: #d97706;
  border-color: #d97706;
}

/* References */
.references h4 {
  font-size: 16px;
  margin-bottom: 16px;
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
  border-radius: 8px;
  font-size: 14px;
}

.ref-icon {
  flex-shrink: 0;
  font-size: 16px;
}

.ref-text {
  flex: 1;
  color: #888;
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

.ref-value.highlight {
  color: var(--primary);
  font-size: 15px;
}

@media (max-width: 900px) {
  .tools-layout {
    grid-template-columns: 1fr;
  }
  .settings-panel {
    position: static;
  }
  .earned-number {
    font-size: 44px;
  }
  .ref-list {
    grid-template-columns: 1fr;
  }
}
</style>
