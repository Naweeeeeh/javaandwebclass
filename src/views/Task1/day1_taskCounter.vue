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
  <div class="app">
    <h1>Task Counter</h1>

    <div class="input-row">
      <!-- TODO 7: Add an input with v-model, @keyup.enter, and placeholder -->
      <input
        v-model="newTaskName"
        @keyup.enter="addTask"
        placeholder="Enter task"
      />
      <!-- TODO 8: Add an "Add Task" button with @click="addTask" -->
       <button @click="addTask"> add task </button>

    </div>

    <!-- TODO 9: Display the stats bar using your computed values -->
    <!-- Format: Total: X | Done: X | Pending: X -->
    <div class="stats">
      <!-- your stats here -->
       <button :class="{ active: filter === 'all' }"     @click="filter = 'all'">Total count {{ totalCount }}</button>
       <button :class="{ active: filter === 'done' }"    @click="filter = 'done'">done count {{ doneCount }}</button>
       <button :class="{ active: filter === 'pending' }" @click="filter = 'pending'">pending count {{ pendingCount }}</button>
      </div>

    <!-- clear buttons -->
    <div class="actions">
      <button @click="clearSelected">Remove Done</button>
      <button @click="clearAll">Clear All</button>
    </div>

    <!-- TODO 10: Show this message only when the task list is empty -->
    <p v-if="totalCount === 0" class="empty">empty tasks</p>

    <!-- TODO 11: Render the task list using v-for -->
    <!-- Each item needs: checkbox (v-model), task name (:class done), remove button -->
    <ul v-else class="task-list">
      <li v-for="task in filteredTasks" :key="task.id">
        <input type="checkbox" v-model="task.done" />
        <span :class="{ done: task.done }">{{ task.name }}</span>
        <button @click="removeTask(task.id)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.app {
  max-width: 480px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

h1 { color: #1B2A4A; margin-bottom: 20px; }

.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.input-row input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.input-row button {
  padding: 8px 16px;
  background: #42B883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.stats {
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #e9f7f0;
  border-radius: 6px;
}

.stats button {
  border: 1px solid #c7e7da;
  background: white;
  color: #1B2A4A;
  border-radius: 6px;
  padding: 4px 10px;
  margin-right: 6px;
  cursor: pointer;
  font-size: 12px;
}

.stats button.active {
  background: #42B883;
  color: white;
  border-color: #42B883;
  font-weight: bold;
}

.actions {
  margin-bottom: 16px;
}

.actions button {
  padding: 6px 12px;
  margin-right: 6px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.empty {
  text-align: center;
  color: #aaa;
  font-style: italic;
  margin: 32px 0;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid #eee;
}

.task-list li span {
  flex: 1;
  font-size: 14px;
}

/* TODO: Apply this class to task names when task.done is true */
.done {
  text-decoration: line-through;
  color: #aaa;
}

.task-list li button {
  padding: 4px 10px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
</style>
