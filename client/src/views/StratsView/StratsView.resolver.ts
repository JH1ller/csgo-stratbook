import { NavigationGuard } from 'vue-router';
import store, { Response } from '@/store';
import { authGuard } from '@/guards/auth.guard';
import { teamGuard } from '@/guards/team.guard';

export const stratsResolver: NavigationGuard = async (to, from, next) => {
  //await store.dispatch('auth/fetchProfile');

  const authGuardResult: boolean = authGuard(to, from, next);
  if (!authGuardResult) return;
  const teamGuardResult: boolean = await teamGuard(to, from, next);
  if (!teamGuardResult) return;

  const [stratResponse, teamResponse, utilityResponse] = await Promise.all([
    store.dispatch('strat/fetchStrats'),
    store.dispatch('team/fetchTeamInfo'),
    store.dispatch('utility/fetchUtilities'),
  ]);

  if (!stratResponse.success || !teamResponse.success || !utilityResponse.success) {
    next(false);
    return;
  }

  next();
};
