import { UserDocument } from './schemas/user.schema';

declare global {
  namespace Express {
    /**
     * extends the req.user object with our user document properties
     */
    interface User extends UserDocument {
      /**
       * invalid property. Required for compilation
       */
      $unused_: number;
    }
  }
}
