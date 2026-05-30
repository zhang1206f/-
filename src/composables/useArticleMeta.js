const tagMap = {
  Vue: 'tag-vue',
  前端: 'tag-frontend',
  经验分享: 'tag-exp',
  Vite: 'tag-vite',
  构建工具: 'tag-build',
  体验: 'tag-exp',
  'Ant Design Vue': 'tag-antd',
  'UI 组件': 'tag-ui',
  CSS: 'tag-css',
  Grid: 'tag-css',
  踩坑: 'tag-bug',
  JavaScript: 'tag-js',
  异步编程: 'tag-js',
  最佳实践: 'tag-best',
  Router: 'tag-vue',
  性能优化: 'tag-best',
  Lighthouse: 'tag-build'
}

const coverPalette = [
  'linear-gradient(135deg, #67e8f9 0%, #2563eb 52%, #7c3aed 100%)',
  'linear-gradient(135deg, #22c55e 0%, #0f766e 52%, #1d4ed8 100%)',
  'linear-gradient(135deg, #c084fc 0%, #7c3aed 48%, #ec4899 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #0f766e 55%, #0f172a 100%)',
  'linear-gradient(135deg, #4f46e5 0%, #2563eb 45%, #06b6d4 100%)'
]

export function getTagClass(tag) {
  return tagMap[tag] || ''
}

export function getCoverGradient(article) {
  return article.coverColor || coverPalette[article.id % coverPalette.length]
}

export function formatShortDate(input) {
  const date = new Date(input)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

export function formatFullDate(input) {
  const date = new Date(input)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`
}
