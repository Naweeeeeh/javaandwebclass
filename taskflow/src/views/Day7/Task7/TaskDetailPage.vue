<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tasks" />
        </ion-buttons>
        <ion-title>Task Detail</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Task Detail</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="!task" class="empty">
        <ion-icon :icon="alertCircleOutline" />
        <p>No tasks</p>
      </div>

      <template v-else>
        <ion-list inset>
          <ion-item>
            <ion-label class="ion-text-wrap">
              <p>Name</p>
              <h2 :class="{ done: task.done }">{{ task.name }}</h2>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>ID</ion-label>
            <ion-note slot="end">#{{ task.id }}</ion-note>
          </ion-item>

          <ion-item>
            <ion-label>Status</ion-label>
            <ion-badge slot="end" :color="task.done ? 'success' : 'warning'">
              {{ task.done ? 'Done' : 'Pending' }}
            </ion-badge>
          </ion-item>

          <ion-item>
            <ion-label>Due date</ion-label>
            <ion-note slot="end">{{ task.dueDate || '—' }}</ion-note>
          </ion-item>

          <ion-item>
            <ion-label>Priority</ion-label>
            <ion-badge slot="end" :color="priorityColor">{{ task.priority }}</ion-badge>
          </ion-item>
        </ion-list>

        <div class="actions">
          <ion-button
            expand="block"
            class="btn-ink"
            @click="toggleAndReturn"
          >
            Mark as {{ task.done ? 'pending' : 'done' }}
          </ion-button>
          <ion-button expand="block" class="btn-ghost" @click="onDelete">
            Delete task
          </ion-button>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonNote, IonBadge, IonButton, IonIcon,
} from '@ionic/vue';
import { alertCircleOutline } from 'ionicons/icons';
import { useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '@/stores/taskStore';

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();

const task = computed(() => taskStore.getTaskById(route.params.id));

const priorityColor = computed(() => {
  switch (task.value?.priority) {
    case 'high': return 'danger';
    case 'medium': return 'warning';
    default: return 'medium';
  }
});

const { toggleTask, removeTask } = taskStore;

function toggleAndReturn() {
  if (task.value) toggleTask(task.value.id);
  router.push('/tabs/tasks');
}

function onDelete() {
  if (task.value) removeTask(task.value.id);
  router.push('/tabs/tasks');
}
</script>

<style scoped>
.done {
  text-decoration: line-through;
  opacity: 0.6;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 16px 24px;
}

.btn-ink {
  --background: #16150f;
  --background-hover: #2f2d24;
  --background-activated: #2f2d24;
  --background-focused: #2f2d24;
  --color: #ffffff;
  --border-radius: 999px;
  --box-shadow: 0 2px 8px rgba(22, 21, 15, 0.12);
  font-weight: 600;
  letter-spacing: 0.01em;
}

.btn-ghost {
  --background: #ffffff;
  --background-hover: #f3f0e8;
  --background-activated: #ece8db;
  --background-focused: #ece8db;
  --color: #33322d;
  --border-radius: 999px;
  --border-width: 1.5px;
  --border-style: solid;
  --border-color: #d5d0c1;
  --box-shadow: none;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 64px 24px;
  color: var(--ion-color-medium);
  text-align: center;
}

.empty ion-icon {
  font-size: 48px;
}
</style>
