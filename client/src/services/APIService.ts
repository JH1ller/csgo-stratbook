import axios from 'axios';
import urljoin from 'url-join';
import { Map, Strat, Step, Player, Team } from '@/services/models';
import { TeamCreateFormData } from '@/components/team-create-form/team-create-form';
import store from '@/store';
import router from '@/router';
import jwtDecode from 'jwt-decode';

const baseURL =
  process.env.NODE_ENV === 'production' ? 'https://csgo-stratbook.herokuapp.com/' : 'http://localhost:3000/';

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
});

axiosInstance.interceptors.request.use(config => {
  if (store.state.auth.token) {
    config.headers['Authorization'] = store.state.auth.token;
    store.dispatch('app/showLoader');
    return config;
  } else {
    throw new axios.Cancel('User not authenticated. Request cancelled.');
  }
});
axiosInstance.interceptors.response.use(
  () => store.dispatch('app/hideLoader'),
  error => {
    store.dispatch('app/hideLoader');
    console.error(error.response.data.error);
    if (error.response.status === 401) {
      router.push({ name: 'Login' });
      store.dispatch('app/showToast', 'Authorization expired. Please login again.');
    } else {
      if (error.response.status !== 500) {
        store.dispatch('app/showToast', error.response.data.error);
      }
    }
  }
);

enum Endpoints {
  Maps = '/maps',
  Strats = '/strats',
  Players = '/players',
  Steps = '/steps',
  Teams = '/teams',
  Auth = '/auth',
}

enum Actions {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  Login = 'login',
  Register = 'register',
  Join = 'join',
  Leave = 'leave',
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
      return { error: error.response.data.error };
    }
  }

  static async getPlayer(): Promise<APIResponse<Player>> {
    const decodedToken: JWTData = jwtDecode(store.state.auth.token);
    if (!decodedToken._id) return { error: 'Could not fetch player info: No token in storage.' };
    const target = urljoin(Endpoints.Players, decodedToken._id);

    try {
      const { data } = await axiosInstance.get(target);
      return { success: data, error: 'test' };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async login(email: string, password: string): Promise<APIResponse<string>> {
    const target = urljoin(baseURL, Endpoints.Auth, Actions.Login);

    try {
      store.dispatch('app/showLoader');
      // * not using axiosInstance here, because login doesn't require authorization
      const { data } = await axios.post(target, { email, password });
      store.dispatch('app/hideLoader');
      return { success: data };
    } catch (error) {
      store.dispatch('app/hideLoader');
      return { error: error.response.data.error };
    }
  }

  static async register(formData: Partial<Player>): Promise<APIResponse<{ _id: string; email: string }>> {
    const target = urljoin(baseURL, Endpoints.Auth, Actions.Register);
    try {
      store.dispatch('app/showLoader');
      // * not using axiosInstance here, because register doesn't require authorization
      const { data } = await axios.post(target, formData);
      store.dispatch('app/hideLoader');
      return { success: data };
    } catch (error) {
      store.dispatch('app/hideLoader');
      return { error: error.response.data.error };
    }
  }

  static async updatePlayer(payload: Partial<Player>): Promise<APIResponse<Player>> {
    const target = urljoin(Endpoints.Players, Actions.Update);
    try {
      const { data } = await axiosInstance.patch(target, payload);
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async getStratsOfMap(mapId: string): Promise<APIResponse<Strat[]>> {
    const target = urljoin(Endpoints.Strats);
    try {
      const { data } = await axiosInstance.get(target, {
        params: {
          map: mapId,
        },
      });
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async deleteStrat(stratId: string): Promise<APIResponse<Message>> {
    const target = urljoin(Endpoints.Strats, stratId, Actions.Delete);
    try {
      const { data } = await axiosInstance.delete(target);
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async createStrat(strat: Partial<Strat>): Promise<APIResponse<Strat>> {
    const target = urljoin(Endpoints.Strats, Actions.Create);
    try {
      const { data } = await axiosInstance.post(target, strat);
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async updateStrat(payload: Partial<Strat>): Promise<APIResponse<Strat>> {
    const target = urljoin(Endpoints.Strats, Actions.Update);

    try {
      const { data } = await axiosInstance.patch(target, payload);
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async getStepsOfStrat(stratID: string): Promise<APIResponse<Step[]>> {
    try {
      const { data } = await axiosInstance.get(Endpoints.Steps, {
        params: {
          strat: stratID,
        },
      });
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async updateStep(payload: Partial<Step>): Promise<APIResponse<Step>> {
    const target = urljoin(Endpoints.Steps, Actions.Update);

    try {
      const { data } = await axiosInstance.patch(target, payload);
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async createStep(step: Partial<Step>): Promise<APIResponse<Step>> {
    const target = urljoin(Endpoints.Steps, Actions.Create);

    try {
      const { data } = await axiosInstance.post(target, step);
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async deleteStep(stepID: string): Promise<APIResponse<Message>> {
    const target = urljoin(Endpoints.Steps, stepID, Actions.Delete);
    try {
      const { data } = await axiosInstance.delete(target);
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async createTeam(formData: TeamCreateFormData): Promise<APIResponse<Team>> {
    const target = urljoin(Endpoints.Teams, Actions.Create);
    try {
      const { data } = await axiosInstance.post(target, formData);
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async joinTeam(code: string): Promise<APIResponse<Player>> {
    const target = urljoin(Endpoints.Teams, Actions.Join);
    try {
      const { data } = await axiosInstance.patch(target, { code });
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async leaveTeam(): Promise<APIResponse<Player>> {
    const target = urljoin(Endpoints.Teams, Actions.Leave);
    try {
      const { data } = await axiosInstance.patch(target);
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async getTeam(): Promise<APIResponse<Team>> {
    const target = urljoin(Endpoints.Teams);
    try {
      const { data } = await axiosInstance.get(target);
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }

  static async getMembersOfTeam(): Promise<APIResponse<Player[]>> {
    const target = urljoin(Endpoints.Teams, 'players');
    try {
      const { data } = await axiosInstance.get(target);
      return { success: data };
    } catch (error) {
      return { error: error.response.data.error };
    }
  }
}

export default APIService;
