<!--
=============================================================
  DAY 2 ASSIGNMENT — Reusable TaskCard Component
  Topic: Props, Emits, Slots, Component Lifecycle
  Files: TaskCard.vue (child)  +  TaskListView.vue (parent)
  Time: 60 minutes
=============================================================

OBJECTIVE
---------
Build a reusable TaskCard child component that accepts data as props
and communicates back to the parent via custom events (emits). The
parent renders a list of TaskCards and handles all state changes.

WHAT TO BUILD — TaskCard.vue (this file)
-----------------------------------------
  1. Accept a "task" prop: { id, name, done, dueDate }
  2. Display the task name and dueDate (via a named slot "meta")
  3. Emit "complete" event (payload: task.id) when Complete/Undo clicked
  4. Emit "delete" event (payload: task.id) when Delete clicked
  5. Show "Complete" when task.done is false, "Undo" when true
  6. Apply a visual style change when task.done is true

WHAT TO BUILD — TaskListView.vue (see that file)
-------------------------------------------------
  1. Hold a tasks ref array with at least 3 sample tasks
  2. Render a TaskCard for each task using v-for
  3. Handle @complete → toggle that task's done property
  4. Handle @delete → remove that task from the array
  5. Fill the "meta" named slot with the due date

REQUIREMENTS (Acceptance Criteria)
------------------------------------
  [x] TaskCard uses defineProps({ task: Object })
  [x] TaskCard uses defineEmits(['complete', 'delete'])
  [x] TaskCard has <slot name="meta" /> for optional metadata
  [x] Parent passes :task="task" and listens @complete @delete
  [x] Parent fills the slot with <template #meta>...</template>
  [x] Data flows DOWN (props) and events flow UP (emits)
  [x] Parent owns the state — TaskCard never mutates props directly

EXTENSION (additional points)
---------------------------------
  - Add a priority badge prop (low/medium/high) with colour coding
  - Add an edit mode: clicking the task name turns it into an input
  - Emit an "update" event when the edited name is saved

HINTS (read only if stuck)
---------------------------
  Hint 1: const props = defineProps({ task: { type: Object, required: true } })
  Hint 2: const emit = defineEmits(['complete', 'delete'])
  Hint 3: @click="emit('complete', props.task.id)"
  Hint 4: In the parent — @complete="handleComplete"
           function handleComplete(id) { find task by id, toggle done }
  Hint 5: Named slot in child  → <slot name="meta" />
           Fill in parent      → <template #meta>Due: {{ task.dueDate }}</template>
  Hint 6: NEVER do this inside TaskCard: props.task.done = !props.task.done
           That mutates a prop directly — Vue will warn you. Emit instead.
=============================================================
-->

<!-- ─── TaskCard.vue ─── -->
<script setup>
// TODO 1: import defineProps and defineEmits (they are compiler macros — no import needed
//          but you DO need to call them)
import { defineProps, defineEmits, ref } from 'vue'

// TODO 2: Define the task prop with type Object, required: true
const props = defineProps({
  task: { type: Object, required: true },
  priority: {
    type: String,
    default: 'low',
    validator: (v) => ['low', 'medium', 'high'].includes(v),
  },
})

// TODO 3: Define emits for 'complete' and 'delete'
const emit = defineEmits(['complete', 'delete', 'update'])

const isEditing = ref(false)
const draftName = ref('')

function startEdit() {
  draftName.value = props.task.name
  isEditing.value = true
}

function saveEdit() {
  const name = draftName.value.trim()
  if (name) emit('update', { id: props.task.id, name })
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}
</script>

<template>
  <!-- TODO 4: Wrap everything in a div with class "task-card"
               Add :class="{ completed: task.done }" to the wrapper div -->
  <div class="task-card" :class="{ completed: task.done }">

    <div class="task-header">
      <!-- TODO 5: Display the task name -->
      <input
        v-if="isEditing"
        v-model="draftName"
        class="name-input"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @blur="saveEdit"
      />
      <span v-else class="name" title="edit taks" @click="startEdit">
        {{ props.task.name }}
      </span>

      <span class="badge" :class="'priority-' + priority">{{ priority }}</span>

      <!-- TODO 6: Add the named slot for metadata -->
      <span class="meta"><slot name="meta" /></span>
    </div>

    <div class="task-actions">
      <!-- TODO 7: Add Complete/Undo button — text changes based on task.done -->
      <!--         @click should emit 'complete' with task.id as payload -->
      <button class="btn-complete" @click="emit('complete', props.task.id)">
        {{ props.task.done ? 'Undo' : 'Complete' }}
      </button>

      <!-- TODO 8: Add Delete button — emits 'delete' with task.id -->
      <button class="btn-delete" @click="emit('delete', props.task.id)">
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  margin-bottom: 12px;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.task-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
  background: var(--surface);
}
.task-card.completed {
  background: var(--accent-soft);
  border-color: transparent;
}
.task-card.completed .name {
  text-decoration: line-through;
  color: var(--text-muted);
}
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.task-header span.name {
  flex: 1;
  font-weight: 600;
  font-size: 15px;
  color: var(--text-heading);
  cursor: pointer;
}
.task-header span.name:hover {
  color: var(--accent-hover);
}
.task-header .meta {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}
.name-input {
  flex: 1;
  font-weight: 600;
  font-size: 15px;
  color: var(--text-heading);
  padding: 6px 10px;
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  outline: none;
  box-shadow: var(--ring);
}
.badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 9px;
  border-radius: var(--radius-pill);
}
.priority-low {
  background: var(--warn-soft);
  color: var(--info);
}
.priority-medium {
  background: var(--warn-soft);
  color: var(--info);
}
.priority-high {
  background: var(--warn-soft);
  color: var(--info);
}
.task-actions {
  display: flex;
  gap: 8px;
}
.btn-complete {
  padding: 7px 16px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.18s;
}
.btn-complete:hover {
  background: var(--accent-hover);
}
.task-card.completed .btn-complete {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border-strong);
}
.btn-delete {
  padding: 7px 16px;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.18s;
}
.btn-delete:hover {
  background: var(--danger-soft);
  color: var(--danger);
  border-color: var(--danger);
}
</style>
