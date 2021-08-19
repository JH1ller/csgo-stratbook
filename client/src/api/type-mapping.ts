/* eslint-disable no-redeclare */
import { AddStrategyDtoGameMap, AddStrategyDtoSide, AddStrategyDtoType, StrategyItemResponse } from './models';

export type PlayerSide = AddStrategyDtoSide;
export const PlayerSide = { ...AddStrategyDtoSide };

export type GameMap = AddStrategyDtoGameMap;
export const GameMap = { ...AddStrategyDtoGameMap };

export type StrategyType = AddStrategyDtoType;
export const StrategyType = { ...AddStrategyDtoType };

export type Strategy = StrategyItemResponse & { gameMap: GameMap };
