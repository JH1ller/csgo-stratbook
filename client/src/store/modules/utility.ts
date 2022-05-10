import { Module } from 'vuex';
import { RootState } from '..';
import { Utility } from '@/api/models/Utility';
import api from '@/api/base';
import { writeToClipboard } from '@/utils/writeToClipboard';

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
      return state.utilities.filter(utility => utility.map === rootState.map.currentMap);
    },
    filteredUtilitiesOfCurrentMap(_state, getters, rootState) {
      return (getters.utilitiesOfCurrentMap as Utility[]).filter(
        utility =>
          (rootState.filter.utilityFilters.side ? rootState.filter.utilityFilters.side === utility.side : true) &&
          (rootState.filter.utilityFilters.type ? rootState.filter.utilityFilters.type === utility.type : true) &&
          (rootState.filter.utilityFilters.name
            ? utility.name.toLowerCase().includes(rootState.filter.utilityFilters.name.toLowerCase())
            : true),
      );
    },
    sortedFilteredUtilitiesOfCurrentMap(_state, getters) {
      return (getters.filteredUtilitiesOfCurrentMap as Utility[]).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
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
    async updateUtility({ dispatch }, data: FormData) {
      const res = await api.utility.updateUtility(data);
      if (res.success)
        dispatch(
          'app/showToast',
          { id: 'utility/updateUtility', text: 'Successfully updated the utility.' },
          { root: true },
        );
    },
    async shareUtility({ dispatch }, utilityID: string) {
      dispatch(
        'app/showToast',
        { id: 'utility/shareUtility', text: 'Sharing utilities not yet implemented.' },
        { root: true },
      );
      return;
      //! TODO
      const formData = new FormData();
      formData.append('_id', utilityID);
      formData.append('shared', 'true');
      const res = await api.utility.updateUtility(formData);
      if (res.success) {
        const shareLink = `${window.location.origin}/#/share/${utilityID}`;
        writeToClipboard(shareLink);
        dispatch(
          'app/showToast',
          { id: 'utility/shareUtility', text: 'Copied share link to clipboard.' },
          { root: true },
        );
      }
    },
    async unshareUtility({ dispatch }, utilityID: string) {
      const formData = new FormData();
      formData.append('_id', utilityID);
      formData.append('shared', 'false');
      const res = await api.utility.updateUtility(formData);
      if (res.success) {
        dispatch(
          'app/showToast',
          { id: 'utility/unshareUtility', text: 'Utility is no longer shared.' },
          { root: true },
        );
      }
    },
    async addSharedUtility({ dispatch }, utilityID: string) {
      const res = await api.utility.addSharedUtility(utilityID);
      if (res.success) {
        dispatch(
          'app/showToast',
          { id: 'utility/addedShared', text: 'Utility successfully added to your utilitybook.' },
          { root: true },
        );
      }
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
      const utility = state.utilities.find(utility => utility._id === payload.utility._id);
      if (utility) Object.assign(utility, payload.utility);
    },
    [DELETE_UTILITY](state, utilityID: string) {
      state.utilities = state.utilities.filter(utility => utility._id !== utilityID);
    },
    [RESET_STATE](state) {
      Object.assign(state, utilityInitialState());
    },
  },
};
