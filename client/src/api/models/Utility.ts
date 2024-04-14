import { GameMap } from './GameMap';
import { Model } from './Model';
import { MouseButtons } from './MouseButtons';
import { Sides } from './Sides';
import { UtilityMovement } from './UtilityMovement';
import { UtilityTypes } from './UtilityTypes';

export interface Utility extends Model {
  name: string;
  type: UtilityTypes;
  map: GameMap;
  side: Sides;
  mouseButton: MouseButtons;
  crouch: boolean;
  jump: boolean;
  movement: UtilityMovement;
  videoLink?: string;
  setpos?: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  images: string[];
  shared: boolean;
  labels: string[];
}
