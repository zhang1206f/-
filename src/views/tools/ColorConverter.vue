<template>
  <div class="tool-panel glass">
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
            <button class="btn-ghost" @click="handleCopy(colorHex)">复制</button>
          </div>
        </div>

        <div class="color-field">
          <label>RGB</label>
          <div class="color-input-group">
            <input v-model="colorRgb" @input="rgbToHex" placeholder="rgb(99, 102, 241)" />
            <button class="btn-ghost" @click="handleCopy(colorRgb)">复制</button>
          </div>
        </div>

        <div class="color-field">
          <label>HSL</label>
          <div class="color-input-group">
            <input v-model="colorHsl" readonly placeholder="hsl(239, 84%, 67%)" />
            <button class="btn-ghost" @click="handleCopy(colorHsl)">复制</button>
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

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
  } catch {
    // 静默处理
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
  } catch {
    // 静默处理
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
  } catch {
    // 静默处理
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
</style>
