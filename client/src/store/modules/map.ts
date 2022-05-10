import { GameMap } from '@/api/models/GameMap';
import StorageService from '@/services/storage.service';
import { Module } from 'vuex';
import { RootState } from '..';

const SET_CURRENT_MAP = 'SET_CURRENT_MAP';
const RESET_STATE = 'RESET_STATE';

export interface MapState {
  currentMap: GameMap;
}

const mapInitialState = (): MapState => ({
  currentMap: GameMap.Dust2,
});

const storageService = StorageService.getInstance();

export const mapModule: Module<MapState, RootState> = {
  namespaced: true,
  state: mapInitialState(),
  getters: {},
  actions: {
    updateCurrentMap({ commit }, mapID: GameMap) {
      commit(SET_CURRENT_MAP, mapID);
      storageService.set('currentMap', mapID);
    },
    loadCurrentMapFromStorage({ commit }) {
      const currentMap = storageService.get('currentMap');
      if (currentMap) commit(SET_CURRENT_MAP, currentMap);
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
