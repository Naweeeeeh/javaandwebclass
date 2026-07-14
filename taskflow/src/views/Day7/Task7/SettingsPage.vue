<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Settings</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list inset>
        <ion-item-divider>Overview</ion-item-divider>
        <ion-item>
          <ion-label>Total tasks</ion-label>
          <ion-note slot="end">{{ totalCount }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Completed</ion-label>
          <ion-note slot="end">{{ doneCount }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Pending</ion-label>
          <ion-note slot="end">{{ pendingCount }}</ion-note>
        </ion-item>
      </ion-list>

      <ion-list inset>
        <ion-item-divider>Actions</ion-item-divider>
        <ion-item button :detail="false" :disabled="doneCount === 0" @click="clearCompleted">
          <ion-icon slot="start" color="warning" :icon="trashBinOutline" />
          <ion-label color="warning">Clear completed tasks</ion-label>
        </ion-item>
        <ion-item button :detail="false" @click="confirmReset">
          <ion-icon slot="start" color="danger" :icon="refreshOutline" />
          <ion-label color="danger">Delete all tasks</ion-label>
        </ion-item>
      </ion-list>

      <p class="about">TaskFlow · built with Ionic + Vue + Pinia</p>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonItemDivider, IonLabel, IonNote, IonIcon,
  alertController,
} from '@ionic/vue';
import { trashBinOutline, refreshOutline } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';

const taskStore = useTaskStore();
const { totalCount, doneCount, pendingCount, tasks } = storeToRefs(taskStore);
const { clearCompleted, clearAll } = taskStore;

async function confirmReset() {
  const alert = await alertController.create({
    header: 'Delete all tasks?',
    message: 'This removes every task and cannot be undone.',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Delete all',
        role: 'destructive',
        handler: () => { clearAll(); },
      },
    ],
  });
  await alert.present();
}
</script>

<style scoped>
.about {
  text-align: center;
  color: var(--ion-color-medium);
  font-size: 13px;
  margin-top: 24px;
}
</style>
