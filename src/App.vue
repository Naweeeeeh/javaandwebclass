<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const days = [
  { id: 1, label: 'Reactivity', topic: 'ref · computed · v-model', accent: 'var(--day1)', to: '/day1', roots: ['/day1'] },
  { id: 2, label: 'Components', topic: 'props · emits · slots',     accent: 'var(--day2)', to: '/day2', roots: ['/day2'] },
  { id: 3, label: 'Routing',    topic: 'routes · guards · links',   accent: 'var(--day3)', to: '/day3', roots: ['/day3', '/task', '/about', '/stats'] },
  { id: 4, label: 'State',      topic: 'pinia · store · getters',   accent: 'var(--day4)', to: '/day4', roots: ['/day4'] },
]

// A day is active when the current URL sits under one of its route roots.
function isActive(day) {
  return day.roots.some((r) => route.path === r || route.path.startsWith(r + '/'))
}
</script>

<template>
  <div class="shell">
    <header class="masthead">
      <div class="brand-meta">BOISER · Vue 3 training</div>
    </header>

    <section class="hero">
      <h1 class="hero-title">
        Mobile and Web Development Training
      </h1>
    </section>

    <nav class="slider" aria-label="Choose a training day">
      <RouterLink
        v-for="day in days"
        :key="day.id"
        :to="day.to"
        class="slide"
        :class="{ active: isActive(day) }"
        :style="{ '--dot': day.accent }"
        :aria-current="isActive(day) ? 'page' : undefined"
      >
        <span class="slide-num">Day {{ String(day.id).padStart(2, '0') }}</span>
        <span class="slide-label">{{ day.label }}</span>
        <span class="slide-topic">{{ day.topic }}</span>
      </RouterLink>
    </nav>

    <main class="stage">
      <RouterView v-slot="{ Component }">
        <Transition name="day" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.masthead {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1.5px solid var(--text-heading);
}
.brand-meta {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.hero {
  max-width: 40ch;
  animation: rise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.hero-title {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(2.1rem, 6vw, 3.4rem);
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: var(--text-heading);
}

/* ── Day slider ── */
.slider {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.slide {
  position: relative;
  text-align: left;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 18px 20px;
  background: var(--surface);
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius);
  cursor: pointer;
  transition: transform 0.18s, border-color 0.18s, background 0.18s, color 0.18s;
}
.slide::before {
  content: '';
  position: absolute;
  top: 16px;
  right: 16px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--dot);
  transition: transform 0.18s;
}
.slide:hover {
  transform: translateY(-2px);
  border-color: var(--text-heading);
}
.slide:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}
.slide.active {
  background: var(--text-heading);
  border-color: var(--text-heading);
  color: #fff;
}
.slide.active::before {
  transform: scale(1.25);
}
.slide-num {
  font-family: var(--display);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.02em;
  color: var(--text-muted);
}
.slide.active .slide-num {
  color: var(--dot);
}
.slide-label {
  font-family: var(--display);
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.02em;
  color: var(--text-heading);
}
.slide.active .slide-label {
  color: #fff;
}
.slide-topic {
  font-size: 12px;
  color: var(--text-muted);
}

/* ── Stage ── */
.stage {
  min-height: 200px;
}

/* ── Motion ── */
.day-enter-active,
.day-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.day-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.day-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}

@media (max-width: 640px) {
  .slider {
    grid-template-columns: 1fr;
  }
}
</style>
