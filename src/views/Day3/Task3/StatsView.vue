<script setup>
import { computed } from 'vue'

const taskStore = {
  tasks: [
    { id: 1, name: 'Write Playwright tests', done: false, dueDate: '06/30/2026' },
    { id: 2, name: 'Add documentation', done: false, dueDate: '07/01/2026' },
    { id: 3, name: 'Say hello world', done: true, dueDate: '06/29/2026' },
  ],
}

const total = computed(() => taskStore.tasks.length)
const done = computed(() => taskStore.tasks.filter((t) => t.done).length)
const pending = computed(() => total.value - done.value)
</script>

<template>
  <div class="stats-view">
    <RouterLink class="back-link" to="/day3">← Back to tasks</RouterLink>
    <h1>Task stats</h1>
    <div class="stat-grid">
      <div class="stat">
        <span class="stat-num">{{ total }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat">
        <span class="stat-num">{{ done }}</span>
        <span class="stat-label">Done</span>
      </div>
      <div class="stat">
        <span class="stat-num">{{ pending }}</span>
        <span class="stat-label">Pending</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-view {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-md);
}
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: var(--text-heading);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.18s;
}
.back-link:hover {
  color: var(--accent-hover);
}
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.stat {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 16px;
  text-align: center;
}
.stat-num {
  display: block;
  font-family: var(--display);
  font-weight: 700;
  font-size: 42px;
  line-height: 1;
  color: var(--text-heading);
}
.stat-label {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
@media (max-width: 480px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
