import { Sides } from '@/api/models/Sides';
import { LinkOption } from '../StratEditor';

export const generateWeaponData = (side: Sides): LinkOption[] => [
  {
    label: 'Desert Eagle',
    query: 'deagle desert eagle',
    icon: 'deserteagle',
  },
  {
    label: 'AWP',
    query: 'AWP sniper',
    icon: 'awp',
  },
  {
    label: 'P250',
    query: 'p250',
    icon: 'p250',
  },
  {
    label: side === Sides.CT ? 'M4' : 'AK47',
    query: side === Sides.CT ? 'm4' : 'ak47',
    icon: side === Sides.CT ? 'm4a4' : 'ak47',
  },
  {
    label: side === Sides.CT ? 'Famas' : 'Galil',
    query: side === Sides.CT ? 'famas' : 'galil',
    icon: side === Sides.CT ? 'famas' : 'galil',
  },
  {
    label: side === Sides.CT ? 'USP/P2000' : 'Glock',
    query: side === Sides.CT ? 'usp p2000' : 'glock',
    icon: side === Sides.CT ? 'p2000' : 'glock',
  },
  {
    label: side === Sides.CT ? 'MP9' : 'MAC-10',
    query: side === Sides.CT ? 'mp9' : 'mac10',
    icon: side === Sides.CT ? 'mp9' : 'mac10',
  },
];

export const generateEquipmentData = (side: Sides): LinkOption[] => [
  {
    label: 'Kevlar',
    query: 'kevlar armor',
    icon: 'kevlar',
  },
  {
    label: side === Sides.CT ? 'Defuse Kit' : 'Bomb',
    query: side === Sides.CT ? 'defusekit' : 'bomb',
    icon: side === Sides.CT ? 'defusekit' : 'c4',
  },
];
