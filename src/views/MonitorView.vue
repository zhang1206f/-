<template>
  <div class="monitor-page">
    <header class="monitor-header">
      <div class="monitor-title">
        <span class="monitor-dot" />
        <h1>系统监控</h1>
        <span
          v-if="connected"
          class="monitor-badge"
        >LIVE</span>
        <span
          v-else
          class="monitor-badge disconnected"
        >DISCONNECTED</span>
      </div>
      <div class="monitor-header-right">
        <span class="monitor-uptime">运行 {{ formatUptime(data.uptime) }}</span>
        <span class="monitor-clock">{{ clock }}</span>
      </div>
    </header>

    <div class="monitor-grid">
      <!-- 4 指标卡片 -->
      <div class="metric-card metric-cpu">
        <div
          class="metric-ring"
          :style="{ '--pct': data.cpu + '%' }"
        >
          <svg viewBox="0 0 120 120">
            <circle
              class="ring-bg"
              cx="60"
              cy="60"
              r="54"
            />
            <circle
              class="ring-fill"
              cx="60"
              cy="60"
              r="54"
              :style="{ strokeDashoffset: 339.292 - 339.292 * data.cpu / 100 }"
            />
          </svg>
          <div class="metric-ring-value">
            {{ data.cpu }}<small>%</small>
          </div>
        </div>
        <div class="metric-label">
          CPU
        </div>
        <div
          v-if="cpuTrend !== 0"
          class="metric-trend"
          :class="cpuTrend > 0 ? 'up' : 'down'"
        >
          {{ cpuTrend > 0 ? '↑' : '↓' }} {{ Math.abs(cpuTrend) }}%
        </div>
      </div>

      <div class="metric-card metric-mem">
        <div
          class="metric-ring"
          :style="{ '--pct': data.memory.pct + '%' }"
        >
          <svg viewBox="0 0 120 120">
            <circle
              class="ring-bg"
              cx="60"
              cy="60"
              r="54"
            />
            <circle
              class="ring-fill"
              cx="60"
              cy="60"
              r="54"
              :style="{ strokeDashoffset: 339.292 - 339.292 * data.memory.pct / 100 }"
            />
          </svg>
          <div class="metric-ring-value">
            {{ formatBytes(data.memory.used) }}<small>GB</small>
          </div>
        </div>
        <div class="metric-label">
          内存
        </div>
        <div class="metric-sub">
          {{ data.memory.pct }}% · {{ formatBytes(data.memory.total) }}GB
        </div>
      </div>

      <div class="metric-card metric-disk">
        <div
          class="metric-ring"
          :style="{ '--pct': data.disk.pct + '%' }"
        >
          <svg viewBox="0 0 120 120">
            <circle
              class="ring-bg"
              cx="60"
              cy="60"
              r="54"
            />
            <circle
              class="ring-fill"
              cx="60"
              cy="60"
              r="54"
              :style="{ strokeDashoffset: 339.292 - 339.292 * data.disk.pct / 100 }"
            />
          </svg>
          <div class="metric-ring-value">
            {{ formatBytes(data.disk.used) }}<small>GB</small>
          </div>
        </div>
        <div class="metric-label">
          磁盘
        </div>
        <div class="metric-sub">
          {{ data.disk.pct }}% · {{ formatBytes(data.disk.size) }}GB
        </div>
      </div>

      <div class="metric-card metric-net">
        <div class="metric-ring no-anim">
          <svg viewBox="0 0 120 120">
            <circle
              class="ring-bg"
              cx="60"
              cy="60"
              r="54"
            />
          </svg>
          <div class="metric-ring-value net-value">
            <small class="net-up">↑{{ formatNet(data.net.tx_sec) }}</small>
            <small class="net-down">↓{{ formatNet(data.net.rx_sec) }}</small>
          </div>
        </div>
        <div class="metric-label">
          网络
        </div>
        <div class="metric-sub">
          {{ data.net.iface || '—' }}
        </div>
      </div>
    </div>

    <div class="monitor-body">
      <!-- CPU & Memory 折线图 -->
      <div class="panel panel-chart">
        <div class="panel-header">
          <h2>CPU & 内存</h2>
          <span class="panel-legend">
            <span class="legend-dot cpu-dot" />CPU
            <span class="legend-dot mem-dot" />内存
          </span>
        </div>
        <v-chart
          :option="cpuMemOption"
          autoresize
          class="chart-main"
        />
      </div>

      <!-- 进程列表 -->
      <div class="panel panel-proc">
        <div class="panel-header">
          <h2>进程 TOP 8</h2>
        </div>
        <div class="proc-list">
          <div
            v-for="(p, idx) in data.processes"
            :key="p.pid"
            class="proc-row"
          >
            <span class="proc-rank">{{ idx + 1 }}</span>
            <span class="proc-name">{{ p.name }}</span>
            <div class="proc-bar-track">
              <div
                class="proc-bar-fill"
                :style="{ width: Math.min(p.cpu * 2.5, 100) + '%' }"
              />
            </div>
            <span class="proc-pct">{{ p.cpu }}%</span>
            <span class="proc-mem">{{ p.mem }}%</span>
          </div>
        </div>
      </div>

      <!-- 网络流量面积图 -->
      <div class="panel panel-net-chart">
        <div class="panel-header">
          <h2>网络吞吐量</h2>
          <span class="panel-legend">
            <span class="legend-dot tx-dot" />上传
            <span class="legend-dot rx-dot" />下载
          </span>
        </div>
        <v-chart
          :option="netOption"
          autoresize
          class="chart-main"
        />
      </div>

      <!-- 磁盘 IO -->
      <div class="panel panel-io">
        <div class="panel-header">
          <h2>磁盘 IO</h2>
        </div>
        <div class="io-box">
          <div class="io-row">
            <span class="io-label">读取</span>
            <div class="io-bar-track">
              <div
                class="io-bar-fill io-read"
                :style="{ width: ioReadPct + '%' }"
              />
            </div>
            <span class="io-value io-read-val">{{ formatIO(data.diskIO.read_speed) }}/s</span>
          </div>
          <div class="io-row">
            <span class="io-label">写入</span>
            <div class="io-bar-track">
              <div
                class="io-bar-fill io-write"
                :style="{ width: ioWritePct + '%' }"
              />
            </div>
            <span class="io-value io-write-val">{{ formatIO(data.diskIO.write_speed) }}/s</span>
          </div>
        </div>
        <div class="io-note">
          读取 / 写入操作次数每秒
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, ScatterChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, ScatterChart, GridComponent, TooltipComponent, LegendComponent])

