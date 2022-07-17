import { Types, Schema, model, Document } from 'mongoose';

export interface Session {
  refreshToken: string;
  player: Types.ObjectId;
  expires: Date;
}

export type SessionDocument = Document<unknown, any, Session>;

const sessionSchema = new Schema<Session>({
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },

  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },

  expires: {
    type: Date,
    required: true,
  },
});

export const SessionModel = model<Session>('Session', sessionSchema);
