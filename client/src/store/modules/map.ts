import { Module } from 'vuex';
import { RootState } from '..';
import { Map } from '@/services/models';
import APIService from '@/services/APIService';

const SET_MAPS = 'SET_MAPS';
const SET_CURRENT_MAP = 'SET_CURRENT_MAP';
const RESET_STATE = 'RESET_STATE';

export interface MapState {
  maps: Map[];
  currentMap: string;
}

const mapInitialState = (): MapState => ({
  maps: [],
  currentMap: '',
});

export const mapModule: Module<MapState, RootState> = {
  namespaced: true,
  state: mapInitialState(),
  getters: {},
  actions: {
    async fetchMaps({ commit, dispatch }) {
      const res = await APIService.getMaps();
      if (res.success) {
        commit(SET_MAPS, res.success);
        dispatch('updateCurrentMap', res.success[0]._id);
      }
    },
    updateCurrentMap({ commit, dispatch }, mapID: string) {
      commit(SET_CURRENT_MAP, mapID);
      dispatch('strat/fetchStrats', null, { root: true });
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_MAPS](state, payload) {
      state.maps = payload;
    },
    [SET_CURRENT_MAP](state, payload) {
      state.currentMap = payload;
    },
    [RESET_STATE](state) {
      Object.assign(state, mapInitialState());
    },
  },
};
