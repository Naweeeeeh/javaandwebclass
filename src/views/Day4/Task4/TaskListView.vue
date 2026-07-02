<!--
=============================================================
  DAY 4 ASSIGNMENT — TaskListView.vue (refactored for Pinia)
  Remove all local state. Use the store for everything.
=============================================================
-->
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// TODO 1: Import your store
import { useTaskStore } from '@/views/Day4/Task4/taskStore.js'

// TODO 2: Get the store instance
const taskStore = useTaskStore()

// TODO 3: Destructure REACTIVE STATE using storeToRefs()
const { tasks, doneCount, pendingCount, totalCount } = storeToRefs(taskStore)

// TODO 4: Destructure ACTIONS directly (no storeToRefs needed for functions)
const { addTask, toggleTask, removeTask, clearCompleted } = taskStore

// This local ref is fine — it's UI state, not task state
const newTaskName = ref('')

function handleAdd() {
  // TODO 5: Call addTask() from the store, then clear the input
  addTask(newTaskName.value)
  newTaskName.value = ''
}
</script>

<template>
  <div class="card">
    <header class="card-head">
      <h1>Tasks</h1>
      <p class="subtitle">Shared Pinia store — changes sync across every day.</p>
    </header>

    <!-- TODO 6: Display totalCount, doneCount, pendingCount from the store -->
    <div class="stats">
      Total: {{ totalCount }} | Done: {{ doneCount }} | Pending: {{ pendingCount }}
    </div>

    <div class="input-row">
      <input v-model="newTaskName" placeholder="New task..." @keyup.enter="handleAdd" />
      <button class="btn-primary" @click="handleAdd">Add</button>
      <button class="btn-clear" @click="clearCompleted" :disabled="doneCount === 0">Clear completed</button>
    </div>

    <!-- TODO 7: Render the task list using tasks from the store -->
    <p v-if="tasks.length === 0" class="empty">No tasks yet — add your first one above.</p>
    <ul v-else class="task-list">
      <!-- v-for task in tasks -->
      <!--   checkbox v-model="task.done" @change="toggleTask(task.id)" -->
      <!--   span :class done -->
      <!--   remove button @click="removeTask(task.id)" -->
      <li v-for="task in tasks" :key="task.id">
        <label class="check">
          <input type="checkbox" :checked="task.done" @change="toggleTask(task.id)" />
          <span class="checkmark" />
        </label>
        <span class="name" :class="{ done: task.done }">{{ task.name }}</span>
        <button class="btn-remove" @click="removeTask(task.id)" aria-label="Remove task">✕</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-md);
}

.card-head {
  margin-bottom: 22px;
}

h1 {
  font-size: 26px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 14px;
  margin-top: 4px;
}

.stats {
  font-size: 13px;
  color: var(--text-muted);
  padding: 10px 14px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-bottom: 18px;
}

.input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-row input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  font-size: 15px;
  color: var(--text-heading);
  background: var(--surface-2);
  transition: border-color 0.18s, box-shadow 0.18s;
}

.input-row input::placeholder {
  color: var(--text-muted);
}

.input-row input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--ring);
  background: var(--surface);
}

.btn-primary {
  padding: 11px 20px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 650;
  font-size: 15px;
  transition: background 0.18s;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.btn-clear {
  padding: 11px 18px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.18s;
}

.btn-clear:hover:not(:disabled) {
  border-color: var(--border-strong);
  color: var(--text-heading);
  background: var(--surface-hover);
}

.btn-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
  padding: 40px 0;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  transition: border-color 0.18s, background 0.18s;
}

.task-list li:hover {
  border-color: var(--border-strong);
  background: var(--surface-hover);
}

.task-list .name {
  flex: 1;
  font-size: 15px;
  color: var(--text-heading);
}

.done {
  text-decoration: line-through;
  color: var(--text-muted);
}

.check {
  position: relative;
  display: inline-flex;
  cursor: pointer;
}

.check input {
  position: absolute;
  opacity: 0;
  inset: 0;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--border-strong);
  background: var(--surface);
  transition: all 0.18s;
}

.check input:checked + .checkmark {
  background: var(--accent);
  border-color: var(--accent);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M3.5 8.5l3 3 6-6.5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-size: 16px;
  background-position: center;
  background-repeat: no-repeat;
}

.btn-remove {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--text-muted);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.18s;
}

.btn-remove:hover {
  background: var(--surface-hover);
  color: var(--text-heading);
}
</style>
