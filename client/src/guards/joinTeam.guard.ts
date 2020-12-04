import { Routes } from '@/router/router.models';
import store from '@/store';
import { Status } from '@/store/modules/auth';
import { NavigationGuard } from 'vue-router';

export const joinTeamGuard: NavigationGuard = async (_to, _from, next) => {
  if (store.state.auth.status === Status.LOGGED_IN_WITH_TEAM) {
    next(Routes.Team);
    return false;
  } else {
    return true;
  }
};
