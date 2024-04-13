import urljoin from 'url-join';
import ApiService from './base';
import { Strat } from './models/Strat';
import { APIResponse, Endpoints, Message } from './types';

export enum Actions {
  Share = 'share',
  Export = 'export',
  Batch = 'batch',
}

export class StratService {
  private static instance: StratService;
  private endpoint = Endpoints.Strats;

  private constructor() {
    // private to prevent instantiation
  }

  static getInstance(): StratService {
    if (!StratService.instance) {
      StratService.instance = new StratService();
    }
    return StratService.instance;
  }

  async getStrats(): Promise<APIResponse<{ strats: Strat[]; labels: string[] }>> {
    return ApiService.makeRequest<{ strats: Strat[]; labels: string[] }>(ApiService.http.get(this.endpoint));
  }

  async deleteStrat(stratId: string): Promise<APIResponse<Message>> {
    const target = urljoin(this.endpoint, stratId);
    return ApiService.makeRequest<Message>(ApiService.http.delete(target));
  }

  async createStrat(strat: Partial<Strat>): Promise<APIResponse<Strat>> {
    return ApiService.makeRequest<Strat>(ApiService.http.post(this.endpoint, strat));
  }

  async updateStrat(payload: Partial<Strat>): Promise<APIResponse<Strat>> {
    return ApiService.makeRequest<Strat>(ApiService.http.patch(this.endpoint, payload));
  }

  async updateStrats(payload: Partial<Strat>[]): Promise<APIResponse<Strat[]>> {
    const target = urljoin(this.endpoint, Actions.Batch);
    return ApiService.makeRequest<Strat[]>(ApiService.http.patch(target, payload));
  }

  async addSharedStrat(stratID: string): Promise<APIResponse<Strat>> {
    const target = urljoin(this.endpoint, Actions.Share, stratID);
    return ApiService.makeRequest<Strat>(ApiService.http.post(target));
  }

  async getStratExport(): Promise<APIResponse<Blob>> {
    const target = urljoin(this.endpoint, Actions.Export);
    return ApiService.makeRequest<Blob>(ApiService.http.get(target, { responseType: 'blob' }));
  }
}
