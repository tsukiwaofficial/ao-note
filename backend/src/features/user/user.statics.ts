import type { Model } from "mongoose";
import bcrypt from "bcrypt";
import type { User, UserDocument } from "./user.types";
import validator from "validator";
import { RESERVED_USERNAMES_SET } from "../../shared/config/usernames.config";
import { AoNoteError } from "../../shared/lib/error";

export const userStatics = {
  async login(
    this: Model<UserDocument>,
    { username, password }: User,
  ): Promise<UserDocument> {
    const user = await this.findOne({ username });

    if (!user)
      throw new AoNoteError(
        "Cannot find a user with this username.",
        "username",
      );

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched)
      throw new AoNoteError(
        "Password doesn't match with this username.",
        "password",
      );

    return user;
  },

  async signup(
    this: Model<UserDocument>,
    { username, password }: User,
  ): Promise<UserDocument> {
    const doesUserExist = await this.findOne({ username });

    if (doesUserExist) throw new AoNoteError("User already exists.");

    if (RESERVED_USERNAMES_SET.has(username.toLowerCase().trim()))
      throw new AoNoteError(
        "This username is reserved. Please choose other username.",
        "username",
      );

    if (!validator.isLowercase(username)) {
      throw new AoNoteError("Username must be lowercased", "username");
    }

    if (!validator.isLength(username, { min: 3, max: 25 })) {
      throw new AoNoteError(
        "Username must be between 3 - 25 characters long.",
        "username",
      );
    }

    if (!validator.isLength(password, { min: 8 })) {
      throw new AoNoteError(
        "Password must be at least 8 characters long.",
        "password",
      );
    }

    if (!validator.isStrongPassword(password, { minUppercase: 0 })) {
      throw new AoNoteError("Password is not strong enough.", "password");
    }

    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({ username, password: hashedPassword });

    return user;
  },
};