const MAX_POINTS = 60

const data = reactive({
  cpu: 0, cpuCores: [], uptime: 0,
  memory: { total: 0, used: 0, available: 0, pct: 0 },
  disk: { size: 0, used: 0, pct: 0 },
  net: { tx_sec: 0, rx_sec: 0, iface: '' },
  processes: [],
  diskIO: { read_speed: 0, write_speed: 0 }
})

const connected = ref(false)
const clock = ref('')
let clockTimer = null
let ws = null
let reconnectTimer = null
const historyCpu = reactive([])
const historyMem = reactive([])
const historyTx = reactive([])
const historyRx = reactive([])
const historyTime = reactive([])
const lastCpu = ref(0)

function connect() {
  if (ws) { ws.close(); ws = null }
  ws = new WebSocket('ws://localhost:3001')
  ws.onopen = () => { connected.value = true; clearTimeout(reconnectTimer) }
  ws.onmessage = (e) => {
    try {
      const d = JSON.parse(e.data)
      Object.assign(data, d)
      historyCpu.push(d.cpu)
      historyMem.push(d.memory.pct)
      historyTx.push(d.net.tx_sec)
      historyRx.push(d.net.rx_sec)
      historyTime.push(new Date().toLocaleTimeString('zh-CN', { hour12: false }).slice(0, 8))
      if (historyCpu.length > MAX_POINTS) { historyCpu.shift(); historyMem.shift(); historyTx.shift(); historyRx.shift(); historyTime.shift() }
      if (historyCpu.length >= 2) lastCpu.value = historyCpu[historyCpu.length - 2]
    } catch {
      // 解析错误静默忽略
    }
  }
  ws.onclose = () => {
    connected.value = false
    reconnectTimer = setTimeout(connect, 3000)
  }
  ws.onerror = () => { ws.close() }
}

const cpuTrend = computed(() => historyCpu.length >= 2 ? Math.round((data.cpu - lastCpu.value) * 10) / 10 : 0)

const ioReadPct = computed(() => Math.min((data.diskIO.read_speed / 500) * 100, 100))
const ioWritePct = computed(() => Math.min((data.diskIO.write_speed / 500) * 100, 100))

