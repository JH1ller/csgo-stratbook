import Vue from 'vue';
import Vuex from 'vuex';
import { appModule, AppState } from './modules/app';
import { FilterState, filterModule } from './modules/filter';
import { MapState, mapModule } from './modules/map';
import { StratState, stratModule } from './modules/strat';
import { authModule, AuthState } from './modules/auth';
import { TeamState, teamModule } from './modules/team';

export interface RootState {
  app: AppState;
  filter: FilterState;
  map: MapState;
  strat: StratState;
  auth: AuthState;
  team: TeamState;
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
      dispatch('map/loadStratMapFromStorage');
      dispatch('map/loadUtilityMapFromStorage');
      dispatch('team/loadTeamInfoFromStorage');
      dispatch('team/loadTeamMembersFromStorage');
      dispatch('strat/loadStratsFromStorage');
    },
  },
  getters: {},
});
