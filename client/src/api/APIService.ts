import axios from 'axios';
import urljoin from 'url-join';
import store from '@/store';
import router from '@/router';
import jwtDecode from 'jwt-decode';
import { Routes, RouteNames } from '@/router/router.models';
import { API_URL } from '@/config';
import { log } from '@/utils/logger';
import { Status } from '@/store/modules/auth';
import { Player } from './models/Player';
import { Strat } from './models/Strat';
import { Team } from './models/Team';
import { Utility } from './models/Utility';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    if (store.state.auth.token) {
      config.headers['Authorization'] = store.state.auth.token;
      store.dispatch('app/updateLoading', true);
      return config;
    } else {
      log.error('axios::interceptor', 'User not authenticated. Request cancelled.');
      throw new axios.Cancel('User not authenticated. Request cancelled.');
    }
  },
  error => {
    log.error('axios::interceptor', 'User not authenticated. Request cancelled.');
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  response => {
    store.dispatch('app/updateLoading', false);
    return response;
  },
  error => {
    store.dispatch('app/updateLoading', false);
    log.error('axios::interceptor', error.response.data.error);
    if (error.response.status === 401) {
      if (router.currentRoute.name !== RouteNames.Login) router.push(Routes.Login);
      store.dispatch('resetState');
      store.dispatch('app/showToast', {
        id: 'axiosInterceptor/401',
        text: 'Authorization expired. Please login again.',
      });
      store.dispatch('auth/updateStatus', Status.NO_AUTH);
    } else {
      if (error.response.status !== 500) {
        store.dispatch('app/showToast', { id: 'axiosInterceptor/error', text: error.response.data.error });
      } else {
        store.dispatch('app/showToast', { id: 'axiosInterceptor/500', text: 'An error occured on the server.' });
      }
    }
    return Promise.reject(error);
  }
);

enum Endpoints {
  Maps = '/maps',
  Strats = '/strats',
  Players = '/players',
  Teams = '/teams',
  Auth = '/auth',
  Utilities = '/utilities',
}

// TODO: obsolete, remove
enum Actions {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  Login = 'login',
  Register = 'register',
  Join = 'join',
  Leave = 'leave',
  Kick = 'kick',
  Transfer = 'transfer',
  Share = 'share',
  ForgotPassword = 'forgot-password',
  Reset = 'reset',
}

interface APIResponseSuccess<T> {
  success: T;
  error?: never;
}
interface APIResponseError {
  error: string;
  success?: never;
}

type Message = { message: string };

export type APIResponse<T> = APIResponseSuccess<T> | APIResponseError;

interface JWTData {
  _id: string;
}

