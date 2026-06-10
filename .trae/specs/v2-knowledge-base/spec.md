# V2.0 知识库系统 Spec

## Why
当前博客文章全部硬编码在 `src/mock/articles.js` 中，无法动态增删改查。V2.0 目标是让博客作者可以通过交互式界面自主管理文章内容，构建个人知识库体系。

## What Changes
- 引入 Pinia 状态管理，替代硬编码 mock 数据
- 新增文章编辑器页面，支持 Markdown 实时预览编辑
- 新增文章管理后台页面（文章列表 CRUD 操作）
- 新增知识库分类体系（多级标签/分类树管理）
- 新增文章草稿系统（草稿、已发布、已归档状态流转）
- 新增本地持久化存储（localStorage），数据导入导出功能
- 文章数据模型扩展，支持分类、状态、排序等元数据
- 优化文章列表页，支持分类筛选和更丰富的搜索

## Impact
- Affected specs: 文章 CRUD、分类体系、草稿系统、数据持久化
- Affected code:
  - `src/mock/articles.js` → 迁移为 Pinia store + localStorage
  - `src/router/index.js` → 新增编辑器和管理路由
  - `src/views/` → 新增 Editor.vue、Admin.vue 页面
  - `src/components/` → 新增 Editor、ArticleForm 等组件
  - 新增 `src/stores/` 目录存放 Pinia store

## ADDED Requirements

### Requirement: Pinia 状态管理
系统 SHALL 引入 Pinia 作为状态管理方案，将文章数据从 mock 硬编码迁移至 store 管理。

#### Scenario: 数据初始化
- **WHEN** 应用首次加载
- **THEN** 从 localStorage 读取已有数据；若无数据则使用当前 5 篇 mock 文章作为初始数据

#### Scenario: 数据持久化
- **WHEN** 文章数据发生任何变更（增删改）
- **THEN** 自动同步写入 localStorage

### Requirement: 文章编辑器
系统 SHALL 提供富文本 Markdown 编辑器，支持文章的创建和编辑。

#### Scenario: 创建新文章
- **WHEN** 用户点击"新建文章"
- **THEN** 打开编辑器页面，提供标题、摘要、标签、分类、封面色、正文（Markdown）输入区域，并支持实时预览

#### Scenario: 编辑已有文章
- **WHEN** 用户在管理列表中点击某篇文章的编辑按钮
- **THEN** 打开编辑器页面，预填充该文章的所有现有数据，允许修改并保存

#### Scenario: 保存草稿
- **WHEN** 用户点击"保存草稿"
- **THEN** 文章以草稿状态保存到 store 和 localStorage，不显示在公开文章列表中

#### Scenario: 发布文章
- **WHEN** 用户点击"发布"
- **THEN** 文章以已发布状态保存，出现在公开文章列表和首页中

### Requirement: 文章管理后台
系统 SHALL 提供文章管理界面，支持对所有文章的查看、编辑、删除和状态管理。

#### Scenario: 查看文章列表
- **WHEN** 用户进入管理后台
- **THEN** 显示所有文章列表（含状态标签），支持按状态（草稿/已发布/已归档）筛选

#### Scenario: 删除文章
- **WHEN** 用户点击某篇文章的删除按钮并确认
- **THEN** 该文章从 store 和 localStorage 中永久移除

#### Scenario: 文章状态变更
- **WHEN** 用户将已发布文章改为草稿或归档
- **THEN** 文章状态立即更新，公开列表同步变化

### Requirement: 分类与标签体系
系统 SHALL 提供灵活的文章分类和标签管理能力。

#### Scenario: 分类管理
- **WHEN** 用户进入分类管理界面
- **THEN** 可以创建、编辑、删除文章分类，每个分类包含名称和图标

#### Scenario: 文章关联分类
- **WHEN** 用户编辑文章时选择分类
- **THEN** 文章可归属一个分类，文章列表支持按分类筛选

### Requirement: 数据导入导出
系统 SHALL 支持知识库数据的导入和导出。

#### Scenario: 导出数据
- **WHEN** 用户点击"导出数据"
- **THEN** 将所有文章和分类数据导出为 JSON 文件下载

#### Scenario: 导入数据
- **WHEN** 用户上传 JSON 数据文件
- **THEN** 解析并合并（或替换）现有数据，提示导入结果

## MODIFIED Requirements

### Requirement: 文章数据模型
在现有数据结构基础上扩展以下字段：

```javascript
{
  // 现有字段保留
  id, title, date, views, coverColor, summary, tags, content, recommendation, readingTime,
  // 新增字段
  category: String,        // 所属分类
  status: 'draft' | 'published' | 'archived',  // 文章状态
  updatedAt: String,       // 最后更新时间
  sortOrder: Number,       // 排序权重
  coverImage: String,      // 封面图片 URL（可选）
}
```

### Requirement: 首页展示逻辑
**MODIFIED** 首页仅展示 `status === 'published'` 的文章。

### Requirement: 文章列表筛选
**MODIFIED** 文章列表页增加按分类筛选功能，与现有标签筛选并列。

## REMOVED Requirements
无
