export const handleUnknownError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  }
};
