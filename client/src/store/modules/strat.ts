import { Module } from 'vuex';
import { RootState } from '..';
import { Strat } from '@/api/models/Strat';
import api from '@/api/base';

const SET_STRATS = 'SET_STRATS';

const ADD_STRAT = 'ADD_STRAT';
const UPDATE_STRAT = 'UPDATE_STRAT';
const DELETE_STRAT = 'DELETE_STRAT';

const RESET_STATE = 'RESET_STATE';

export interface StratState {
  strats: Strat[];
}

const stratInitialState = (): StratState => ({
  strats: [],
});

export const stratModule: Module<StratState, RootState> = {
  namespaced: true,
  state: stratInitialState(),
  getters: {
    stratsOfCurrentMap(state, _getters, rootState) {
      return state.strats.filter(strat => strat.map === rootState.map.currentMap);
    },
    sortedStratsOfCurrentMap(_state, getters) {
      return (getters.stratsOfCurrentMap as Strat[])
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .sort((a, b) => +b.active - +a.active);
    },
  },
  actions: {
    async fetchStrats({ commit, dispatch }) {
      const res = await api.strat.getStrats();
      if (res.success) {
        commit(SET_STRATS, res.success);
        return { success: res.success };
      } else {
        return { error: res.error };
      }
    },
    async deleteStrat({ dispatch }, stratID: string) {
      const res = await api.strat.deleteStrat(stratID);
      if (res.success) dispatch('app/showToast', { id: 'strat/deleteStrat', text: 'Deleted strat.' }, { root: true });
    },
    async createStrat({ dispatch, rootState }, payload: Partial<Strat>) {
      const newStrat = { ...payload, map: rootState.map.currentMap };
      const res = await api.strat.createStrat(newStrat);
      if (res.success) dispatch('app/showToast', { id: 'strat/createStrat', text: 'Added strat.' }, { root: true });
    },
    async updateStrat({ dispatch }, payload: Partial<Strat>) {
      const res = await api.strat.updateStrat(payload);
      if (res.success)
        dispatch('app/showToast', { id: 'strat/updateStrat', text: 'Successfully updated the strat.' }, { root: true });
    },
    async shareStrat({ dispatch }, stratID: string) {
      const res = await api.strat.updateStrat({ _id: stratID, shared: true });
      if (res.success) {
        const shareLink = `${window.location.origin}/#/share/${stratID}`;
        navigator.clipboard.writeText(shareLink);
        dispatch('app/showToast', { id: 'strat/shareStrat', text: 'Copied share link to clipboard.' }, { root: true });
      }
    },
    async unshareStrat({ dispatch }, stratID: string) {
      const res = await api.strat.updateStrat({ _id: stratID, shared: false });
      if (res.success) {
        dispatch('app/showToast', { id: 'strat/unshareStrat', text: 'Strat is no longer shared.' }, { root: true });
      }
    },
    async addSharedStrat({ dispatch }, stratID: string) {
      const res = await api.strat.addSharedStrat(stratID);
      if (res.success) {
        dispatch(
          'app/showToast',
          { id: 'strat/addedShared', text: 'Strat successfully added to your stratbook.' },
          { root: true }
        );
      }
    },
    addStratLocally({ commit, dispatch }, payload: { strat: Strat }) {
      commit(ADD_STRAT, payload.strat);
    },
    updateStratLocally({ commit, dispatch }, payload: { strat: Strat }) {
      commit(UPDATE_STRAT, payload);
    },
    deleteStratLocally({ commit, dispatch }, payload: { stratID: string }) {
      commit(DELETE_STRAT, payload.stratID);
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
      const strat = state.strats.find(strat => strat._id === payload.strat._id);
      if (strat) Object.assign(strat, payload.strat);
    },
    [DELETE_STRAT](state, stratID: string) {
      state.strats = state.strats.filter(strat => strat._id !== stratID);
    },
    [RESET_STATE](state) {
      Object.assign(state, stratInitialState());
    },
  },
};
