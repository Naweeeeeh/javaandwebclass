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
        <ion-chip color="medium" :outline="filter !== 'all'" @click="filter = 'all'">
          Total {{ totalCount }}
        </ion-chip>
        <ion-chip color="success" :outline="filter !== 'done'" @click="filter = 'done'">
          Done {{ doneCount }}
        </ion-chip>
        <ion-chip color="warning" :outline="filter !== 'pending'" @click="filter = 'pending'">
          Pending {{ pendingCount }}
        </ion-chip>
      </div>

      <div v-if="visibleTasks.length === 0" class="empty">
        <ion-icon :icon="checkmarkDoneOutline" />
        <p v-if="tasks.length === 0">Empty tasks</p>
        <p v-else>No {{ filter }} tasks.</p>
      </div>

      <ion-list v-else>
        <ion-item-sliding v-for="task in visibleTasks" :key="task.id">
          <ion-item button :detail="true" @click="openTask(task.id)">
            <ion-checkbox
              slot="start"
              :checked="task.done"
              @click.stop
              @ionChange="toggleTask(task.id)"
            />
            <ion-label :class="{ done: task.done }">
              {{ task.name }}
            </ion-label>
            <ion-button
              slot="end"
              fill="clear"
              color="medium"
              @click.stop="removeTask(task.id)"
            >
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-button>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="medium" @click="removeTask(task.id)">
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="openAddModal">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>

    <ion-modal :is-open="isAddOpen" @didDismiss="closeAddModal">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="cancelAddModal">Cancel</ion-button>
          </ion-buttons>
          <ion-title>New Task</ion-title>
          <ion-buttons slot="end">
            <ion-button :strong="true" :disabled="!form.name.trim()" @click="submitAddModal">
              Add
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-list inset>
          <ion-item>
            <ion-input
              label="Task"
              label-placement="stacked"
              placeholder="What needs doing?"
              v-model="form.name"
            />
          </ion-item>

          <ion-item>
            <ion-input
              type="date"
              label="Due date"
              label-placement="stacked"
              v-model="form.dueDate"
            />
          </ion-item>
        </ion-list>

        <div class="field">
          <p class="field-label">Priority</p>
          <ion-segment v-model="form.priority">
            <ion-segment-button value="low">
              <ion-label>Low</ion-label>
            </ion-segment-button>
            <ion-segment-button value="medium">
              <ion-label>Medium</ion-label>
            </ion-segment-button>
            <ion-segment-button value="high">
              <ion-label>High</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption,
  IonLabel, IonCheckbox, IonButton, IonButtons, IonIcon, IonChip, IonFab, IonFabButton,
  IonModal, IonInput, IonSegment, IonSegmentButton,
} from '@ionic/vue';
import { add, trashOutline, checkmarkDoneOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';

const router = useRouter();
const taskStore = useTaskStore();

const { tasks, doneCount, pendingCount, totalCount } = storeToRefs(taskStore);
const { addTask, toggleTask, removeTask, clearCompleted } = taskStore;

const filter = ref('all');
const visibleTasks = computed(() => {
  if (filter.value === 'done') return tasks.value.filter((t) => t.done);
  if (filter.value === 'pending') return tasks.value.filter((t) => !t.done);
  return tasks.value;
});

function openTask(id) {
  router.push(`/tabs/tasks/${id}`);
}

const isAddOpen = ref(false);
const form = reactive({
  name: '',
  dueDate: '',
  priority: 'low',
});

function resetForm() {
  form.name = '';
  form.dueDate = '';
  form.priority = 'low';
}

function openAddModal() {
  resetForm();
  isAddOpen.value = true;
}

function closeAddModal() {
  isAddOpen.value = false;
}

function cancelAddModal() {
  isAddOpen.value = false;
  router.push('/tabs/tasks');
}

function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function submitAddModal() {
  if (!form.name.trim()) return;
  addTask({
    name: form.name,
    dueDate: form.dueDate || todayISO(),
    priority: form.priority,
  });
  closeAddModal();
}
</script>

<style scoped>
.stats {
  display: flex;
  gap: 6px;
  padding: 8px 12px 0;
  flex-wrap: wrap;
}

.stats ion-chip {
  cursor: pointer;
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

.field {
  padding: 4px 16px 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ion-color-medium);
  margin: 8px 4px;
}
</style>
