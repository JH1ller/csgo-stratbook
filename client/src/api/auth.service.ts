import { API_URL } from '@/config';
import axios from 'axios';
import urljoin from 'url-join';
import ApiService from './base';
import { APIResponse, Endpoints } from './types';

export enum Actions {
  Login = 'login',
  Logout = 'logout',
  Refresh = 'refresh',
  Register = 'register',
  ForgotPassword = 'forgot-password',
  Reset = 'reset',
}

interface Authorization {
  token: string;
  refreshToken?: string;
}

export default class AuthService {
  private static instance: AuthService;
  private endpoint = Endpoints.Auth;

  private constructor() {
    // private to prevent instantiation
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<APIResponse<Authorization>> {
    const target = urljoin(API_URL, this.endpoint, Actions.Login);
    return ApiService.makeRequest<{ token: string }>(
      axios.post(target, { email, password, jsonMode: window.desktopMode }, { withCredentials: true })
    );
  }

  async logout(): Promise<APIResponse<string>> {
    const target = urljoin(API_URL, this.endpoint, Actions.Logout);
    return ApiService.makeRequest<string>(axios.post(target, {}, { withCredentials: true }));
  }

  async refresh(refreshToken?: string): Promise<APIResponse<Authorization>> {
    const target = urljoin(API_URL, this.endpoint, Actions.Refresh);
    return ApiService.makeRequest<Authorization>(
      axios.post(target, { jsonMode: window.desktopMode, refreshToken }, { withCredentials: true })
    );
  }

  async register(formData: FormData): Promise<APIResponse<{ _id: string, email: string }>> {
    const target = urljoin(API_URL, this.endpoint, Actions.Register);
    return ApiService.makeRequest<{ _id: string, email: string }>(axios.post(target, formData));
  }

  async forgotPassword(email: string): Promise<APIResponse<boolean>> {
    const target = urljoin(API_URL, this.endpoint, Actions.ForgotPassword);
    return ApiService.makeRequest<boolean>(axios.post(target, { email }));
  }

  async resetPassword(payload: { token: string, password: string }): Promise<APIResponse<boolean>> {
    const target = urljoin(API_URL, this.endpoint, Actions.Reset);
    return ApiService.makeRequest<boolean>(axios.patch(target, payload));
  }

  async deleteAccount(): Promise<APIResponse<string>> {
    const target = urljoin(API_URL, this.endpoint);
    return ApiService.makeRequest<string>(ApiService.http.delete(target));
  }
}
