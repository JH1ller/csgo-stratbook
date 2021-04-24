import { NavigationGuard } from 'vue-router';
import store, { Response } from '@/store';

export const utilityResolver: NavigationGuard = async (_to, _from, next) => {
  const utilityResponse: Response = await store.dispatch('utility/fetchUtilities');
  if (!utilityResponse.success) {
    next(false);
    store.dispatch('app/showErrorDialog');
    return;
  }

  next();
};
