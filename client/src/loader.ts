import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api'
import LoaderView from '@/views/LoaderView/LoaderView.vue';
import { PiniaPlugin } from 'pinia'
import '@/styles/core.scss';

Vue.config.productionTip = false;

Vue.use(VueCompositionApi)
Vue.use(PiniaPlugin)


new Vue({
  render: h => h(LoaderView),
}).$mount('#app');
