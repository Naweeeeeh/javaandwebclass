<script setup>
</script>

<template>
  <div class="about-view">
    <RouterLink class="back-link" to="/day3">← Back to tasks</RouterLink>
    <h1>About</h1>
    <p>
      Routing task referencing from our learnings from day 1 and day 2, from task counter, to task list, up into routing our task list to here.
    </p>
  </div>
</template>

<style scoped>
.about-view {
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
  margin-bottom: 14px;
}
p {
  color: var(--text);
  font-size: 15px;
  line-height: 1.55;
  margin-bottom: 12px;
  max-width: 52ch;
}
</style>
