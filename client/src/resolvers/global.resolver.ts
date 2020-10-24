import { Player } from '@/services/models';
import store from '@/store';
import { isEmpty } from '@/utils/objectEmpty';
import { NavigationGuard } from 'vue-router';

export const globalResolver: NavigationGuard = async (_to, _from, next) => {
  if (isEmpty(store.state.auth.profile) && store.state.auth.token) {
    await store.dispatch('auth/fetchProfile');
  } else if (store.state.auth.token) {
    store.dispatch('auth/fetchProfile');
  }
  if (isEmpty(store.state.team.teamInfo) && (store.state.auth.profile as Player).team) {
    await store.dispatch('team/fetchTeamInfo');
  } else if ((store.state.auth.profile as Player).team) {
    store.dispatch('team/fetchTeamInfo');
  }
  if (store.state.auth.status === Status.LOGGED_IN_WITH_TEAM) {
    WebSocketService.getInstance().connect(); // * starting socket connection
  }
  next();

  try {
    await store.
  } catch (error) {
    
  }
};