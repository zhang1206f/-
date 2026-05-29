import { ref } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const saved = localStorage.getItem('theme')

  if (saved === 'dark' || (!saved && mq.matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return { isDark, toggleTheme }
}
