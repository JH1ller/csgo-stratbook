import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { RouteNames, Routes } from './router.models';
import { stratsResolver } from '@/views/StratsView/StratsView.resolver';
import { teamResolver } from '@/views/TeamView/TeamView.resolver';
import { joinTeamResolver } from '@/views/JoinTeamView/JoinTeamView.resolver';
import store from '@/store';
import { utilityResolver } from '@/views/UtilityView/UtilityView.resolver';

// * not using lazy loading for these two views, as they are both entrypoints to the app
import LoginView from '@/views/LoginView/LoginView.vue';
import StratsView from '@/views/StratsView/StratsView.vue';
import StorageService from '@/services/storage.service';
import TrackingService from '@/services/tracking.service';

Vue.use(VueRouter);

const storageService = StorageService.getInstance();
const trackingService = TrackingService.getInstance();

const routes = [
  {
    path: '/',
    name: RouteNames.Home,
    redirect: () => {
      if (storageService.get('has-session')) {
        return Routes.Strats;
      } else {
        return Routes.Login;
      }
    },
  },
  {
    path: '/strats',
    name: RouteNames.Strats,
    component: StratsView,
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
    component: LoginView,
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
    path: '/imprint',
    name: RouteNames.Imprint,
    component: () => import('@/views/ImprintView/ImprintView.vue'),
  },
];

const router = new VueRouter({
  routes,
});

router.afterEach(() => trackingService.page());

export default router;
