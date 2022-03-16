export default class UserNotFoundError extends Error {
  constructor(error: unknown) {
    if (error instanceof Error) {
      super(error.message);
    } else {
      super(error as string);
    }
  }
}
