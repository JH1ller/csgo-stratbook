import { NavigationGuard } from 'vue-router';
import store, { Response } from '@/store';

import { authGuard } from '@/guards/auth.guard';
import { teamGuard } from '@/guards/team.guard';

export const teamResolver: NavigationGuard = async (to, from, next) => {
  await store.dispatch('auth/fetchProfile');

  const authGuardResult = authGuard(to, from, next);
  if (!authGuardResult) return;
  const teamGuardResult = await teamGuard(to, from, next);
  if (!teamGuardResult) return;

  const teamResponse: Response = await store.dispatch('team/fetchTeamInfo');
  if (!teamResponse.success) {
    next(false);
    return;
  }

  next();
};
