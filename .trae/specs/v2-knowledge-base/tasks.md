# Tasks

- [x] Task 1: 引入 Pinia 状态管理基础架构
  - [x] SubTask 1.1: 安装 pinia 依赖
  - [x] SubTask 1.2: 在 main.js 中注册 Pinia 插件
  - [x] SubTask 1.3: 创建 `src/stores/articles.js` 文章 store，包含完整的 CRUD actions 和 localStorage 持久化逻辑
  - [x] SubTask 1.4: 创建 `src/stores/categories.js` 分类 store，包含分类 CRUD actions 和 localStorage 持久化逻辑
  - [x] SubTask 1.5: 将 `src/mock/articles.js` 中的初始数据迁移到 store 作为默认数据

- [x] Task 2: 扩展文章数据模型与 mock 数据迁移
  - [x] SubTask 2.1: 在 articles store 中为现有 5 篇文章补充新字段（category、status、updatedAt、sortOrder、coverImage）
  - [x] SubTask 2.2: 为现有文章预设默认分类（如：Vue 实战、工程化、CSS、JavaScript）
  - [x] SubTask 2.3: 创建默认分类数据，包含名称和图标

- [x] Task 3: 构建文章编辑器页面
  - [x] SubTask 3.1: 创建 `src/views/Editor.vue` 页面，使用左右分栏布局（左侧编辑区、右侧实时预览）
  - [x] SubTask 3.2: 实现文章元数据表单（标题、摘要、分类下拉、标签输入、封面色选择）
  - [x] SubTask 3.3: 实现 Markdown 编辑区域，复用现有 `useMarkdown.js` composable 做实时渲染
  - [x] SubTask 3.4: 实现"保存草稿"和"发布"按钮逻辑，分别设置文章状态并保存
  - [x] SubTask 3.5: 支持通过路由参数识别新建模式（`/editor/new`）和编辑模式（`/editor/:id`）
  - [x] SubTask 3.6: 添加编辑器页面的 GSAP 入场动画，保持与现有设计风格一致

- [x] Task 4: 构建文章管理后台页面
  - [x] SubTask 4.1: 创建 `src/views/Admin.vue` 页面，展示所有文章的表格列表
  - [x] SubTask 4.2: 实现状态筛选功能（全部/草稿/已发布/已归档），使用自定义 Tab 组件
  - [x] SubTask 4.3: 实现文章编辑跳转（点击编辑跳转到 `/editor/:id`）
  - [x] SubTask 4.4: 实现文章删除功能（带确认弹窗）
  - [x] SubTask 4.5: 实现快速状态切换（下拉切换草稿/发布/归档）
  - [x] SubTask 4.6: 实现"新建文章"按钮，跳转到 `/editor/new`
  - [x] SubTask 4.7: 添加管理后台页面的动画和响应式适配

- [x] Task 5: 构建分类管理功能
  - [x] SubTask 5.1: 在 Admin 页面中添加"分类管理"标签页或入口
  - [x] SubTask 5.2: 实现分类列表展示（名称、图标、文章数量）
  - [x] SubTask 5.3: 实现分类的新增、编辑、删除操作（使用 Teleport Modal）
  - [x] SubTask 5.4: 在文章编辑器的分类下拉中联动展示分类列表

- [x] Task 6: 路由配置与导航整合
  - [x] SubTask 6.1: 在 `src/router/index.js` 中新增 `/editor/new`、`/editor/:id`、`/admin` 路由
  - [x] SubTask 6.2: 在导航栏（Layout.vue）中添加"管理"入口链接
  - [x] SubTask 6.3: 将新增页面组件设为懒加载，与其他路由保持一致

- [x] Task 7: 更新现有页面以适配新数据源
  - [x] SubTask 7.1: 修改 Home.vue，从 Pinia store 获取文章并过滤 `status === 'published'`
  - [x] SubTask 7.2: 修改 Articles.vue，从 Pinia store 获取文章
  - [x] SubTask 7.3: 修改 ArticleDetail.vue，从 Pinia store 根据 id 获取文章
  - [x] SubTask 7.4: 修改 Archive.vue，从 Pinia store 获取文章
  - [x] SubTask 7.5: 修改首页统计面板数据来源为 store（文章数仅统计已发布）

- [x] Task 8: 数据导入导出功能
  - [x] SubTask 8.1: 在 Admin 页面实现"导出数据"按钮，将文章和分类数据序列化为 JSON 并触发浏览器下载
  - [x] SubTask 8.2: 在 Admin 页面实现"导入数据"按钮，通过文件选择器上传 JSON，解析后合并到 store
  - [x] SubTask 8.3: 导入时进行数据校验，提示导入结果（成功数、跳过数）

- [x] Task 9: UI 风格对齐与动画整合
  - [x] SubTask 9.1: 确保编辑器和管理后台的视觉风格与现有设计系统（CSS 变量）一致
  - [x] SubTask 9.2: 为管理后台添加 GSAP 入场动画
  - [x] SubTask 9.3: 适配亮色/暗色主题切换
  - [x] SubTask 9.4: 确保所有新页面响应式适配（1080px/768px/640px 断点）

# Task Dependencies

- Task 2 依赖 Task 1（需要 store 基础架构）
- Task 3 依赖 Task 1（编辑器需要调用 store）
- Task 4 依赖 Task 1（管理页面需要调用 store）
- Task 5 依赖 Task 1（分类管理需要分类 store）
- Task 6 依赖 Task 3、Task 4（路由需要页面组件存在）
- Task 7 依赖 Task 1（现有页面需要切换到 store 数据源）
- Task 8 依赖 Task 1（导入导出操作 store 数据）
- Task 9 依赖 Task 3、Task 4、Task 5（UI 对齐需要页面存在）
