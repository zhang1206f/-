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

export { gsap, ScrollTrigger }
