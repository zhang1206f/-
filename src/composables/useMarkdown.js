import MarkdownIt from 'markdown-it'

/**
 * 将标题文本转换为可用作 ID 的 slug
 * 支持中文字符，保留字母、数字、中文和连字符
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/^/, 'toc-')
}

/**
 * 创建配置好的 markdown-it 实例
 */
function createMd() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false,
    breaks: false,
  })

  // 自定义 heading slug，生成 toc- 前缀的 ID
  md.renderer.rules.heading_open = (tokens, idx) => {
    const token = tokens[idx]
    const level = token.tag
    const nextToken = tokens[idx + 1]
    const text = nextToken.children
      ? nextToken.children.reduce((acc, t) => acc + t.content, '')
      : ''
    const id = slugify(text)
    return `<${level} id="${id}">`
  }

  // 外部链接在新标签页打开
  const defaultLinkOpen =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href')
    if (href && /^https?:\/\//.test(href) && !href.includes('localhost')) {
      tokens[idx].attrPush('target', '_blank')
      tokens[idx].attrPush('rel', 'noopener noreferrer')
    }
    return defaultLinkOpen(tokens, idx, options, env, self)
  }

  // 代码块：仅添加 class，不做高亮（由 shiki 等工具在组件中处理）
  const defaultFence =
    md.renderer.rules.fence ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const info = token.info.trim()
    const langName = info ? info.split(/\s+/)[0] : ''

    const langClass = langName ? ` class="language-${langName}"` : ''
    const highlighted = md.utils.escapeHtml(token.content)

    return `<pre${langClass}><code${langClass}>${highlighted}</code></pre>\n`
  }

  // 行内代码同样添加 class
  const defaultInlineCode =
    md.renderer.rules.code_inline ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const content = md.utils.escapeHtml(token.content)
    return `<code class="inline">${content}</code>`
  }

  return md
}

/**
 * 渲染 Markdown 为 HTML
 * @param {string} content - Markdown 原文
 * @returns {string} HTML 字符串
 */
function renderStandalone(content) {
  if (!content) return ''
  const md = createMd()
  return md.render(content)
}

/**
 * Vue 组合式函数：返回 renderMarkdown 方法
 * @returns {{ renderMarkdown: (content: string) => string }}
 */
export function useMarkdown() {
  const md = createMd()

  function renderMarkdown(content) {
    if (!content) return ''
    return md.render(content)
  }

  return { renderMarkdown }
}

export { renderStandalone }
