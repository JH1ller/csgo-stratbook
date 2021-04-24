import { Routes, RouteNames } from '@/router/router.models';
import store from '@/store';
import { NavigationGuard } from 'vue-router';

export const noAuthGuard: NavigationGuard = (to, _from, next): boolean => {
  if (store.getters['auth/hasAuth']) {
    if (to.name !== RouteNames.Strats) {
      next(Routes.Strats);
    } else {
      next(false);
    }
    return false;
  } else {
    return true;
  }
};
