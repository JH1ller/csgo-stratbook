import { PassportSerializer } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';

import { NativeError } from 'mongoose';

import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/schemas/user.schema';

/**
 * @summary The session serializer is used to populate the req.user object.
 */
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    // see more: http://www.passportjs.org/docs/configure/#sessions
    super();
  }

  /**
   * Specify which data should be persisted in the session-store.
   * @param user strategy specified user data
   * @param done passport callback which we feed our new user data into
   */
  public serializeUser(user: UserDocument, done: (err: any, id?: any) => void) {
    // only pass id field to passport
    done(null, user._id.toString());
  }

  /**
   * @summary interpret data read from our session storage and create a full user object out of it.
   * (This populates the req.user object)
   * @param payload payload json string - from the session collection
   * @param done passport callback to pass the fully populated user object
   */
  public deserializeUser(payload: string, done: (err: any, id?: any) => void) {
    // note: we only pass the id in serializeUser to passport so we only have the raw-id string
    // as the payload parameter.
    this.usersService
      .findById(payload)
      .then((user) => {
        done(null, user);
      })
      .catch((error: NativeError) => {
        Logger.error(`failed to translate session id to user document: ${error.message}`);
        done(error, null);
      });
  }
}
