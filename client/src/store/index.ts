import Vue from 'vue';
import Vuex from 'vuex';
import { appModule, AppState } from './modules/app';
import { FilterState, filterModule } from './modules/filter';
import { MapState, mapModule } from './modules/map';
import { StratState, stratModule } from './modules/strat';
import { authModule, AuthState } from './modules/auth';
import { TeamState, teamModule } from './modules/team';
import { utilityModule, UtilityState } from './modules/utility';

export interface Response {
  success?: string | boolean;
  error?: string;
}

export interface RootState {
  app: AppState;
  filter: FilterState;
  map: MapState;
  strat: StratState;
  auth: AuthState;
  team: TeamState;
  utility: UtilityState;
}

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app: appModule,
    filter: filterModule,
    map: mapModule,
    strat: stratModule,
    auth: authModule,
    team: teamModule,
    utility: utilityModule,
  },
  state: undefined,
  mutations: {},
  actions: {
    resetState({ dispatch, state }) {
      Object.keys(state).forEach(module => dispatch(`${module}/resetState`));
      localStorage.clear();
    },
    loadDataFromStorage({ dispatch }) {
      dispatch('auth/loadTokenFromStorage');
      dispatch('auth/loadProfileFromStorage');
      dispatch('map/loadCurrentMapFromStorage');
      dispatch('team/loadTeamInfoFromStorage');
      dispatch('team/loadTeamMembersFromStorage');
      dispatch('strat/loadStratsFromStorage');
      dispatch('utility/loadUtilitiesFromStorage');
    },
  },
  getters: {},
});
