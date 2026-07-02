<!--
=============================================================
  DAY 3 ASSIGNMENT — TaskDetailView.vue
  Displays full details for a single task
=============================================================
-->
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/views/Day4/Task4/taskStore.js'

// TODO 1: Get the current route and router instances
const route  = useRoute()
const router = useRouter()

const taskStore = useTaskStore()

// TODO 2: Find the task matching the route param
// Remember: route.params.id is a STRING — cast to Number before comparing
const task = computed(() => taskStore.getTaskById(route.params.id))

// TODO 3: Write goBack() using router.push() to navigate to '/home'
function goBack() {
  // your code here
  router.push('/day3')
}
</script>

<template>
  <div class="detail-view">

    <!-- TODO 4: Show this only if task is found (v-if="task") -->
    <div v-if="task">
      <button class="back-btn" @click="goBack">← Back</button>

      <!-- TODO 5: Display task.name, task.dueDate, and task.done status -->
      <h1>{{task.name}}</h1>
      <p>Status: {{ task.done ? 'task done' : 'not yet done' }}</p>
      <p>Due: {{task.dueDate}}</p>
    </div>

    <div v-if="false">
      <p>Task not found.</p>
      <button @click="goBack">Go Back</button>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-md);
}
.back-btn {
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  cursor: pointer;
  margin-bottom: 22px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  transition: border-color 0.18s, background 0.18s, color 0.18s;
}
.back-btn:hover {
  border-color: var(--text-muted);
  background: var(--surface-hover);
  color: var(--text-heading);
}
.back-btn:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}
h1 {
  font-size: 24px;
  margin-bottom: 14px;
}
p {
  color: var(--text);
  font-size: 15px;
  margin: 8px 0;
}
</style>
