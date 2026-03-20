import { Types } from "mongoose";
import { Model, Schema } from "../../shared/lib/mongoose";
import { userStatics } from "./user.statics";
import type {
  UserDetailsDocument,
  UserDocument,
  UserDocumentModel,
} from "./user.types";

const UserSchema = new Schema<UserDocument, UserDocumentModel>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

UserSchema.statics = {
  ...UserSchema.statics,
  ...userStatics,
};

export const UserModel = Model<UserDocument, UserDocumentModel>(
  "User",
  UserSchema,
);

const UserDetailsSchema = new Schema<UserDetailsDocument>(
  {
    userId: { type: Types.ObjectId, required: true },
    avatar: { type: String },
    displayName: { type: String },
  },
  { timestamps: true },
);

export const UserDetailsModel = Model<UserDetailsDocument>(
  "UserDetails",
  UserDetailsSchema,
);
