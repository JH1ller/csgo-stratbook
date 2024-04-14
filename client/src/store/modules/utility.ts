import { Module } from 'vuex';
import { RootState } from '..';
import { Utility } from '@/api/models/Utility';
import api from '@/api/base';

const SET_UTILITIES = 'SET_UTILITIES';

const ADD_UTILITY = 'ADD_UTILITY';
const UPDATE_UTILITY = 'UPDATE_UTILITY';
const DELETE_UTILITY = 'DELETE_UTILITY';

const RESET_STATE = 'RESET_STATE';

export interface UtilityState {
  utilities: Utility[];
}

const utilityInitialState = (): UtilityState => ({
  utilities: [],
});

export const utilityModule: Module<UtilityState, RootState> = {
  namespaced: true,
  state: utilityInitialState(),
  getters: {
    utilitiesOfCurrentMap(state, _getters, rootState) {
      return state.utilities.filter((utility) => utility.map === rootState.map.currentMap);
    },
    filteredUtilitiesOfCurrentMap(_state, getters, rootState) {
      const { side, type, name, labels } = rootState.filter.utilityFilters;
      return (getters.utilitiesOfCurrentMap as Utility[]).filter(
        (utility) =>
          (side ? side === utility.side : true) &&
          (type ? type === utility.type : true) &&
          (name ? utility.name.toLowerCase().includes(name.toLowerCase()) : true) &&
          (!labels.length || labels.some((label) => utility.labels.includes(label))),
      );
    },
    sortedFilteredUtilitiesOfCurrentMap(_state, getters) {
      return (getters.filteredUtilitiesOfCurrentMap as Utility[]).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    },
    allLabels(state): string[] {
      const labelSet = state.utilities.reduce<Set<string>>((acc, curr) => {
        for (const label of curr.labels) {
          acc.add(label);
        }
        return acc;
      }, new Set());

      return [...labelSet];
    },
  },
  actions: {
    async fetchUtilities({ commit }) {
      const res = await api.utility.getUtilities();
      if (res.success) {
        commit(SET_UTILITIES, res.success);
        return { success: res.success };
      } else {
        return { error: res.error };
      }
    },
    async deleteUtility({ dispatch }, utilityID: string) {
      const res = await api.utility.deleteUtility(utilityID);
      if (res.success)
        dispatch('app/showToast', { id: 'utility/deleteUtility', text: 'Deleted utility.' }, { root: true });
    },
    async createUtility({ dispatch, rootState }, data: FormData) {
      data.append('map', rootState.map.currentMap);
      const res = await api.utility.createUtility(data);
      if (res.success)
        dispatch('app/showToast', { id: 'utility/createUtility', text: 'Added utility.' }, { root: true });
    },
    async updateUtility({ dispatch }, data: FormData | Partial<Utility>) {
      const res = await api.utility.updateUtility(data);
      if (res.success)
        dispatch(
          'app/showToast',
          { id: 'utility/updateUtility', text: 'Successfully updated the utility.' },
          { root: true },
        );
    },
    addUtilityLocally({ commit }, payload: { utility: Utility }) {
      commit(ADD_UTILITY, payload.utility);
    },
    updateUtilityLocally({ commit }, payload: { utility: Utility }) {
      commit(UPDATE_UTILITY, payload);
    },
    deleteUtilityLocally({ commit }, payload: { utilityId: string }) {
      commit(DELETE_UTILITY, payload.utilityId);
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_UTILITIES](state, utilities: Utility[]) {
      state.utilities = utilities;
    },
    [ADD_UTILITY](state, utility: Utility) {
      state.utilities.push(utility);
    },
    [UPDATE_UTILITY](state, payload: { utility: Utility }) {
      const utility = state.utilities.find((utility) => utility._id === payload.utility._id);
      if (utility) Object.assign(utility, payload.utility);
    },
    [DELETE_UTILITY](state, utilityID: string) {
      state.utilities = state.utilities.filter((utility) => utility._id !== utilityID);
    },
    [RESET_STATE](state) {
      Object.assign(state, utilityInitialState());
    },
  },
};