const cpuMemOption = computed(() => ({
  tooltip: { trigger: 'axis', backgroundColor: 'rgba(7,11,20,0.9)', borderColor: 'rgba(148,163,184,0.2)', textStyle: { color: '#e2e8f0', fontSize: 12 } },
  grid: { left: 40, right: 12, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: historyTime, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#6b7d95', fontSize: 10 } },
  yAxis: [
    { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } }, axisLabel: { color: '#6b7d95', fontSize: 10, formatter: '{value}%' } }
  ],
  series: [
    { name: 'CPU', type: 'line', smooth: true, data: historyCpu, showSymbol: false, lineStyle: { width: 2, color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } },
    { name: '内存', type: 'line', smooth: true, data: historyMem, showSymbol: false, lineStyle: { width: 2, color: '#a78bfa' }, areaStyle: { color: 'rgba(167,139,250,0.1)' } }
  ]
}))

const netOption = computed(() => ({
  tooltip: { trigger: 'axis', backgroundColor: 'rgba(7,11,20,0.9)', borderColor: 'rgba(148,163,184,0.2)', textStyle: { color: '#e2e8f0', fontSize: 12 } },
  grid: { left: 48, right: 12, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: historyTime, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#6b7d95', fontSize: 10 } },
  yAxis: {
    type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } },
    axisLabel: { color: '#6b7d95', fontSize: 10, formatter: (v) => v >= 1048576 ? (v / 1048576).toFixed(1) + 'MB' : v >= 1024 ? (v / 1024).toFixed(1) + 'KB' : v.toFixed(0) + 'B' }
  },
  series: [
    { name: '上传', type: 'line', smooth: true, data: historyTx, showSymbol: false, lineStyle: { width: 2, color: '#fbbf24' }, areaStyle: { color: 'rgba(251,191,36,0.1)' } },
    { name: '下载', type: 'line', smooth: true, data: historyRx, showSymbol: false, lineStyle: { width: 2, color: '#34d399' }, areaStyle: { color: 'rgba(52,211,153,0.1)' } }
  ]
}))

function formatBytes(b) { return (b / 1073741824).toFixed(1) }
function formatNet(v) {
  if (v >= 1048576) return (v / 1048576).toFixed(1) + 'MB'
  if (v >= 1024) return (v / 1024).toFixed(1) + 'KB'
  return v.toFixed(0) + 'B'
}
function formatIO(v) {
  if (v >= 1000) return (v / 1000).toFixed(1) + 'K'
  return v.toFixed(1)
}
function formatUptime(s) {
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  return d + 'd ' + h + 'h'
}

function tickClock() { clock.value = new Date().toLocaleTimeString('zh-CN', { hour12: false }) }

onMounted(() => {
  connect()
  tickClock()
  clockTimer = setInterval(tickClock, 1000)
})

onUnmounted(() => {
  clearTimeout(reconnectTimer)
  clearInterval(clockTimer)
  if (ws) { ws.onclose = null; ws.close() }
})
</script>

<style scoped>
.monitor-page {
  background: #070b14;
  border-radius: 0;
  padding: 24px;
  min-height: calc(100vh - 120px);
  color: #e2e8f0;
  font-family: 'JetBrains Mono', 'DM Sans', sans-serif;
}

