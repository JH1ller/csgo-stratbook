import * as fs from 'fs';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * custom validator used for .env validation
 */
@ValidatorConstraint()
export class DirectoryExistsConstraint implements ValidatorConstraintInterface {
  validate(path: string) {
    try {
      console.log('validate: ', path);
      // Query the entry
      const stats = fs.lstatSync(path);

      // Is it a directory?
      if (stats.isDirectory()) {
        return true;
      }
    } catch (e) {
      // ...
    }

    return false;
  }
}
