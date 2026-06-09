<template>
  <div class="skeleton-container">
    <header class="skeleton-header">
      <div class="skeleton-logo" />
      <nav class="skeleton-nav">
        <div class="skeleton-nav-item" />
        <div class="skeleton-nav-item" />
        <div class="skeleton-nav-item" />
        <div class="skeleton-nav-item" />
      </nav>
      <div class="skeleton-theme-toggle" />
    </header>

    <main class="skeleton-content">
      <section class="skeleton-hero">
        <div class="skeleton-chip" />
        <div class="skeleton-title" />
        <div class="skeleton-subtitle" />
        <div class="skeleton-actions">
          <div class="skeleton-btn skeleton-btn-primary" />
          <div class="skeleton-btn skeleton-btn-secondary" />
        </div>
        <div class="skeleton-tags">
          <div class="skeleton-tag" />
          <div class="skeleton-tag" />
          <div class="skeleton-tag" />
          <div class="skeleton-tag" />
        </div>
      </section>

      <section class="skeleton-section">
        <div class="skeleton-section-header">
          <div class="skeleton-eyebrow" />
          <div class="skeleton-section-title" />
        </div>
        <div class="skeleton-grid">
          <div class="skeleton-card">
            <div class="skeleton-card-cover" />
            <div class="skeleton-card-body">
              <div class="skeleton-card-title" />
              <div class="skeleton-card-text" />
              <div class="skeleton-card-text" />
              <div class="skeleton-card-meta" />
            </div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-card-cover" />
            <div class="skeleton-card-body">
              <div class="skeleton-card-title" />
              <div class="skeleton-card-text" />
              <div class="skeleton-card-text" />
              <div class="skeleton-card-meta" />
            </div>
          </div>
        </div>
      </section>

      <section class="skeleton-section">
        <div class="skeleton-section-header">
          <div class="skeleton-eyebrow" />
          <div class="skeleton-section-title" />
        </div>
        <div class="skeleton-list">
          <div class="skeleton-list-item" v-for="i in 3" :key="i">
            <div class="skeleton-list-index" />
            <div class="skeleton-list-content">
              <div class="skeleton-list-title" />
              <div class="skeleton-list-text" />
              <div class="skeleton-list-meta" />
            </div>
          </div>
        </div>
      </section>

      <section class="skeleton-cta">
        <div class="skeleton-cta-title" />
        <div class="skeleton-cta-text" />
        <div class="skeleton-cta-actions">
          <div class="skeleton-btn skeleton-btn-primary" />
          <div class="skeleton-btn skeleton-btn-secondary" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.skeleton-container {
  min-height: 100vh;
  background: var(--bg-primary);
}

.skeleton-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--line);
}

.skeleton-logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-nav {
  display: flex;
  gap: 24px;
}

.skeleton-nav-item {
  width: 60px;
  height: 24px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.skeleton-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 24px;
  gap: 20px;
}

.skeleton-chip {
  width: 200px;
  height: 32px;
  border-radius: 20px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-title {
  width: 60%;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-subtitle {
  width: 50%;
  height: 24px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-actions {
  display: flex;
  gap: 12px;
}

.skeleton-btn {
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-btn-primary {
  width: 140px;
}

.skeleton-btn-secondary {
  width: 100px;
}

.skeleton-tags {
  display: flex;
  gap: 8px;
}

.skeleton-tag {
  width: 60px;
  height: 28px;
  border-radius: 14px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-section {
  margin-top: 24px;
}

.skeleton-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.skeleton-eyebrow {
  width: 120px;
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-section-title {
  width: 150px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.skeleton-card {
  border-radius: 24px;
  border: 1px solid var(--line);
  overflow: hidden;
}

.skeleton-card-cover {
  height: 180px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card-title {
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-card-text {
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-card-meta {
  height: 16px;
  border-radius: 3px;
  width: 60%;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-list-item {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 20px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--bg-muted);
}

.skeleton-list-index {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-muted) 50%, var(--bg-secondary) 75%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-list-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-list-title {
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-list-text {
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-list-meta {
  height: 16px;
  border-radius: 3px;
  width: 40%;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-cta {
  margin-top: 24px;
  padding: 60px 24px;
  border-radius: 24px;
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.skeleton-cta-title {
  height: 36px;
  width: 40%;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-cta-text {
  height: 20px;
  width: 60%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-secondary) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-cta-actions {
  display: flex;
  gap: 12px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 1080px) {
  .skeleton-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .skeleton-hero {
    padding: 40px 16px;
  }

  .skeleton-list-item {
    grid-template-columns: 60px 1fr;
    gap: 16px;
    padding: 16px;
  }

  .skeleton-list-index {
    font-size: 36px;
  }
}

@media (max-width: 640px) {
  .skeleton-actions,
  .skeleton-cta-actions {
    flex-direction: column;
    width: 100%;
  }

  .skeleton-btn {
    width: 100% !important;
  }

  .skeleton-list-item {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }

  .skeleton-list-index {
    font-size: 24px;
    text-align: left;
  }
}
</style>
