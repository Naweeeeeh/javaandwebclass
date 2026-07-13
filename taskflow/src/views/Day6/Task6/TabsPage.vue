<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab1" href="/day6/tab1">
          <ion-icon aria-hidden="true" :icon="listOutline" />
          <ion-label>Tasks</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/day6/tab2">
          <ion-icon aria-hidden="true" :icon="checkmarkDoneOutline" />
          <ion-label>Completed</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/day6/tab3">
          <ion-icon aria-hidden="true" :icon="settingsOutline" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup>
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { homeOutline, listOutline, checkmarkDoneOutline, settingsOutline } from 'ionicons/icons';
</script>
