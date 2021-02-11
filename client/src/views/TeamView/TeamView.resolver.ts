import { NavigationGuard } from 'vue-router';
import store from '@/store';
import { Response } from '@/store';
import { authGuard } from '@/guards/auth.guard';
import { teamGuard } from '@/guards/team.guard';
import { objectEmpty } from '@/utils/objectEmpty';

export const teamResolver: NavigationGuard = async (to, from, next) => {
  await store.dispatch('auth/fetchProfile');

  const authGuardResult = authGuard(to, from, next);
  if (!authGuardResult) return;
  const teamGuardResult = await teamGuard(to, from, next);
  if (!teamGuardResult) return;

  //* if there are maps loaded from localStorage load strats async, otherwise wait for result
  if (!objectEmpty(store.state.team.teamInfo)) {
    store.dispatch('team/fetchTeamInfo');
  } else {
    const teamResponse: Response = await store.dispatch('team/fetchTeamInfo');
    if (!teamResponse.success) {
      next(false);
      return;
    }
  }

  next();
};
