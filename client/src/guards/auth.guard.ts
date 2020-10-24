import { Routes } from '@/router/router.models';
import { Status } from '@/services/models';
import store from '@/store';
import { NavigationGuard } from 'vue-router';

export const authGuard: NavigationGuard = (to, _from, next) => {
  if (store.state.auth.status === Status.NO_AUTH && to !== Routes.Login) {
    store.dispatch('app/showToast', { id: 'authGuard/noAuth', text: 'You need to login first.' });
    next(Routes.Login);
  } else {
    next();
  }
}