import { Module } from 'vuex';
import { RootState } from '..';
import { Dialog } from '@/components/dialog-wrapper/dialog-wrapper.models';

const SET_LOADER_VISIBLE = 'SET_LOADER_VISIBLE';
const SET_LOADER_TEXT = 'SET_LOADER_TEXT';
const SHOW_TOAST = 'SHOW_TOAST';
const HIDE_TOAST = 'HIDE_TOAST';
const OPEN_DIALOG = 'OPEN_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';
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
  openDialogs: Dialog[];
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
  openDialogs: [],
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
    showDialog({ commit, state }, dialogData: Partial<Dialog>) {
      return new Promise<void>((resolve, reject) => {
        if (!state.openDialogs.some(dialog => dialog.key === dialogData.key)) {
          commit(OPEN_DIALOG, {
            ...dialogData,
            resolve,
            reject,
          } as Dialog);
        } else {
          reject('Dialog already open.');
        }
      });
    },
    closeDialog({ commit }, key: string) {
      commit(CLOSE_DIALOG, key);
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
    [OPEN_DIALOG](state, dialog: Dialog) {
      state.openDialogs.push(dialog);
    },
    [CLOSE_DIALOG](state, key: string) {
      state.openDialogs = [...state.openDialogs.filter(dialog => dialog.key !== key)];
    },

    [RESET_STATE](state) {
      Object.assign(state, appInitialState());
    },
  },
};
