import { API_URL } from '@/config';
import axios from 'axios';
import urljoin from 'url-join';
import ApiService from './base';
import { Player } from './models/Player';
import { Actions, APIResponse, Endpoints } from './types';

const endpoint = Endpoints.Auth;

export default class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<APIResponse<string>> {
    const target = urljoin(API_URL, Endpoints.Auth, Actions.Login);
    return ApiService.makeRequest<string>(axios.post(target, { email, password }));
  }

  async register(formData: Partial<Player>): Promise<APIResponse<{ _id: string; email: string }>> {
    const target = urljoin(API_URL, Endpoints.Auth, Actions.Register);
    return ApiService.makeRequest<{ _id: string; email: string }>(axios.post(target, formData));
  }

  async forgotPassword(email: string): Promise<APIResponse<boolean>> {
    const target = urljoin(API_URL, Endpoints.Auth, Actions.ForgotPassword);
    return ApiService.makeRequest<boolean>(axios.post(target, { email }));
  }

  async resetPassword(payload: { token: string; password: string }): Promise<APIResponse<boolean>> {
    const target = urljoin(API_URL, Endpoints.Auth, Actions.Reset);
    return ApiService.makeRequest<boolean>(axios.patch(target, payload));
  }
}
