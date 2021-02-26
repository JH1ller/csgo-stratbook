export const catchPromise = async (promise: Promise<any>, callback?: () => any) => {
  try {
    await promise;
    callback?.();
  } catch (error) {
    return;
  }
};
