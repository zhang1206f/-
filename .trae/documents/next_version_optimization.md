# 清风博客 v2.0 优化计划

## Summary

对个人博客项目进行全方位优化，涵盖**代码架构重构**、**视觉交互提升**、**功能增强**三个维度。核心变更包括：拆分巨型组件、统一 Markdown 渲染（markdown-it + shiki）、消除重复代码、增强移动端体验、完善全局 UI 组件。

---

## Phase 1: 依赖安装与基础设施

### 1.1 安装新依赖

```bash
npm install markdown-it shiki
```

### 1.2 创建统一 Markdown 解析 composable

**文件**: `src/composables/useMarkdown.js`（新建）

- 使用 `markdown-it` 作为解析引擎
- 配置 `markdown-it` 选项：启用 HTML、链接新标签打开、自定义 heading 生成规则（支持中文标题的 id 生成）
- 集成 `shiki` 作为代码高亮后端，使用 `dracula` 主题（与深色主题匹配）
- 使用 `createMarkdownIt()` 函数，支持传入 `{ darkMode: boolean }` 以适配亮/暗主题切换
- 导出 `renderMarkdown(content)` 函数供各组件使用

---

## Phase 2: 代码架构重构

### 2.1 Tools.vue 拆分为独立子组件

**文件**: `src/views/Tools.vue` → 拆分为 6 个文件

当前 Tools.vue 约 770 行，包含 5 个完全独立的工具。拆分方案：

| 新文件 | 内容 | 大致行数 |
|--------|------|----------|
| `src/views/tools/CodeFormatter.vue` | 代码格式化器 | ~100 |
| `src/views/tools/ColorConverter.vue` | 颜色转换器 | ~200 |
| `src/views/tools/TimestampConverter.vue` | 时间戳转换器 | ~100 |
| `src/views/tools/SalaryCalculator.vue` | 工资计算器 | ~150 |
| `src/views/tools/MarkdownPreview.vue` | Markdown 预览器 | ~150 |
| `src/views/Tools.vue` | 工具页容器（保留导航+工具面板切换） | ~100 |

**具体做法**：
- `Tools.vue` 保留工具列表导航面板和 `activeTool` 切换逻辑
- 每个工具组件独立管理自己的数据和交互
- 工具页容器通过 `v-show` 控制面板切换（保持状态不丢失）
- 每个工具组件内部使用统一的 `useMarkdown`（仅 MarkdownPreview）

### 2.2 统一 Markdown 渲染

**受影响文件**:
- `src/views/ArticleDetail.vue` — 删除手写正则 `renderedContent`，改用 `useMarkdown`
- `src/views/tools/MarkdownPreview.vue`（新文件）— 使用 `useMarkdown` 替换手写 `parseMarkdown`

**具体做法**:
- `ArticleDetail.vue` 中：
  - 删除第 282-306 行的 `renderedContent` 计算属性中的手写正则
  - 导入 `useMarkdown` 并调用 `renderMarkdown(article.value.content)`
  - `useToc` 的提取逻辑改为从 markdown-it 的 tokens 中提取 heading，而非从 HTML 正则匹配
  - 确保 h2-h6 都支持（当前仅 h1-h3）
- `MarkdownPreview.vue` 中：
  - 删除 `parseMarkdown` 函数，改用 `useMarkdown` 的 `renderMarkdown`

### 2.3 消除返回顶部按钮重复

**受影响文件**:
- `src/views/Archive.vue` — 删除页面级 `.back-top-btn` 实现

**具体做法**:
- 删除 Archive.vue 中的 `showBackTop`、`handleBackTop`、`.back-top-btn` 样式
- 依赖 Layout.vue 的全局返回顶部按钮（已功能完整）
- 如 Archive 页面有特殊的返回顶部按钮视觉需求，在 Layout 中统一配置

### 2.4 消除按钮样式重复

**受影响文件**:
- `src/views/tools/CodeFormatter.vue` 等工具组件

**具体做法**:
- 新拆分的工具组件不再在 scoped 样式中重新定义 `btn-primary`、`btn-ghost` 等全局已有的按钮类
- 直接使用 `style.css` 中的全局按钮类

---

## Phase 3: 视觉与交互提升

### 3.1 alert() 替换为 Toast 提示

**受影响文件**:
- `src/views/tools/CodeFormatter.vue` — `alert('已复制到剪贴板')`
- `src/views/tools/ColorConverter.vue` — 复制操作
- `src/views/tools/TimestampConverter.vue` — 复制操作
- `src/views/tools/SalaryCalculator.vue` — 复制操作

**具体做法**:
- 在 `src/components/` 中创建轻量 `Toast.vue` 组件（支持 show/hide + 自动消失）
- 或使用一个简单的 composable `useToast.js`，通过 `createApp` 动态挂载 toast DOM
- 保持实现简洁，不引入额外依赖

### 3.2 移动端体验增强

**受影响文件**:
- `src/views/Home.vue`
- `src/components/Layout.vue`

**具体做法**:

