import { Module } from 'vuex';
import { RootState } from '..';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import { Breakpoints } from '@/services/breakpoint.service';
import { nanoid } from 'nanoid';

const ADD_ACTIVE_REQUEST = 'ADD_ACTIVE_REQUEST';
const REMOVE_ACTIVE_REQUEST = 'REMOVE_ACTIVE_REQUEST';
const SHOW_TOAST = 'SHOW_TOAST';
const HIDE_TOAST = 'HIDE_TOAST';
const OPEN_DIALOG = 'OPEN_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';
const SET_LATENCY = 'SET_LATENCY';
const SET_GAME_MODE = 'SET_GAME_MODE';
const SET_BREAKPOINT = 'SET_BREAKPOINT';
const RESET_STATE = 'RESET_STATE';

export interface AppState {
  activeRequests: number;
  toasts: Toast[];
  openDialogs: Dialog[];
  latency: number;
  gameMode: boolean;
  breakpoint: Breakpoints;
}

const appInitialState = (): AppState => ({
  activeRequests: 0,
  toasts: [],
  openDialogs: [],
  latency: 0,
  gameMode: false,
  breakpoint: Breakpoints.MQ1,
});

export const appModule: Module<AppState, RootState> = {
  namespaced: true,
  state: appInitialState(),
  getters: {
    isMobile(state): boolean {
      return state.breakpoint === Breakpoints.MQ1 || state.breakpoint === Breakpoints.MQ2;
    },
    loading(state): boolean {
      return state.activeRequests > 0;
    },
  },
  actions: {
    showToast({ commit, state }, toast: Toast) {
      const toastCopy = {
        ...toast,
        id: toast.allowMultiple ? nanoid() : toast.id,
      };
      if (!state.toasts.find((item) => item.id === toastCopy.id)) {
        commit(SHOW_TOAST, toastCopy);
        setTimeout(() => {
          commit(HIDE_TOAST, toastCopy.id);
        }, 5000);
      }
    },
    hideToast({ commit }) {
      commit(HIDE_TOAST);
    },
    addRequest({ commit }) {
      commit(ADD_ACTIVE_REQUEST);
    },
    removeRequest({ commit }) {
      commit(REMOVE_ACTIVE_REQUEST);
    },
    showDialog({ commit, state }, dialogData: Partial<Dialog>) {
      return new Promise<boolean>((resolve, reject) => {
        if (!state.openDialogs.some((dialog) => dialog.key === dialogData.key)) {
          commit(OPEN_DIALOG, {
            ...dialogData,
            resolve,
          } as Dialog);
        } else {
          reject(`Dialog '${dialogData.key}' already open.`);
        }
      });
    },
    closeDialog({ commit }, key: string) {
      commit(CLOSE_DIALOG, key);
    },
    updateLatency({ commit }, latency: number) {
      commit(SET_LATENCY, latency);
    },
    startGameMode({ commit }) {
      commit(SET_GAME_MODE, true);
      document.title = document.title += ' | Focus Mode';
    },
    exitGameMode({ commit }) {
      commit(SET_GAME_MODE, false);
      document.title = document.title.replace(' | Focus Mode', '');
    },
    updateBreakpoint({ commit }, bp: Breakpoints) {
      commit(SET_BREAKPOINT, bp);
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [ADD_ACTIVE_REQUEST](state) {
      ++state.activeRequests;
    },
    [REMOVE_ACTIVE_REQUEST](state) {
      --state.activeRequests;
    },
    [SHOW_TOAST](state, toast: Toast) {
      state.toasts.push(toast);
    },
    [HIDE_TOAST](state, toastID: string) {
      state.toasts = state.toasts.filter((toast) => toast.id !== toastID);
    },
    [OPEN_DIALOG](state, dialog: Dialog) {
      state.openDialogs.push(dialog);
    },
    [CLOSE_DIALOG](state, key: string) {
      state.openDialogs = [...state.openDialogs.filter((dialog) => dialog.key !== key)];
    },
    [SET_LATENCY](state, latency: number) {
      state.latency = latency;
    },
    [SET_GAME_MODE](state, gameMode: boolean) {
      state.gameMode = gameMode;
    },
    [SET_BREAKPOINT](state, bp: Breakpoints) {
      state.breakpoint = bp;
    },
    [RESET_STATE](state) {
      Object.assign(state, appInitialState());
    },
  },
};
