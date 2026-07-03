<!--
=============================================================
  DAY 5 EXTENSION — UsersView.vue
  Fetches /users from JSONPlaceholder and shows a user card grid
=============================================================
-->
<script setup>
import { useFetch } from '@/api/useFetch'

const { data: users, loading, error, refetch } = useFetch('https://jsonplaceholder.typicode.com/users')
</script>

<template>
  <div class="card">
    <header class="card-head">
      <h1>Users</h1>
      <p class="subtitle">Loaded from JSONPlaceholder API</p>
    </header>

    <nav class="page-nav">
      <RouterLink to="/day5">← Back to todos</RouterLink>
    </nav>

    <div v-if="loading" class="loading">
      <span class="spinner" />
      Loading users…
    </div>

    <div v-else-if="error" class="error-box">
      <p>Couldn't load users — {{ error }}</p>
      <button class="btn-retry" @click="refetch">Retry</button>
    </div>

    <div v-else class="user-grid">
      <article v-for="user in users" :key="user.id" class="user-card">
        <div class="user-top">
          <div class="avatar">{{ user.name.charAt(0) }}</div>
          <div>
            <h2 class="user-name">{{ user.name }}</h2>
            <p class="user-handle">@{{ user.username }}</p>
          </div>
        </div>
        <dl class="user-meta">
          <div><dt>Email</dt><dd>{{ user.email }}</dd></div>
          <div><dt>Phone</dt><dd>{{ user.phone }}</dd></div>
          <div><dt>Company</dt><dd>{{ user.company.name }}</dd></div>
          <div><dt>City</dt><dd>{{ user.address.city }}</dd></div>
        </dl>
      </article>
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

/* ── user grid ── */
.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
.user-card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
}
.user-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
  background: var(--surface-hover);
}
.user-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.avatar {
  flex: none;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-family: var(--display);
  font-weight: 700;
  font-size: 17px;
}
.user-name {
  font-size: 16px;
}
.user-handle {
  font-size: 13px;
  color: var(--text-muted);
}
.user-meta {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.user-meta > div {
  display: flex;
  gap: 8px;
  font-size: 13px;
}
.user-meta dt {
  flex: none;
  width: 66px;
  color: var(--text-muted);
  font-weight: 600;
}
.user-meta dd {
  margin: 0;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
