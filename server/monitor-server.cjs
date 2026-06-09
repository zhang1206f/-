const si = require('systeminformation')
const { WebSocketServer } = require('ws')

const PORT = 3001
const INTERVAL = 1500

let prevIO = null

function pickIface(netList) {
  const sorted = [...netList].sort((a, b) => (b.tx_sec + b.rx_sec) - (a.tx_sec + a.rx_sec))
  return sorted.find(i => i.iface !== 'lo0') || sorted[0] || {}
}

async function collect() {
  const [cpuLoad, memInfo, diskInfo, netStats, procInfo, timeInfo, ioStats] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.fsSize(),
    si.networkStats(),
    si.processes(),
    si.time(),
    si.disksIO()
  ])

  const cpu = Math.round(cpuLoad.currentLoad * 10) / 10
  const cpuCores = (cpuLoad.cpus || []).map(c => Math.round(c.load * 10) / 10)

  const memory = {
    total: memInfo.total,
    used: memInfo.total - memInfo.available,
    pct: Math.round(((memInfo.total - memInfo.available) / memInfo.total) * 1000) / 10
  }

  const dataVol = diskInfo.find(d => d.mount === '/System/Volumes/Data')
    || diskInfo.find(d => d.mount === '/' && d.size > 0 && !isNaN(d.size))
    || diskInfo[0]
  const disk = dataVol
    ? { size: dataVol.size, used: dataVol.used, pct: Math.round(dataVol.use * 10) / 10 }
    : { size: 0, used: 0, pct: 0 }

  const activeIface = pickIface(netStats)
  const net = {
    tx_sec: Math.round((activeIface.tx_sec || 0) * 100) / 100,
    rx_sec: Math.round((activeIface.rx_sec || 0) * 100) / 100,
    iface: activeIface.iface || ''
  }

  // 磁盘 IO 速度（delta 计算，因为 rIO_sec 在 macOS 上为 null）
  let read_speed = 0, write_speed = 0
  if (prevIO && ioStats) {
    const dt = INTERVAL / 1000
    const dr = ioStats.rIO - prevIO.rIO
    const dw = ioStats.wIO - prevIO.wIO
    if (dr > 0) read_speed = Math.round((dr / dt) * 100) / 100
    if (dw > 0) write_speed = Math.round((dw / dt) * 100) / 100
  }
  if (ioStats) prevIO = { rIO: ioStats.rIO, wIO: ioStats.wIO }

  const processes = (procInfo.list || [])
    .sort((a, b) => b.cpu - a.cpu)
    .slice(0, 8)
    .map(p => ({
      name: p.name,
      pid: p.pid,
      cpu: Math.round(p.cpu * 10) / 10,
      mem: Math.round(p.mem * 10) / 10,
      memBytes: p.mem_rss || 0
    }))

  return {
    cpu, cpuCores, memory, disk, net, uptime: timeInfo.uptime,
    processes, diskIO: { read_speed, write_speed },
    ts: Date.now()
  }
}

const wss = new WebSocketServer({ port: PORT })
console.log(`[monitor] WebSocket server on ws://localhost:${PORT}`)

let timer = null

wss.on('connection', (ws) => {
  console.log('[monitor] client connected')
  if (!timer) {
    async function tick() {
      try {
        const data = await collect()
        wss.clients.forEach(c => { if (c.readyState === 1) c.send(JSON.stringify(data)) })
      } catch (e) {
        console.error('[monitor] collect error:', e.message)
      }
    }
    tick()
    timer = setInterval(tick, INTERVAL)
  }
  ws.on('close', () => {
    console.log('[monitor] client disconnected')
    if (wss.clients.size === 0 && timer) {
      clearInterval(timer)
      timer = null
      prevIO = null
      console.log('[monitor] no clients, stopped polling')
    }
  })
})
