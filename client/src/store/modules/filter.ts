import { Sides } from '@/api/models/Sides';
import { StratTypes } from '@/api/models/StratTypes';
import { Module } from 'vuex';
import { RootState } from '..';

const SET_CONTENT_FILTER = 'SET_CONTENT_FILTER';
const SET_TYPE_FILTER = 'SET_TYPE_FILTER';
const SET_SIDE_FILTER = 'SET_SIDE_FILTER';
const SET_NAME_FILTER = 'SET_NAME_FILTER';
const RESET_STATE = 'RESET_STATE';

export interface FilterState {
  name: string;
  content: string;
  side: Sides | null;
  type: StratTypes | null;
}

const filterInitialState = (): FilterState => ({
  name: '',
  content: '',
  side: null,
  type: null,
});

export const filterModule: Module<FilterState, RootState> = {
  namespaced: true,
  state: filterInitialState(),
  getters: {
    filterStateObject(state: FilterState) {
      return state;
    },
  },
  actions: {
    updateContentFilter({ commit }, value: string) {
      commit(SET_CONTENT_FILTER, value);
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
      commit(SET_CONTENT_FILTER, '');
      commit(SET_TYPE_FILTER, null);
      commit(SET_SIDE_FILTER, null);
      commit(SET_NAME_FILTER, '');
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_CONTENT_FILTER](state, value: string) {
      state.content = value;
    },
    [SET_TYPE_FILTER](state, value: StratTypes | null) {
      state.type = value;
    },
    [SET_SIDE_FILTER](state, value: Sides | null) {
      state.side = value;
    },
    [SET_NAME_FILTER](state, value: string) {
      state.name = value;
    },
    [RESET_STATE](state) {
      Object.assign(state, filterInitialState());
    },
  },
};