.monitor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.monitor-title { display: flex; align-items: center; gap: 12px; }
.monitor-title h1 { font-size: 22px; font-weight: 700; color: #f1f5f9; margin: 0; }
.monitor-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: #22d3ee; box-shadow: 0 0 8px rgba(34,211,238,0.5);
}
.monitor-badge {
  padding: 2px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;
  background: rgba(34,211,238,0.15); color: #22d3ee; border: 1px solid rgba(34,211,238,0.3);
}
.monitor-badge.disconnected { background: rgba(248,113,113,0.15); color: #f87171; border-color: rgba(248,113,113,0.3); }
.monitor-header-right { display: flex; align-items: center; gap: 20px; font-size: 13px; color: #94a3b8; }
.monitor-uptime { }
.monitor-clock { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 600; color: #e2e8f0; letter-spacing: 0.05em; }

.monitor-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }

.metric-card {
  background: rgba(15,23,42,0.6);
  border: 1px solid rgba(148,163,184,0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  backdrop-filter: blur(8px);
}
.metric-ring { position: relative; width: 100px; height: 100px; }
.metric-ring svg { width: 100px; height: 100px; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: rgba(148,163,184,0.08); stroke-width: 6; }
.ring-fill { fill: none; stroke-width: 6; stroke-linecap: round; stroke-dasharray: 339.292; stroke-dashoffset: 339.292; transition: stroke-dashoffset 0.5s ease; }
.metric-cpu .ring-fill { stroke: #22d3ee; }
.metric-mem .ring-fill { stroke: #a78bfa; }
.metric-disk .ring-fill { stroke: #fbbf24; }

.metric-ring-value { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #f1f5f9; }
.metric-ring-value small { font-size: 11px; color: #94a3b8; font-weight: 500; }
.net-value { gap: 2px; }
.net-up { font-size: 11px; color: #fbbf24; font-weight: 600; }
.net-down { font-size: 11px; color: #34d399; font-weight: 600; }
.metric-label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
.metric-sub { font-size: 11px; color: #6b7d95; }
.metric-trend { font-size: 11px; font-weight: 600; }
.metric-trend.up { color: #22d3ee; }
.metric-trend.down { color: #f87171; }

.monitor-body { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.panel {
  background: rgba(15,23,42,0.5);
  border: 1px solid rgba(148,163,184,0.1);
  border-radius: 16px;
  padding: 18px;
  backdrop-filter: blur(8px);
}
.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.panel-header h2 { font-size: 14px; font-weight: 600; color: #e2e8f0; margin: 0; }
.panel-legend { display: flex; align-items: center; gap: 12px; font-size: 11px; color: #94a3b8; }
.legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }
.cpu-dot { background: #22d3ee; }
.mem-dot { background: #a78bfa; }
.tx-dot { background: #fbbf24; }
.rx-dot { background: #34d399; }

.chart-main { height: 200px; width: 100%; }

.panel-chart { grid-column: 1 / 2; }
.panel-proc { grid-column: 2 / 3; }

.panel-net-chart { grid-column: 1 / 2; }
.panel-io { grid-column: 2 / 3; }

.io-box { display: flex; flex-direction: column; gap: 14px; padding: 8px 0; }
.io-row { display: grid; grid-template-columns: 36px 1fr 60px; align-items: center; gap: 10px; }
.io-label { font-size: 12px; color: #94a3b8; font-weight: 600; }
.io-bar-track { height: 6px; border-radius: 4px; background: rgba(148,163,184,0.08); overflow: hidden; }
.io-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
.io-read { background: linear-gradient(90deg, #22d3ee, #06b6d4); }
.io-write { background: linear-gradient(90deg, #a78bfa, #8b5cf6); }
.io-value { font-size: 12px; font-weight: 600; text-align: right; font-family: 'JetBrains Mono', monospace; }
.io-read-val { color: #22d3ee; }
.io-write-val { color: #a78bfa; }
.io-note { margin-top: 8px; font-size: 11px; color: #6b7d95; text-align: center; }

.proc-list { display: flex; flex-direction: column; gap: 6px; }
.proc-row { display: grid; grid-template-columns: 20px 1fr 2fr 36px 36px; align-items: center; gap: 8px; padding: 5px 8px; border-radius: 8px; font-size: 11px; }
.proc-row:nth-child(odd) { background: rgba(148,163,184,0.04); }
.proc-rank { color: #6b7d95; font-weight: 600; }
.proc-name { color: #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.proc-bar-track { height: 4px; background: rgba(148,163,184,0.08); border-radius: 4px; overflow: hidden; }
.proc-bar-fill { height: 100%; background: linear-gradient(90deg, #22d3ee, #06b6d4); border-radius: 4px; transition: width 0.5s ease; }
.proc-pct { color: #22d3ee; text-align: right; font-weight: 600; }
.proc-mem { color: #a78bfa; text-align: right; }



@media (max-width: 980px) {
  .monitor-grid { grid-template-columns: repeat(2, 1fr); }
  .monitor-body { grid-template-columns: 1fr; }
  .panel-chart, .panel-proc, .panel-net-chart, .panel-io { grid-column: 1; }
}
@media (max-width: 640px) {
  .monitor-grid { grid-template-columns: 1fr; }
  .monitor-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  .monitor-header-right { width: 100%; justify-content: space-between; }
}
</style>
