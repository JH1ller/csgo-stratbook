import { Module } from 'vuex';
import { RootState } from '..';
import TrackingService from '@/services/tracking.service';
import { extractTextFromHTML } from '@/utils/extractTextFromHTML';
import StorageService from '@/services/storage.service';
import { sortDateAddedASC, sortDateAddedDESC } from '@/utils/sortFunctions';
import { AddStrategyDto, Configuration, StrategiesApi, UpdateStrategyDto } from 'src/api';
import { API_URL } from 'src/config';
import { Log } from 'src/utils/logger';
import { Strategy } from 'src/api/type-mapping';

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
const apiConfig = new Configuration({
  basePath: API_URL,
});
const stratApi = new StrategiesApi(apiConfig);

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
    async fetchStrats({ commit, rootState }) {
      try {
        const { data } = await stratApi.strategiesControllerGetStrategy({ gameMap: rootState.map.currentMap });
        commit(SET_STRATS, data);
      } catch (error) {
        Log.error('strat store', error);
      }
    },
    async deleteStrat({ dispatch, state }, stratID: string) {
      try {
        await stratApi.strategiesControllerDeleteStrategy({ id: stratID });
        dispatch('app/showToast', { id: 'strat/deleteStrat', text: 'Deleted strat.' }, { root: true });
        trackingService.track('Action: Delete Strat', {
          name: state.strats.find(strat => strat._id === stratID)?.name as string,
        });
      } catch (error) {
        Log.error('strat store', error);
      }
    },
    async createStrat({ dispatch, rootState }, payload: Omit<AddStrategyDto, 'gameMap'>) {
      const newStrat: AddStrategyDto = { ...payload, gameMap: rootState.map.currentMap };

      try {
        const { data } = await stratApi.strategiesControllerAddStrategy({ addStrategyDto: newStrat });
        dispatch('app/showToast', { id: 'strat/createStrat', text: 'Added strat.' }, { root: true });
        trackingService.track('Action: Create Strat', {
          name: payload.name,
          types: payload.types,
          side: payload.side,
          note: payload.note,
        });
        return data;
      } catch (error) {
        Log.error('strat store', error);
      }
    },
    async updateStrat(_, payload: UpdateStrategyDto) {
      try {
        await stratApi.strategiesControllerUpdateStrategy({ updateStrategyDto: payload });
      } catch (error) {
        Log.error('strat store', error);
      }
    },
    async shareStrat({ dispatch, state }, stratID: string) {
      try {
        await stratApi.strategiesControllerUpdateStrategy({ updateStrategyDto: { id: stratID, shared: true } });
        const shareLink = `${window.location.origin}/#/share/${stratID}`;
        navigator.clipboard.writeText(shareLink);
        dispatch('app/showToast', { id: 'strat/shareStrat', text: 'Copied share link to clipboard.' }, { root: true });
        trackingService.track('Action: Share Strat', {
          name: state.strats.find(strat => strat._id === stratID)?.name as string,
        });
      } catch (error) {
        Log.error('strat store', error);
      }
    },
    async unshareStrat({ dispatch }, stratID: string) {
      try {
        await stratApi.strategiesControllerUpdateStrategy({ updateStrategyDto: { id: stratID, shared: false } });
        dispatch('app/showToast', { id: 'strat/unshareStrat', text: 'Strat is no longer shared.' }, { root: true });
      } catch (error) {
        Log.error('strat store', error);
      }
    },
    async addSharedStrat({ dispatch, state }, stratID: string) {
      try {
        await stratApi.strategiesControllerAddSharedStrategy({ id: stratID });
        dispatch(
          'app/showToast',
          { id: 'strat/addedShared', text: 'Strat successfully added to your stratbook.' },
          { root: true }
        );
        trackingService.track('Action: Add Shared Strat', {
          name: state.strats.find(strat => strat._id === stratID)?.name as string,
        });
      } catch (error) {
        Log.error('strat store', error);
      }
    },
    addStratLocally({ commit }, strat: Strategy) {
      commit(ADD_STRAT, strat);
    },
    updateStratLocally({ commit }, strat: Strategy) {
      commit(UPDATE_STRAT, strat);
    },
    deleteStratLocally({ commit }, stratID: string) {
      commit(DELETE_STRAT, stratID);
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
    [SET_STRATS](state, strats: Strategy[]) {
      state.strats = strats;
    },
    [ADD_STRAT](state, strat: Strategy) {
      state.strats.push(strat);
    },
    [UPDATE_STRAT](state, strat: Strategy) {
      const target = state.strats.find(i => i._id === strat.id);
      if (target) Object.assign(target, strat);
    },
    [DELETE_STRAT](state, stratID: string) {
      state.strats = state.strats.filter(strat => strat._id !== stratID);
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
