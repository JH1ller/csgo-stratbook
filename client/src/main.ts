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
  faCoffee,
  faHeadset,
  faThList,
  faCompressAlt,
  faExpandAlt,
  faCrosshairs,
  faExpand,
  faMapMarkerAlt,
  faPhotoVideo,
  faSortAmountUp,
  faSortAmountDown,
  faAlignCenter,
  faMousePointer,
  faICursor,
  faNetworkWired,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueTippy, { TippyComponent } from 'vue-tippy';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { isDesktop } from './utils/isDesktop';
import StorageService from './services/storage.service';
import { BreakpointService } from './services/breakpoint.service';
import VueKonva from 'vue-konva';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import { SENTRY_DSN } from './config';

Vue.use(VueTippy, {
  directive: 'tippy',
  animateFill: true,
  distance: 5,
  duration: [300, 100],
  delay: [300, 0],
  animation: 'scale',
});
Vue.component('tippy', TippyComponent);

Vue.use(VueKonva);

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
  faSignOutAlt,
  faCoffee,
  faDiscord,
  faHeadset,
  faThList,
  faCompressAlt,
  faExpandAlt,
  faCrosshairs,
  faExpand,
  faMapMarkerAlt,
  faPhotoVideo,
  faSortAmountUp,
  faSortAmountDown,
  faAlignCenter,
  faMousePointer,
  faICursor,
  faNetworkWired,
  faCog,
);

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    Vue,
    dsn: SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', 'stratbook.live', /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

Vue.component('fa-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

window.debugMode = process.env.NODE_ENV === 'development' || !!localStorage.getItem('debug');
window.desktopMode = isDesktop();

const storageService = StorageService.getInstance();

new BreakpointService(MQ => store.dispatch('app/updateBreakpoint', MQ));

const hasSession = !!storageService.get('has-session');

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
