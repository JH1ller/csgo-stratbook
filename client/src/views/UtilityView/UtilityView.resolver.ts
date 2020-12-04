import { NavigationGuard } from 'vue-router';
import store, { Response } from '@/store';
import { authGuard } from '@/guards/auth.guard';
import { teamGuard } from '@/guards/team.guard';

export const utilityResolver: NavigationGuard = async (to, from, next) => {
  await store.dispatch('auth/fetchProfile');

  const authGuardResult: boolean = authGuard(to, from, next);
  if (!authGuardResult) return;
  const teamGuardResult: boolean = await teamGuard(to, from, next);
  if (!teamGuardResult) return;

  if (store.state.utility.utilities.length) {
    store.dispatch('utility/fetchUtilities');
  } else {
    const utilityResponse: Response = await store.dispatch('utility/fetchUtilities');
    if (!utilityResponse.success) {
      next(false);
      return;
    }
  }

  next();
};
