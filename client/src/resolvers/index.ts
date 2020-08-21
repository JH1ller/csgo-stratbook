import { NavigationGuard } from 'vue-router';
import store from '@/store';
import { Routes } from '@/router/router.models';
import { Status } from '@/services/models';

export const stratsResolver: NavigationGuard = async (_to, _from, next) => {
  await store.dispatch('auth/fetchProfile');

  switch (store.state.auth.status) {
    case Status.NO_AUTH:
      next(Routes.Login);
      break;
    case Status.LOGGED_IN_NO_TEAM:
      next(Routes.Team);
      break;
    case Status.LOGGED_IN_WITH_TEAM:
      await store.dispatch('map/fetchMaps');
      next();
      break;
  }
};

export const teamResolver: NavigationGuard = async (_to, _from, next) => {
  await store.dispatch('auth/fetchProfile');

  switch (store.state.auth.status) {
    case Status.NO_AUTH:
      next(Routes.Login);
      break;
    case Status.LOGGED_IN_NO_TEAM:
      next();
      break;
    case Status.LOGGED_IN_WITH_TEAM:
      await store.dispatch('team/fetchTeamInfo');
      next();
      break;
  }
};

export const loginResolver: NavigationGuard = async (_to, _from, next) => {
  await store.dispatch('auth/fetchProfile');

  switch (store.state.auth.status) {
    case Status.NO_AUTH:
      next();
      break;
    case Status.LOGGED_IN_NO_TEAM:
      next(Routes.Team);
      break;
    case Status.LOGGED_IN_WITH_TEAM:
      next(Routes.Strats);
      break;
  }
};
