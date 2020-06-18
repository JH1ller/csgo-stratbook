import Vue from 'vue';
import VueRouter from 'vue-router';
import StratsView from '../views/StratsView/StratsView.vue';
import LoginView from '../views/LoginView/LoginView.vue';
import RegisterView from '../views/RegisterView/RegisterView.vue';
import TeamView from '../views/TeamView/TeamView.vue';
import ProfileView from '@/views/ProfileView/ProfileView.vue';
import {
  stratsResolver,
  profileResolver,
  teamResolver,
} from '@/resolvers/index';

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
    beforeEnter: teamResolver,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
