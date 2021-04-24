import { NavigationGuard } from 'vue-router';
import store, { Response } from '@/store';

export const stratsResolver: NavigationGuard = async (_to, _from, next) => {
  const responses = await Promise.allSettled<Promise<Response>[]>([
    store.dispatch('strat/fetchStrats'),
    store.dispatch('team/fetchTeamInfo'),
    store.dispatch('utility/fetchUtilities'),
  ]);

  if (responses.some(res => res.status === 'fulfilled' && res.value.success)) {
    next(false);
    store.dispatch('app/showErrorDialog');
    return;
  }

  next();
};
