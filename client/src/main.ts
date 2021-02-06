import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/styles/core.scss';
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
  faShareAlt,
  faDownload,
  faQuestionCircle,
  faInfoCircle,
  faTimes,
  faComment,
  faWifi,
  faChevronLeft,
  faChevronRight,
  faMinusCircle,
  faCheckCircle,
  faEllipsisV,
  faBalanceScale,
  faMap,
  faEraser,
  faFont,
  faPencilAlt,
  faArrowsAlt,
  faLongArrowAltRight,
  faExclamationTriangle,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueTippy, { TippyComponent } from 'vue-tippy';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

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
  faSave,
  faShareAlt,
  faTwitter,
  faDownload,
  faQuestionCircle,
  faInfoCircle,
  faTimes,
  faComment,
  faWifi,
  faChevronLeft,
  faChevronRight,
  faMinusCircle,
  faCheckCircle,
  faEllipsisV,
  faBalanceScale,
  faMap,
  faEraser,
  faFont,
  faPencilAlt,
  faArrowsAlt,
  faLongArrowAltRight,
  faCircle,
  faExclamationTriangle,
  faSignOutAlt
);
Vue.component('fa-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

(window as any).debugMode = process.env.NODE_ENV === 'development' || !!localStorage.getItem('debug');

const hasSession = !!localStorage.getItem('has-session');

(async () => {
  if (hasSession) {
    await store.dispatch('auth/refresh');
    await store.dispatch('auth/fetchProfile');
    await store.dispatch('loadDataFromStorage');
  }

  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
})();
