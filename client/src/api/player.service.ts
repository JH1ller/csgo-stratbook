import ApiService from './base';
import { Player } from './models/Player';
import { APIResponse, Endpoints } from './types';

export class PlayerService {
  private static instance: PlayerService;
  private endpoint = Endpoints.Players;

  private constructor() {}

  static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  async getPlayer(): Promise<APIResponse<Player>> {
    return ApiService.makeRequest<Player>(ApiService.http.get(this.endpoint));
  }

  async updatePlayer(formData: FormData, updateStrats: boolean = false): Promise<APIResponse<Player>> {
    return ApiService.makeRequest<Player>(
      ApiService.http.patch(this.endpoint, formData, {
        params: {
          updateStrats,
        },
      })
    );
  }
}
