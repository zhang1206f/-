import { computed, ref } from 'vue'

const THEME_KEY = 'theme'
const isDark = ref(false)
const initialized = ref(false)

function resolveInitialTheme() {
  if (typeof window === 'undefined') return true

  const saved = window.localStorage.getItem(THEME_KEY)
  if (saved === 'light') return false
  if (saved === 'dark') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(dark) {
  if (typeof document === 'undefined') return

  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  window.localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
}

export function useTheme() {
  if (!initialized.value) {
    initialized.value = true
    applyTheme(resolveInitialTheme())
  }

  const themeLabel = computed(() => (isDark.value ? '暗色模式' : '浅色模式'))

  const toggleTheme = () => {
    applyTheme(!isDark.value)
  }

  return {
    isDark,
    themeLabel,
    toggleTheme,
    setTheme: applyTheme
  }
}
