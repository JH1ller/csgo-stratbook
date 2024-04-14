import { Sides } from '@/api/models/Sides';
import { StratTypes } from '@/api/models/StratTypes';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import StorageService from '@/services/storage.service';
import TrackingService from '@/services/tracking.service';
import { Module } from 'vuex';
import { RootState } from '..';

const SET_STRAT_CONTENT_FILTER = 'SET_STRAT_CONTENT_FILTER';
const SET_STRAT_TYPE_FILTER = 'SET_STRAT_TYPE_FILTER';
const SET_STRAT_SIDE_FILTER = 'SET_STRAT_SIDE_FILTER';
const SET_STRAT_NAME_FILTER = 'SET_STRAT_NAME_FILTER';
const SET_STRAT_INACTIVE_FILTER = 'SET_STRAT_INACTIVE_FILTER';
const SET_STRAT_LABEL_FILTER = 'SET_STRAT_LABEL_FILTER';
const SET_UTILITY_TYPE_FILTER = 'SET_UTILITY_TYPE_FILTER';
const SET_UTILITY_SIDE_FILTER = 'SET_UTILITY_STRAT_SIDE_FILTER';
const SET_UTILITY_NAME_FILTER = 'SET_UTILITY_STRAT_NAME_FILTER';
const SET_UTILITY_LABEL_FILTER = 'SET_UTILITY_LABEL_FILTER';
const SET_STRAT_FILTER_BY_KEY = 'SET_STRAT_FILTER_BY_KEY';
const SET_UTIL_FILTER_BY_KEY = 'SET_UTIL_FILTER_BY_KEY';
const RESET_STATE = 'RESET_STATE';

export interface StratFilters {
  name: string;
  content: string;
  side: Sides | null;
  types: StratTypes[];
  inactive: boolean;
  labels: string[];
}
export interface UtilityFilters {
  name: string;
  side: Sides | null;
  type: UtilityTypes | null;
  labels: string[];
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
    types: [],
    inactive: false,
    labels: [],
  },
  utilityFilters: {
    name: '',
    side: null,
    type: null,
    labels: [],
  },
});

const trackingService = TrackingService.getInstance();
const storageService = StorageService.getInstance();

export const filterModule: Module<FilterState, RootState> = {
  namespaced: true,
  state: filterInitialState(),
  getters: {
    activeUtilityFilterCount(state): number {
      return Object.values(state.utilityFilters).filter((v) => (Array.isArray(v) ? v.length : v)).length;
    },
    activeStratFilterCount(state): number {
      return Object.values(state.stratFilters).filter((v) => (Array.isArray(v) ? v.length : v)).length;
    },
  },
  actions: {
    updateStratContentFilter({ commit, state }, value: string) {
      commit(SET_STRAT_CONTENT_FILTER, value);
      storageService.set('filters', state);
    },
    updateStratTypeFilter({ commit, state }, value: StratTypes[]) {
      commit(SET_STRAT_TYPE_FILTER, value);
      storageService.set('filters', state);
      trackingService.track('Filter: Strat Types', { value: value });
    },
    updateStratSideFilter({ commit, state }, value: Sides | null) {
      commit(SET_STRAT_SIDE_FILTER, value);
      storageService.set('filters', state);
      trackingService.track('Filter: Strat Side', { value: value as string });
    },
    updateStratNameFilter({ commit, state }, value: string) {
      commit(SET_STRAT_NAME_FILTER, value);
      storageService.set('filters', state);
    },
    updateStratInactiveFilter({ commit, state }, value: boolean) {
      commit(SET_STRAT_INACTIVE_FILTER, value);
      storageService.set('filters', state);
    },
    updateStratLabelsFilter({ commit, state }, value: string[]) {
      commit(SET_STRAT_LABEL_FILTER, value);
      storageService.set('filters', state);
    },
    clearStratFilters({ commit }) {
      commit(SET_STRAT_CONTENT_FILTER, '');
      commit(SET_STRAT_TYPE_FILTER, []);
      commit(SET_STRAT_SIDE_FILTER, null);
      commit(SET_STRAT_NAME_FILTER, '');
      commit(SET_STRAT_INACTIVE_FILTER, false);
      commit(SET_STRAT_LABEL_FILTER, []);
      storageService.remove('filters');
    },
    updateUtilityTypeFilter({ commit, state }, value: UtilityTypes | null) {
      commit(SET_UTILITY_TYPE_FILTER, value);
      storageService.set('filters', state);
      trackingService.track('Filter: Utility Type', { value: value as string });
    },
    updateUtilitySideFilter({ commit, state }, value: Sides | null) {
      commit(SET_UTILITY_SIDE_FILTER, value);
      storageService.set('filters', state);
      trackingService.track('Filter: Utility Side', { value: value as string });
    },
    updateUtilityNameFilter({ commit, state }, value: string) {
      commit(SET_UTILITY_NAME_FILTER, value);
      storageService.set('filters', state);
    },
    updateUtilityLabelsFilter({ commit, state }, value: string[]) {
      commit(SET_UTILITY_LABEL_FILTER, value);
      storageService.set('filters', state);
    },
    clearUtilityFilters({ commit }) {
      commit(SET_UTILITY_TYPE_FILTER, null);
      commit(SET_UTILITY_SIDE_FILTER, null);
      commit(SET_UTILITY_NAME_FILTER, '');
      commit(SET_UTILITY_LABEL_FILTER, []);
      storageService.remove('filters');
    },
    loadFiltersFromStorage({ commit }) {
      const filterState = storageService.get<FilterState>('filters');
      if (filterState?.stratFilters) {
        for (const filterKey in filterState.stratFilters) {
          commit(SET_STRAT_FILTER_BY_KEY, [filterKey, filterState.stratFilters[filterKey as keyof StratFilters]]);
        }
      }
      if (filterState?.utilityFilters) {
        for (const filterKey in filterState.utilityFilters) {
          commit(SET_UTIL_FILTER_BY_KEY, [filterKey, filterState.utilityFilters[filterKey as keyof UtilityFilters]]);
        }
      }
    },
    resetState({ commit }) {
      commit(RESET_STATE);
      storageService.remove('filters');
    },
  },
  mutations: {
    [SET_STRAT_CONTENT_FILTER](state, value: string) {
      state.stratFilters.content = value;
    },
    [SET_STRAT_TYPE_FILTER](state, value: StratTypes[]) {
      state.stratFilters.types = value;
    },
    [SET_STRAT_SIDE_FILTER](state, value: Sides | null) {
      state.stratFilters.side = value;
    },
    [SET_STRAT_NAME_FILTER](state, value: string) {
      state.stratFilters.name = value;
    },
    [SET_STRAT_INACTIVE_FILTER](state, value: boolean) {
      state.stratFilters.inactive = value;
    },
    [SET_STRAT_LABEL_FILTER](state, value: string[]) {
      state.stratFilters.labels = value;
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
    [SET_UTILITY_LABEL_FILTER](state, value: string[]) {
      state.utilityFilters.labels = value;
    },
    [SET_STRAT_FILTER_BY_KEY](state, [key, value]: [keyof StratFilters, any]) {
      (state.stratFilters[key] as any) = value;
    },
    [SET_UTIL_FILTER_BY_KEY](state, [key, value]: [keyof UtilityFilters, any]) {
      (state.utilityFilters[key] as any) = value;
    },
    [RESET_STATE](state) {
      Object.assign(state, filterInitialState());
    },
  },
};
