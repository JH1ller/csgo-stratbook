import { Module } from 'vuex';
import { RootState } from '..';
import { Strat } from '@/api/models/Strat';
import api from '@/api/base';
import { Team } from '@/api/models/Team';
import TrackingService from '@/services/tracking.service';
import { extractTextFromHTML } from '@/utils/extractTextFromHTML';
import StorageService from '@/services/storage.service';
import { sortDateAddedASC, sortDateAddedDESC } from '@/utils/sortFunctions';

const SET_STRATS = 'SET_STRATS';

const ADD_STRAT = 'ADD_STRAT';
const UPDATE_STRAT = 'UPDATE_STRAT';
const DELETE_STRAT = 'DELETE_STRAT';
const SET_COLLAPSED = 'SET_COLLAPSED';
const SET_EDITED = 'SET_EDITED';
const SET_SORT = 'SET_SORT';

const RESET_STATE = 'RESET_STATE';

export enum Sort {
  DateAddedASC,
  DateAddedDESC,
}

export interface StratState {
  strats: Strat[];
  collapsedStrats: string[];
  editedStrats: string[];
  sort: Sort;
}

const stratInitialState = (): StratState => ({
  strats: [],
  collapsedStrats: [],
  editedStrats: [],
  sort: Sort.DateAddedASC,
});

const trackingService = TrackingService.getInstance();
const storageService = StorageService.getInstance();

