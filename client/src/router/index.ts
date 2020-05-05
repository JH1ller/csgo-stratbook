import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Map from '../views/Map.vue';
import { mapsResolver } from '@/resolvers/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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