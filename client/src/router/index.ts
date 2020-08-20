import Vue from 'vue';
import VueRouter from 'vue-router';
import StratsView from '../views/StratsView/StratsView.vue';
import LoginView from '../views/LoginView/LoginView.vue';
import RegisterView from '../views/RegisterView/RegisterView.vue';
import TeamView from '../views/TeamView/TeamView.vue';
import ProfileView from '@/views/ProfileView/ProfileView.vue';
import { stratsResolver, teamResolver } from '@/resolvers/index';
import { RouteNames, Routes } from './router.models';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: RouteNames.Home,
    redirect: (to: any) => {
      return Routes.Strats;
    },
  },
  {
    path: '/strats',
    name: RouteNames.Strats,
    component: StratsView,
    beforeEnter: stratsResolver,
  },
  {
    path: '/login',
    name: RouteNames.Login,
    component: LoginView,
  },
  {
    path: '/register',
    name: RouteNames.Register,
    component: RegisterView,
  },
  {
    path: '/team',
    name: RouteNames.Team,
    component: TeamView,
    beforeEnter: teamResolver,
  },
  {
    path: '/profile',
    name: RouteNames.Profile,
    component: ProfileView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
