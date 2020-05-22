import Vue from 'vue';
import VueRouter from 'vue-router';
import StratsView from '../views/StratsView/StratsView.vue';
import LoginView from '../views/LoginView/LoginView.vue';
import Map from '../views/Map.vue';
import { mapsResolver } from '@/resolvers/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: (to: any) => {
      return { name: 'Login' };
    },
  },
  {
    path: '/strats',
    name: 'Strats',
    component: StratsView,
    beforeEnter: mapsResolver,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/map/:map',
    name: 'Map',
    component: Map,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
