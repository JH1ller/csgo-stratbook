import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { RouteNames, Routes } from './router.models';
import { stratsResolver } from '@/views/StratsView/StratsView.resolver';
import { teamResolver } from '@/views/TeamView/TeamView.resolver';
import { joinTeamResolver } from '@/views/JoinTeamView/JoinTeamView.resolver';
import store from '@/store';
import { utilityResolver } from '@/views/UtilityView/UtilityView.resolver';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: RouteNames.Home,
    redirect: () => {
      return Routes.Strats;
    },
  },
  {
    path: '/strats',
    name: RouteNames.Strats,
    component: () => import('@/views/StratsView/StratsView.vue'),
    beforeEnter: stratsResolver,
  },
  {
    path: '/utility',
    name: RouteNames.Utilities,
    component: () => import('@/views/UtilityView/UtilityView.vue'),
    beforeEnter: utilityResolver,
  },
  {
    path: '/login',
    name: RouteNames.Login,
    component: () => import('@/views/LoginView/LoginView.vue'),
  },
  {
    path: '/reset',
    name: RouteNames.ResetPassword,
    component: () => import('@/views/ResetPasswordView/ResetPasswordView.vue'),
  },
  {
    path: '/forgot-password',
    name: RouteNames.ForgotPassword,
    component: () => import('@/views/ForgotPasswordView/ForgotPasswordView.vue'),
  },
  {
    path: '/register',
    name: RouteNames.Register,
    component: () => import('@/views/RegisterView/RegisterView.vue'),
  },
  {
    path: '/team',
    name: RouteNames.Team,
    component: () => import('@/views/TeamView/TeamView.vue'),
    beforeEnter: teamResolver,
  },
  {
    path: '/team/join',
    name: RouteNames.JoinTeam,
    component: () => import('@/views/JoinTeamView/JoinTeamView.vue'),
    beforeEnter: joinTeamResolver,
  },
  {
    path: '/profile',
    name: RouteNames.Profile,
    component: () => import('@/views/ProfileView/ProfileView.vue'),
  },
  {
    path: '/share/:id',
    name: RouteNames.Share,
    redirect: (to: Route) => {
      store.dispatch('strat/addSharedStrat', to.params.id);
      return Routes.Strats;
    },
  },
  {
    path: '/faq',
    name: RouteNames.Faq,
    component: () => import('@/views/FaqView/FaqView.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
