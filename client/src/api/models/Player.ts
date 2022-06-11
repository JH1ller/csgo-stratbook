import { Model } from './Model';

export interface Player extends Model {
  name: string;
  email: string;
  avatar?: string;
  team?: string;
  isOnline?: boolean;
  lastOnline?: Date;
  completedTutorial?: boolean;
  color: string;
}
