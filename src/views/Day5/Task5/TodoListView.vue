<!--
=============================================================
  DAY 5 ASSIGNMENT — TodoListView.vue
  Uses useFetch() to load and display todos from JSONPlaceholder
=============================================================
-->
<script setup>
import { ref, computed } from 'vue'
import { useFetch } from '@/api/useFetch'

const filter = ref('all') // 'all' | 'done' | 'pending'
const search = ref('')

// TODO 1: Call useFetch with the JSONPlaceholder todos endpoint
// Rename 'data' to 'todos' using destructuring alias syntax
const { data: todos, loading, error, refetch } = useFetch('https://jsonplaceholder.typicode.com/todos')

// TODO 2: Create a filteredTodos computed() that:
//  - Returns [] if todos.value is null (still loading)
//  - Filters by filter.value ('all' shows first 20, 'done' shows completed, 'pending' shows incomplete)
const filteredTodos = computed(() => {
  if (!todos.value) return []
  let list = todos.value
  if (filter.value === 'done')    list = list.filter((t) => t.completed)
  if (filter.value === 'pending') list = list.filter((t) => !t.completed)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter((t) => t.title.toLowerCase().includes(q))
  return list.slice(0, 20)
})
</script>

<template>
  <div class="card">
    <header class="card-head">
      <h1>Todo List</h1>
      <p class="subtitle">Loaded from JSONPlaceholder API</p>
    </header>

    <nav class="page-nav">
      <RouterLink to="/users">Users</RouterLink>
    </nav>

    <!-- TODO 3: Show a loading message/spinner while loading is true -->
    <div v-if="loading" class="loading">
      <span class="spinner" />
      Loading todos…
    </div>

    <!-- TODO 4: Show an error message if error has a value -->
    <div v-else-if="error" class="error-box">
      <p>Couldn't load todos — {{ error }}</p>
      <button class="btn-retry" @click="refetch">Retry</button>
    </div>

    <!-- TODO 5: Show the content block when NOT loading and NO error -->
    <div v-else>
      <!-- Filter buttons -->
      <div class="filters">
        <!-- TODO 6: Three buttons — All, Done, Pending -->
        <!-- Each sets filter.value and gets :class="{ active: filter === '...' }" -->
        <button :class="{ active: filter === 'all' }" @click="filter = 'all'">All</button>
        <button :class="{ active: filter === 'done' }" @click="filter = 'done'">Done</button>
        <button :class="{ active: filter === 'pending' }" @click="filter = 'pending'">Pending</button>
      </div>

      <input v-model="search" class="search" placeholder="Search" />

      <!-- TODO 7: Render filteredTodos using v-for -->
      <ul class="todo-list">
        <!-- li with checkbox (disabled, reflects todo.completed) and title -->
        <li v-for="todo in filteredTodos" :key="todo.id" :class="{ 'done-item': todo.completed }">
          <label class="check">
            <input type="checkbox" :checked="todo.completed" disabled />
            <span class="checkmark" />
          </label>
          <span :class="{ 'completed-text': todo.completed }">{{ todo.title }}</span>
        </li>
      </ul>

      <!-- TODO 8: Show count of visible items -->
      <p class="count">{{ filteredTodos.length }} shown</p>
    </div>
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
  margin-bottom: 18px;
}
h1 {
  font-size: 26px;
}
.subtitle {
  color: var(--text-muted);
  font-size: 14px;
  margin-top: 4px;
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
  transition: border-color 0.18s, background 0.18s, color 0.18s;
}
.page-nav a:hover {
  border-color: var(--text-heading);
  background: var(--surface-hover);
  color: var(--text-heading);
}
.page-nav a.router-link-active {
  background: var(--text-heading);
  border-color: var(--text-heading);
  color: #fff;
}

/* ── loading ── */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 48px 0;
  color: var(--text-muted);
  font-size: 15px;
}
.spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid var(--border-strong);
  border-top-color: var(--accent);
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── error ── */
.error-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background: var(--danger-soft);
  border: 1px solid var(--danger);
  border-radius: var(--radius);
  padding: 18px;
  color: var(--danger);
  font-size: 14px;
}
.btn-retry {
  padding: 8px 16px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: border-color 0.18s, background 0.18s, color 0.18s;
}
.btn-retry:hover {
  border-color: var(--text-muted);
  background: var(--surface-hover);
  color: var(--text-heading);
}

/* ── filters ── */
.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.filters button {
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  border-radius: var(--radius-pill);
  padding: 7px 16px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 550;
  transition: all 0.18s;
}
.filters button:hover {
  border-color: var(--border-strong);
  background: var(--surface-hover);
}
.filters button.active {
  background: var(--accent-soft);
  border-color: transparent;
  color: var(--accent-hover);
}

/* ── search ── */
.search {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  font-size: 15px;
  color: var(--text-heading);
  background: var(--surface-2);
  margin-bottom: 18px;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.search::placeholder {
  color: var(--text-muted);
}
.search:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--ring);
  background: var(--surface);
}

/* ── list ── */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.todo-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 15px;
  color: var(--text-heading);
  transition: border-color 0.18s, background 0.18s;
}
.todo-list li:hover {
  border-color: var(--border-strong);
  background: var(--surface-hover);
}
.todo-list li.done-item {
  opacity: 0.7;
}
.todo-list li span {
  flex: 1;
}
.completed-text {
  text-decoration: line-through;
  color: var(--text-muted);
}

/* read-only checkbox */
.check {
  position: relative;
  display: inline-flex;
}
.check input {
  position: absolute;
  opacity: 0;
  inset: 0;
}
.checkmark {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--border-strong);
  background: var(--surface);
}
.check input:checked + .checkmark {
  background: var(--accent);
  border-color: var(--accent);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M3.5 8.5l3 3 6-6.5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-size: 16px;
  background-position: center;
  background-repeat: no-repeat;
}

.count {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 14px;
  text-align: right;
}
</style>
