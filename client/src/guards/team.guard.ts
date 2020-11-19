import { Routes, RouteNames } from '@/router/router.models';
import { Status } from '@/api/models';
import store from '@/store';
import { NavigationGuard } from 'vue-router';

export const teamGuard: NavigationGuard = async (_to, from, next): Promise<boolean> => {
  if (store.state.auth.status !== Status.LOGGED_IN_WITH_TEAM) {
    if (from.name === RouteNames.JoinTeam) {
      store.dispatch('app/showToast', { id: 'teamGuard/noTeam', text: 'You need to join a team first.' });
      next(false);
    } else {
      try {
        await store.dispatch('app/showDialog', {
          key: 'team-guard/confirm-redirect',
          text: 'You need to join a team first. Would you like to go to the join team page?',
        });
        next(Routes.JoinTeam);
      } catch (error) {
        next(false);
      }
    }
    return false;
  } else {
    return true;
  }
};
