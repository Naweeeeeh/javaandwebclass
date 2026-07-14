<template>
  <ion-modal :is-open="open" :backdrop-dismiss="false" @didDismiss="onDismiss">
    <div class="ad-wrap">
      <div class="ad-top">
        <span class="ad-badge">Ad</span>
        <button class="ad-skip" :disabled="!canSkip" @click="finish">
          <span v-if="canSkip">Skip Ad</span>
          <span v-else>Skip in {{ countdown }}s</span>
          <ion-icon :icon="canSkip ? closeOutline : timeOutline" />
        </button>
      </div>

      <div class="ad-body">
        <div class="ad-card">
          <h2 class="ad-title">JuiceMax Pro™</h2>
          <p class="ad-copy">
            Stay hydrated while you stay productive. Download now — your first sip is free!*
          </p>
          <div class="ad-stars">★★★★★ <span>4.9 · 2M+ installs</span></div>
          <button class="ad-cta">Install</button>
        </div>
      </div>

      <p class="ad-sponsor">Your task is sponsored by TaskFlow Ads™</p>
    </div>
  </ion-modal>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { IonModal, IonIcon } from '@ionic/vue';
import { closeOutline, timeOutline } from 'ionicons/icons';

const props = defineProps({
  open: { type: Boolean, default: false },
  seconds: { type: Number, default: 5 },
});
const emit = defineEmits(['update:open', 'done']);

const countdown = ref(props.seconds);
const canSkip = computed(() => countdown.value <= 0);
let timer = null;

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function start() {
  countdown.value = props.seconds;
  stop();
  timer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) stop();
  }, 1000);
}

watch(() => props.open, (isOpen) => {
  if (isOpen) start();
  else stop();
});

function finish() {
  if (!canSkip.value) return;
  stop();
  emit('done');
  emit('update:open', false);
}

function onDismiss() {
  stop();
  emit('update:open', false);
}

onUnmounted(stop);
</script>

<style scoped>
.ad-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(160deg, #4f46e5 0%, #7c3aed 55%, #db2777 100%);
  color: #ffffff;
  padding: 16px;
}

.ad-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ad-badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  padding: 3px 8px;
  border-radius: 6px;
}

.ad-skip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.35);
  border: none;
  border-radius: 999px;
  padding: 7px 12px;
  cursor: pointer;
}

.ad-skip:disabled {
  opacity: 0.7;
  cursor: default;
}

.ad-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ad-card {
  width: 100%;
  max-width: 320px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  padding: 28px 22px;
  text-align: center;
  backdrop-filter: blur(6px);
}

.ad-emoji {
  font-size: 64px;
  line-height: 1;
}

.ad-title {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 700;
  font-size: 26px;
  margin: 12px 0 6px;
  color: #fff;
}

.ad-copy {
  font-size: 14px;
  opacity: 0.95;
  margin-bottom: 12px;
}

.ad-stars {
  font-size: 13px;
  color: #ffd54a;
  margin-bottom: 16px;
}

.ad-stars span {
  color: rgba(255, 255, 255, 0.85);
  margin-left: 6px;
}

.ad-cta {
  width: 100%;
  background: #ffffff;
  color: #4f46e5;
  font-weight: 700;
  font-size: 16px;
  border: none;
  border-radius: 999px;
  padding: 12px;
  cursor: pointer;
}

.ad-fine {
  font-size: 11px;
  opacity: 0.8;
  margin-top: 12px;
}

.ad-sponsor {
  text-align: center;
  font-size: 12px;
  opacity: 0.85;
  margin: 4px 0 8px;
}
</style>
