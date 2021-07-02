import RandExp from 'randexp';

import { PasswordPattern } from 'src/common/validation-helpers';

export function generatePassword() {
  return new RandExp(PasswordPattern).gen();
}
