import type { Document, Types } from 'mongoose';

import type { Strat } from '@/models/strat';
import { minifyHtml } from '@/utils/minifyHtml';
import { sanitize } from '@/utils/sanitizeHtml';

const updatableFields = new Set<keyof Strat>([
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
]);

type StratDocument = Document<unknown, unknown, Strat> &
  Omit<
    Strat &
      Required<{
        _id: Types.ObjectId;
      }>,
    never
  > & {
    [key: string]: unknown;
  };

export const updateStrats = async (strats: StratDocument[], stratPatches: Partial<StratDocument>[]) => {
  const stratUpdatePromises = strats.map(async (strat) => {
    const patch = stratPatches.find((p) => strat._id.equals(p._id!));
    if (!patch) throw new Error('Strat update _id mismatch');
    for (const [key, value] of Object.entries(patch)) {
      // check for undefined / null, but accept empty string ''
      if (value != undefined && updatableFields.has(key as keyof Strat)) {
        if (key === 'content') {
          strat[key.toString()] = minifyHtml(sanitize(value as string));
        } else {
          strat[key.toString()] = value;
        }
      }
    }

    return await strat.save();
  });
  return await Promise.all(stratUpdatePromises);
};
