<!--
=============================================================
  DAY 1 Task — Reactive Task Counter App
  Topic: Vue 3 Composition API (ref, computed, v-model, v-for)
  Time: 60 minutes
=============================================================

OBJECTIVE
---------
Build a reactive task management app that demonstrates Vue 3's
reactivity system. You will use ref(), computed(), v-model, v-for,
and event handling — the core building blocks of every Vue app.

WHAT TO BUILD
-------------
A single-file Vue component (this file) that:

  1. Has a text input + "Add Task" button to create new tasks.
  2. Displays the task list, each item with:
       - A checkbox to mark it as done
       - The task name (strike-through when done)
       - A "Remove" button
  3. Shows a live stats bar:
       Total Tasks | Done: X | Pending: X
  4. Shows an empty state message when there are no tasks.

REQUIREMENTS (Acceptance Criteria)
------------------------------------
  [x] Use ref() for the text input value
  [x] Use ref() for the tasks array
  [x] Use computed() for total, done, and pending counts
  [x] Use v-model on the text input
  [x] Use v-for with :key to render the task list
  [x] Use @keyup.enter on the input to also trigger addTask
  [x] Prevent adding empty/whitespace-only tasks
  [x] Clear the input after adding a task

EXTENSION (Additional Points)
---------------------------------
  - Add a filter bar: All | Done | Pending — filters the visible list
  - Add a "Clear All Done" button that removes all completed tasks
  - Add a task priority: Low / Medium / High (use a <select> dropdown)

HINTS (read only if stuck)
---------------------------
  Hint 1: import { ref, computed } from 'vue'
  Hint 2: tasks.value.push({ id: Date.now(), name: '...', done: false })
  Hint 3: computed(() => tasks.value.filter(t => t.done).length)
  Hint 4: For :class strikethrough — :class="{ done: task.done }"
  Hint 5: v-model on a checkbox binds to a boolean — v-model="task.done"
  Hint 6: To prevent empty tasks — if (!newTaskName.value.trim()) return

FILE STRUCTURE (this is a single-file component)
-------------------------------------------------
  <script setup>  — all your reactive logic goes here
  <template>      — your HTML markup
  <style scoped>  — your CSS (scoped = only applies to this component)
=============================================================
-->

<script setup>
import { ref, computed } from 'vue'

// TODO 1: Create a ref for the text input value (initial value: '')
const newTaskName = ref('')

// TODO 2: Create a ref for the tasks array (initial value: [])
const tasks = ref([])

// TODO 3: Create computed() values for total, done, and pending counts
const totalCount   = computed(() => tasks.value.length)
const doneCount    = computed(() => tasks.value.filter(t => t.done).length)
const pendingCount = computed(() => tasks.value.filter(t => !t.done).length)

// Current filter: 'all' | 'done' | 'pending'
const filter = ref('all')

// The list actually shown, derived from the active filter
const filteredTasks = computed(() => {
  if (filter.value === 'done')    return tasks.value.filter(t => t.done)
  if (filter.value === 'pending') return tasks.value.filter(t => !t.done)
  return tasks.value
})

// TODO 4: Write the addTask() function
// - Prevent empty tasks
// - Push a new task object to tasks.value: { id, name, done }
// - Clear the input
function addTask() {
  const name = newTaskName.value.trim()
  if (!name) return                                  
  tasks.value.push({ id: Date.now(), name, done: false })
  newTaskName.value = ''                            
}

// TODO 5: Write toggleTask(id) — flip task.done for the matching task
function toggleTask(id) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.done = !task.done
}

// TODO 6: Write removeTask(id) — filter out the task with this id
function removeTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
  console.log("Removed: " + id)
  console.log(totalCount.value + " left")
}

// clear all tasks
function clearAll() {
  tasks.value = []
}

// clear the selected (checked) tasks
function clearSelected() {
  tasks.value = tasks.value.filter(t => !t.done)
}
</script>

<template>
  <div class="card">
    <header class="card-head">
      <h1>Task Counter</h1>
      <p class="subtitle">Add tasks, track what's done.</p>
    </header>

    <!-- TODO 7/8: input + add button -->
    <div class="input-row">
      <input
        v-model="newTaskName"
        @keyup.enter="addTask"
        placeholder="What needs doing?"
      />
      <button class="btn-primary" @click="addTask">Add</button>
    </div>

    <!-- TODO 9: stats double as filter chips -->
    <div class="filters">
      <button :class="{ active: filter === 'all' }" @click="filter = 'all'">
        All <span class="count">{{ totalCount }}</span>
      </button>
      <button :class="{ active: filter === 'done' }" @click="filter = 'done'">
        Done <span class="count">{{ doneCount }}</span>
      </button>
      <button :class="{ active: filter === 'pending' }" @click="filter = 'pending'">
        Pending <span class="count">{{ pendingCount }}</span>
      </button>
    </div>

    <!-- TODO 10: empty state -->
    <p v-if="totalCount === 0" class="empty">No tasks yet — add your first one above.</p>

    <!-- TODO 11: the list -->
    <ul v-else class="task-list">
      <li v-for="task in filteredTasks" :key="task.id">
        <label class="check">
          <input type="checkbox" v-model="task.done" />
          <span class="checkmark" />
        </label>
        <span class="name" :class="{ done: task.done }">{{ task.name }}</span>
        <button class="btn-remove" @click="removeTask(task.id)" aria-label="Remove task">✕</button>
      </li>
    </ul>

    <!-- clear buttons -->
    <footer v-if="totalCount" class="actions">
      <button @click="clearSelected">Remove done</button>
      <button @click="clearAll">Clear all</button>
    </footer>
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

/* ── input row ── */
.input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
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

/* ── filter chips ── */
.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.filters button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  border-radius: var(--radius-pill);
  padding: 7px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 550;
  transition: all 0.18s;
}

.filters button:hover {
  border-color: var(--border-strong);
  background: var(--surface-hover);
}

.filters button .count {
  font-size: 12px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: var(--radius-pill);
  background: var(--bg);
  color: var(--text-muted);
}

.filters button.active {
  background: var(--accent-soft);
  border-color: transparent;
  color: var(--accent-hover);
}

.filters button.active .count {
  background: var(--accent);
  color: #fff;
}

/* ── empty state ── */
.empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
  padding: 40px 0;
}

/* ── task list ── */
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
  background: var(--surface);
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

/* custom checkbox */
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
  background: var(--danger-soft);
  color: var(--danger);
}

/* ── footer actions ── */
.actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}

.actions button {
  padding: 8px 14px;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.18s;
}

.actions button:hover {
  border-color: var(--danger);
  color: var(--danger);
  background: var(--danger-soft);
}
</style>
