<template>
  <div
    ref="aboutRef"
    class="about"
  >
    <div class="profile-header glass">
      <div class="avatar-wrap">
        <div class="avatar-glow" />
        <a-avatar
          :size="100"
          class="profile-avatar"
        >
          风
        </a-avatar>
      </div>
      <h1>清风</h1>
      <p class="profile-title">
        前端开发者 / Vue 技术写作者
      </p>
      <p class="profile-bio">
        我喜欢把复杂的前端问题拆成可复用的方案，用真实项目案例帮助你快速理解技术落地。
      </p>
      <div class="social-links">
        <a
          class="social-btn"
          href="https://github.com"
          target="_blank"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          ><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
        </a>
        <a
          class="social-btn"
          href="mailto:hello@qingfeng.me"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
        </a>
      </div>
    </div>

    <section class="section profile-grid">
      <div class="profile-card glass">
        <h3>写作方向</h3>
        <ul>
          <li>Vue 3 & 组件化架构</li>
          <li>Vite 与现代前端工具链</li>
          <li>性能优化与体验提升</li>
          <li>工程化、构建流程与前端架构</li>
        </ul>
      </div>
      <div class="profile-card glass">
        <h3>我的原则</h3>
        <p>写博客时，我更看重「能不能直接用」和「有没有真实价值」。每篇文章都尽量带上代码示例、落地建议与复盘结论。</p>
      </div>
    </section>

    <section
      ref="skillsRef"
      class="section"
    >
      <h2>技术栈</h2>
      <div class="skills-grid">
        <div
          v-for="skill in skills"
          :key="skill.name"
          class="skill-item glass"
        >
          <div class="skill-header">
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-label">{{ skill.label }}</span>
          </div>
          <div class="skill-bar">
            <div
              class="skill-fill"
              :style="{ width: skill.level + '%', background: skill.color }"
            />
          </div>
        </div>
      </div>
    </section>

    <section
      ref="timelineRef"
      class="section"
    >
      <h2>技术成长时间线</h2>
      <div class="tl-list">
        <div
          v-for="(item, idx) in timeline"
          :key="idx"
          class="tl-entry"
        >
          <div
            class="tl-line"
            :class="`line-${idx % 5}`"
          >
            <div class="tl-node" />
          </div>
          <div class="tl-content glass">
            <div class="tl-header">
              <strong>{{ item.year }}</strong>
              <span class="tl-tag">{{ item.role }}</span>
            </div>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section
      ref="projectsRef"
      class="section"
    >
      <h2>个人项目</h2>
      <div class="projects-grid">
        <div
          v-for="proj in projects"
          :key="proj.name"
          class="project-card glass"
        >
          <h3>{{ proj.name }}</h3>
          <p>{{ proj.desc }}</p>
          <div class="proj-tags">
            <span
              v-for="t in proj.tags"
              :key="t"
              class="tag-pill tag-sm"
            >{{ t }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { animateIn, revealOnScroll, useGsapContext } from '../composables/useMotion'

const aboutRef = ref(null)
const skillsRef = ref(null)
const timelineRef = ref(null)
const projectsRef = ref(null)

useGsapContext(() => {
  animateIn(aboutRef.value?.querySelectorAll('.profile-header, .profile-grid'), { stagger: 0.12 })
  revealOnScroll(skillsRef.value?.querySelectorAll('.skill-item'), { trigger: skillsRef.value })
  revealOnScroll(timelineRef.value?.querySelectorAll('.tl-entry'), { trigger: timelineRef.value })
  revealOnScroll(projectsRef.value?.querySelectorAll('.project-card'), { trigger: projectsRef.value })
})

const skills = [
  { name: 'JavaScript', level: 88, color: '#eab308', label: '熟练' },
  { name: 'TypeScript', level: 78, color: '#3b82f6', label: '进阶' },
  { name: 'Vite', level: 82, color: '#646cff', label: '进阶' },
  { name: 'CSS / SCSS', level: 80, color: '#f97316', label: '进阶' },
  { name: 'Node.js', level: 70, color: '#22c55e', label: '掌握' },
  { name: 'React', level: 60, color: '#06b6d4', label: '掌握' },
  { name: 'Python', level: 52, color: '#8b5cf6', label: '了解' }
]

const timeline = [
  { year: '2021', role: '初级前端', color: '#3b82f6', desc: '毕业后加入创业公司，负责后台管理系统前端开发，使用 Vue 2 + Element UI，开始写技术博客，记录成长。' },
  { year: '2022', role: '前端开发', color: '#22c55e', desc: '加入中型公司，独立负责两个业务线前端，深入理解大型项目组件化和性能优化。' },
  { year: '2023', role: '前端开发', color: '#eab308', desc: '带领团队完成 Vue 2 到 Vue 3 的迁移，梳理公共组件库和开发规范。' },
  { year: '2024', role: '高级前端', color: '#f97316', desc: '开始带新人和分享技术实践，关注工程化、CI/CD 与前端性能体系。' },
  { year: '2025-2026', role: '前端技术负责人', color: '#8b5cf6', desc: '负责团队技术选型与架构规划，维持博客更新，持续输出实战总结。' }
]

const projects = [
  { name: 'Vue 组件库', desc: '内部组件库，基于 Ant Design Vue 封装，覆盖表格、表单、布局、弹窗等常用业务控件。', tags: ['Vue 3', '组件库', 'Ant Design'] },
  { name: 'CLI 工具', desc: '一个支持多种模板的命令行脚手架工具，能够快速生成项目结构和基础配置。', tags: ['Node.js', 'CLI'] },
  { name: '个人博客', desc: '这个网站本身就是一个实践项目，使用 Vue 3 + Vite 构建。', tags: ['Vue 3', 'Vite', '博客'] }
]
</script>

<style scoped>
.about { padding: 24px 0; max-width: 960px; margin: 0 auto; }

.section { margin-bottom: 48px; }

.section h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-heading);
}

