import axios, { AxiosResponse } from 'axios';
import urljoin from 'url-join';
import { Map, Strat, Player, Team, Status } from '@/api/models';
import { TeamCreateFormData } from '@/components/TeamCreateForm/TeamCreateForm';
import store from '@/store';
import router from '@/router';
import jwtDecode from 'jwt-decode';
import { Routes, RouteNames } from '@/router/router.models';
import { BASE_URL } from '@/config';
import { log } from '@/utils/logger';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    if (store.state.auth.token) {
      config.headers['Authorization'] = store.state.auth.token;
      store.dispatch('app/showLoader');
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
    store.dispatch('app/hideLoader');
    return response;
  },
  error => {
    store.dispatch('app/hideLoader');
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
  Share = 'share'
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
  static async getMaps(): Promise<APIResponse<Map[]>> {
    try {
      const { data } = await axiosInstance.get(Endpoints.Maps);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async getPlayer(): Promise<APIResponse<Player>> {
    try {
      const decodedToken: JWTData = jwtDecode(store.state.auth.token);
      if (!decodedToken?._id) return { error: 'Could not fetch player info: No token in storage.' };
      const target = urljoin(Endpoints.Players, decodedToken._id);
      const { data } = await axiosInstance.get(target);
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static async login(email: string, password: string): Promise<APIResponse<string>> {
    const target = urljoin(BASE_URL, Endpoints.Auth, Actions.Login);

    try {
      store.dispatch('app/showLoader');
      // * not using axiosInstance here, because login doesn't require authorization
      const { data } = await axios.post(target, { email, password });
      store.dispatch('app/hideLoader');
      return { success: data };
    } catch (error) {
      store.dispatch('app/hideLoader');
      return { error: error.response?.data?.error };
    }
  }

  static async register(formData: Partial<Player>): Promise<APIResponse<{ _id: string; email: string }>> {
    const target = urljoin(BASE_URL, Endpoints.Auth, Actions.Register);
    try {
      store.dispatch('app/showLoader');
      // * not using axiosInstance here, because register doesn't require authorization
      const { data } = await axios.post(target, formData);
      store.dispatch('app/hideLoader');
      return { success: data };
    } catch (error) {
      store.dispatch('app/hideLoader');
      return { error: error.response?.data?.error };
    }
  }

  static async updatePlayer(payload: Partial<Player>): Promise<APIResponse<Player>> {
    const target = urljoin(Endpoints.Players);
    try {
      const { data } = await axiosInstance.patch(target, payload);
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

  static async createTeam(formData: TeamCreateFormData): Promise<APIResponse<Team>> {
    const target = urljoin(Endpoints.Teams);
    try {
      const { data } = await axiosInstance.post(target, formData);
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
