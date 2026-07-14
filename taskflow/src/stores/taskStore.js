import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences'

const PRIORITIES = ['low', 'medium', 'high']
const MAX_NAME_LENGTH = 200
const MAX_DUEDATE_LENGTH = 32
const PER_CLICK = 2
const TASKS_KEY = 'taskflow.tasks'
const MAX_PHOTO_LENGTH = 8_000_000

function isValidPhoto(path) {
  if (typeof path !== 'string') return false
  const p = path.trim()
  if (!p || p.length > MAX_PHOTO_LENGTH) return false
  return /^(data:image\/(png|jpe?g|gif|webp|heic|heif);|https?:\/\/|file:\/\/|capacitor:\/\/|ionic:\/\/|\/)/i.test(p)
}

function cleanName(v) {
  return (typeof v === 'string' ? v : '').trim().slice(0, MAX_NAME_LENGTH)
}
function cleanPriority(v) {
  return PRIORITIES.includes(v) ? v : 'low'
}
function cleanDueDate(v) {
  return typeof v === 'string' ? v.slice(0, MAX_DUEDATE_LENGTH) : ''
}
function cleanPhoto(v) {
  return isValidPhoto(v) ? v.trim() : ''
}

function sanitizeTask(raw) {
  if (!raw || typeof raw !== 'object') return null
  const id = Number(raw.id)
  if (!Number.isInteger(id) || id <= 0) return null
  const name = cleanName(raw.name)
  if (!name) return null
  return {
    id,
    name,
    done: raw.done === true,
    dueDate: cleanDueDate(raw.dueDate),
    priority: cleanPriority(raw.priority),
    photo: cleanPhoto(raw.photo),
  }
}

export const useTaskStore = defineStore('tasks', () => {

  const tasks = ref([
    { id: 1, name: 'Write Playwright tests', done: false, dueDate: '06/30/2026', priority: 'high', photo: '' },
    { id: 2, name: 'Add documentation',      done: false, dueDate: '07/01/2026', priority: 'medium', photo: '' },
    { id: 3, name: 'Say hello world',         done: true,  dueDate: '06/29/2026', priority: 'low', photo: '' },
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

  async function saveTasks() {
    try {
      await Preferences.set({ key: TASKS_KEY, value: JSON.stringify(tasks.value) })
    } catch (e) {
      console.warn('[taskflow] Could not persist tasks:', e)
    }
  }

  async function loadTasks() {
    let value
    try {
      ({ value } = await Preferences.get({ key: TASKS_KEY }))
    } catch (e) {
      console.warn('[taskflow] Could not read persisted tasks:', e)
      return
    }
    if (!value) return 

    let parsed
    try {
      parsed = JSON.parse(value)
    } catch {
      return 
    }
    if (!Array.isArray(parsed)) return

    const seen = new Set()
    const clean = []
    for (const raw of parsed) {
      const t = sanitizeTask(raw)
      if (t && !seen.has(t.id)) {
        seen.add(t.id)
        clean.push(t)
      }
    }
    tasks.value = clean
    nextId.value = clean.reduce((m, t) => Math.max(m, t.id), 0) + 1
    saveTasks() 
  }

  function addTask(input) {
    const opts = typeof input === 'string' ? { name: input } : (input ?? {})
    const name = cleanName(opts.name)
    if (!name) return
    tasks.value.push({
      id: nextId.value++,
      name,
      done: opts.done === true,
      dueDate: cleanDueDate(opts.dueDate),
      priority: cleanPriority(opts.priority),
      photo: cleanPhoto(opts.photo),
    })
    saveTasks()
  }

  function addPhotoToTask(id, path) {
    const task = tasks.value.find((t) => t.id === Number(id))
    if (task) task.photo = cleanPhoto(path)
    saveTasks()
  }

  function toggleTask(id) {
    const task = tasks.value.find((t) => t.id === Number(id))
    if (task) task.done = !task.done
    saveTasks()
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== Number(id))
    saveTasks()
  }

  function updateTask({ id, name }) {
    const task = tasks.value.find((t) => t.id === Number(id))
    const clean = cleanName(name)
    if (task && clean) task.name = clean
    saveTasks()
  }

  function clearCompleted() {
    tasks.value = tasks.value.filter((t) => !t.done)
    saveTasks()
  }

  function clearAll() {
    tasks.value = []
    saveTasks()
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
    saveTasks,
    loadTasks,
    addTask,
    addPhotoToTask,
    toggleTask,
    removeTask,
    updateTask,
    clearCompleted,
    clearAll,
  }
})
