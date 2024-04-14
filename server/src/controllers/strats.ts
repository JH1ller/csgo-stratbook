import type { Strat } from '@/models/strat';
import { minifyHtml } from '@/utils/minifyHtml';
import { sanitize } from '@/utils/sanitizeHtml';
import type { Document, Types } from 'mongoose';

const updatableFields: (keyof Strat)[] = [
  'labels',
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
        _id: Types.ObjectId;
      }>,
    never
  > & {
    [key: string]: any;
  };

export const updateStrats = async (strats: StratDoc[], stratPatches: Partial<StratDoc>[]) => {
  const stratUpdatePromises = strats.map(async (strat) => {
    const patch = stratPatches.find((p) => strat._id.equals(p._id!));
    if (!patch) throw new Error('Strat update _id mismatch');
    Object.entries(patch).forEach(([key, value]) => {
      // check for undefined / null, but accept empty string ''
      if (value != null && updatableFields.includes(key as keyof Strat)) {
        if (key === 'content') {
          strat[key.toString()] = minifyHtml(sanitize(value as string));
        } else {
          strat[key.toString()] = value;
        }
      }
    });

    return await strat.save();
  });
  return await Promise.all(stratUpdatePromises);
};
