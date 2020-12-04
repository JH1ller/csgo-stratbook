import { Module } from 'vuex';
import { RootState } from '..';
import APIService from '@/api/APIService';
import { Utility } from '@/api/models/Utility';

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
  },
  actions: {
    async fetchUtilities({ commit, dispatch }) {
      const res = await APIService.getUtilities();
      if (res.success) {
        commit(SET_UTILITIES, res.success);
        dispatch('saveUtilitiesToStorage');
        return { success: res.success };
      } else {
        return { error: res.error };
      }
    },
    async deleteUtility({ dispatch }, utilityID: string) {
      const res = await APIService.deleteUtility(utilityID);
      if (res.success)
        dispatch('app/showToast', { id: 'utility/deleteUtility', text: 'Deleted utility.' }, { root: true });
    },
    async createUtility({ dispatch, rootState }, data: FormData) {
      data.append('map', rootState.map.currentMap);
      const res = await APIService.createUtility(data);
      if (res.success)
        dispatch('app/showToast', { id: 'utility/createUtility', text: 'Added utility.' }, { root: true });
    },
    async updateUtility({ dispatch }, data: FormData) {
      const res = await APIService.updateUtility(data);
      if (res.success)
        dispatch(
          'app/showToast',
          { id: 'utility/updateUtility', text: 'Successfully updated the utility.' },
          { root: true }
        );
    },
    // async shareUtility({ dispatch }, utilityID: string) {
    //   const res = await APIService.updateUtility({ _id: utilityID, shared: true });
    //   if (res.success) {
    //     const shareLink = `${window.location.origin}/#/share/${utilityID}`;
    //     navigator.clipboard.writeText(shareLink);
    //     dispatch(
    //       'app/showToast',
    //       { id: 'utility/shareUtility', text: 'Copied share link to clipboard.' },
    //       { root: true }
    //     );
    //   }
    // },
    // async unshareUtility({ dispatch }, utilityID: string) {
    //   const res = await APIService.updateUtility({ _id: utilityID, shared: false });
    //   if (res.success) {
    //     dispatch(
    //       'app/showToast',
    //       { id: 'utility/unshareUtility', text: 'Utility is no longer shared.' },
    //       { root: true }
    //     );
    //   }
    // },
    async addSharedUtility({ dispatch }, utilityID: string) {
      const res = await APIService.addSharedUtility(utilityID);
      if (res.success) {
        dispatch(
          'app/showToast',
          { id: 'utility/addedShared', text: 'Utility successfully added to your utilitybook.' },
          { root: true }
        );
      }
    },
    addUtilityLocally({ commit, dispatch }, payload: { utility: Utility }) {
      commit(ADD_UTILITY, payload.utility);
      dispatch('saveUtilitiesToStorage');
    },
    updateUtilityLocally({ commit, rootState, dispatch }, payload: { utility: Utility }) {
      commit(UPDATE_UTILITY, payload);
      dispatch('saveUtilitiesToStorage');
    },
    deleteUtilityLocally({ commit, dispatch }, payload: { utilityID: string }) {
      commit(DELETE_UTILITY, payload.utilityID);
      dispatch('saveUtilitiesToStorage');
    },
    loadUtilitiesFromStorage({ commit }) {
      const utilities = localStorage.getItem('utilities');
      if (utilities) commit(SET_UTILITIES, JSON.parse(utilities));
    },
    saveUtilitiesToStorage({ state }) {
      localStorage.setItem('utilities', JSON.stringify(state.utilities));
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
