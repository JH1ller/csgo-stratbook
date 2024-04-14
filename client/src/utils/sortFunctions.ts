import { Strat } from '@/api/models/Strat';

export enum Sort {
  DateAddedASC,
  DateAddedDESC,
  Manual,
}

export const sortFunctions: Record<Sort, (a: any, b: any) => number> = {
  [Sort.DateAddedASC]: (a: Strat, b: Strat) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  [Sort.DateAddedDESC]: (a: Strat, b: Strat) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  [Sort.Manual]: (a, b) => a.index - b.index,
};
