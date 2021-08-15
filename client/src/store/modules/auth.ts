/* eslint-disable @typescript-eslint/no-explicit-any */
import { Module } from 'vuex';
import { RootState } from '..';
import WebSocketService from '@/services/websocket.service';
import { API_URL } from '@/config';
import TrackingService from '@/services/tracking.service';
import {
  AuthApi,
  Configuration,
  GetUserResponse,
  ProfileUpdateDto,
  ResetPasswordDto,
  UsersApi,
  UsersApiUsersControllerRegisterUserRequest,
} from 'src/api';
import { Log } from 'src/utils/logger';

const SET_TOKEN = 'SET_TOKEN';
const SET_USER = 'SET_USER';
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
  user: GetUserResponse | Record<string, any>;
}

const authInitialState = (): AuthState => ({
  status: Status.NO_AUTH,
  token: '',
  user: {},
});

const trackingService = TrackingService.getInstance();
const apiConfig = new Configuration({
  basePath: API_URL,
});
const authApi = new AuthApi(apiConfig);
const usersApi = new UsersApi(apiConfig);

export const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state: authInitialState(),
  getters: {},
  actions: {
    async fetchUser({ dispatch }) {
      try {
        const { data } = await usersApi.usersControllerGetUser();
        dispatch('setUser', data);
      } catch (error) {
        Log.error('auth store', error);
      }
    },
    async updateUser({ dispatch }, formData: FormData) {
      if (
        formData.has('name') &&
        (await dispatch(
          'app/showDialog',
          {
            key: 'auth/updateUser',
            text:
              // eslint-disable-next-line max-len
              'Would you like to replace your name in all strat mentions? This will do a simple find/replace and may lead to errors in the strat.',
            resolveBtn: 'Yes',
            rejectBtn: 'No',
          },
          { root: true }
        ))
      ) {
        formData.set('updateStrategies', 'true');
      }
      try {
        await usersApi.usersControllerUpdateUser({
          profileUpdateDto: formData as ProfileUpdateDto,
        });
        dispatch('fetchUser');
        if (formData.has('email')) {
          const message =
            'Successfully updated your user. A confirmation mail has been sent to confirm the new email address.';
          dispatch('app/showToast', { id: 'auth/updateUser', text: message }, { root: true });
        }
      } catch (error) {
        Log.error('auth store', error);
      }
    },
    updateStatus({ commit }, status: Status) {
      commit(SET_STATUS, status);
    },
    setUser({ commit }, user: GetUserResponse) {
      commit(SET_USER, user);
      commit(SET_STATUS, user.team ? Status.LOGGED_IN_WITH_TEAM : Status.LOGGED_IN_NO_TEAM);
      trackingService.identify(user.id, user.userName);
      if (user.team) {
        WebSocketService.getInstance().connect();
      } else {
        // TODO: maybe find a way to call this earlier, because socket update will cause console error
        WebSocketService.getInstance().disconnect();
      }
    },
    async login({ dispatch, state }, { email, password }) {
      try {
        await authApi.authControllerLogin({ localSignInDto: { email, password } });
        await dispatch('fetchUser');
        dispatch('app/showToast', { id: 'auth/login', text: 'Logged in successfully.' }, { root: true });
        trackingService.track('Action: Login', { email, name: state.user.userName });
      } catch (error) {
        Log.error('auth store', error);
      }
    },
    async logout({ dispatch, state }) {
      try {
        await authApi.authControllerLogout();
        dispatch('resetState', null, { root: true });
        WebSocketService.getInstance().disconnect();
        dispatch('app/showToast', { id: 'auth/logout', text: 'Logged out successfully.' }, { root: true });
        trackingService.track('Action: Logout', { email: state.user.email, name: state.user.userName });
      } catch (error) {
        Log.error('auth store', error);
      }
    },
    async deleteAccount({ dispatch, state }) {
      try {
        await usersApi.usersControllerDeleteUser({ deleteUserDto: { userName: state.user.userName } });
        trackingService.track('Action: Delete Account', { email: state.user.email, name: state.user.userName });
        dispatch('resetState', null, { root: true });
        WebSocketService.getInstance().disconnect();
        dispatch('app/showToast', { id: 'auth/delete', text: 'Successfully deleted account.' }, { root: true });
      } catch (error) {
        Log.error('auth store', error);
      }
    },
    async forgotPassword({ dispatch }, { email, captchaToken }) {
      try {
        await usersApi.usersControllerForgotPassword({ forgotPasswordDto: { email, captchaResponse: captchaToken } });
        dispatch(
          'app/showToast',
          { id: 'auth/forgotPassword', text: 'A mail has been sent to your email with a link to reset your password.' },
          { root: true }
        );
      } catch (error) {
        Log.error('auth store', error);
      }
    },
    async resetPassword({ dispatch }, payload: ResetPasswordDto) {
      try {
        await usersApi.usersControllerResetPassword({ resetPasswordDto: payload });
        dispatch(
          'app/showToast',
          { id: 'auth/resetPassword', text: 'Your password has been changed successfully.' },
          { root: true }
        );
      } catch (error) {
        Log.error('auth store', error);
      }
    },
    async register({ dispatch }, formData: FormData) {
      try {
        await usersApi.usersControllerRegisterUser((formData as unknown) as UsersApiUsersControllerRegisterUserRequest);
        dispatch(
          'app/showToast',
          { id: 'auth/register', text: 'Registered successfully. A confirmation email has been sent.' },
          { root: true }
        );
        trackingService.track('Action: Register', {
          email: formData.get('email') as string,
          name: formData.get('name') as string,
        });
      } catch (error) {
        Log.error('auth store', error);
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
    [SET_USER](state, user: GetUserResponse) {
      state.user = user;
    },
    [SET_STATUS](state, status: Status) {
      state.status = status;
    },
    [RESET_STATE](state) {
      Object.assign(state, authInitialState());
    },
  },
};
