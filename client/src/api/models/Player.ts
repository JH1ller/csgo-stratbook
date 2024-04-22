import { AccessRole } from './AccessRoles';
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
  role: AccessRole;
  steamId: string;
  accountType: 'local' | 'steam';
}
