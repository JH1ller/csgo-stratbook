import jwtDecode from 'jwt-decode';
import axios from 'axios';
import urljoin from 'url-join';
import { Player } from './models';
import APIService from './APIService';

const url =
  process.env.NODE_ENV === 'production'
    ? 'https://csgo-stratbook.herokuapp.com/'
    : 'http://localhost:3000/';

enum Endpoints {
  AUTH = 'auth',
}

enum Actions {
  LOGIN = 'login',
  REGISTER = 'register',
}

interface JWTData {
  _id: string;
}

class AuthService {
  private static instance: AuthService;

  private token: string | null = null;

  private playerInfo: Player | null = null;

  private constructor() {
    this.loadTokenFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string) {
    const target = urljoin(url, Endpoints.AUTH, Actions.LOGIN);
    try {
      const res = await axios.post(target, { email, password });
      this.token = res.data;
      this.saveTokenToStorage();
      return { token: res.data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  async register(formData: any) {
    const target = urljoin(url, Endpoints.AUTH, Actions.REGISTER);
    try {
      const res = await axios.post(target, formData);
      this.token = res.data;
      return { user: res.data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  saveTokenToStorage() {
    if (this.token) localStorage.setItem('auth-token', this.token);
  }

  loadTokenFromStorage(): string | undefined {
    this.token = localStorage.getItem('auth-token');
    if (this.token) return this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getPlayerInfo(): Player | null {
    return this.playerInfo;
  }

  async updatePlayerInfo() {
    if (this.token) {
      const decodedToken: JWTData = jwtDecode(this.token);
      try {
        const res = await APIService.getPlayer(decodedToken._id);
        this.playerInfo = res;
        return res;
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    }
  }
}

export default AuthService;
