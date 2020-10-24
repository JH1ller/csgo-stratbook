import Vue from 'vue';
import VueRouter from 'vue-router';
import StratsView from '../views/StratsView/StratsView.vue';
import LoginView from '../views/LoginView/LoginView.vue';
import RegisterView from '../views/RegisterView/RegisterView.vue';
import TeamView from '../views/TeamView/TeamView.vue';
import ProfileView from '@/views/ProfileView/ProfileView.vue';
import { stratsResolver, teamResolver, loginResolver, globalResolver } from '@/resolvers/index';
import { RouteNames, Routes } from './router.models';
import JoinTeamView from '@/views/JoinTeamView/JoinTeamView';

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
    beforeEnter: loginResolver,
  },
  {
    path: '/register',
    name: RouteNames.Register,
    component: RegisterView,
    beforeEnter: loginResolver,
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

router.beforeEach(globalResolver);

export default router;
