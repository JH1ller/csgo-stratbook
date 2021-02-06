import urljoin from 'url-join';
import ApiService from './base';
import { Player } from './models/Player';
import { Team } from './models/Team';
import { APIResponse, Endpoints } from './types';

export enum Actions {
  Join = 'join',
  Leave = 'leave',
  Kick = 'kick',
  Transfer = 'transfer',
  Players = 'players',
}

export class TeamService {
  private static instance: TeamService;
  private endpoint = Endpoints.Teams;

  private constructor() {
    // private to prevent instantiation
  }

  static getInstance(): TeamService {
    if (!TeamService.instance) {
      TeamService.instance = new TeamService();
    }
    return TeamService.instance;
  }

  async createTeam(formData: FormData): Promise<APIResponse<Team>> {
    return ApiService.makeRequest<Team>(ApiService.http.post(this.endpoint, formData));
  }

  async updateTeam(formData: FormData): Promise<APIResponse<Team>> {
    return ApiService.makeRequest<Team>(ApiService.http.patch(this.endpoint, formData));
  }

  async joinTeam(code: string): Promise<APIResponse<Player>> {
    const target = urljoin(this.endpoint, Actions.Join);
    return ApiService.makeRequest<Player>(ApiService.http.patch(target, { code }));
  }

  async leaveTeam(): Promise<APIResponse<Player>> {
    const target = urljoin(this.endpoint, Actions.Leave);
    return ApiService.makeRequest<Player>(ApiService.http.patch(target));
  }

  async deleteTeam(): Promise<APIResponse<Player>> {
    return ApiService.makeRequest<Player>(ApiService.http.delete(this.endpoint));
  }

  async transferManager(memberID: string): Promise<APIResponse<Team>> {
    const target = urljoin(this.endpoint, Actions.Transfer);
    return ApiService.makeRequest<Team>(ApiService.http.patch(target, { _id: memberID }));
  }

  async kickMember(memberID: string): Promise<APIResponse<string>> {
    const target = urljoin(this.endpoint, Actions.Kick);
    return ApiService.makeRequest<string>(ApiService.http.patch(target, { _id: memberID }));
  }

  async getTeam(): Promise<APIResponse<Team>> {
    return ApiService.makeRequest<Team>(ApiService.http.get(this.endpoint));
  }

  async getMembersOfTeam(): Promise<APIResponse<Player[]>> {
    const target = urljoin(this.endpoint, Actions.Players);
    return ApiService.makeRequest<Player[]>(ApiService.http.get(target));
  }
}
