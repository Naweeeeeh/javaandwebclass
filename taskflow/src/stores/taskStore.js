import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const PRIORITIES = ['low', 'medium', 'high']
const MAX_NAME_LENGTH = 200
const PER_CLICK = 2 // ₱ added to the running tab on every button click

export const useTaskStore = defineStore('tasks', () => {

  const tasks = ref([
    { id: 1, name: 'Write Playwright tests', done: false, dueDate: '06/30/2026', priority: 'high' },
    { id: 2, name: 'Add documentation',      done: false, dueDate: '07/01/2026', priority: 'medium' },
    { id: 3, name: 'Say hello world',         done: true,  dueDate: '06/29/2026', priority: 'low' },
  ])
  const nextId = ref(4)
  
  const clickCount = ref(0)
  const clickCharge = computed(() => clickCount.value * PER_CLICK)
  function registerClick() { clickCount.value++ }
  function resetClicks() { clickCount.value = 0 }

  const totalCount   = computed(() => tasks.value.length)
  const doneCount    = computed(() => tasks.value.filter((t) => t.done).length)
  const pendingCount = computed(() => totalCount.value - doneCount.value)
  const doneTasks    = computed(() => tasks.value.filter((t) => t.done))
  const getTaskById  = (id) => tasks.value.find((t) => t.id === Number(id))

  function addTask(input) {
    const opts = typeof input === 'string' ? { name: input } : (input ?? {})
    const trimmed = (opts.name ?? '').trim().slice(0, MAX_NAME_LENGTH)
    if (!trimmed) return
    const priority = PRIORITIES.includes(opts.priority) ? opts.priority : 'low'
    tasks.value.push({
      id: nextId.value++,
      name: trimmed,
      done: opts.done === true,
      dueDate: typeof opts.dueDate === 'string' ? opts.dueDate : '',
      priority,
      photo: typeof opts.photo === 'string' ? opts.photo : '',
    })
  }

  function addPhotoToTask(id, path) {
    const task = tasks.value.find((t) => t.id === Number(id))
    if (task) task.photo = path ?? ''
  }

  function toggleTask(id) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.done = !task.done
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function updateTask({ id, name }) {
    const task = tasks.value.find((t) => t.id === id)
    const trimmed = (name ?? '').trim()
    if (task && trimmed) task.name = trimmed
  }

  function clearCompleted() {
    tasks.value = tasks.value.filter((t) => !t.done)
  }

  return {
    tasks,
    nextId,
    totalCount,
    doneCount,
    pendingCount,
    doneTasks,
    getTaskById,
    clickCount,
    clickCharge,
    registerClick,
    resetClicks,
    addTask,
    addPhotoToTask,
    toggleTask,
    removeTask,
    updateTask,
    clearCompleted,
  }
}, {
  persist: {
    // Guard against tampered / malformed localStorage so the app can't be
    // bricked by a bad persisted value.
    afterHydrate: (ctx) => {
      const store = ctx.store
      if (!Array.isArray(store.tasks)) {
        store.tasks = []
      }
      const maxId = store.tasks.reduce((m, t) => Math.max(m, Number(t?.id) || 0), 0)
      if (!Number.isInteger(store.nextId) || store.nextId <= maxId) {
        store.nextId = maxId + 1
      }
    },
  },
})
