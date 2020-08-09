import { Module } from 'vuex';
import { RootState } from '..';

const SET_LOADER_VISIBLE = 'SET_LOADER_VISIBLE';
const SET_LOADER_TEXT = 'SET_LOADER_TEXT';
const SHOW_TOAST = 'SHOW_TOAST';
const HIDE_TOAST = 'HIDE_TOAST';
const RESET_STATE = 'RESET_STATE';

export interface AppState {
  ui: {
    showLoader: boolean;
    loaderText: string;
    toast: {
      show: boolean;
      message: string;
    };
  };
}

const appInitialState = (): AppState => ({
  ui: {
    showLoader: false,
    loaderText: '',
    toast: {
      show: false,
      message: '',
    },
  },
});

export const appModule: Module<AppState, RootState> = {
  namespaced: true,
  state: appInitialState(),
  getters: {},
  actions: {
    showToast({ commit }, message: string) {
      commit(SHOW_TOAST, message);
    },
    hideToast({ commit }) {
      commit(HIDE_TOAST);
    },
    showLoader({ commit }) {
      commit(SET_LOADER_VISIBLE, true);
    },
    hideLoader({ commit }) {
      commit(SET_LOADER_VISIBLE, false);
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_LOADER_VISIBLE](state, payload) {
      state.ui.showLoader = payload;
    },
    [SET_LOADER_TEXT](state, payload) {
      state.ui.loaderText = payload;
    },
    [SHOW_TOAST](state, message: string) {
      state.ui.toast.message = message;
      state.ui.toast.show = true;
    },
    [HIDE_TOAST](state) {
      state.ui.toast.show = false;
    },
    [RESET_STATE](state) {
      Object.assign(state, appInitialState());
    },
  },
};