class APIService {
  static async getPlayer(): Promise<APIResponse<Player>> {
    try {
      const { data } = await axiosInstance.get(Endpoints.Players);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async login(email: string, password: string): Promise<APIResponse<string>> {
    const target = urljoin(API_URL, Endpoints.Auth, Actions.Login);

    try {
      store.dispatch('app/updateLoading', true);
      // * not using axiosInstance here, because login doesn't require authorization
      const { data } = await axios.post(target, { email, password });
      store.dispatch('app/updateLoading', false);
      return { success: data };
    } catch (error) {
      store.dispatch('app/updateLoading', false);
      return { error: error.response?.data?.error };
    }
  }

  static async register(formData: Partial<Player>): Promise<APIResponse<{ _id: string; email: string }>> {
    const target = urljoin(API_URL, Endpoints.Auth, Actions.Register);
    try {
      store.dispatch('app/updateLoading', true);
      // * not using axiosInstance here, because register doesn't require authorization
      const { data } = await axios.post(target, formData);
      store.dispatch('app/updateLoading', false);
      return { success: data };
    } catch (error) {
      store.dispatch('app/updateLoading', false);
      return { error: error.response?.data?.error };
    }
  }

  static async forgotPassword(email: string): Promise<APIResponse<boolean>> {
    const target = urljoin(API_URL, Endpoints.Auth, Actions.ForgotPassword);
    try {
      const { data } = await axios.post(target, { email });
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async resetPassword(payload: { token: string; password: string }): Promise<APIResponse<boolean>> {
    const target = urljoin(API_URL, Endpoints.Auth, Actions.Reset);
    try {
      const { data } = await axios.patch(target, payload);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async updatePlayer(payload: FormData, updateStrats: boolean = false): Promise<APIResponse<Player>> {
    const target = urljoin(Endpoints.Players);
    try {
      const { data } = await axiosInstance.patch(target, payload, {
        params: {
          updateStrats,
        },
      });
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async getStrats(): Promise<APIResponse<Strat[]>> {
    const target = urljoin(Endpoints.Strats);
    try {
      const { data } = await axiosInstance.get(target);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async deleteStrat(stratId: string): Promise<APIResponse<Message>> {
    const target = urljoin(Endpoints.Strats, stratId);
    try {
      const { data } = await axiosInstance.delete(target);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async createStrat(strat: Partial<Strat>): Promise<APIResponse<Strat>> {
    const target = urljoin(Endpoints.Strats);
    try {
      const { data } = await axiosInstance.post(target, strat);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async updateStrat(payload: Partial<Strat>): Promise<APIResponse<Strat>> {
    const target = urljoin(Endpoints.Strats);

    try {
      const { data } = await axiosInstance.patch(target, payload);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async addSharedStrat(stratID: string): Promise<APIResponse<Strat>> {
    const target = urljoin(Endpoints.Strats, Actions.Share, stratID);

    try {
      const { data } = await axiosInstance.post(target);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async getUtilities(): Promise<APIResponse<Utility[]>> {
    const target = urljoin(Endpoints.Utilities);
    try {
      const { data } = await axiosInstance.get(target);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async deleteUtility(utilityID: string): Promise<APIResponse<Message>> {
    const target = urljoin(Endpoints.Utilities, utilityID);
    try {
      const { data } = await axiosInstance.delete(target);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async createUtility(utility: FormData): Promise<APIResponse<Utility>> {
    const target = urljoin(Endpoints.Utilities);
    try {
      const { data } = await axiosInstance.post(target, utility, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async updateUtility(payload: FormData): Promise<APIResponse<Utility>> {
    const target = urljoin(Endpoints.Utilities);

    try {
      const { data } = await axiosInstance.patch(target, payload);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async addSharedUtility(utilityID: string): Promise<APIResponse<Utility>> {
    const target = urljoin(Endpoints.Utilities, Actions.Share, utilityID);

    try {
      const { data } = await axiosInstance.post(target);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async createTeam(formData: FormData): Promise<APIResponse<Team>> {
    const target = urljoin(Endpoints.Teams);
    try {
      const { data } = await axiosInstance.post(target, formData);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async updateTeam(payload: FormData): Promise<APIResponse<Team>> {
    const target = urljoin(Endpoints.Teams);
    try {
      const { data } = await axiosInstance.patch(target, payload);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async joinTeam(code: string): Promise<APIResponse<Player>> {
    const target = urljoin(Endpoints.Teams, Actions.Join);
    try {
      const { data } = await axiosInstance.patch(target, { code });
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async leaveTeam(): Promise<APIResponse<Player>> {
    const target = urljoin(Endpoints.Teams, Actions.Leave);
    try {
      const { data } = await axiosInstance.patch(target);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async deleteTeam(): Promise<APIResponse<Player>> {
    const target = urljoin(Endpoints.Teams, Actions.Delete);
    try {
      const { data } = await axiosInstance.delete(target);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async transferManager(memberID: string): Promise<APIResponse<Team>> {
    const target = urljoin(Endpoints.Teams, Actions.Transfer);
    try {
      const { data } = await axiosInstance.patch(target, { _id: memberID });
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async kickMember(memberID: string): Promise<APIResponse<string>> {
    const target = urljoin(Endpoints.Teams, Actions.Kick);
    try {
      const { data } = await axiosInstance.patch(target, { _id: memberID });
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async getTeam(): Promise<APIResponse<Team>> {
    const target = urljoin(Endpoints.Teams);
    try {
      const { data } = await axiosInstance.get(target);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async getMembersOfTeam(): Promise<APIResponse<Player[]>> {
    const target = urljoin(Endpoints.Teams, 'players');
    try {
      const { data } = await axiosInstance.get(target);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }
}

export default APIService;