.profile-header {
  text-align: center;
  padding: 44px 28px 36px;
  border-radius: var(--radius-lg);
  margin-bottom: 36px;
}

.avatar-wrap { position: relative; display: inline-block; margin-bottom: 16px; }

.avatar-glow {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: var(--gradient-brand);
  opacity: 0.15;
  filter: blur(20px);
}

.profile-avatar {
  background: var(--gradient-brand) !important;
  font-size: 36px !important;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.profile-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.profile-title { color: var(--text-muted); font-size: 16px; margin-bottom: 16px; }

.profile-bio {
  color: var(--text-muted);
  font-size: 15px;
  line-height: 1.8;
  max-width: 560px;
  margin: 0 auto 24px;
}

.social-links { display: flex; gap: 12px; justify-content: center; }

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-muted);
  color: var(--text-muted);
  border: 1px solid var(--line);
  transition: all 0.2s ease;
}

.social-btn:hover { border-color: var(--primary); color: var(--primary); }

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.profile-card {
  padding: 24px;
  border-radius: var(--radius-md);
}

.profile-card h3 { font-size: 18px; margin-bottom: 14px; color: var(--text-heading); }

.profile-card p,
.profile-card li {
  color: var(--text-muted);
  line-height: 1.8;
  font-size: 14px;
}

.profile-card ul { list-style: none; padding: 0; margin: 0; }
.profile-card li { padding: 4px 0; }
.profile-card li::before { content: '→ '; color: var(--primary); }

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.skill-item { padding: 20px; border-radius: var(--radius-md); }

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.skill-name { font-weight: 600; font-size: 15px; color: var(--text-heading); }
.skill-label { font-size: 12px; color: var(--text-muted); }

.skill-bar {
  height: 6px;
  border-radius: 999px;
  background: var(--bg-muted);
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.8s ease;
}

.tl-list { position: relative; }

.tl-entry {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.tl-line {
  position: relative;
  width: 2px;
  background: var(--line);
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.tl-node {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary);
  border: 3px solid var(--bg);
  position: relative;
  top: 24px;
  flex-shrink: 0;
}

.line-0 .tl-node { background: #3b82f6; }
.line-1 .tl-node { background: #22c55e; }
.line-2 .tl-node { background: #eab308; }
.line-3 .tl-node { background: #f97316; }
.line-4 .tl-node { background: #8b5cf6; }

.tl-content {
  flex: 1;
  padding: 20px 22px;
  border-radius: var(--radius-md);
}

.tl-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.tl-header strong { font-size: 17px; color: var(--text-heading); }

.tl-tag {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 500;
}

.tl-content p {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.75;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.project-card {
  padding: 24px;
  border-radius: var(--radius-md);
  transition: all 0.25s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--line-strong);
}

.project-card h3 { font-size: 17px; margin-bottom: 12px; color: var(--text-heading); }

.project-card p {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 16px;
}

.proj-tags { display: flex; flex-wrap: wrap; gap: 6px; }

@media (max-width: 860px) {
  .profile-grid,
  .skills-grid,
  .projects-grid { grid-template-columns: 1fr; }
}
</style>
