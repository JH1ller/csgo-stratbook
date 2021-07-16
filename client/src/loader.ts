import Vue from 'vue';
import LoaderView from '@/views/LoaderView/LoaderView.vue';
import '@/styles/core.scss';

Vue.config.productionTip = false;

new Vue({
  render: h => h(LoaderView),
}).$mount('#app');
