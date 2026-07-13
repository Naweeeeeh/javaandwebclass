<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>TaskFlow</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">TaskFlow</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="days">
        <button
          v-for="d in days"
          :key="d.route"
          class="day-card"
          @click="open(d.route)"
        >
          Day {{ d.day }}
        </button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const days = [
  { day: 6, route: '/day6/tab1' },
  { day: 7, route: '/tabs/tasks' },
  { day: 8, route: '/day8/tasks' },
];

function open(route) {
  router.push(route);
}
</script>

<style scoped>
.days {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.day-card {
  width: 100%;
  text-align: left;
  padding: 22px 20px;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.02em;
  color: var(--ion-text-color);
  background: #ffffff;
  border: 1.5px solid #d5d0c1;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(22, 21, 15, 0.06);
  transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
}

.day-card:hover {
  transform: translateY(-2px);
  border-color: #16150f;
  box-shadow: 0 10px 24px rgba(22, 21, 15, 0.1);
}

.day-card:active {
  transform: translateY(0);
}
</style>
