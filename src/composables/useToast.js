const activeToasts = []

function recalcPositions() {
  let offset = 28
  for (const t of activeToasts) {
    t.style.bottom = offset + 'px'
    offset += t.offsetHeight + 10
  }
}

export function useToast() {
  const showToast = (message, duration = 2000) => {
    const el = document.createElement('div')
    el.className = 'app-toast'
    el.textContent = message

    // Inline styles matching the project's glassmorphism design system
    Object.assign(el.style, {
      position: 'fixed',
      bottom: '28px',
      left: '50%',
      transform: 'translateX(-50%) translateY(16px)',
      zIndex: '200',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      maxWidth: '90vw',
      padding: '14px 24px',
      borderRadius: '14px',
      background: 'var(--gradient-panel)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-sm)',
      color: 'var(--text-heading)',
      fontSize: '14px',
      fontWeight: '600',
      lineHeight: '1.5',
      whiteSpace: 'nowrap',
      opacity: '0',
      transition: 'opacity 300ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), bottom 300ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      pointerEvents: 'none',
    })

    document.body.appendChild(el)
    activeToasts.push(el)
    recalcPositions()

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateX(-50%) translateY(0)'
      })
    })

    // Remove after duration
    setTimeout(() => {
      el.style.opacity = '0'
      el.style.transform = 'translateX(-50%) translateY(16px)'
      setTimeout(() => {
        const idx = activeToasts.indexOf(el)
        if (idx !== -1) activeToasts.splice(idx, 1)
        el.remove()
        recalcPositions()
      }, 300)
    }, duration)
  }

  return { showToast }
}
