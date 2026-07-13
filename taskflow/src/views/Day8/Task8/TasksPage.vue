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
        <p v-if="tasks.length === 0">No tasks yet — tap + to add your first one.</p>
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
            <ion-thumbnail v-if="task.photo" slot="start" class="thumb">
              <ion-img :src="task.photo" />
            </ion-thumbnail>
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
            <ion-button @click="closeAddModal">Cancel</ion-button>
          </ion-buttons>
          <ion-title>New Task</ion-title>
          <ion-buttons slot="end">
            <ion-button :strong="true" :disabled="!form.name.trim()" @click="goToCheckout">
              Add Task
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding" @click="onFlowClick">
        <ion-list inset>
          <ion-item>
            <ion-input
              label="Task"
              label-placement="stacked"
              placeholder="What needs doing?"
              maxlength="200"
              counter
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

        <div class="field">
          <p class="field-label">Photo</p>
          <ion-button expand="block" fill="outline" @click="openPhotoChooser">
            <ion-icon slot="start" :icon="cameraOutline" />
            {{ form.photo ? 'Replace photo' : 'Add photo' }}
          </ion-button>
          <ion-img v-if="form.photo" :src="form.photo" class="preview" />
        </div>
      </ion-content>
    </ion-modal>

    <ion-modal
      :is-open="photoChooserOpen"
      :initial-breakpoint="0.4"
      :breakpoints="[0, 0.4]"
      @didDismiss="photoChooserOpen = false"
    >
      <ion-content class="ion-padding" @click="onFlowClick">
        <h2 class="chooser-title">Add a photo</h2>
        <div class="chooser-actions">
          <ion-button expand="block" class="btn-pay" @click="pickFrom('camera')">
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

    <ion-modal :is-open="isPayOpen" @didDismiss="closePay">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button :disabled="processing" @click="closePay">Cancel</ion-button>
          </ion-buttons>
          <ion-title>Checkout</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding pp-content" @click="onFlowClick">
        <div v-if="isPayPalStep" class="pp-logo">
          <span class="pp-pay">Pay</span><span class="pp-pal">Pal</span>
        </div>

        <template v-if="payStep === 'method'">
          <div class="receipt">
            <div class="receipt-row">
              <span>{{ priorityLabel }} priority task — "{{ form.name || 'Untitled' }}"</span>
              <span>{{ money(subtotal) }}</span>
            </div>
            <div v-if="form.photo" class="receipt-row muted">
              <span>Photo add-on</span>
              <span>{{ money(photoFee) }}</span>
            </div>
            <div v-if="clickCharge > 0" class="receipt-row muted">
              <span>Button clicks ({{ clickCount }}× ₱2)</span>
              <span>{{ money(clickCharge) }}</span>
            </div>
            <div class="receipt-row muted">
              <span>Processing fee</span>
              <span>{{ money(FEE) }}</span>
            </div>
            <div class="receipt-row total">
              <span>Total due</span>
              <span>{{ money(total) }}</span>
            </div>
          </div>

          <p class="field-label">Choose a payment method</p>
          <div class="pay-methods">
            <ion-button expand="block" class="btn-paypal" @click="choosePaypal">
              Pay with PayPal
            </ion-button>
            <ion-button expand="block" class="btn-pay" @click="payStep = 'card'">
              Pay with Card
            </ion-button>
          </div>

          
        </template>

        <template v-else-if="payStep === 'redirecting'">
          <div class="pp-redirect">
            <ion-spinner name="crescent" />
            <p class="pp-sub">Redirecting to PayPal…</p>
          </div>
        </template>

        <template v-else-if="payStep === 'login'">
          <p class="pp-sub">Log in to complete your {{ money(total) }} payment to TaskFlow.</p>

          <ion-list inset>
            <ion-item>
              <ion-input
                label="Email or mobile number"
                label-placement="stacked"
                inputmode="email"
                v-model="pp.email"
              />
            </ion-item>
            <ion-item>
              <ion-input
                label="Password"
                label-placement="stacked"
                type="password"
                v-model="pp.password"
              />
            </ion-item>
          </ion-list>

          <div class="pp-errors">
            <p v-if="pp.email && !emailValid" class="err">
              Enter a valid email.
            </p>
            <p v-if="pp.password && !passwordValid" class="err">
              Password must be at least 8 characters and include a letter and a number.
            </p>
          </div>

          <ion-button
            expand="block"
            class="btn-paypal"
            :disabled="!loginValid"
            @click="payStep = 'review'"
          >
            Log In
          </ion-button>
          <ion-button expand="block" fill="clear" size="small" @click="payStep = 'method'">
            Back
          </ion-button>
        </template>

        <template v-else-if="payStep === 'review'">
          <p class="pp-sub">Paying as <strong>{{ pp.email || 'demo@paypal.com' }}</strong></p>

          <div class="receipt">
            <div class="receipt-row">
              <span>{{ priorityLabel }} priority task — "{{ form.name || 'Untitled' }}"</span>
              <span>{{ money(subtotal) }}</span>
            </div>
            <div v-if="form.photo" class="receipt-row muted">
              <span>Photo add-on</span>
              <span>{{ money(photoFee) }}</span>
            </div>
            <div v-if="clickCharge > 0" class="receipt-row muted">
              <span>Button clicks ({{ clickCount }}× ₱2)</span>
              <span>{{ money(clickCharge) }}</span>
            </div>
            <div class="receipt-row muted">
              <span>Processing fee</span>
              <span>{{ money(FEE) }}</span>
            </div>
            <div class="receipt-row total">
              <span>Total due</span>
              <span>{{ money(total) }}</span>
            </div>
          </div>

          <ion-button expand="block" class="btn-paypal" :disabled="processing" @click="confirmPayment">
            <ion-spinner v-if="processing" name="dots" />
            <span v-else>Pay {{ money(total) }} Now</span>
          </ion-button>
          <ion-button expand="block" fill="clear" size="small" :disabled="processing" @click="payStep = 'method'">
            Back
          </ion-button>

        
        </template>

        <template v-else-if="payStep === 'card'">
          <div class="receipt">
            <div class="receipt-row">
              <span>{{ priorityLabel }} priority task — "{{ form.name || 'Untitled' }}"</span>
              <span>{{ money(subtotal) }}</span>
            </div>
            <div v-if="form.photo" class="receipt-row muted">
              <span>Photo add-on</span>
              <span>{{ money(photoFee) }}</span>
            </div>
            <div v-if="clickCharge > 0" class="receipt-row muted">
              <span>Button clicks ({{ clickCount }}× ₱2)</span>
              <span>{{ money(clickCharge) }}</span>
            </div>
            <div class="receipt-row muted">
              <span>Processing fee</span>
              <span>{{ money(FEE) }}</span>
            </div>
            <div class="receipt-row total">
              <span>Total due</span>
              <span>{{ money(total) }}</span>
            </div>
          </div>

          <ion-list inset>
            <ion-item>
              <ion-input label="Name on card" label-placement="stacked" v-model="cardForm.name" />
            </ion-item>
            <ion-item>
              <ion-input label="Card number" label-placement="stacked" inputmode="numeric" maxlength="19" v-model="cardForm.number" />
            </ion-item>
            <ion-item>
              <ion-input label="Expiry (MM/YY)" label-placement="stacked" maxlength="5" v-model="cardForm.exp" />
            </ion-item>
            <ion-item>
              <ion-input label="CVC" label-placement="stacked" inputmode="numeric" maxlength="4" v-model="cardForm.cvc" />
            </ion-item>
          </ion-list>

          <div class="pp-errors">
            <p v-if="cardForm.number && !cardValid" class="err">
              Enter valid card details (name, 13–19 digit number, MM/YY, 3–4 digit CVC).
            </p>
          </div>

          <ion-button expand="block" class="btn-pay" :disabled="!cardValid || processing" @click="confirmPayment">
            <ion-spinner v-if="processing" name="dots" />
            <span v-else>Pay {{ money(total) }}</span>
          </ion-button>
          <ion-button expand="block" fill="clear" size="small" :disabled="processing" @click="payStep = 'method'">
            Back
          </ion-button>
        </template>
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
  IonModal, IonInput, IonSegment, IonSegmentButton, IonSpinner, IonThumbnail, IonImg,
  toastController,
} from '@ionic/vue';
import { add, trashOutline, checkmarkDoneOutline, cameraOutline, imagesOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';

const router = useRouter();
const taskStore = useTaskStore();

const { tasks, doneCount, pendingCount, totalCount, clickCount, clickCharge } = storeToRefs(taskStore);
const { addTask, toggleTask, removeTask, clearCompleted, registerClick, resetClicks } = taskStore;

// +₱2 for every button clicked while adding a task (charged at checkout).
function onFlowClick(e) {
  if (e.target?.closest?.('ion-button, ion-fab-button, ion-segment-button, ion-back-button, ion-chip')) {
    registerClick();
  }
}

const filter = ref('all');
const visibleTasks = computed(() => {
  if (filter.value === 'done') return tasks.value.filter((t) => t.done);
  if (filter.value === 'pending') return tasks.value.filter((t) => !t.done);
  return tasks.value;
});

function openTask(id) {
  router.push(`/day8/tasks/${id}`);
}

const isAddOpen = ref(false);
const form = reactive({
  name: '',
  dueDate: '',
  priority: 'low',
  photo: '',
});

function resetForm() {
  form.name = '';
  form.dueDate = '';
  form.priority = 'low';
  form.photo = '';
}

const photoChooserOpen = ref(false);

function openPhotoChooser() {
  photoChooserOpen.value = true;
}

async function pickFrom(which) {
  photoChooserOpen.value = false;
  const source = which === 'camera' ? CameraSource.Camera : CameraSource.Photos;
  try {
    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source,
    });
    form.photo = photo.webPath ?? '';
  } catch (err) {
    const toast = await toastController.create({
      message: 'No photo was added.',
      duration: 1400,
      position: 'bottom',
      cssClass: 'app-toast',
    });
    await toast.present();
  }
}

