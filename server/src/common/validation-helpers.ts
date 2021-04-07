/**
 * at least one upper case character, one number and at least 8 characters long.
 */
export const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;