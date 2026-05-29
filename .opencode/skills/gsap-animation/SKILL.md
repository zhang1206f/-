---
name: gsap-animation
description: 使用 GSAP 添加页面动效。当用户说"加动画"、"用 GSAP"、"优化动效"、"让页面动起来"时触发。为 Vue 组件添加 GSAP 入场动画、滚动触发器、数字滚动、交错列表等效果。
---

# GSAP Animation Skill

## Import 规范

```javascript
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

## Vue 集成最佳实践

### 模板 ref 绑定
```vue
<template>
  <div ref="heroRef" class="hero">...</div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const heroRef = ref(null)
let ctx = null
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(heroRef.value, { opacity: 0, y: 40, duration: 0.8 })
  })
})
onUnmounted(() => ctx?.revert())
</script>
```

- **始终使用 `gsap.context()`** 包裹动画，组件卸载时 `ctx.revert()` 自动清理
- 动画钩子放在 `onMounted` 中
- 避免在模板中直接操作 DOM，用 `ref` 绑定

## 常用动画模式

### 1. 页面入场（fade + slide up）
```javascript
gsap.from(el, {
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: 'power3.out'
})
```

### 2. 交错列表（stagger）
```javascript
gsap.from(items, {
  opacity: 0,
  y: 30,
  duration: 0.6,
  stagger: 0.08,
  ease: 'power2.out'
})
```

### 3. 数字滚动计数
```javascript
gsap.to(obj, {
  val: targetNumber,
  duration: 1.5,
  ease: 'power2.out',
  onUpdate: () => { el.textContent = Math.round(obj.val) }
})
```

### 4. ScrollTrigger 滚动触发
```javascript
gsap.from(el, {
  scrollTrigger: {
    trigger: el,
    start: 'top 85%',
    toggleActions: 'play none none reverse'
  },
  opacity: 0,
  y: 50,
  duration: 0.8
})
```

### 5. Timeline 编排
```javascript
const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power2.out' } })
tl.from(hero, { opacity: 0, y: 40 })
  .from(subtitle, { opacity: 0, x: -20 }, '-=0.3')
  .from(cta, { opacity: 0, y: 20 }, '-=0.2')
```

## 设计原则

- 动画时长：入场 0.6-0.8s，hover 0.2-0.3s，数字滚动 1-2s
- easing：入场用 `power2.out` / `power3.out`，hover 用 `power1.out`
- 不要过度动画：内容区用 ScrollTrigger，导航和按钮用 hover 微动效
- 数字从 0 滚动到目标值，带千分位逗号
