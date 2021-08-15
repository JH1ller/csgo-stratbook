/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unreachable-loop */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const isEmptyIterable = (iterable: IterableIterator<any>): boolean => {
  for (const _ of iterable) {
    // eslint-disable-line no-unused-vars
    return false;
  }

  return true;
};
