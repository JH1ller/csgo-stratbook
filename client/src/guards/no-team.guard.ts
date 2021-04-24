import { Routes } from '@/router/router.models';
import store from '@/store';
import { NavigationGuard } from 'vue-router';

export const noTeamGuard: NavigationGuard = async (_to, _from, next) => {
  if (store.getters['auth/hasTeam']) {
    next(Routes.Strats);
    return false;
  } else {
    return true;
  }
};
