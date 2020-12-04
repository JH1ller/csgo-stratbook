import { MapID } from '@/components/MapPicker/MapPicker';
import { Module } from 'vuex';
import { RootState } from '..';

const SET_CURRENT_MAP = 'SET_CURRENT_MAP';
const SET_STRAT_MAP = 'SET_STRAT_MAP';
const SET_UTILITY_MAP = 'SET_UTILITY_MAP';
const RESET_STATE = 'RESET_STATE';

export interface MapState {
  currentMap: MapID;
  //utilityMap: MapID;
}

const mapInitialState = (): MapState => ({
  currentMap: MapID.Dust2,
  //utilityMap: MapID.Dust2
});

export const mapModule: Module<MapState, RootState> = {
  namespaced: true,
  state: mapInitialState(),
  getters: {},
  actions: {
    updateCurrentMap({ commit }, mapID: MapID) {
      commit(SET_CURRENT_MAP, mapID);
      localStorage.setItem('currentMap', mapID);
    },
    // updateStratMap({ commit }, mapID: MapID) {
    //   commit(SET_STRAT_MAP, mapID);
    //   localStorage.setItem('stratMap', mapID);
    // },
    // updateUtilityMap({ commit }, mapID: MapID) {
    //   commit(SET_UTILITY_MAP, mapID);
    //   localStorage.setItem('utilityMap', mapID);
    // },
    loadCurrentMapFromStorage({ commit }) {
      const currentMap = localStorage.getItem('currentMap');
      if (currentMap) commit(SET_CURRENT_MAP, currentMap);
    },
    // loadStratMapFromStorage({ commit }) {
    //   const stratMap = localStorage.getItem('stratMap');
    //   if (stratMap) commit(SET_STRAT_MAP, stratMap);
    // },
    // loadUtilityMapFromStorage({ commit }) {
    //   const utilityMap = localStorage.getItem('utilityMap');
    //   if (utilityMap) commit(SET_UTILITY_MAP, utilityMap);
    // },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_CURRENT_MAP](state, payload) {
      state.currentMap = payload;
    },
    // [SET_STRAT_MAP](state, payload) {
    //   state.stratMap = payload;
    // },
    // [SET_UTILITY_MAP](state, payload) {
    //   state.utilityMap = payload;
    // },
    [RESET_STATE](state) {
      Object.assign(state, mapInitialState());
    },
  },
};
