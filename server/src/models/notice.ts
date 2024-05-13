import { Document, model, Schema } from 'mongoose';

export interface Notice {
  version: string;
  content: string;
  tags: string[];
  expires: Date;
}

export type NoticeDocument = Document<unknown, unknown, Notice>;

const noticeSchema = new Schema<Notice>({
  version: {
    type: String,
    required: true,
    unique: true,
  },

  content: {
    type: String,
    required: true,
  },

  tags: {
    type: [String],
    default: [],
  },

  expires: {
    type: Date,
    required: false,
  },
});

export const NoticeModel = model<Notice>('Notice', noticeSchema);
