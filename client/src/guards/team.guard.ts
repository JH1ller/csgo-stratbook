import { Routes } from '@/router/router.models';
import { Status } from '@/services/models';
import store from '@/store';
import { NavigationGuard } from 'vue-router';

export const teamGuard: NavigationGuard = (to, _from, next) => {
  if (store.state.auth.status === Status.LOGGED_IN_WITH_TEAM) {
    next();
  } else {
    store.dispatch('app/showToast', { id: 'teamGuard/noTeam', text: 'You need to join a team first.' });
    store.dispatch('app/showDialog', {
      key: 'team-guard/confirm-redirect',
      text: 'You need to join a team first. Would you like to go to the join team page?'
    }).then(() => next(Routes.JoinTeam));
  }
}