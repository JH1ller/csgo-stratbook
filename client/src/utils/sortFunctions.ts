import { Strat } from '@/api/models/Strat';

export const sortDateAddedASC = (a: Strat, b: Strat) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
export const sortDateAddedDESC = (a: Strat, b: Strat) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
