import Vue from 'vue';
import VueRouter from 'vue-router';
import StratsView from '../views/StratsView/StratsView.vue';
import LoginView from '../views/LoginView/LoginView.vue';
import RegisterView from '../views/RegisterView/RegisterView.vue';
import TeamView from '../views/TeamView/TeamView.vue';
import Map from '../views/Map.vue';
import { stratsResolver, profileResolver } from '@/resolvers/index';
import AuthService from '@/services/AuthService';

const authService = AuthService.getInstance();

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: (to: any) => {
      return { name: 'Strats' };
    },
  },
  {
    path: '/strats',
    name: 'Strats',
    component: StratsView,
    beforeEnter: stratsResolver,
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
    path: '/team',
    name: 'Team',
    component: TeamView,
    beforeEnter: profileResolver,
  },
];

const router = new VueRouter({
  routes,
});

//router.beforeEach(profileResolver);

export default router;
