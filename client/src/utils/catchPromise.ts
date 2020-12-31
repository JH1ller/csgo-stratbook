export const catchPromise = async (promise: Promise<any>, callback: Function) => {
  try {
    await promise;
    callback();
  } catch (error) {
    return;
  }
}