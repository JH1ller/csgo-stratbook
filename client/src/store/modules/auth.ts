import { Module } from 'vuex';
import { RootState } from '..';
import { Status, Player } from '@/services/models';
import AuthService from '@/services/AuthService';
import APIService from '@/services/APIService';

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

const authService = AuthService.getInstance();

export const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state: authInitialState(),
  getters: {},
  actions: {
    async fetchProfile({ commit, dispatch }) {
      try {
        dispatch('app/showLoader', null, { root: true });
        const profile = await authService.updatePlayerInfo();
        dispatch('app/hideLoader', null, { root: true });
        if (profile) {
          commit(SET_PROFILE, profile);
          commit(
            SET_STATUS,
            profile.team ? Status.LOGGED_IN_WITH_TEAM : Status.LOGGED_IN_NO_TEAM
          );
          return profile;
        } else {
          throw new Error('Could not update Profile');
        }
      } catch (error) {
        dispatch('app/hideLoader', null, { root: true });
        throw new Error(error);
      }
    },
    updateStatus({ commit }, status: Status) {
      commit(SET_STATUS, status);
    },
    async loginUser({ commit, dispatch }, { email, password }) {
      try {
        dispatch('app/showLoader', null, { root: true });
        const res = await authService.login(email, password);
        dispatch('app/hideLoader', null, { root: true });
        if (res.token) {
          commit(SET_TOKEN, res.token);
          await dispatch('fetchProfile');
          return { success: 'Logged in successfully.' };
        }
      } catch (error) {
        dispatch('app/hideLoader', null, { root: true });
        return { error: error };
      }
    },
    async logoutUser({ commit, dispatch }) {
      commit(RESET_STATE);
      authService.clear();
      commit(SET_STATUS, Status.NO_AUTH);
      dispatch('app/showToast', 'Logged out successfully', { root: true });
    },
    async registerUser({ dispatch }, formData) {
      try {
        dispatch('app/showLoader', null, { root: true });
        const res = await authService.register(formData);
        dispatch('app/hideLoader', null, { root: true });
        if (res.user) {
          return {
            success:
              'Registered successfully. A confirmation email has been sent.',
          };
        }
      } catch (error) {
        dispatch('app/hideLoader', null, { root: true });
        return { error: error };
      }
    },

    async updatePlayer({ dispatch }, teamId: string) {
      try {
        dispatch('app/showLoader', null, { root: true });
        const res = await APIService.updatePlayer({ team: teamId });
        dispatch('app/hideLoader', null, { root: true });
      } catch (error) {
        dispatch('app/hideLoader', null, { root: true });
        throw new Error(error);
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
