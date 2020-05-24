import Vue from 'vue';
import VueRouter from 'vue-router';
import StratsView from '../views/StratsView/StratsView.vue';
import LoginView from '../views/LoginView/LoginView.vue';
import RegisterView from '../views/RegisterView/RegisterView.vue';
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
    path: '/register',
    name: 'Register',
    component: RegisterView,
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
