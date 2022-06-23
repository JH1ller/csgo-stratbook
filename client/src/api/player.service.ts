import urljoin from 'url-join';
import ApiService from './base';
import { Player } from './models/Player';
import { APIResponse, Endpoints } from './types';

export enum Actions {
  ChangeColor = 'color',
}

export class PlayerService {
  private static instance: PlayerService;
  private endpoint = Endpoints.Players;

  private constructor() {
    // private to prevent instantiation
  }

  static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  async getPlayer(): Promise<APIResponse<Player>> {
    return ApiService.makeRequest<Player>(ApiService.http.get(this.endpoint));
  }

  async updatePlayer(formData: FormData, updateStrats = false): Promise<APIResponse<Player>> {
    return ApiService.makeRequest<Player>(
      ApiService.http.patch(this.endpoint, formData, {
        params: {
          updateStrats,
        },
      }),
    );
  }

  async updatePlayerColor(payload: { _id: string; color: string }): Promise<APIResponse<Player>> {
    const target = urljoin(this.endpoint, Actions.ChangeColor);
    return ApiService.makeRequest<Player>(ApiService.http.patch(target, payload));
  }
}
