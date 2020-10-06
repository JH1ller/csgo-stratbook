import { NavigationGuard } from 'vue-router';
import store from '@/store';
import { Routes } from '@/router/router.models';
import { Status, Player } from '@/services/models';
import { isEmpty } from '@/utils/objectEmpty';
import WebSocketService from '@/services/WebSocketService';

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
};

export const stratsResolver: NavigationGuard = async (_to, _from, next) => {
  switch (store.state.auth.status) {
    case Status.NO_AUTH:
      store.dispatch('app/showToast', { id: 'stratsResolver/noAuth', text: 'You need to login first.' });
      next(Routes.Login);
      break;
    case Status.LOGGED_IN_NO_TEAM:
      store.dispatch('app/showToast', { id: 'stratsResolver/noTeam', text: 'You need to join a team first.' });
      next(Routes.Team);
      break;
    case Status.LOGGED_IN_WITH_TEAM:
      await store.dispatch('map/fetchMaps');
      next();
      break;
  }
};

export const teamResolver: NavigationGuard = async (_to, _from, next) => {
  switch (store.state.auth.status) {
    case Status.NO_AUTH:
      store.dispatch('app/showToast', { id: 'teamResolver/noAuth', text: 'You need to login first.' });
      next(Routes.Login);
      break;
    case Status.LOGGED_IN_NO_TEAM:
      next();
      break;
    case Status.LOGGED_IN_WITH_TEAM:
      await store.dispatch('team/fetchTeamInfo');
      next();
      break;
  }
};

export const loginResolver: NavigationGuard = async (_to, _from, next) => {
  switch (store.state.auth.status) {
    case Status.NO_AUTH:
      next();
      break;
    case Status.LOGGED_IN_NO_TEAM:
      next(Routes.Team);
      break;
    case Status.LOGGED_IN_WITH_TEAM:
      next(Routes.Strats);
      break;
  }
};
