import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/styles/core.scss';

import VueTippy, { TippyComponent } from 'vue-tippy';
import { isDesktop } from './utils/isDesktop';
import StorageService from './services/storage.service';
import { BreakpointService } from './services/breakpoint.service';
import VueKonva from 'vue-konva';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import { SENTRY_DSN } from './config';
import loadIcons from './utils/loadIcons';
import SvgIcon from './components/SvgIcon/SvgIcon.vue';

loadIcons();

Vue.use(VueTippy, {
  directive: 'tippy',
  animateFill: true,
  distance: 5,
  duration: [300, 100],
  delay: [300, 0],
  animation: 'scale',
});
Vue.component('tippy', TippyComponent);
Vue.component('SvgIcon', SvgIcon);

Vue.use(VueKonva);

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

Vue.config.productionTip = false;

window.debugMode = process.env.NODE_ENV !== 'production' || !!localStorage.getItem('debug');
window.desktopMode = isDesktop();

const storageService = StorageService.getInstance();

new BreakpointService((MQ) => store.dispatch('app/updateBreakpoint', MQ));

const hasSession = !!storageService.get('has-session');

(async () => {
  if (hasSession) {
    await store.dispatch('auth/refresh');
    await store.dispatch('auth/fetchProfile');
    await store.dispatch('loadDataFromStorage');
  }
  (window as any).intervalActive = false;

  // fade out app loader
  const loaderEl: HTMLDivElement = document.querySelector('.loader-wrapper')!;
  loaderEl.style.opacity = '0';
  loaderEl.ontransitionend = () => loaderEl.remove();

  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
})();
