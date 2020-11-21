import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import StratsView from '../views/StratsView/StratsView.vue';
import LoginView from '../views/LoginView/LoginView.vue';
import RegisterView from '../views/RegisterView/RegisterView.vue';
import TeamView from '../views/TeamView/TeamView.vue';
import ProfileView from '@/views/ProfileView/ProfileView.vue';
import { RouteNames, Routes } from './router.models';
import JoinTeamView from '@/views/JoinTeamView/JoinTeamView.vue';
import { stratsResolver } from '@/views/StratsView/StratsView.resolver';
import { teamResolver } from '@/views/TeamView/TeamView.resolver';
import { joinTeamResolver } from '@/views/JoinTeamView/JoinTeamView.resolver';
import store from '@/store';

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
    path: '/team/join',
    name: RouteNames.JoinTeam,
    component: JoinTeamView,
    beforeEnter: joinTeamResolver,
  },
  {
    path: '/profile',
    name: RouteNames.Profile,
    component: ProfileView,
  },
  {
    path: '/share/:id',
    name: RouteNames.Share,
    redirect: (to: Route) => {
      store.dispatch('strat/addSharedStrat', to.params.id);
      return Routes.Strats;
    }
  },
];

const router = new VueRouter({
  routes,
});

export default router;
