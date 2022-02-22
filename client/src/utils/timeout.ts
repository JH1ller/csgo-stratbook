export const timeout = (ms: number) => new Promise(resolve => setTimeout(() => resolve(true), ms));
