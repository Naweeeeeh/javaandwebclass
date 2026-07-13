import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import { IonicVue } from '@ionic/vue';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import './theme/variables.css';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)
  .use(IonicVue)
  .use(pinia)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});
defineCustomElements(window);
