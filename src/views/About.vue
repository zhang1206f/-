<template>
  <div class="about" ref="aboutRef">
    <div class="profile-header">
      <a-avatar :size="110" class="profile-avatar">风</a-avatar>
      <h1>清风</h1>
      <p class="profile-title">前端开发者 / Vue 技术写作者</p>
      <p class="profile-bio">
        我喜欢把复杂的前端问题拆成可复用的方案，用真实项目案例帮助你快速理解技术落地。
        这不是一个仅仅分享概念的博客，而是一个专注于“实践 + 反思”的前端笔记本。
      </p>
      <div class="social-links">
        <a-button shape="circle" href="https://github.com" target="_blank" class="social-btn">GH</a-button>
        <a-button shape="circle" href="mailto:hello@qingfeng.me" class="social-btn">@</a-button>
        <a-button shape="circle" href="https://twitter.com" target="_blank" class="social-btn">X</a-button>
      </div>
    </div>

    <section class="section profile-grid">
      <div class="profile-card">
        <h2>我的写作方向</h2>
        <ul>
          <li>Vue 3 & 组件化架构</li>
          <li>Vite 与现代前端工具链</li>
          <li>性能优化与体验提升</li>
          <li>工程化、构建流程与前端架构</li>
        </ul>
      </div>
      <div class="profile-card">
        <h2>我的原则</h2>
        <p>写博客时，我更看重「能不能直接用」和「有没有真实价值」。每篇文章都尽量带上代码示例、落地建议与复盘结论。</p>
      </div>
    </section>

    <section class="section" ref="skillsRef">
      <h2>📌 技术栈</h2>
      <div class="skills-grid">
        <div class="skill-item" v-for="skill in skills" :key="skill.name">
          <div class="skill-name">{{ skill.name }}</div>
          <a-progress
            :percent="skill.level"
            :stroke-color="skill.color"
            size="small"
            :show-info="false"
          />
          <div class="skill-level">{{ skill.label }}</div>
        </div>
      </div>
    </section>

    <section class="section" ref="timelineRef">
      <h2>📖 技术成长时间线</h2>
      <a-timeline>
        <a-timeline-item v-for="(item, idx) in timeline" :key="idx" :color="item.color">
          <div class="tl-header">
            <strong>{{ item.year }}</strong>
            <span class="tl-tag">{{ item.role }}</span>
          </div>
          <div class="tl-desc">{{ item.desc }}</div>
        </a-timeline-item>
      </a-timeline>
    </section>

    <section class="section" ref="projectsRef">
      <h2>🛠 个人项目</h2>
      <div class="projects-grid">
        <a-card
          v-for="proj in projects"
          :key="proj.name"
          :title="proj.name"
          :bordered="false"
          class="project-card"
        >
          <p class="proj-desc">{{ proj.desc }}</p>
          <div class="proj-tags">
            <a-tag v-for="t in proj.tags" :key="t" color="blue">{{ t }}</a-tag>
          </div>
        </a-card>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const aboutRef = ref(null)
const skillsRef = ref(null)
const timelineRef = ref(null)
const projectsRef = ref(null)
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(aboutRef.value?.querySelector('.profile-header'), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    })
    gsap.from(aboutRef.value?.querySelector('.profile-grid'), {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.2,
      ease: 'power3.out'
    })
    gsap.from(skillsRef.value?.querySelectorAll('.skill-item'), {
      scrollTrigger: { trigger: skillsRef.value, start: 'top 85%' },
      opacity: 0,
      x: -20,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power2.out'
    })
    gsap.from(timelineRef.value?.querySelectorAll('.ant-timeline-item'), {
      scrollTrigger: { trigger: timelineRef.value, start: 'top 85%' },
      opacity: 0,
      x: -20,
      stagger: 0.12,
      duration: 0.5,
      ease: 'power2.out'
    })
    gsap.from(projectsRef.value?.querySelectorAll('.project-card'), {
      scrollTrigger: { trigger: projectsRef.value, start: 'top 85%' },
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})

const skills = [
  { name: 'JavaScript', level: 88, color: '#f7df1e', label: '熟练' },
  { name: 'TypeScript', level: 78, color: '#3178c6', label: '进阶' },
  { name: 'Vite', level: 82, color: '#646cff', label: '进阶' },
  { name: 'CSS / SCSS', level: 80, color: '#1572b6', label: '进阶' },
  { name: 'Node.js', level: 70, color: '#339933', label: '掌握' },
  { name: 'React', level: 60, color: '#61dafb', label: '掌握' },
  { name: 'Python', level: 52, color: '#3776ab', label: '了解' }
]

