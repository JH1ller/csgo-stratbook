import { NavigationGuard } from 'vue-router';
import { authGuard } from '@/guards/auth.guard';
import store from '@/store';
import { joinTeamGuard } from '@/guards/joinTeam.guard';

export const joinTeamResolver: NavigationGuard = async (to, from, next) => {
  await store.dispatch('auth/fetchProfile');
  
  const authGuardResult = authGuard(to, from, next);
  if (!authGuardResult) return;

  const joinTeamGuardResult = joinTeamGuard(to, from, next);
  if (!joinTeamGuardResult) return;

  next();
};
