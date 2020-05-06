import Vue from 'vue';
import VueRouter from 'vue-router';
import StratsView from '../views/StratsView.vue';
import Map from '../views/Map.vue';
import { mapsResolver } from '@/resolvers/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'Strats' },
  },
  {
    path: '/strats',
    name: 'Strats',
    component: StratsView,
    beforeEnter: mapsResolver
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