export const stratModule: Module<StratState, RootState> = {
  namespaced: true,
  state: stratInitialState(),
  getters: {
    stratsOfCurrentMap(state, _getters, rootState): Strat[] {
      return state.strats.filter(strat => strat.map === rootState.map.currentMap);
    },
    filteredStratsOfCurrentMap(_state, getters, rootState): Strat[] {
      return (getters.stratsOfCurrentMap as Strat[]).filter(
        strat =>
          (!rootState.filter.stratFilters.side || rootState.filter.stratFilters.side === strat.side) &&
          (!rootState.filter.stratFilters.types.length ||
            rootState.filter.stratFilters.types.some(typeFilter => strat.types.includes(typeFilter))) &&
          (rootState.filter.stratFilters.name
            ? strat.name.toLowerCase().includes(rootState.filter.stratFilters.name.toLowerCase())
            : true) &&
          (rootState.filter.stratFilters.content
            ? extractTextFromHTML(strat.content)
                .toLowerCase()
                .includes(rootState.filter.stratFilters.content.toLowerCase())
            : true)
      );
    },
    sortedFilteredStratsOfCurrentMap(state, getters): Strat[] {
      return (getters.filteredStratsOfCurrentMap as Strat[])
        .sort(state.sort === Sort.DateAddedASC ? sortDateAddedASC : sortDateAddedDESC)
        .sort((a, b) => +b.active - +a.active);
    },
  },
  actions: {
    async fetchStrats({ commit }) {
      const res = await api.strat.getStrats();
      if (res.success) {
        commit(SET_STRATS, res.success);
        return { success: res.success };
      } else {
        return { error: res.error };
      }
    },
    async deleteStrat({ dispatch, state, rootState }, stratID: string) {
      const res = await api.strat.deleteStrat(stratID);
      if (res.success) {
        dispatch('app/showToast', { id: 'strat/deleteStrat', text: 'Deleted strat.' }, { root: true });
        trackingService.track('Action: Delete Strat', {
          name: state.strats.find(strat => strat._id === stratID)?.name as string,
        });
      }
    },
    async createStrat({ dispatch, rootState }, payload: Partial<Strat>) {
      const newStrat = { ...payload, map: rootState.map.currentMap };
      const res = await api.strat.createStrat(newStrat);
      if (res.success) {
        dispatch('app/showToast', { id: 'strat/createStrat', text: 'Added strat.' }, { root: true });
        trackingService.track('Action: Create Strat', {
          name: payload.name!,
          types: payload.types!,
          side: payload.side!,
          note: payload.note!,
        });
        return res.success;
      }
    },
    updateStrat(_, payload: Partial<Strat>) {
      api.strat.updateStrat(payload);
    },
    async shareStrat({ dispatch, state }, stratID: string) {
      const res = await api.strat.updateStrat({ _id: stratID, shared: true });
      if (res.success) {
        const shareLink = `${window.location.origin}/#/share/${stratID}`;
        navigator.clipboard.writeText(shareLink);
        dispatch('app/showToast', { id: 'strat/shareStrat', text: 'Copied share link to clipboard.' }, { root: true });
        trackingService.track('Action: Share Strat', {
          name: state.strats.find(strat => strat._id === stratID)?.name as string,
        });
      }
    },
    async unshareStrat({ dispatch }, stratID: string) {
      const res = await api.strat.updateStrat({ id: stratID, shared: false });
      if (res.success) {
        dispatch('app/showToast', { id: 'strat/unshareStrat', text: 'Strat is no longer shared.' }, { root: true });
      }
    },
    async addSharedStrat({ dispatch, state }, stratID: string) {
      const res = await api.strat.addSharedStrat(stratID);
      if (res.success) {
        dispatch(
          'app/showToast',
          { id: 'strat/addedShared', text: 'Strat successfully added to your stratbook.' },
          { root: true }
        );
        trackingService.track('Action: Add Shared Strat', {
          name: state.strats.find(strat => strat._id === stratID)?.name as string,
        });
      }
    },
    addStratLocally({ commit }, payload: { strat: Strat }) {
      commit(ADD_STRAT, payload.strat);
    },
    updateStratLocally({ commit }, payload: { strat: Strat }) {
      commit(UPDATE_STRAT, payload);
    },
    deleteStratLocally({ commit }, payload: { stratID: string }) {
      commit(DELETE_STRAT, payload.stratID);
    },
    collapseAll({ commit, state }) {
      const collapsed = state.strats.filter(strat => !state.editedStrats.includes(strat._id)).map(strat => strat._id);
      commit(SET_COLLAPSED, collapsed);
      storageService.set('collapsed', state.collapsedStrats);
    },
    expandAll({ commit, state }) {
      commit(SET_COLLAPSED, []);
      storageService.set('collapsed', state.collapsedStrats);
    },
    toggleStratCollapse({ commit, state }, stratID: string) {
      if (state.collapsedStrats.some(id => id === stratID)) {
        commit(
          SET_COLLAPSED,
          state.collapsedStrats.filter(id => id !== stratID)
        );
      } else {
        commit(SET_COLLAPSED, [...state.collapsedStrats, stratID]);
      }
      storageService.set('collapsed', state.collapsedStrats);
    },
    updateEdited({ commit, state }, { stratID, value }: { stratID: string; value: boolean }) {
      const edited = value ? [...state.editedStrats, stratID] : state.editedStrats.filter(id => id !== stratID);
      commit(SET_EDITED, edited);
    },
    loadCollapsedStratsFromStorage({ commit }) {
      const collapsed = storageService.get<string[]>('collapsed');
      if (collapsed?.length) {
        commit(SET_COLLAPSED, collapsed);
      }
    },
    updateSort({ commit, dispatch }, sort: Sort) {
      commit(SET_SORT, sort);
      dispatch(
        'app/showToast',
        {
          id: 'strat/updateSort',
          text: sort === Sort.DateAddedASC ? 'Sorting by: newest 🠖 oldest' : 'Sorting by: oldest 🠖 newest',
          allowMultiple: true,
        },
        { root: true }
      );
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_STRATS](state, strats: Strat[]) {
      state.strats = strats;
    },
    [ADD_STRAT](state, strat: Strat) {
      state.strats.push(strat);
    },
    [UPDATE_STRAT](state, payload: { strat: Strat }) {
      const strat = state.strats.find(strat => strat.id === payload.strat.id);
      if (strat) Object.assign(strat, payload.strat);
    },
    [DELETE_STRAT](state, stratID: string) {
      state.strats = state.strats.filter(strat => strat.id !== stratID);
    },
    [SET_COLLAPSED](state, stratIDs: string[]) {
      state.collapsedStrats = stratIDs;
    },
    [SET_EDITED](state, stratIDs: string[]) {
      state.editedStrats = stratIDs;
    },
    [SET_SORT](state, sort: Sort) {
      state.sort = sort;
    },
    [SET_COLLAPSED](state, stratIDs: string[]) {
      state.collapsedStrats = stratIDs;
    },
    [SET_EDITED](state, stratIDs: string[]) {
      state.editedStrats = stratIDs;
    },
    [SET_SORT](state, sort: Sort) {
      state.sort = sort;
    },
    [SET_COLLAPSED](state, stratIDs: string[]) {
      state.collapsedStrats = stratIDs;
    },
    [SET_EDITED](state, stratIDs: string[]) {
      state.editedStrats = stratIDs;
    },
    [SET_SORT](state, sort: Sort) {
      state.sort = sort;
    },
    [SET_COLLAPSED](state, stratIDs: string[]) {
      state.collapsedStrats = stratIDs;
    },
    [SET_EDITED](state, stratIDs: string[]) {
      state.editedStrats = stratIDs;
    },
    [SET_SORT](state, sort: Sort) {
      state.sort = sort;
    },
    [RESET_STATE](state) {
      Object.assign(state, stratInitialState());
    },
  },
};
