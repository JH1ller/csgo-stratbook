import { Routes, RouteNames } from '@/router/router.models';
import { Status } from '@/api/models';
import store from '@/store';
import { NavigationGuard } from 'vue-router';

export const authGuard: NavigationGuard = (to, _from, next): boolean => {
  if (store.state.auth.status === Status.NO_AUTH) {
    if (to.name !== RouteNames.Login) {
      store.dispatch('app/showToast', { id: 'authGuard/noAuth', text: 'You need to login first.' });
      next(Routes.Login);
    } else {
      next(false);
    }
    return false;
  } else {
    return true;
  }
};
