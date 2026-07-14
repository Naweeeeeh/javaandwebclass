<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useTaskStore } from '@/stores/taskStore';

const store = useTaskStore();

// Load persisted tasks on startup (Preferences → survives tab close / reopen).
onMounted(() => store.loadTasks());
</script>
