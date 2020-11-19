import { Module } from 'vuex';
import { RootState } from '..';
import { Sides, StratTypes } from '@/api/models';

const SET_PLAYER_FILTER = 'SET_PLAYER_FILTER';
const SET_TYPE_FILTER = 'SET_TYPE_FILTER';
const SET_SIDE_FILTER = 'SET_SIDE_FILTER';
const SET_NAME_FILTER = 'SET_NAME_FILTER';
const RESET_STATE = 'RESET_STATE';

export interface Filters {
  name: string;
  player: string;
  side: Sides | null;
  type: StratTypes | null;
}

export interface FilterState {
  filters: Filters
}

const filterInitialState = (): FilterState => ({
  filters: {
    name: '',
    player: '',
    side: null,
    type: null,
  },
});

export const filterModule: Module<FilterState, RootState> = {
  namespaced: true,
  state: filterInitialState(),
  getters: {},
  actions: {
    updatePlayerFilter({ commit }, value: string) {
      commit(SET_PLAYER_FILTER, value);
    },
    updateTypeFilter({ commit }, value: StratTypes | null) {
      commit(SET_TYPE_FILTER, value);
    },
    updateSideFilter({ commit }, value: Sides | null) {
      commit(SET_SIDE_FILTER, value);
    },
    updateNameFilter({ commit }, value: string) {
      commit(SET_NAME_FILTER, value);
    },
    clearFilters({ commit }) {
      commit(SET_PLAYER_FILTER, '');
      commit(SET_TYPE_FILTER, null);
      commit(SET_SIDE_FILTER, null);
      commit(SET_NAME_FILTER, '');
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_PLAYER_FILTER](state, value: string) {
      state.filters.player = value;
    },
    [SET_TYPE_FILTER](state, value: StratTypes | null) {
      state.filters.type = value;
    },
    [SET_SIDE_FILTER](state, value: Sides | null) {
      state.filters.side = value;
    },
    [SET_NAME_FILTER](state, value: string) {
      state.filters.name = value;
    },
    [RESET_STATE](state) {
      Object.assign(state, filterInitialState());
    },
  },
};