**Home.vue**:
- Hero 区域移动端 `min-height` 从 `calc(100vh - 72px)` 调整为 `auto`（或较小值），减少首屏空白
- `.latest-section` 的 `line-height: 1px` 修复为正常值
- `.latest-section` 的 `border-radius: 9px` 统一为 `var(--radius-lg)`

**Layout.vue**:
- `.mobile-panel` 增加过渡动画（`max-height` + `opacity` + `transform`），替代当前的 `display` 直接切换
- Footer 版权年份从硬编码 `2026` 改为 `new Date().getFullYear()` 动态计算

### 3.3 全局样式清理

**受影响文件**: `src/style.css`

**具体做法**:
- 删除重复变量 `--primary-main`（与 `--primary` 值相同，保留 `--primary`）
- 删除 `.lazy-loading`/`.lazy-loaded`/`.lazy-error` 未使用的样式类（或保留但添加注释说明为预留）
- 删除 `.nav-cta` 未使用的样式
- 确认 `.dark body` 选择器是否正确（根据实际 `.dark` 类放置位置修复）
- `body::before` 网格装饰在 `prefers-reduced-motion` 时隐藏

---

## Phase 4: 功能增强

### 4.1 文章详情页增强

**受影响文件**: `src/views/ArticleDetail.vue`

**具体做法**:
- 将 `article` 查找改为 `computed`，响应 `route.params.id` 变化（支持同页面切换文章）
- 代码块使用 shiki 高亮后，添加"复制代码"按钮（每个代码块右上角）
- TOC 提取范围从 h2-h3 扩展为 h2-h6
- 修复 768-1080px 断点区间的 TOC 显示问题（保持 sticky 而非 static）

### 4.2 搜索体验优化

**受影响文件**: `src/views/Articles.vue`

**具体做法**:
- 搜索输入框添加清除按钮（X 图标），方便一键清空
- `searchText` 与 `activeTag` 解耦：标签筛选使用独立的 `activeTag` 过滤逻辑，不再写入 `searchText`
- `filteredArticles` 计算属性中同时使用 `searchText` 和 `activeTag` 进行过滤

### 4.3 About 页数据动态化

**受影响文件**: `src/views/About.vue`

**具体做法**:
- 社交链接中的 `https://github.com` 占位值替换为说明注释（或使用 `#` 占位并添加 TODO 注释）
- 移除 `a-avatar` 组件，改用纯 CSS 圆形头像
- 技能进度条增加入场动画（从 0 增长到目标值）
- 时间线颜色使用数据中的 `color` 字段动态绑定，删除 `line-0` 到 `line-4` 硬编码类

### 4.4 工资计算器精度修复

**受影响文件**: `src/views/tools/SalaryCalculator.vue`（新文件）

**具体做法**:
- `earned.value += rate` 累加方式改为基于 `Date.now()` 差值计算，避免长时间运行的浮点精度漂移

---

## Phase 5: 代码清理与收尾

### 5.1 清理残留代码

| 清理项 | 文件 | 说明 |
|--------|------|------|
| `console.error` | Tools.vue 拆分后的各组件 | 替换为静默处理或保留仅在开发环境 |
| 硬编码年份 | Layout.vue L140 | `new Date().getFullYear()` |
| 未使用 SVG 导入 | Home.vue | `vite.svg`、`vue.svg` 仅在 Hero 临时展示 |

### 5.2 Archive.vue 清理

- 删除冗余的回到顶部实现
- `groupRefs` 回调 ref 逻辑简化

### 5.3 更新项目文档

更新 `.trae/documents/check_list.md` 中的进度状态，反映实际完成情况。

---

## Assumptions & Decisions

1. **shiki 使用 `dracula` 主题**：与项目深色玻璃拟态风格最匹配，浅色模式下切换为 `github-light`
2. **Toast 组件纯实现**：不引入 ant-design-vue 的 message/notification，保持轻量
3. **不引入 TypeScript**：保持现有 JavaScript 技术栈
4. **不迁移数据层到 API**：本次优化聚焦于前端代码质量和体验，数据层保持 mock
5. **markdown-it + shiki 异步加载**：使用动态 import 避免影响首屏加载性能
6. **工具组件切换使用 `v-show`**：保持各工具的状态（输入内容等）在切换时不丢失

---

## Verification Steps

1. `npm run build` 确认生产构建无错误
2. `npm run dev` 启动开发服务器，逐页检查：
   - 首页：Hero 响应式、统计面板、标签云点击跳转
   - 文章列表：搜索、标签筛选、URL query 同步
   - 文章详情：Markdown 渲染（含表格、列表、代码块高亮）、TOC 导航、代码复制按钮
   - 归档页：时间轴显示、年份导航、返回顶部
   - 工具页：5 个工具功能正常、Toast 提示正常
   - 关于页：进度条动画、社交链接
3. 移动端（768px 以下）检查所有页面响应式
4. 主题切换（深色/浅色）检查所有页面
5. ESLint 检查：`npm run lint` 无错误

---

**文档版本**: v2.0  
**创建日期**: 2026-06-09  
**适用项目**: my-vue 个人博客
