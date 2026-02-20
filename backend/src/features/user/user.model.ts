import { Model, Schema } from "../../shared/lib/mongoose";
import { userStatics } from "./user.statics";
import type { UserDocument, UserDocumentModel } from "./user.types";

const UserSchema = new Schema<UserDocument, UserDocumentModel>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.statics = {
  ...UserSchema.statics,
  ...userStatics,
};

export const UserModel = Model<UserDocument, UserDocumentModel>(
  "User",
  UserSchema,
);
