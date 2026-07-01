<!--
=============================================================
  DAY 3 ASSIGNMENT — HomeView.vue
  Shows the task list with router-link navigation to each task
=============================================================
-->
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const taskStore = {
  tasks: [
    { id: 1, name: 'Write Playwright tests', done: false, dueDate: '06/30/2026' },
    { id: 2, name: 'Add documentation', done: false, dueDate: '07/01/2026' },
    { id: 3, name: 'hello world', done: true, dueDate: '06/29/2026' },
  ],
}
const route = useRoute()
const router = useRouter()

// TODO 1: Read route.query.error — if it equals 'notfound', show a warning banner
const showErrorBanner = computed(() => route.query.error === 'notfound')
</script>

<template>
  <div class="home-view">
    <h1>My Tasks</h1>

    <!-- TODO 2: Show a warning banner if showErrorBanner is true -->
    <div class="error-banner" v-if="showErrorBanner">
        Task not found. Redirected back to home.
    </div>
    
    <nav class="page-nav">
      <!-- TODO 3: Add a RouterLink to /about -->
       <RouterLink to="/about">About</RouterLink>
       <RouterLink to="/stats">Stats</RouterLink>
    </nav>

    <!-- TODO 4: Render each task as a RouterLink to /task/:id -->
    <!-- Use <RouterLink :to="`/task/${task.id}`"> as the wrapper -->
    <ul class="task-list">
      <li v-for="task in taskStore.tasks" :key="task.id">
        <!-- TODO 5: Wrap this in a RouterLink -->
         <RouterLink :to="`/task/${task.id}`">
        <span :class="{ done: task.done }">{{ task.name }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home-view {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-md);
}
h1 {
  font-size: 26px;
  margin-bottom: 18px;
}
.error-banner {
  background: var(--warn-soft);
  border: 1px solid var(--warn);
  border-radius: var(--radius-sm);
  padding: 11px 14px;
  margin-bottom: 18px;
  color: #7a5411;
  font-size: 14px;
}
.page-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.page-nav a {
  display: inline-flex;
  align-items: center;
  padding: 7px 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s, color 0.18s;
}
.page-nav a:hover {
  border-color: var(--text-heading);
  background: var(--surface-hover);
  color: var(--text-heading);
}
.page-nav a:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}
.page-nav a.router-link-active {
  background: var(--text-heading);
  border-color: var(--text-heading);
  color: #fff;
}
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.task-list a {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text-heading);
  font-size: 15px;
  font-weight: 500;
  transition: border-color 0.18s, background 0.18s;
}
.task-list a:hover {
  border-color: var(--border-strong);
  background: var(--surface);
}
.task-list a:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}
.done {
  text-decoration: line-through;
  color: var(--text-muted);
}
</style>