function openAddModal() {
  resetForm();
  resetClicks();
  isAddOpen.value = true;
}

function closeAddModal() {
  isAddOpen.value = false;
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
    photo: form.photo,
  });
  closeAddModal();
}

const PRICES = { low: 111, medium: 167, high: 279 };
const FEE = 17;
const PHOTO_FEE = 56; // ~$1 add-on when a photo is attached

const isPayOpen = ref(false);
const processing = ref(false);
const payStep = ref('method');
const pp = reactive({ email: '', password: '' });
const cardForm = reactive({ name: '', number: '', exp: '', cvc: '' });

const isPayPalStep = computed(
  () => ['redirecting', 'login', 'review'].includes(payStep.value)
);

const cardValid = computed(() => {
  const digits = cardForm.number.replace(/\D/g, '');
  return (
    cardForm.name.trim().length > 0 &&
    digits.length >= 13 && digits.length <= 19 &&
    /^\d{2}\/\d{2}$/.test(cardForm.exp.trim()) &&
    /^\d{3,4}$/.test(cardForm.cvc.trim())
  );
});

// Client-side apps can't do a real DNS/MX lookup, so we accept only well-known
// providers. This blocks made-up domains like "whatisthisdomain.com".
const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'outlook.com',
  'hotmail.com', 'live.com', 'msn.com', 'icloud.com', 'me.com',
  'aol.com', 'proton.me', 'protonmail.com',
  'cit.edu',
];
const emailValid = computed(() => {
  const email = pp.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  return ALLOWED_EMAIL_DOMAINS.includes(email.split('@')[1]);
});
const passwordValid = computed(
  () => pp.password.length >= 8 && /[A-Za-z]/.test(pp.password) && /\d/.test(pp.password)
);
const loginValid = computed(() => emailValid.value && passwordValid.value);

