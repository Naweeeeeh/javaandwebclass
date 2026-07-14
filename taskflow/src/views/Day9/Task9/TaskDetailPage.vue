<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/day9/tasks" />
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
        <p>Task not found.</p>
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
            <ion-note slot="end">{{ task.id }}</ion-note>
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

          <ion-item>
            <ion-label>Photo</ion-label>
            <ion-button slot="end" fill="clear" @click="openPhotoChooser">
              <ion-icon slot="start" :icon="cameraOutline" />
              {{ task.photo ? 'Replace' : 'Add photo' }}
            </ion-button>
          </ion-item>
        </ion-list>

        <ion-img v-if="task.photo" :src="task.photo" class="detail-photo" />

        <div class="actions">
          <ion-button expand="block" class="btn-ink" @click="toggleAndReturn">
            Mark as {{ task.done ? 'pending' : 'done' }}
          </ion-button>
          <ion-button expand="block" class="btn-ghost" @click="onDelete">
            Delete task
          </ion-button>
        </div>
      </template>
    </ion-content>

    <ion-modal
      :is-open="photoChooserOpen"
      :initial-breakpoint="0.4"
      :breakpoints="[0, 0.4]"
      @didDismiss="photoChooserOpen = false"
    >
      <ion-content class="ion-padding">
        <h2 class="chooser-title">Add a photo</h2>
        <div class="chooser-actions">
          <ion-button expand="block" class="btn-ink" @click="pickFrom('camera')">
            <ion-icon slot="start" :icon="cameraOutline" />
            Take Photo
          </ion-button>
          <ion-button expand="block" class="btn-ghost" @click="pickFrom('photos')">
            <ion-icon slot="start" :icon="imagesOutline" />
            Choose from Photos
          </ion-button>
          <ion-button expand="block" fill="clear" color="medium" @click="photoChooserOpen = false">
            Cancel
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <PaymentModal
      v-model:open="checkoutOpen"
      :amount="PHOTO_FEE"
      line-label="Photo add-on"
      @paid="onPhotoPaid"
    />
  </ion-page>
</template>

<script setup>
import { computed, ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonNote, IonBadge, IonButton, IonIcon, IonImg, IonModal,
  toastController,
} from '@ionic/vue';
import { alertCircleOutline, cameraOutline, imagesOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '@/stores/taskStore';
import PaymentModal from './PaymentModal.vue';

const PHOTO_FEE = 56; // ~$1 charge for adding a photo to a task with none

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

const { toggleTask, removeTask, addPhotoToTask } = taskStore;

const photoChooserOpen = ref(false);
const checkoutOpen = ref(false);
const pendingPhoto = ref('');

function openPhotoChooser() {
  if (task.value) photoChooserOpen.value = true;
}

async function toast(message) {
  const t = await toastController.create({
    message,
    duration: 1500,
    position: 'bottom',
    cssClass: 'app-toast',
  });
  await t.present();
}

async function pickFrom(which) {
  photoChooserOpen.value = false;
  if (!task.value) return;
  const source = which === 'camera' ? CameraSource.Camera : CameraSource.Photos;
  try {
    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source,
    });
    const path = photo.dataUrl ?? '';
    if (task.value.photo) {
      // Replacing an existing photo is free.
      addPhotoToTask(task.value.id, path);
      toast('Photo updated — no charge.');
    } else {
      // Adding to an empty task requires the photo add-on charge.
      pendingPhoto.value = path;
      checkoutOpen.value = true;
    }
  } catch (err) {
    toast('No photo was added.');
  }
}

function onPhotoPaid() {
  if (task.value) addPhotoToTask(task.value.id, pendingPhoto.value);
  pendingPhoto.value = '';
  toast('Payment approved — photo added.');
}

function toggleAndReturn() {
  if (task.value) toggleTask(task.value.id);
  router.push('/day9/tasks');
}

function onDelete() {
  if (task.value) removeTask(task.value.id);
  router.push('/day9/tasks');
}
</script>

<style scoped>
.done {
  text-decoration: line-through;
  opacity: 0.6;
}

.detail-photo {
  display: block;
  margin: 4px 16px 8px;
  border-radius: 12px;
  overflow: hidden;
  border: 1.5px solid #d5d0c1;
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

.chooser-title {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  margin: 4px 0 14px;
  color: var(--ion-text-color);
}

.chooser-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
