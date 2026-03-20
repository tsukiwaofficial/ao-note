import type { Document, Model, Types } from "mongoose";

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

export interface UserDetails {
  avatar: string;
  displayName: string;
}

export interface UserDetailsDocument extends UserDetails, Document {
  userId: Types.ObjectId;
}
