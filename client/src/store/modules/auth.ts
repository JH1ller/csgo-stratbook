import { Module } from 'vuex';
import { RootState } from '..';
import { Status, Player } from '@/api/models';
import APIService from '@/api/APIService';
import WebSocketService from '@/api/WebSocketService';

const SET_TOKEN = 'SET_TOKEN';
const SET_PROFILE = 'SET_PROFILE';
const SET_STATUS = 'SET_STATUS';
const RESET_STATE = 'RESET_STATE';

export interface AuthState {
  status: Status;
  token: string;
  profile: Player | {};
}

const authInitialState = (): AuthState => ({
  status: Status.NO_AUTH,
  token: '',
  profile: {},
});

export const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state: authInitialState(),
  getters: {},
  actions: {
    async fetchProfile({ dispatch }) {
      const res = await APIService.getPlayer();
      if (res.success) {
        const profile = res.success;
        localStorage.setItem('profile', JSON.stringify(profile));
        await dispatch('setProfile', profile);
        return { success: profile };
      } else {
        return { error: res.error };
      }
    },
    updateStatus({ commit }, status: Status) {
      commit(SET_STATUS, status);
    },
    setProfile({ commit }, profile: Player) {
      commit(SET_PROFILE, profile);
      commit(SET_STATUS, profile.team ? Status.LOGGED_IN_WITH_TEAM : Status.LOGGED_IN_NO_TEAM);
      if (profile.team) {
        WebSocketService.getInstance().connect();
      } else {
        WebSocketService.getInstance().disconnect(); // TODO: maybe find a way to call this earlier, because socket update will cause console error
      }
    },
    async login({ commit, dispatch }, { email, password }) {
      const res = await APIService.login(email, password);
      if (res.success) {
        commit(SET_TOKEN, res.success);
        localStorage.setItem('token', res.success);
        await dispatch('fetchProfile');
        dispatch('app/showToast', { id: 'auth/login', text: 'Logged in successfully.' }, { root: true });
        return { success: 'Logged in successfully.' };
      } else {
        return { error: res.error };
      }
    },
    async logout({ dispatch }) {
      dispatch('resetState', null, { root: true });
      localStorage.clear();
      WebSocketService.getInstance().disconnect();
      dispatch('app/showToast', { id: 'auth/logout', text: 'Logged out successfully.' }, { root: true });
    },
    async register({ dispatch }, formData: Partial<Player>) {
      const res = await APIService.register(formData);
      if (res.success) {
        dispatch('app/showToast', { id: 'auth/register', text: 'Registered successfully. A confirmation email has been sent.' }, { root: true });
        return { success: 'Registered successfully. A confirmation email has been sent.' }; // TODO: probably remove all these
      } else {
        return { error: res.error };
      }
    },
    async loadTokenFromStorage({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        commit(SET_TOKEN, token);
      }
    },
    async loadProfileFromStorage({ dispatch }) {
      const profile = localStorage.getItem('profile');
      if (profile) {
        await dispatch('setProfile', JSON.parse(profile));
      }
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_TOKEN](state, token: string) {
      state.token = token;
    },
    [SET_PROFILE](state, profile: Player) {
      state.profile = profile;
    },
    [SET_STATUS](state, status: Status) {
      state.status = status;
    },
    [RESET_STATE](state) {
      Object.assign(state, authInitialState());
    },
  },
};
