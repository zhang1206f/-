function readingTime(text) {
  const words = text.replace(/```[\s\S]*?```/g, '').length
  return Math.max(1, Math.ceil(words / 400))
}

const rawArticles = [
  {
    id: 1,
    title: '从 Options API 到 Composition API：我为什么最终选择了它',
    date: '2026-05-15',
    views: 1286,
    coverColor: '#1890ff',
    summary: '去年在一家中厂做后台管理项目，代码量爆炸后 options api 的 mixin 让我彻底崩溃。这篇文章不讲大道理，聊聊我迁移的真实感受和遇到的坑。',
    tags: ['Vue', '前端', '经验分享'],
    content: `去年接手了一个用 Vue 2 写的中型后台项目，代码量大概 200+ 个组件。一开始还觉得挺清晰的，但随着迭代加速，问题开始浮现——特别是 mixin 带来的噩梦。

## 为什么要换？

先说说 mixin 有多坑。我们有三个 mixin，分别处理表格分页、表单校验和权限控制。看似挺好的分工对吧？实际用起来：

- 命名冲突：mixin A 定义了 \`handleSubmit\`，mixin B 也定义了 \`handleSubmit\`，合并后谁会生效得靠猜
- 来源不明：在模板里看到一个 \`tableData\`，你根本不知道它是来自哪个 mixin 的，得去翻代码
- 逻辑交织：分页逻辑和筛选逻辑散布在 mixin 和组件之间，改一个分页就要同时改好几处

几次线上 bug 追下来，我决定——**重构**。

## 迁移过程

我们选的方案是 Vue 3 + Composition API，渐进式迁移，不是一口气重写。

### 1. 先改工具函数

把 mixin 里的逻辑拆成独立的 composable：

\`\`\`javascript
// usePagination.js
import { ref, computed } from 'vue'

export function usePagination(fetchFn) {
  const current = ref(1)
  const pageSize = ref(20)
  const total = ref(0)

  const pagination = computed(() => ({
    current: current.value,
    pageSize: pageSize.value,
    total: total.value,
    onChange: (page) => { current.value = page; fetchFn() }
  }))

  return { current, pageSize, total, pagination }
}
\`\`\`

### 2. 组件内使用

\`\`\`vue
<script setup>
import { usePagination } from '../composables/usePagination'
import { useFormValidation } from '../composables/useFormValidation'

const { pagination, total } = usePagination(fetchUsers)
const { formState, rules, validate } = useFormValidation()
</script>
\`\`\`

简洁太多了。每个 composable 暴露什么、不暴露什么，清清楚楚。

## 真实感受

**好的方面：**

- **代码可读性大幅提升** — 看到 \`setup\` 里的导入，就知道这个组件用了哪些能力
- **TypeScript 支持好太多** — 不用再写一堆 \`Vue.extend\` 的类型体操
- **逻辑复用不再是玄学** — composable 就是个函数，组合、传参、返回值都是 JS 基本功

**踩过的坑：**

- **\[\`watch\` 的坑\]** — 不要直接 watch 一个 reactive 对象的属性，要传 getter 函数
- **生命周期** — 记得 \`onUnmounted\` 清理定时器和事件监听，不然内存泄漏等着你
- **过度抽象** — 刚开始的时候我把什么都抽成 composable，反而增加了理解成本。后来才学会：够用就好

## 总结

Composition API 不是银弹，但对于中大型项目来说，它确实让代码组织上了一个台阶。如果你还在犹豫，我的建议是：从一个小模块开始尝试，不要一上来就全部重写。`,
    recommendation: '如果你正在做 Vue 2 到 Vue 3 的迁移，这篇文章应该能帮你少走一些弯路。'
  },
  {
    id: 2,
    title: '用 Vite 替换 Webpack 后，我的开发体验发生了这些变化',
    date: '2026-05-10',
    views: 954,
    coverColor: '#52c41a',
    summary: '之前一直用 Webpack，觉得启动慢是正常的。直到有天同事让我试试 Vite……半小时后我就把新项目的构建工具换了。',
    tags: ['Vite', '构建工具', '体验'],
    content: `说实话，之前我对构建工具没什么太大感觉。Webpack 从 4 用到 5，启动 30 秒、热更新 3-5 秒，我甚至觉得"前端项目嘛，就这样"。

直到有次接了个新项目，用 Vite 初始化之后，当场愣住了。

## 第一印象

执行 \`npm create vite\`，装完依赖，\`npm run dev\`——

**1.2 秒**。

对，你没看错，1.2 秒。我当时第一反应是："不会是没编译吧？"然后点了页面，能正常访问。

再试个热更新，改一行代码，保存，**几乎瞬时的**。没有 Webpack 那种"嘶——"的编译声，没有等待，编辑器保存，浏览器已经刷新了。

## 为什么 Vite 能这么快？

这个问题的答案其实不复杂：

- **开发环境用原生 ESM** — 浏览器自己去加载模块，Vite 只做按需编译
- **预构建用 esbuild** — 用 Go 写的打包器，比 Webpack 用的 JS 打包快几十倍
- **生产环境用 Rollup** — 打包出来的产物同样经过 Tree-shaking 和代码分割

所以开发模式不用先把整个项目打包一遍，你改了哪个文件，它就只重新编译那一个。

## 实际项目中的表现

说几个让我印象深刻的场景：

### 场景 1：启动大型项目

我们有个比较老的项目，Webpack 启动要 45 秒，Vite 大概 3-4 秒（第一次需要预构建依赖）。同事开玩笑说："以前启动之后可以先去接杯水，现在水还没倒好项目就能用了。"

### 场景 2：CSS 热更新

在 Webpack 里改 CSS，偶尔会遇到热更新失效，得手动刷新。Vite 里目前还没遇到过 CSS 热更新失效的情况，甚至 \`.vue\` 文件里样式部分的更新也是几乎即时的。

### 场景 3：TypeScript

Vite 本身不做类型检查，它用 esbuild 做 transpile，速度比 tsc 快很多。类型检查交给 \`vue-tsc\` 在构建时或者编辑器层面做。一开始有点不习惯，但用久了觉得——这其实更合理，开发时速度优先，构建时再做完整检查。

## 有没有缺点？

当然有，说实话比较好：

- **生产构建偶尔有兼容性问题** — 需要配置 \`target\` 和 polyfill，IE 用户基本告别了
- **插件生态相对 Webpack 少一些** — 虽然核心插件都够用，但某些小众需求还是 Webpack 有现成的
- **大项目的第一次预构建** — 虽然只有一次，但依赖多了还是会等一会儿

## 我的建议

新项目直接用 Vite，不要犹豫。老项目如果不急着重构，可以先在小模块里试试。对我来说，Vite 属于那种"用过了就回不去"的工具。`,
    recommendation: '如果你还在犹豫 Vite 值不值得换，建议花半小时试试，可能就回不去了。'
  },
  {
    id: 3,
    title: 'Ant Design Vue 4.x 主题定制：从入门到生产实践',
    date: '2026-05-05',
    views: 723,
    coverColor: '#722ed1',
    summary: '公司要求换主题色，以前用 less 变量覆写的方式太痛苦了。4.x 的 CSS 变量方案让我眼前一亮，但也踩了几个坑。',
    tags: ['Ant Design Vue', 'UI 组件', 'CSS'],
    content: `去年年底我们拿到了一个新项目，甲方要求支持**品牌色自定义**。简单来说，就是不同的客户进来看到的主题色不一样。

如果用 Ant Design Vue 3.x，这个需求基本只能靠覆盖 less 变量来做——每个客户打包一份不同主题的产物，想想就头疼。

好在 4.x 版本终于支持了 **CSS 变量方案**，彻底解决了这个问题。

## 快速开始

首先确认你用的是 ant-design-vue 4.x：

\`\`\`bash
npm install ant-design-vue@4
\`\`\`

### 全局配置

\`\`\`javascript
import { createApp } from 'vue'
import { ConfigProvider } from 'ant-design-vue'

const app = createApp(App)
app.use(ConfigProvider)
\`\`\`

### CSS 变量覆盖

4.x 不再需要 less 变量覆盖了，直接写 CSS：

\`\`\`css
:root {
  --ant-primary-color: #ff6b35;
  --ant-primary-color-hover: #ff8a5c;
  --ant-primary-color-active: #e55a2b;
  --ant-primary-color-outline: rgba(255, 107, 53, 0.1);
  --ant-primary-1: #fff2ed;
  --ant-primary-2: #ffdcc9;
}
\`\`\`

就是这么简单。所有组件的主色调全变了。

## 实践中的坑

### 1. 主题动态切换

我们要做到运行时无刷新切换主题：

\`\`\`javascript
function setTheme(color) {
  const root = document.documentElement
  root.style.setProperty('--ant-primary-color', color)
  root.style.setProperty('--ant-primary-color-hover', lighten(color, 10))
  root.style.setProperty('--ant-primary-color-active', darken(color, 10))
}
\`\`\`

这里注意 \`lighten\` 和 \`darken\` 要自己实现或用颜色库，Ant Design 没有提供内置工具函数。

### 2. 自定义组件保持一致

项目里我们自己写的业务组件也要跟着主题走：

\`\`\`css
.my-custom-button {
  background: var(--ant-primary-color);
  border-color: var(--ant-primary-color);
}
\`\`\`

这样切换主题的时候自定义组件也会自动变色。

### 3. dark mode 支持

4.x 的暗色模式可以通过 \`ConfigProvider\` 配置：

\`\`\`vue
<template>
  <a-config-provider :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>
\`\`\`

但 CSS 变量方式在暗色模式下需要额外处理，建议结合 CSS 的 \`prefers-color-scheme\` 媒体查询 + JS 手动控制双管齐下。

## 结语

从 less 变量到 CSS 变量，Ant Design Vue 的这套方案让主题定制变得真正可维护了。如果你还在用 3.x 的 less 覆盖方案，4.x 的升级绝对值得。`,
    recommendation: 'Ant Design Vue 4.x 的 CSS 变量方案是我升级的最大动力，强烈推荐。'
  },
  {
    id: 4,
    title: '一个困扰我两天的 CSS Grid 布局问题，最终解决方案很简单',
    date: '2026-04-28',
    views: 1568,
    coverColor: '#eb2f96',
    summary: '我以为自己对 Grid 已经够熟悉了，直到遇到这个"自动填充高度不一致"的问题。排查了两天，最后发现是漏了一个属性。',
    tags: ['CSS', 'Grid', '踩坑'],
    content: `前阵子在做一个新闻门户网站，首页的卡片网格布局用了 CSS Grid。需求很简单：左侧一栏是主文，右侧两栏放次要卡片。听起来就是 \`grid-template-columns: 2fr 1fr\` 的事情。

结果出来的效果让我懵逼——卡片的**高度不一致**，参差不齐，非常难看。

## 问题复现

简化一下，代码大概是这样：

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}
\`\`\`

左边的内容多，撑得高；右边的内容少，缩成一团。我试过 \`align-items: stretch\`、\`align-content\`，都不行。

后来上网查了才知道——Grid 的 \`stretch\` 默认就是生效的，但前提是子元素**没有显式的高度**。

我的每个卡片内部有一个图片占位，图片用了 \`height: auto\`，但容器没有设置高度，所以 Grid 也不知道应该撑到多少。

## 解决方案

其实就一行：

\`\`\`css
.grid-item {
  height: 100%;
}
\`\`\`

对，就是让每个 Grid 子元素显式地撑满父容器的高度。加上这个之后，所有卡片高度就一致了。

## 更多 Grid 技巧

这次踩坑之后，我又系统梳理了几个 Grid 容易忽略的点：

### 1. minmax 控制最小宽度

\`\`\`css
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
\`\`\`

这个组合超级实用——当屏幕变小但卡片宽度低于 300px 时自动折行。

### 2. auto-fill vs auto-fit

- \`auto-fill\`：即使没有内容，也保留空列
- \`auto-fit\`：没有内容的列会被折叠，占用的空间重新分配给其他列

这个区分我第一次看文档时完全没注意，后来在一次适配移动端的时候才搞明白。

### 3. grid-area 命名

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
\`\`\`

命名方式让布局结构一目了然，比数字索引好维护太多。

## 一点心得

CSS Grid 确实强大，但它的学习曲线比 Flexbox 陡一些。建议在实际项目中多用，踩几次坑就熟悉了。`,
    recommendation: 'Grid 的属性很多，不用一次性全记住，遇到问题再查文档就好。'
  },
  {
    id: 5,
    title: '我的 async/await 最佳实践：一个接口请求的例子',
    date: '2026-04-20',
    views: 2012,
    coverColor: '#fa8c16',
    summary: '一个简简单单的接口请求，我见过十几种写法。这篇文章分享我现在最常用的模式，以及为什么这样写。',
    tags: ['JavaScript', '异步编程', '最佳实践'],
    content: `最近 code review 时发现，团队里每个人写异步请求的方式都不一样。有的人用 \`.then()\`，有的人用 \`async/await\` 但不做错误处理，有的人写了 try/catch 但到处重复。

这让我想整理一下自己这两年积累下来的一个"标准写法"。

## 基础模式

\`\`\`javascript
async function fetchUserList() {
  try {
    const res = await api.getUsers()
    return [null, res.data]
  } catch (err) {
    return [err, null]
  }
}
\`\`\`

这个模式借鉴了 Go 的错误处理思路——函数永远返回一个 \`[error, data]\` 元组。调用方拿到结果后先判断第一个值。

## 封装一层

每次都写 try/catch 太烦了，我封装了一个工具函数：

\`\`\`javascript
async function request(promise) {
  try {
    const data = await promise
    return [null, data]
  } catch (err) {
    const url = err.config?.url || 'unknown'
    console.error('Request Error ' + url + ':', err.message)
    return [err, null]
  }
}

// 使用
const [err, users] = await request(api.getUsers())
if (err) return
\`\`\`

## 实际应用

在 Vue 组件里配合 loading 状态：

\`\`\`javascript
const loading = ref(false)
const users = ref([])

async function loadUsers() {
  loading.value = true
  const [err, data] = await request(api.getUsers())
  if (err) {
    message.error('加载用户列表失败')
    loading.value = false
    return
  }
  users.value = data
  loading.value = false
}
\`\`\`

还可以用 \`finally\` 进一步简化：

\`\`\`javascript
async function loadUsers() {
  loading.value = true
  const [err, data] = await request(api.getUsers())
  if (!err) users.value = data
  loading.value = false
}
\`\`\`

## 为什么我不用 .then()

很多人说 \`.then()\` 也可以，但实际项目里嵌套多了确实不好维护：

\`\`\`javascript
api.getUsers()
  .then(res => {
    users.value = res.data
    return api.getRoles()
  })
  .then(res => {
    roles.value = res.data
  })
  .catch(err => {
    // 这里不知道是哪个请求出的错
  })
\`\`\`

\`async/await\` 写出来是顺序的，读代码的时候眼睛不需要上下跳来跳去。

## 最后

这个模式不是我独创的，网上有很多类似的方案。选一个你能坚持用下去的，让团队统一就好。一致性比花哨更重要。`,
    recommendation: '错误处理看似简单，但每个项目风格不同。找到适合团队的模式并坚持下去。'
  }
]

const articles = rawArticles.map(a => ({
  ...a,
  readingTime: readingTime(a.content)
}))

export default articles
