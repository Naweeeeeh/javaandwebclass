<template>
  <ion-modal :is-open="open" @didDismiss="onDismiss">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button :disabled="processing" @click="close">Cancel</ion-button>
        </ion-buttons>
        <ion-title>Checkout</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding pp-content">
      <div v-if="isPayPalStep" class="pp-logo">
        <span class="pp-pay">Pay</span><span class="pp-pal">Pal</span>
      </div>

      <template v-if="payStep === 'method'">
        <div class="receipt">
          <div class="receipt-row">
            <span>{{ lineLabel }}</span>
            <span>{{ money(amount) }}</span>
          </div>
          <div class="receipt-row total">
            <span>Total due</span>
            <span>{{ money(amount) }}</span>
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
        <p class="pp-sub">Log in to complete your {{ money(amount) }} payment to TaskFlow.</p>

        <ion-list inset>
          <ion-item>
            <ion-input label="Email or mobile number" label-placement="stacked" inputmode="email" v-model="pp.email" />
          </ion-item>
          <ion-item>
            <ion-input label="Password" label-placement="stacked" type="password" v-model="pp.password" />
          </ion-item>
        </ion-list>

        <div class="pp-errors">
          <p v-if="pp.email && !emailValid" class="err">Enter a valid email.</p>
          <p v-if="pp.password && !passwordValid" class="err">
            Password must be at least 8 characters and include a letter and a number.
          </p>
        </div>

        <ion-button expand="block" class="btn-paypal" :disabled="!loginValid" @click="payStep = 'review'">
          Log In
        </ion-button>
        <ion-button expand="block" fill="clear" size="small" @click="payStep = 'method'">Back</ion-button>
      </template>

      <template v-else-if="payStep === 'review'">
        <p class="pp-sub">Paying as <strong>{{ pp.email || 'demo@paypal.com' }}</strong></p>

        <div class="receipt">
          <div class="receipt-row">
            <span>{{ lineLabel }}</span>
            <span>{{ money(amount) }}</span>
          </div>
          <div class="receipt-row total">
            <span>Total due</span>
            <span>{{ money(amount) }}</span>
          </div>
        </div>

        <ion-button expand="block" class="btn-paypal" :disabled="processing" @click="confirmPayment">
          <ion-spinner v-if="processing" name="dots" />
          <span v-else>Pay {{ money(amount) }} Now</span>
        </ion-button>
        <ion-button expand="block" fill="clear" size="small" :disabled="processing" @click="payStep = 'method'">Back</ion-button>
      </template>

      <template v-else-if="payStep === 'card'">
        <div class="receipt">
          <div class="receipt-row">
            <span>{{ lineLabel }}</span>
            <span>{{ money(amount) }}</span>
          </div>
          <div class="receipt-row total">
            <span>Total due</span>
            <span>{{ money(amount) }}</span>
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
          <span v-else>Pay {{ money(amount) }}</span>
        </ion-button>
        <ion-button expand="block" fill="clear" size="small" :disabled="processing" @click="payStep = 'method'">Back</ion-button>
      </template>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent,
  IonList, IonItem, IonInput, IonSpinner,
} from '@ionic/vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  amount: { type: Number, default: 0 },
  lineLabel: { type: String, default: 'Add-on' },
});
const emit = defineEmits(['update:open', 'paid']);

const processing = ref(false);
const payStep = ref('method');
const pp = reactive({ email: '', password: '' });
const cardForm = reactive({ name: '', number: '', exp: '', cvc: '' });

const isPayPalStep = computed(() => ['redirecting', 'login', 'review'].includes(payStep.value));

const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'outlook.com',
  'hotmail.com', 'live.com', 'msn.com', 'icloud.com', 'me.com',
  'aol.com', 'proton.me', 'protonmail.com', 'cit.edu',
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

const cardValid = computed(() => {
  const digits = cardForm.number.replace(/\D/g, '');
  return (
    cardForm.name.trim().length > 0 &&
    digits.length >= 13 && digits.length <= 19 &&
    /^\d{2}\/\d{2}$/.test(cardForm.exp.trim()) &&
    /^\d{3,4}$/.test(cardForm.cvc.trim())
  );
});

function money(n) {
  return `₱${Number(n).toFixed(2)}`;
}

function reset() {
  pp.email = '';
  pp.password = '';
  cardForm.name = '';
  cardForm.number = '';
  cardForm.exp = '';
  cardForm.cvc = '';
  payStep.value = 'method';
}

// Start fresh each time the modal opens.
watch(() => props.open, (isOpen) => {
  if (isOpen) reset();
});

function close() {
  if (processing.value) return;
  emit('update:open', false);
}

function onDismiss() {
  emit('update:open', false);
  reset();
}

function choosePaypal() {
  payStep.value = 'redirecting';
  setTimeout(() => {
    if (props.open && payStep.value === 'redirecting') {
      payStep.value = 'login';
    }
  }, 1100);
}

async function confirmPayment() {
  processing.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1200));
  processing.value = false;
  emit('paid');
  emit('update:open', false);
  reset();
}
</script>

<style scoped>
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ion-color-medium);
  margin: 8px 4px;
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
</style>
