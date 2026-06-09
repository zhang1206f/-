<template>
  <a-config-provider :theme="antdTheme">
    <Layout />
    <SpeedInsights />
  </a-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import { theme as antdThemeEngine } from 'ant-design-vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import Layout from './components/Layout.vue'
import { useTheme } from './composables/useTheme'

const { isDark } = useTheme()

const antdTheme = computed(() => ({
  algorithm: isDark.value ? antdThemeEngine.darkAlgorithm : antdThemeEngine.defaultAlgorithm,
  token: {
    colorPrimary: '#6d7cff',
    borderRadius: 18,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    boxShadowSecondary: isDark.value
      ? '0 24px 80px rgba(15, 23, 42, 0.46)'
      : '0 24px 80px rgba(15, 23, 42, 0.14)'
  }
}))
</script>
