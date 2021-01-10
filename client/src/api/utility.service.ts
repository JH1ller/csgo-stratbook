import urljoin from 'url-join';
import ApiService from './base';
import { Utility } from './models/Utility';
import { Actions, APIResponse, Endpoints, Message } from './types';

export class UtilityService {
  private static instance: UtilityService;
  private endpoint = Endpoints.Utilities;

  private constructor() {}

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
      })
    );
  }

  async updateUtility(payload: FormData): Promise<APIResponse<Utility>> {
    const target = urljoin(Endpoints.Utilities);
    return ApiService.makeRequest<Utility>(ApiService.http.patch(target, payload));
  }

  async addSharedUtility(utilityID: string): Promise<APIResponse<Utility>> {
    const target = urljoin(Endpoints.Utilities, Actions.Share, utilityID);
    return ApiService.makeRequest<Utility>(ApiService.http.post(target));
  }
}
