import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import {
  faEdit,
  faTrashAlt,
  faBan,
  faFilm,
  faCheck,
  faFilter,
  faPlus,
  faTools,
  faUtensils,
  faBoxes,
  faUsers,
  faChess,
  faCopy,
  faCrown,
  faGamepad,
  faBomb,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

config.autoAddCss = false;
library.add(
  faEdit,
  faTrashAlt,
  faBan,
  faFilm,
  faCheck,
  faFilter,
  faPlus,
  faTools,
  faUtensils,
  faBoxes,
  faUsers,
  faChess,
  faCopy,
  faCrown,
  faGamepad,
  faBomb,
  faSave
);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

store.dispatch('loadDataFromStorage');

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
