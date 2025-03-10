import { Module } from 'vuex';
import { RootState } from '..';
import WebSocketService from '@/services/WebSocketService';
import { Player } from '@/api/models/Player';
import api from '@/api/base';
import router from '@/router';
import { RouteNames, Routes } from '@/router/router.models';
import { TOKEN_TTL } from '@/config';
import TrackingService from '@/services/tracking.service';
import StorageService from '@/services/storage.service';
import { removeCookie } from '@/utils/cookie';

const SET_TOKEN = 'SET_TOKEN';
const SET_PROFILE = 'SET_PROFILE';
const SET_STATUS = 'SET_STATUS';
const RESET_STATE = 'RESET_STATE';

export enum Status {
  NO_AUTH = 'NO_AUTH',
  LOGGED_IN_NO_TEAM = 'LOGGED_IN_NO_TEAM',
  LOGGED_IN_WITH_TEAM = 'LOGGED_IN_WITH_TEAM',
}

export interface AuthState {
  status: Status;
  token: string;
  profile: Player | Record<string, any>;
}

const authInitialState = (): AuthState => ({
  status: Status.NO_AUTH,
  token: '',
  profile: {},
});

// doing the same thing for WebSocketService doesn't work here,
// (probably) because of a circular dependency.
const trackingService = TrackingService.getInstance();
const storageService = StorageService.getInstance();

export const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state: authInitialState(),
  getters: {},
  actions: {
    async fetchProfile({ dispatch }) {
      const res = await api.player.getPlayer();
      if (res.success) {
        const profile = res.success;
        await dispatch('setProfile', profile);
        return { success: profile };
      } else {
        return { error: res.error };
      }
    },
    async updateProfile({ dispatch, commit, rootState }, data: FormData) {
      let updateStrats = false;
      if (data.has('name') && data.get('name') !== rootState.auth.profile.name) {
        try {
          updateStrats = await dispatch(
            'app/showDialog',
            {
              key: 'auth/updateProfile',
              text: 'Would you like to replace your name in all strat mentions? This will do a simple find/replace and may lead to errors in the strat.',
              resolveBtn: 'Yes',
              rejectBtn: 'No',
            },
            { root: true },
          );
          // eslint-disable-next-line no-empty
        } catch (error) {}
      }

      const res = await api.player.updatePlayer(data, updateStrats);
      if (res.success) {
        commit(SET_PROFILE, res.success);
        if (data.has('email')) {
          const message =
            'Successfully updated your profile. A confirmation mail has been sent to confirm the new email address.';
          dispatch('app/showToast', { id: 'auth/updateProfile', text: message }, { root: true });
        }
      }
    },
    updateStatus({ commit }, status: Status) {
      commit(SET_STATUS, status);
    },
    setProfile({ commit }, profile: Player) {
      commit(SET_PROFILE, profile);
      commit(SET_STATUS, profile.team ? Status.LOGGED_IN_WITH_TEAM : Status.LOGGED_IN_NO_TEAM);
      trackingService.identify(profile._id, profile.name);
      storageService.set('username', profile.name);
      storageService.set('userId', profile._id);
      if (profile.team) {
        WebSocketService.getInstance().connect();
      } else {
        WebSocketService.getInstance().disconnect(); // TODO: maybe find a way to call this earlier, because socket update will cause console error
      }
    },
    async login({ commit, dispatch, state }, { email, password }) {
      const res = await api.auth.login(email, password);
      if (res.success) {
        commit(SET_TOKEN, res.success.token);

        await dispatch('fetchProfile');
        storageService.set('hasSession', '1');
        dispatch('app/showToast', { id: 'auth/login', text: 'Logged in successfully.' }, { root: true });
        trackingService.track('Action: Login', { email, name: state.profile.name });
        setTimeout(() => dispatch('refresh'), TOKEN_TTL - 10000);
        return { success: true };
      } else {
        return { error: res.error };
      }
    },
    async logout({ dispatch, state }) {
      trackingService.track('Action: Logout', { email: state.profile.email, name: state.profile.name });
      await api.auth.logout();
      dispatch('resetState', null, { root: true });
      WebSocketService.getInstance().disconnect();
      dispatch('app/showToast', { id: 'auth/logout', text: 'Logged out successfully.' }, { root: true });
    },
    async deleteAccount({ dispatch, state }) {
      trackingService.track('Action: Delete Account', { email: state.profile.email, name: state.profile.name });
      await api.auth.deleteAccount();
      dispatch('resetState', null, { root: true });
      WebSocketService.getInstance().disconnect();
      dispatch('app/showToast', { id: 'auth/delete', text: 'Successfully deleted account.' }, { root: true });
    },
    async refresh({ dispatch, commit }) {
      const res = await api.auth.refresh();

      if (res.success) {
        commit(SET_TOKEN, res.success.token);

        storageService.set('hasSession', '1');
        setTimeout(() => dispatch('refresh'), TOKEN_TTL - 10000);
        return true;
      }
      if (res.error) {
        storageService.remove('hasSession');
        removeCookie('hasSession');
        if (router.currentRoute.name !== RouteNames.Login) router.push(Routes.Login);
      }
    },
    async forgotPassword({ dispatch }, email: string) {
      const res = await api.auth.forgotPassword(email);
      if (res.success) {
        dispatch(
          'app/showToast',
          { id: 'auth/forgotPassword', text: 'A mail has been sent to your email with a link to reset your password.' },
          { root: true },
        );
      } else {
        return { error: res.error };
      }
    },
    async resetPassword({ dispatch }, payload: { token: string; password: string }) {
      const res = await api.auth.resetPassword(payload);
      if (res.success) {
        dispatch(
          'app/showToast',
          { id: 'auth/resetPassword', text: 'Your password has been changed successfully.' },
          { root: true },
        );
        return { success: true };
      } else {
        return { error: res.error };
      }
    },
    async register({ dispatch }, formData: FormData) {
      const res = await api.auth.register(formData);
      if (res.success) {
        dispatch(
          'app/showToast',
          { id: 'auth/register', text: 'Registered successfully. A confirmation email has been sent.' },
          { root: true },
        );
        trackingService.track('Action: Register', {
          email: formData.get('email') as string,
          name: formData.get('name') as string,
        });
        return { success: 'Registered successfully. A confirmation email has been sent.' }; // TODO: probably remove all these
      } else {
        return { error: res.error };
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
