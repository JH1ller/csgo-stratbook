import type { Strat, StratDocument } from '@/models/strat';
import { minifyHtml } from '@/utils/minifyHtml';
import { sanitize } from '@/utils/sanitizeHtml';
import type { Document } from 'mongoose';

const updatableFields: (keyof Strat)[] = [
  'name',
  'map',
  'side',
  'types',
  'active',
  'videoLink',
  'note',
  'content',
  'shared',
  'index',
  'drawData',
];

type StratDoc = Document<unknown, any, Strat> &
  Omit<
    Strat &
      Required<{
        _id: string;
      }>,
    never
  >;

export const updateStrats = async (strats: StratDoc[], stratUpdates: Partial<StratDoc>[]) => {
  const stratUpdatePromises = strats.map(async (strat, i) => {
    Object.entries(stratUpdates[i]).forEach(([key, value]) => {
      // check for undefined / null, but accept empty string ''
      if (value != null && updatableFields.includes(key as keyof Strat)) {
        if (key === 'content') {
          strat[key] = minifyHtml(sanitize(value as string));
        } else {
          //@ts-ignore
          strat[key] = value;
        }
      }
    });
    return await strat.save();
  });
  return await Promise.all(stratUpdatePromises);
};
