export enum Endpoints {
  Maps = '/maps',
  Strats = '/strats',
  Players = '/players',
  Teams = '/teams',
  Auth = '/auth',
  Utilities = '/utilities',
}

export enum Actions {
  Join = 'join',
  Leave = 'leave',
  Kick = 'kick',
  Transfer = 'transfer',
  Share = 'share',
  Players = 'players',
}

interface APIResponseSuccess<T> {
  success: T;
  error?: never;
}
interface APIResponseError {
  error: string;
  success?: never;
}

export type Message = { message: string };

export type APIResponse<T> = APIResponseSuccess<T> | APIResponseError;

export interface JWTData {
  _id: string;
}
