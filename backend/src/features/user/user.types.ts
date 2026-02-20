import type { Document, Model } from "mongoose";

export interface User {
  username: string;
  password: string;
}

export interface UserDocument extends User, Document {}

export interface UserDocumentModel extends Model<UserDocument> {
  login: (
    this: Model<UserDocument>,
    { username, password }: User,
  ) => Promise<UserDocument>;
  signup: (
    this: Model<UserDocument>,
    { username, password }: User,
  ) => Promise<UserDocument>;
}
