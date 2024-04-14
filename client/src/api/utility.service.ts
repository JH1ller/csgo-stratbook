import urljoin from 'url-join';
import ApiService from './base';
import { Utility } from './models/Utility';
import { APIResponse, Endpoints, Message } from './types';

export enum Actions {
  Share = 'share',
}

export class UtilityService {
  private static instance: UtilityService;
  private endpoint = Endpoints.Utilities;

  private constructor() {
    // private to prevent instantiation
  }

  static getInstance(): UtilityService {
    if (!UtilityService.instance) {
      UtilityService.instance = new UtilityService();
    }
    return UtilityService.instance;
  }

  async getUtilities(): Promise<APIResponse<Utility[]>> {
    return ApiService.makeRequest<Utility[]>(ApiService.http.get(this.endpoint));
  }

  async deleteUtility(utilityID: string): Promise<APIResponse<Message>> {
    const target = urljoin(Endpoints.Utilities, utilityID);
    return ApiService.makeRequest<Message>(ApiService.http.delete(target));
  }

  async createUtility(utility: FormData): Promise<APIResponse<Utility>> {
    const target = urljoin(Endpoints.Utilities);
    return ApiService.makeRequest<Utility>(
      ApiService.http.post(target, utility, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    );
  }

  async updateUtility(payload: FormData | Partial<Utility>): Promise<APIResponse<Utility>> {
    const target = urljoin(Endpoints.Utilities);
    return ApiService.makeRequest<Utility>(ApiService.http.patch(target, payload));
  }
}
