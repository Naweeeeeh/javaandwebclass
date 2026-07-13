<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Completed</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Completed</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="doneTasks.length === 0" class="empty">
        <ion-icon :icon="checkmarkCircleOutline" />
        <p>Nothing completed yet. Finished tasks show up here.</p>
      </div>

      <ion-list v-else>
        <ion-item
          v-for="task in doneTasks"
          :key="task.id"
          button
          :detail="true"
          @click="openTask(task.id)"
        >
          <ion-checkbox
            slot="start"
            :checked="task.done"
            @click.stop
            @ionChange="toggleTask(task.id)"
          />
          <ion-label class="done">{{ task.name }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonCheckbox, IonIcon,
} from '@ionic/vue';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';

const router = useRouter();
const taskStore = useTaskStore();
const { doneTasks } = storeToRefs(taskStore);
const { toggleTask } = taskStore;

function openTask(id) {
  router.push(`/tabs/tasks/${id}`);
}
</script>

<style scoped>
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
