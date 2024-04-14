import { NavigationGuard } from 'vue-router';
import store from '@/store';
import { Status } from '@/store/modules/auth';

export const mapResolver: NavigationGuard = async (_to, _from, next) => {
  if (store.state.auth.status === Status.LOGGED_IN_WITH_TEAM) {
    await store.dispatch('team/fetchTeamInfo');
  }
  next();
};
