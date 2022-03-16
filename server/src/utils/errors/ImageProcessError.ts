export default class ImageProcessError extends Error {
  constructor(error: unknown) {
    if (error instanceof Error) {
      super(error.message);
    } else {
      super(error as string);
    }
  }
}
