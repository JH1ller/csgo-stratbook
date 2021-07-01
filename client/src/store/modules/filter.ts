import { Sides } from '@/api/models/Sides';
import { StratTypes } from '@/api/models/StratTypes';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import TrackingService from '@/services/tracking.service';
import { Module } from 'vuex';
import { RootState } from '..';

const SET_STRAT_CONTENT_FILTER = 'SET_STRAT_CONTENT_FILTER';
const SET_STRAT_TYPE_FILTER = 'SET_STRAT_TYPE_FILTER';
const SET_STRAT_SIDE_FILTER = 'SET_STRAT_SIDE_FILTER';
const SET_STRAT_NAME_FILTER = 'SET_STRAT_NAME_FILTER';
const SET_UTILITY_TYPE_FILTER = 'SET_UTILITY_TYPE_FILTER';
const SET_UTILITY_SIDE_FILTER = 'SET_UTILITY_STRAT_SIDE_FILTER';
const SET_UTILITY_NAME_FILTER = 'SET_UTILITY_STRAT_NAME_FILTER';
const RESET_STATE = 'RESET_STATE';

export interface StratFilters {
  name: string;
  content: string;
  side: Sides | null;
  type: StratTypes | null;
}
export interface UtilityFilters {
  name: string;
  side: Sides | null;
  type: UtilityTypes | null;
}

export interface FilterState {
  stratFilters: StratFilters;
  utilityFilters: UtilityFilters;
}

const filterInitialState = (): FilterState => ({
  stratFilters: {
    name: '',
    content: '',
    side: null,
    type: null,
  },
  utilityFilters: {
    name: '',
    side: null,
    type: null,
  },
});

const trackingService = TrackingService.getInstance();

export const filterModule: Module<FilterState, RootState> = {
  namespaced: true,
  state: filterInitialState(),
  getters: {
    activeUtilityFilterCount(state): number {
      return Object.values(state.utilityFilters).filter(v => v).length;
    },
    activeStratFilterCount(state): number {
      return Object.values(state.stratFilters).filter(v => v).length;
    },
  },
  actions: {
    updateStratContentFilter({ commit }, value: string) {
      commit(SET_STRAT_CONTENT_FILTER, value);
    },
    updateStratTypeFilter({ commit }, value: StratTypes | null) {
      commit(SET_STRAT_TYPE_FILTER, value);
      trackingService.track('Filter: Strat Type', { value: value as string });
    },
    updateStratSideFilter({ commit }, value: Sides | null) {
      commit(SET_STRAT_SIDE_FILTER, value);
      trackingService.track('Filter: Strat Side', { value: value as string });
    },
    updateStratNameFilter({ commit }, value: string) {
      commit(SET_STRAT_NAME_FILTER, value);
    },
    clearStratFilters({ commit }) {
      commit(SET_STRAT_CONTENT_FILTER, '');
      commit(SET_STRAT_TYPE_FILTER, null);
      commit(SET_STRAT_SIDE_FILTER, null);
      commit(SET_STRAT_NAME_FILTER, '');
    },
    updateUtilityTypeFilter({ commit }, value: UtilityTypes | null) {
      commit(SET_UTILITY_TYPE_FILTER, value);
      trackingService.track('Filter: Utility Type', { value: value as string });
    },
    updateUtilitySideFilter({ commit }, value: Sides | null) {
      commit(SET_UTILITY_SIDE_FILTER, value);
      trackingService.track('Filter: Utility Side', { value: value as string });
    },
    updateUtilityNameFilter({ commit }, value: string) {
      commit(SET_UTILITY_NAME_FILTER, value);
    },
    clearUtilityFilters({ commit }) {
      commit(SET_UTILITY_TYPE_FILTER, null);
      commit(SET_UTILITY_SIDE_FILTER, null);
      commit(SET_UTILITY_NAME_FILTER, '');
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_STRAT_CONTENT_FILTER](state, value: string) {
      state.stratFilters.content = value;
    },
    [SET_STRAT_TYPE_FILTER](state, value: StratTypes | null) {
      state.stratFilters.type = value;
    },
    [SET_STRAT_SIDE_FILTER](state, value: Sides | null) {
      state.stratFilters.side = value;
    },
    [SET_STRAT_NAME_FILTER](state, value: string) {
      state.stratFilters.name = value;
    },
    [SET_UTILITY_TYPE_FILTER](state, value: UtilityTypes | null) {
      state.utilityFilters.type = value;
    },
    [SET_UTILITY_SIDE_FILTER](state, value: Sides | null) {
      state.utilityFilters.side = value;
    },
    [SET_UTILITY_NAME_FILTER](state, value: string) {
      state.utilityFilters.name = value;
    },
    [RESET_STATE](state) {
      Object.assign(state, filterInitialState());
    },
  },
};
