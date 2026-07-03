// =============================================================
//  DAY 4 EXTENSION — Pinia Store: userStore.js
//  Topic: A second store — the current user / login state.
//  currentUser (name) + isLoggedIn (bool) + login/logout actions.
// =============================================================
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // ── State ──────────────────────────────────────────────
  const currentUser = ref('')

  // ── Getters ────────────────────────────────────────────
  const isLoggedIn = computed(() => currentUser.value.trim() !== '')

  // ── Actions ────────────────────────────────────────────
  function login(name) {
    const trimmed = (name ?? '').trim()
    if (!trimmed) return
    currentUser.value = trimmed
  }

  function logout() {
    currentUser.value = ''
  }

  return { currentUser, isLoggedIn, login, logout }
}, {
  // Persist the signed-in user across reloads too.
  persist: true,
})
