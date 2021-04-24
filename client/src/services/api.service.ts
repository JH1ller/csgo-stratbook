import { AuthApi, StrategiesApi, TeamsApi, UsersApi, UtilitiesApi } from '@/api';
import router from '@/router';
import { Routes } from '@/router/router.models';
import store from '@/store';
import axios, { AxiosInstance } from 'axios';

export default class ApiService {
  private static instance: ApiService;

  private readonly _axios: AxiosInstance;
  private readonly usersApi: UsersApi;
  private readonly authApi: AuthApi;
  private readonly strategiesApi: StrategiesApi;
  private readonly teamsApi: TeamsApi;
  private readonly utilitiesApi: UtilitiesApi;

  private pendingRequests: number = 0;

  private constructor() {
    this._axios = axios.create({
      baseURL: process.env.BASE_URL,
      timeout: 30000,
      headers: {
        Accept: 'application/json',
      },
    });
    this.authApi = new AuthApi(undefined, undefined, this._axios);
    this.usersApi = new UsersApi(undefined, undefined, this._axios);
    this.strategiesApi = new StrategiesApi(undefined, undefined, this._axios);
    this.teamsApi = new TeamsApi(undefined, undefined, this._axios);
    this.utilitiesApi = new UtilitiesApi(undefined, undefined, this._axios);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this._axios.interceptors.request.use(
      config => {
        this.pendingRequests++;
        if (!store.state.app.loading) {
          store.dispatch('app/updateLoading', true);
        }
        return config;
      },
      error => Promise.reject(error)
    );

    this._axios.interceptors.response.use(
      response => {
        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          store.dispatch('app/updateLoading', false);
        }
        return response;
      },
      error => {
        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          store.dispatch('app/updateLoading', false);
        }
        switch (error.response.status) {
          case 401:
            store
              .dispatch('app/showDialog', {
                key: 'api-service/session-expired',
                text: 'Your session has expired. Please login again.',
              })
              .then(() => router.push(Routes.Login));
        }
        Promise.reject(error);
      }
    );
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  get users(): UsersApi {
    return this.usersApi;
  }

  get auth(): AuthApi {
    return this.authApi;
  }

  get strategies(): StrategiesApi {
    return this.strategiesApi;
  }

  get teams(): TeamsApi {
    return this.teamsApi;
  }

  get utilities(): UtilitiesApi {
    return this.utilitiesApi;
  }
}
