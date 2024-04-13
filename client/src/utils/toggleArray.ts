export const toggleArray = <T>(arr: T[], value: T): T[] => {
  return arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value];
};
