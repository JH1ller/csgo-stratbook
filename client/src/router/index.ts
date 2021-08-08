import Vue from 'vue';
import VueRouter, { Route, RouteConfig } from 'vue-router';
import { RouteNames, Routes } from './router.models';
import { stratsResolver } from '@/views/StratsView/StratsView.resolver';
import { teamResolver } from '@/views/TeamView/TeamView.resolver';
import store from '@/store';
import { utilityResolver } from '@/views/UtilityView/UtilityView.resolver';

// * not using lazy loading for these two views, as they are both entrypoints to the app
import LoginView from '@/views/LoginView/LoginView.vue';
import StratsView from '@/views/StratsView/StratsView.vue';
import { noAuthGuard } from '@/guards/no-auth.guard';
import { authGuard } from '@/guards/auth.guard';
import { teamGuard } from '@/guards/team.guard';
import { noTeamGuard } from '@/guards/no-team.guard';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: RouteNames.Home,
    redirect: () => {
      if (store.getters['auth/hasAuth']) {
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
    meta: {
      authRequired: true,
      teamRequired: true,
    },
  },
  {
    path: '/utility',
    name: RouteNames.Utilities,
    component: () => import('@/views/UtilityView/UtilityView.vue'),
    beforeEnter: utilityResolver,
    meta: {
      authRequired: true,
      teamRequired: true,
    },
  },
  {
    path: '/login',
    name: RouteNames.Login,
    component: LoginView,
    meta: {
      noAuthRequired: true,
    },
  },
  {
    path: '/reset',
    name: RouteNames.ResetPassword,
    component: () => import('@/views/ResetPasswordView/ResetPasswordView.vue'),
    meta: {
      noAuthRequired: true,
    },
  },
  {
    path: '/forgot-password',
    name: RouteNames.ForgotPassword,
    component: () => import('@/views/ForgotPasswordView/ForgotPasswordView.vue'),
    meta: {
      noAuthRequired: true,
    },
  },
  {
    path: '/register',
    name: RouteNames.Register,
    component: () => import('@/views/RegisterView/RegisterView.vue'),
    meta: {
      noAuthRequired: true,
    },
  },
  {
    path: '/team',
    name: RouteNames.Team,
    component: () => import('@/views/TeamView/TeamView.vue'),
    beforeEnter: teamResolver,
    meta: {
      authRequired: true,
      teamRequired: true,
    },
  },
  {
    path: '/team/join',
    name: RouteNames.JoinTeam,
    component: () => import('@/views/JoinTeamView/JoinTeamView.vue'),
    meta: {
      authRequired: true,
      noTeamRequired: true,
    },
  },
  {
    path: '/profile',
    name: RouteNames.Profile,
    component: () => import('@/views/ProfileView/ProfileView.vue'),
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/share/:id',
    name: RouteNames.Share,
    redirect: (to: Route) => {
      store.dispatch('strat/addSharedStrat', to.params.id);
      return Routes.Strats;
    },
    meta: {
      authRequired: true,
      teamRequired: true,
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

/**
 * Route Guards
 */
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    const authGuardResult = authGuard(to, from, next);
    if (!authGuardResult) return;
  }

  if (to.matched.some(record => record.meta.noAuthRequired)) {
    const noAuthGuardResult = noAuthGuard(to, from, next);
    if (!noAuthGuardResult) return;
  }

  if (to.matched.some(record => record.meta.teamRequired)) {
    const teamGuardResult = teamGuard(to, from, next);
    if (!teamGuardResult) return;
  }

  if (to.matched.some(record => record.meta.noTeamRequired)) {
    const noTeamGuardResult = noTeamGuard(to, from, next);
    if (!noTeamGuardResult) return;
  }

  next();
});

export default router;
