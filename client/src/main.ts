import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/styles/core.scss';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueTippy, { TippyComponent } from 'vue-tippy';
import { isDesktop } from './utils/isDesktop';
import StorageService from './services/storage.service';
import IconPack from './icons';
import axios from 'axios';

// TODO: move somewhere else
Vue.use(VueTippy, {
  directive: 'tippy',
  animateFill: true,
  distance: 5,
  duration: [300, 100],
  delay: [300, 0],
  animation: 'scale',
});
Vue.component('tippy', TippyComponent);

config.autoAddCss = false;
library.add(...IconPack);
Vue.component('fa-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.BASE_URL;

window.debugMode = process.env.NODE_ENV === 'development' || !!localStorage.getItem('debug');
window.desktopMode = isDesktop();

const storageService = StorageService.getInstance();

(async () => {
  await Promise.allSettled([store.dispatch('auth/fetchProfile'), store.dispatch('loadDataFromStorage')]);

  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
})();
