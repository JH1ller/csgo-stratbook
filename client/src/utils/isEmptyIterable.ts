export const isEmptyIterable = (iterable: IterableIterator<any>): boolean => {
  for (const _ of iterable) {
    // eslint-disable-line no-unused-vars
    return false;
  }

  return true;
};
