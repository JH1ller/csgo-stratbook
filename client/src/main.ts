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
import VuePortal from 'portal-vue';
import { Routes } from './router/router.models';

Vue.use(VuePortal);

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
        tracingOrigins: ['localhost', 'stratbook.live', 'stratbook.pro', /^\//],
      }),
      new Sentry.Replay(),
    ],
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,
    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,
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

const initStore = async () => {
  if (!window.desktopMode || storageService.get('refreshToken')) {
    await store.dispatch('auth/refresh');
  }

  if (storageService.get('has-session')) {
    await store.dispatch('auth/fetchProfile');
    await store.dispatch('loadDataFromStorage');
    router.onReady(() => {
      if (router.currentRoute.name === 'Login') {
        router.push(Routes.Strats);
      }
    });
  }
};

(async () => {
  if (window.desktopMode) {
    const ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.on('steam-auth', (_, token) => {
      console.log('steam-auth', token);
      storageService.set('refreshToken', token);
      initStore();
    });
  }
  await initStore();
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
