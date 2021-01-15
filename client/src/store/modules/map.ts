import { MapID } from '@/components/MapPicker/MapPicker';
import { Module } from 'vuex';
import { RootState } from '..';

const SET_CURRENT_MAP = 'SET_CURRENT_MAP';
const RESET_STATE = 'RESET_STATE';

export interface MapState {
  currentMap: MapID;
}

const mapInitialState = (): MapState => ({
  currentMap: MapID.Dust2,
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
    loadCurrentMapFromStorage({ commit }) {
      const currentMap = localStorage.getItem('currentMap');
      if (currentMap && currentMap in MapID) commit(SET_CURRENT_MAP, currentMap);
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_CURRENT_MAP](state, payload) {
      state.currentMap = payload;
    },
    [RESET_STATE](state) {
      Object.assign(state, mapInitialState());
    },
  },
};
