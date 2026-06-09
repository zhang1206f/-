<template>
  <div class="tools-page">
    <!-- 工具导航 -->
    <div class="tools-nav">
      <button
        v-for="tool in tools"
        :key="tool.id"
        class="tool-tab"
        :class="{ active: activeTool === tool.id }"
        @click="activeTool = tool.id"
      >
        <span class="tool-icon" v-html="tool.icon"></span>
        <span class="tool-name">{{ tool.name }}</span>
      </button>
    </div>

    <CodeFormatter v-show="activeTool === 'formatter'" />
    <ColorConverter v-show="activeTool === 'color'" />
    <TimestampConverter v-show="activeTool === 'timestamp'" />
    <SalaryCalculator v-show="activeTool === 'salary'" />
    <MarkdownPreview v-show="activeTool === 'markdown'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodeFormatter from './tools/CodeFormatter.vue'
import ColorConverter from './tools/ColorConverter.vue'
import TimestampConverter from './tools/TimestampConverter.vue'
import SalaryCalculator from './tools/SalaryCalculator.vue'
import MarkdownPreview from './tools/MarkdownPreview.vue'

const tools = [
  {
    id: 'formatter',
    name: '代码格式化',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>'
  },
  {
    id: 'color',
    name: '颜色转换',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" /></svg>'
  },
  {
    id: 'timestamp',
    name: '时间戳转换',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>'
  },
  {
    id: 'salary',
    name: '工资计算器',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>'
  },
  {
    id: 'markdown',
    name: 'Markdown 预览',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>'
  }
]

const activeTool = ref('formatter')
</script>

<style scoped>
.tools-page {
  padding: 16px 0;
  max-width: 900px;
  margin: 0 auto;
}

.tools-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tool-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tool-tab:hover {
  background: var(--surface-strong);
  color: var(--text-heading);
}

.tool-tab.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.tool-icon {
  display: flex;
  align-items: center;
}

.tool-name {
  font-size: 14px;
  font-weight: 600;
}

/* 通用按钮样式 */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-strong);
  transform: translateY(-2px);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-muted);
  color: var(--text-muted);
  border: 1px solid var(--line);
}

.btn-ghost:hover {
  color: var(--text-heading);
  border-color: var(--line-strong);
}

.btn-pause {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--line);
  background: var(--bg-muted);
  color: var(--text-heading);
}

.btn-pause:hover {
  border-color: var(--primary);
}

@media (max-width: 640px) {
  .tools-nav {
    gap: 4px;
  }
  .tool-tab {
    padding: 8px 12px;
    font-size: 13px;
  }
  .tool-name {
    display: none;
  }
}
</style>

<!-- 非 scoped 样式：供子组件使用的共享样式 -->
<style>
.tool-panel {
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
}

.tool-header {
  margin-bottom: 24px;
}

.tool-header h2 {
  font-size: 24px;
  color: var(--text-heading);
  margin-bottom: 8px;
}

.tool-desc {
  color: var(--text-muted);
  font-size: 14px;
}
</style>
