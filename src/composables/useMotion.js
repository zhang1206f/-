import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useGsapContext(setup) {
  let ctx = null

  onMounted(() => {
    if (prefersReducedMotion()) return
    ctx = gsap.context(setup)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}

export function animateIn(targets, vars = {}) {
  if (!targets || prefersReducedMotion()) return
  gsap.from(targets, {
    opacity: 0,
    y: 24,
    duration: 0.72,
    ease: 'power3.out',
    ...vars
  })
}

export function revealOnScroll(targets, options = {}) {
  if (!targets || prefersReducedMotion()) return
  gsap.from(targets, {
    opacity: 0,
    y: 28,
    duration: 0.72,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: options.trigger || targets,
      start: options.start || 'top 84%',
      once: options.once ?? true
    },
    ...options.vars
  })
}

export function attachHoverLift(elements, options = {}) {
  if (!elements || prefersReducedMotion()) return () => {}

  const list = Array.from(elements)
  const enter = (event) => {
    gsap.to(event.currentTarget, {
      y: options.y ?? -6,
      scale: options.scale ?? 1.01,
      duration: options.duration ?? 0.28,
      ease: 'power2.out'
    })
  }
  const leave = (event) => {
    gsap.to(event.currentTarget, {
      y: 0,
      scale: 1,
      duration: 0.36,
      ease: 'power2.out'
    })
  }

  list.forEach((element) => {
    element.addEventListener('mouseenter', enter)
    element.addEventListener('mouseleave', leave)
  })

  return () => {
    list.forEach((element) => {
      element.removeEventListener('mouseenter', enter)
      element.removeEventListener('mouseleave', leave)
    })
  }
}

/* ===== Magnetic buttons — 跟随鼠标偏移 ===== */
export function attachMagneticButtons(elements, options = {}) {
  if (!elements || prefersReducedMotion()) return () => {}
  const strength = options.strength ?? 12
  const list = Array.from(elements)
  const onMove = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(el, {
      x: (x / rect.width) * strength,
      y: (y / rect.height) * strength,
      duration: 0.4, ease: 'power2.out', overwrite: 'auto'
    })
  }
  const onLeave = (e) => {
    gsap.to(e.currentTarget, {
      x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)'
    })
  }
  list.forEach(el => {
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
  })
  return () => {
    list.forEach(el => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    })
  }
}

/* ===== 鼠标跟随光晕 ===== */
export function attachMouseGlow(glowEl, containerEl, options = {}) {
  if (!glowEl || !containerEl || prefersReducedMotion()) return () => {}
  const size = options.size ?? 30
  const onMove = (e) => {
    const rect = containerEl.getBoundingClientRect()
    gsap.to(glowEl, {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
      duration: 1.2, ease: 'power3.out', overwrite: 'auto'
    })
  }
  containerEl.addEventListener('pointermove', onMove)
  return () => containerEl.removeEventListener('pointermove', onMove)
}

export { gsap, ScrollTrigger }
