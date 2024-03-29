import { GameMap } from '@/api/models/GameMap';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { LineConfig } from 'konva/lib/shapes/Line';
import { TextConfig } from 'konva/lib/shapes/Text';
import { Stage } from 'konva/lib/Stage';

export type KonvaRef<T> = Vue & { getNode: () => T; getStage: () => Stage };

export interface ImageItem extends Partial<ImageConfig> {
  id: string;
  x: number;
  y: number;
  type: UtilityTypes;
}

export interface LineItem extends Partial<LineConfig> {
  id: string;
  points: number[];
  color: string;
}

export interface TextItem extends Partial<TextConfig> {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
}

export interface PlayerItem extends Partial<ImageConfig> {
  id: string;
  playerId?: string;
  x: number;
  y: number;
  name?: string;
  color: string;
}

export interface ItemState extends Record<string, (ImageItem | LineItem | TextItem | PlayerItem)[]> {
  images: ImageItem[];
  lines: LineItem[];
  texts: TextItem[];
  players: PlayerItem[];
}

export interface RemoteClient {
  userName?: string;
  id: string;
  position: {
    x: number;
    y: number;
  };
  image: CanvasImageSource;
  color: string;
  timeout?: NodeJS.Timeout;
  pointerVisible: boolean;
}

export enum ToolTypes {
  Brush = 'BRUSH',
  Pan = 'PAN',
  Pointer = 'POINTER',
  Text = 'TEXT',
}

export type StoredItemState = Record<GameMap, ItemState>;
