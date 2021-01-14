import axios, { AxiosInstance, AxiosResponse } from 'axios';
import store from '@/store';
import router from '@/router';
import { Routes, RouteNames } from '@/router/router.models';
import { API_URL } from '@/config';
import { log } from '@/utils/logger';
import { Status } from '@/store/modules/auth';
import AuthService from './auth.service';
import { APIResponse } from './types';
import { PlayerService } from './player.service';
import { TeamService } from './team.service';
import { StratService } from './strat.service';
import { UtilityService } from './utility.service';

export default class ApiService {
  private static axiosInstance: AxiosInstance = ApiService.setupAxios();

  private constructor() {}

  static async makeRequest<T = any>(request: Promise<AxiosResponse<T>>): Promise<APIResponse<T>> {
    try {
      const { data } = await request;
      return { success: data };
    } catch (error) {
      return { error: error.response?.data?.error };
    }
  }

  static get http(): AxiosInstance {
    return this.axiosInstance;
  }

  static get auth(): AuthService {
    return AuthService.getInstance();
  }

  static get player(): PlayerService {
    return PlayerService.getInstance();
  }

  static get team(): TeamService {
    return TeamService.getInstance();
  }

  static get strat(): StratService {
    return StratService.getInstance();
  }

  static get utility(): UtilityService {
    return UtilityService.getInstance();
  }

  private static setupAxios(): AxiosInstance {
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

    return axiosInstance;
  }
}
