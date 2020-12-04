import { Model } from './Model';

export interface Team extends Model {
  name: string;
  code: string;
  avatar?: string;
  createdBy: string;
  manager: string;
  website?: string;
  server?: {
    ip?: string;
    password?: string;
  };
}