const subtotal = computed(() => PRICES[form.priority] ?? PRICES.low);
const photoFee = computed(() => (form.photo ? PHOTO_FEE : 0));
const total = computed(() => subtotal.value + photoFee.value + FEE + clickCharge.value);
const priorityLabel = computed(
  () => form.priority.charAt(0).toUpperCase() + form.priority.slice(1)
);

function money(n) {
  return `₱${n.toFixed(2)}`;
}

function resetPayment() {
  pp.email = '';
  pp.password = '';
  cardForm.name = '';
  cardForm.number = '';
  cardForm.exp = '';
  cardForm.cvc = '';
  payStep.value = 'method';
}

function goToCheckout() {
  if (!form.name.trim()) return;
  isAddOpen.value = false;
  payStep.value = 'method';
  isPayOpen.value = true;
}

function choosePaypal() {
  payStep.value = 'redirecting';
  // Simulated hand-off to PayPal before showing the login screen.
  setTimeout(() => {
    if (isPayOpen.value && payStep.value === 'redirecting') {
      payStep.value = 'login';
    }
  }, 1100);
}

function closePay() {
  if (processing.value) return;
  isPayOpen.value = false;
  resetPayment();
}

async function confirmPayment() {
  processing.value = true;
  const paid = total.value; // capture before clicks reset
  await new Promise((resolve) => setTimeout(resolve, 1200));
  submitAddModal();
  processing.value = false;
  isPayOpen.value = false;
  resetPayment();
  resetClicks();
  const toast = await toastController.create({
    message: `Payment of ${money(paid)} approved. Task added.`,
    duration: 1800,
    position: 'bottom',
    cssClass: 'app-toast',
  });
  await toast.present();
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

.thumb {
  --size: 44px;
  border-radius: 8px;
  overflow: hidden;
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

.preview {
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
  border: 1.5px solid #d5d0c1;
}

.receipt {
  background: #ffffff;
  border: 1.5px solid #d5d0c1;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  padding: 4px 0;
}

.receipt-row.muted {
  color: var(--ion-color-medium);
}

.receipt-row.total {
  border-top: 1px solid #d5d0c1;
  margin-top: 6px;
  padding-top: 10px;
  font-weight: 700;
  color: #16150f;
}

.disclaimer {
  font-size: 12px;
  color: var(--ion-color-medium);
  text-align: center;
  padding: 4px 8px 12px;
}

.pp-content {
  --background: #ffffff;
}

.pp-logo {
  text-align: center;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 700;
  font-size: 30px;
  letter-spacing: -0.01em;
  padding: 12px 0 4px;
}

.pp-logo .pp-pay {
  color: #253b80;
}

.pp-logo .pp-pal {
  color: #179bd7;
}

.pp-sub {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 16px;
}

.pp-redirect {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 56px 24px;
}

.pp-redirect ion-spinner {
  width: 40px;
  height: 40px;
  color: #0070ba;
}

.pp-redirect .pp-sub {
  margin: 0;
}

.pp-errors {
  padding: 0 4px;
}

.pp-errors .err {
  color: var(--ion-color-danger);
  font-size: 12.5px;
  margin: 2px 0;
}

.btn-paypal {
  --background: #0070ba;
  --background-hover: #005ea6;
  --background-activated: #005ea6;
  --color: #ffffff;
  --border-radius: 999px;
  font-weight: 700;
  margin-top: 4px;
}

.pay-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 4px 0 16px;
}

.btn-pay {
  --background: #16150f;
  --background-hover: #2f2d24;
  --background-activated: #2f2d24;
  --color: #ffffff;
  --border-radius: 999px;
  font-weight: 600;
  margin-top: 4px;
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

.btn-ghost {
  --background: #ffffff;
  --background-hover: #f3f0e8;
  --background-activated: #ece8db;
  --color: #33322d;
  --border-radius: 999px;
  --border-width: 1.5px;
  --border-style: solid;
  --border-color: #d5d0c1;
  font-weight: 600;
}
</style>
