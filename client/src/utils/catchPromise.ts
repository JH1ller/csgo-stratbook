// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const catchPromise = async (promise: Promise<any>, callback?: () => any) => {
  try {
    await promise;
    callback?.();
  } catch (error) {}
};
