<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tasks</ion-title>
        <ion-buttons slot="end">
          <ion-button :disabled="doneCount === 0" @click="clearCompleted">
            Clear done
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tasks</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="stats">
        <ion-chip color="medium">Total {{ totalCount }}</ion-chip>
        <ion-chip color="success">Done {{ doneCount }}</ion-chip>
        <ion-chip color="warning">Pending {{ pendingCount }}</ion-chip>
      </div>

      <div v-if="tasks.length === 0" class="empty">
        <ion-icon :icon="checkmarkDoneOutline" />
        <p>No tasks yet — tap + to add your first one.</p>
      </div>

      <!-- Task list -->
      <ion-list v-else>
        <ion-item-sliding v-for="task in tasks" :key="task.id">
          <ion-item>
            <ion-checkbox
              slot="start"
              :checked="task.done"
              @ionChange="toggleTask(task.id)"
            />
            <ion-label :class="{ done: task.done }">
              {{ task.name }}
            </ion-label>
            <ion-button
              slot="end"
              fill="clear"
              color="danger"
              @click="removeTask(task.id)"
            >
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-button>
          </ion-item>

          <!-- Swipe-to-delete for a native mobile feel -->
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="removeTask(task.id)">
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <!-- Floating action button to add a task -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="presentAddTask">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption,
  IonLabel, IonCheckbox, IonButton, IonButtons, IonIcon, IonChip, IonFab, IonFabButton,
  alertController,
} from '@ionic/vue';
import { add, trashOutline, checkmarkDoneOutline } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';

const taskStore = useTaskStore();

// Reactive state / getters
const { tasks, doneCount, pendingCount, totalCount } = storeToRefs(taskStore);

// Actions (functions — no storeToRefs)
const { addTask, toggleTask, removeTask, clearCompleted } = taskStore;

// Open a native-looking prompt to add a new task
async function presentAddTask() {
  const alert = await alertController.create({
    header: 'New Task',
    inputs: [
      { name: 'name', type: 'text', placeholder: 'What needs doing?' },
    ],
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Add',
        handler: (data) => { addTask(data.name); },
      },
    ],
  });
  await alert.present();
}
</script>

<style scoped>
.stats {
  display: flex;
  gap: 6px;
  padding: 8px 12px 0;
  flex-wrap: wrap;
}

.done {
  text-decoration: line-through;
  opacity: 0.6;
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
