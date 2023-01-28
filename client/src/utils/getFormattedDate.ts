export const getFormattedDate = () => {
  const date = new Date();
  // wtf javascript?
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
