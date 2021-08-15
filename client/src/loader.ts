import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import { PiniaPlugin } from 'pinia';

import LoaderView from 'src/views/LoaderView/LoaderView';

import '@/styles/core.scss';

Vue.config.productionTip = false;

Vue.use(VueCompositionApi);
Vue.use(PiniaPlugin);

new Vue({
  render: (h) => h(LoaderView),
}).$mount('#app');
