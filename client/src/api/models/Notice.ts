import { Model } from './Model';

export interface Notice extends Model {
  version: string;
  content: string;
  tags: string[];
  expires: string;
}
