import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('ant-design-vue') || id.includes('@ant-design/icons-vue')) {
            return 'ant-design-vue'
          }
          if (id.includes('echarts') || id.includes('vue-echarts')) {
            return 'echarts'
          }
          if (id.includes('gsap')) {
            return 'gsap'
          }
          if (id.includes('@vercel/speed-insights')) {
            return 'vercel-insights'
          }
        },
        assetFileNames: 'assets/[name].[hash:8][extname]',
        chunkFileNames: 'assets/[name].[hash:8].js',
        entryFileNames: 'assets/[name].[hash:8].js'
      }
    },
    minify: 'terser',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    assetsInlineLimit: 4096,
    outDir: 'dist'
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'gsap'],
    exclude: ['echarts']
  }
})
