<!--
=============================================================
  DAY 2 ASSIGNMENT — TaskListView.vue (Parent Component)
  This file renders a list of TaskCard components.
=============================================================
-->
<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/views/Day4/Task4/taskStore.js'
import TaskCard from './TaskCard_day2.vue'

// TODO 1: Create a ref() tasks array with at least 3 sample tasks
// Each task: { id, name, done, dueDate }
// const tasks = ref([...])
const taskStore = useTaskStore()
const { tasks } = storeToRefs(taskStore)

// TODO 2: Write handleComplete(id) — toggle the done state of the task with this id
function handleComplete(id) {
  taskStore.toggleTask(id)
}

// TODO 3: Write handleDelete(id) — remove the task with this id from the array
function handleDelete(id) {
  taskStore.removeTask(id)
}

function handleUpdate(payload) {
  taskStore.updateTask(payload)
}

const isEmpty = computed(() => tasks.value.length === 0)
const allDone = computed(
  () => tasks.value.length > 0 && tasks.value.every(t => t.done)
)

const keepCompleted = ref(false)

watch(allDone, (done) => {
  if (!done) keepCompleted.value = false
})

// Delete every task at once.
function clearAll() {
  taskStore.tasks = []
}
</script>

<template>
  <div class="task-list-view">
    <header class="list-head">
      <h1>My Tasks</h1>
    </header>

    <div v-if="isEmpty" class="state-card empty">
      <p class="state-title">Empty task list</p>
    </div>

    <div v-else-if="allDone && !keepCompleted" class="state-card done">

      <p class="state-title">Completed all tasks!</p>
      <p class="state-sub">delete or keep</p>
      <div class="state-actions">
        <button class="btn-danger" @click="clearAll">Delete all</button>
        <button class="btn-ghost" @click="keepCompleted = true">Keep them</button>
      </div>
    </div>

    <!-- TODO 4: Render a <TaskCard> for each task using v-for
         - Pass :task="task" as a prop
         - Listen @complete="handleComplete"
         - Listen @delete="handleDelete"
         - Fill the "meta" named slot with the due date
    -->
    <div v-if="!isEmpty && !(allDone && !keepCompleted)" class="task-cards">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :priority="task.priority"
        @complete="handleComplete"
        @delete="handleDelete"
        @update="handleUpdate"
      >
        <template #meta>
          Due: {{ task.dueDate }}
        </template>
      </TaskCard>
    </div>
  </div>
</template>

<style scoped>
.task-list-view {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-md);
}

.list-head {
  margin-bottom: 22px;
}

h1 {
  font-size: 26px;
}

/* Empty / all-done state cards */
.state-card {
  text-align: center;
  padding: 44px 24px;
  border-radius: var(--radius);
  border: 1px dashed var(--border-strong);
  background: var(--surface-2);
}

.state-card.done {
  border-style: solid;
  border-color: transparent;
  background: var(--accent-soft);
}

.state-title {
  font-size: 17px;
  font-weight: 650;
  color: var(--text-heading);
}

.state-sub {
  margin-top: 4px;
  font-size: 14px;
  color: var(--text-muted);
}

.state-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
}

.btn-danger {
  padding: 9px 18px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.18s;
}

.btn-danger:hover {
  border-color: var(--text-muted);
  background: var(--surface-hover);
  color: var(--text-heading);
}

.btn-ghost {
  padding: 9px 18px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.18s;
}

.btn-ghost:hover {
  border-color: var(--text-muted);
  color: var(--text-heading);
}

.task-cards {
  display: flex;
  flex-direction: column;
}
</style>