const timeline = [
  { year: '2021', role: '初级前端', color: 'blue', desc: '毕业后加入创业公司，负责后台管理系统前端开发，使用 Vue 2 + Element UI，开始写技术博客，记录成长。' },
  { year: '2022', role: '前端开发', color: 'green', desc: '加入中型公司，独立负责两个业务线前端，深入理解大型项目组件化和性能优化。' },
  { year: '2023', role: '前端开发', color: 'orange', desc: '带领团队完成 Vue 2 到 Vue 3 的迁移，梳理公共组件库和开发规范。' },
  { year: '2024', role: '高级前端', color: 'red', desc: '开始带新人和分享技术实践，关注工程化、CI/CD 与前端性能体系。' },
  { year: '2025-2026', role: '前端技术负责人', color: 'purple', desc: '负责团队技术选型与架构规划，维持博客更新，持续输出实战总结。' }
]

const projects = [
  { name: 'Vue 组件库', desc: '内部组件库，基于 Ant Design Vue 封装，覆盖表格、表单、布局、弹窗等常用业务控件。', tags: ['Vue 3', '组件库', 'Ant Design'] },
  { name: 'CLI 工具', desc: '一个支持多种模板的命令行脚手架工具，能够快速生成项目结构和基础配置。', tags: ['Node.js', 'CLI'] },
  { name: '个人博客', desc: '这个网站本身就是一个实践项目，使用 Vue 3 + Vite + Ant Design Vue 构建。', tags: ['Vue 3', 'Vite', '博客'] }
]
</script>

<style scoped>
.about {
  padding: 32px 0;
  max-width: 1000px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  padding: 40px 28px;
  border-radius: 32px;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(148,163,184,0.16);
  box-shadow: var(--shadow-sm);
  margin-bottom: 40px;
}

.profile-avatar {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  font-size: 40px;
  box-shadow: 0 10px 30px rgba(79,70,229,0.2);
  margin-bottom: 18px;
}

.profile-header h1 {
  font-size: 34px;
  font-weight: 700;
  margin-bottom: 10px;
}

.profile-title {
  color: #64748b;
  font-size: 16px;
  margin-bottom: 18px;
}

.profile-bio {
  color: #475569;
  font-size: 15px;
  line-height: 1.85;
  max-width: 640px;
  margin: 0 auto 24px;
}

.social-links {
  display: flex;
  gap: 14px;
  justify-content: center;
}

.social-btn {
  border: none;
  background: #eef2ff;
  color: #334155;
  font-weight: 700;
}

.social-btn:hover {
  background: #8b5cf6;
  color: #fff;
}

.section {
  margin-bottom: 48px;
}

.section h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  margin-bottom: 28px;
}

.profile-card {
  padding: 26px 24px;
  background: rgba(255,255,255,0.96);
  border-radius: 24px;
  border: 1px solid rgba(148,163,184,0.16);
  box-shadow: var(--shadow-sm);
}

.profile-card h2 {
  margin-bottom: 16px;
  font-size: 18px;
}

.profile-card p,
.profile-card li {
  color: #475569;
  line-height: 1.8;
}

.profile-card ul {
  list-style: disc inside;
  padding: 0;
  margin: 0;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.skill-item {
  padding: 22px;
  background: rgba(255,255,255,0.94);
  border-radius: 22px;
  border: 1px solid rgba(148,163,184,0.16);
}

.skill-name {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 10px;
  color: #111827;
}

.skill-level {
  font-size: 12px;
  color: #64748b;
  margin-top: 10px;
  text-align: right;
}

.tl-header strong {
  font-size: 16px;
  margin-right: 10px;
}

.tl-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  background: rgba(99,102,241,0.12);
  border-radius: 999px;
  color: #4f46e5;
  font-size: 13px;
}

.tl-desc {
  color: #475569;
  margin-top: 8px;
  line-height: 1.75;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.project-card {
  border-radius: 22px;
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.25s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.proj-desc {
  color: #475569;
  line-height: 1.75;
  margin-bottom: 16px;
}

.proj-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 950px) {
  .profile-grid,
  .projects-grid,
  .skills-grid {
    grid-template-columns: 1fr;
  }
}

.tl-tag {
  display: inline-block;
  font-size: 12px;
  background: #f0f0f0;
  color: #888;
  padding: 1px 8px;
  border-radius: 4px;
}

.tl-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* Projects */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.project-card {
  border-radius: 10px;
  background: linear-gradient(135deg, #fafafa 0%, #fff 100%);
  border: 1px solid #f0f0f0;
}

.project-card:hover {
  border-color: #1890ff;
}

.proj-desc {
  font-size: 13px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 12px;
}

.proj-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

@media (max-width: 600px) {
  .skills-grid,
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
