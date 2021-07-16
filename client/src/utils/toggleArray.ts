export const toggleArray = (arr: unknown[], value: unknown): unknown[] => {
  return arr.includes(value) ? arr.filter(item => item !== value) : [...arr, value];
};
