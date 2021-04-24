import { NavigationGuard } from 'vue-router';
import store from '@/store';
import { Response } from '@/store';

export const teamResolver: NavigationGuard = async (_to, _from, next) => {
  const teamResponse: Response = await store.dispatch('team/fetchTeamInfo');
  if (!teamResponse.success) {
    next(false);
    store.dispatch('app/showErrorDialog');
    return;
  }

  next();
};
