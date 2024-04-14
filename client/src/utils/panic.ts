export const panic = (msg: string): never => {
  console.error(msg);
  throw new Error(msg);
};
