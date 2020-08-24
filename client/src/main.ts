import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

store.dispatch('auth/loadTokenFromStorage');
store.dispatch('auth/loadProfileFromStorage');
store.dispatch('map/loadMapsFromStorage');
store.dispatch('map/loadCurrentMapFromStorage');
store.dispatch('team/loadTeamInfoFromStorage');
store.dispatch('team/loadTeamMembersFromStorage');
store.dispatch('strat/loadStratsFromStorage');

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
