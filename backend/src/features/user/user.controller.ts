import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { User, UserDetails } from "./user.types";
import { UserDetailsModel, UserModel } from "./user.models";
import { AoNoteError } from "../../shared/lib/error";
import { createTokens } from "./create-tokens.util";
import { ACCESS_SECRET, REFRESH_SECRET } from "../../shared/config/env.config";
import { cookieOptions } from "../../shared/lib/cookie";
import { SEVEN_DAYS_EXPIRY } from "../../shared/config/expiries.config";
import { defaultAvatar } from "./user-defaults.config";
import { Types } from "mongoose";

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken)
      return res.status(401).json({ message: "You are not logged in." });

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
      _id: string;
      role: string;
    };

    const newAccessToken = jwt.sign(
      { _id: decoded._id, role: decoded.role },
      ACCESS_SECRET,
      {
        expiresIn: "5m",
      },
    );

    return res.status(200).json({ token: newAccessToken });
  } catch (error) {
    const parsedError = error as AoNoteError;
    res
      .status(400)
      .json({ message: parsedError.message, error: parsedError.error });
  }
};

export const login = async (req: Request & { body: User }, res: Response) => {
  const { username, password } = req.body;

  try {
    switch (true) {
      case !username:
        throw new AoNoteError("Please fill up all the fields.", "username");
      case !password:
        throw new AoNoteError("Please fill up all the fields.", "password");
    }

    const user = await UserModel.login({ username, password });

    const { accessToken, refreshToken } = createTokens(user._id);

    res.cookie(
      "refreshToken",
      refreshToken,
      cookieOptions("token", SEVEN_DAYS_EXPIRY),
    );

    res.cookie(
      "isLoggedIn",
      "true",
      cookieOptions("status", SEVEN_DAYS_EXPIRY),
    );

    res.status(200).json({
      message: "Logged in successfully.",
      token: accessToken,
    });
  } catch (error) {
    const parsedError = error as AoNoteError;
    res
      .status(400)
      .json({ message: parsedError.message, error: parsedError.error });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.clearCookie("isLoggedIn");

  res.status(200).json({ message: "Logged out successfully." });
};

export const signup = async (req: Request & { body: User }, res: Response) => {
  const { username, password } = req.body;

  try {
    switch (true) {
      case !username:
        throw new AoNoteError("Please fill up all the fields.", "username");
      case !password:
        throw new AoNoteError("Please fill up all the fields.", "password");
    }

    const user = await UserModel.signup({ username, password });

    const { accessToken, refreshToken } = createTokens(user._id);

    res.cookie(
      "refreshToken",
      refreshToken,
      cookieOptions("token", SEVEN_DAYS_EXPIRY),
    );

    res.cookie(
      "isLoggedIn",
      "true",
      cookieOptions("status", SEVEN_DAYS_EXPIRY),
    );

    res.status(201).json({
      message: "Signed in successfully.",
      token: accessToken,
    });
  } catch (error) {
    const parsedError = error as AoNoteError;
    res
      .status(400)
      .json({ message: parsedError.message, error: parsedError.error });
  }
};

export const getUserDetails = async (
  req: Request & { params: { id: string } },
  res: Response,
) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  try {
    if (!id) return res.status(400).json({ message: "Note ID is required" });
    if (!Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "Invalid note ID" });

    const user = await UserModel.findById({ _id: id });
    const userDetails = await UserDetailsModel.findOne({ userId });

    if (!userDetails && user) {
      const userDetails = await UserDetailsModel.create({
        userId,
        avatar: defaultAvatar,
        displayName: user.username,
      });

      return res.status(200).json(userDetails);
    }

    res.status(200).json(userDetails);
  } catch (error) {
    const parsedError = error as AoNoteError;
    res
      .status(400)
      .json({ message: parsedError.message, error: parsedError.error });
  }
};

export const updateAvatar = async (
  req: Request & { body: UserDetails; params: { id: string } },
  res: Response,
) => {
  const { id } = req.params;
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  try {
    if (!id) return res.status(400).json({ message: "User ID is required" });
    if (!Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "Invalid user ID" });

    if (id === userId.toString()) {
      const userDetails = await UserDetailsModel.findOneAndUpdate(
        { userId },
        { avatar },
      );

      if (!userDetails)
        return res.status(400).json({ message: "Cannot update your avatar." });

      res
        .status(200)
        .json({ message: "Avatar updated successfully", userDetails });
    } else {
      console.error("The params ID doesn't match to Token ID");
      return res.status(400).json({
        message: "ID mismatch. Please make sure you are not changing the URL.",
      });
    }
  } catch (error) {
    const parsedError = error as AoNoteError;
    res
      .status(400)
      .json({ message: parsedError.message, error: parsedError.error });
  }
};

export const updateDisplayName = async (
  req: Request & { body: UserDetails; params: { id: string } },
  res: Response,
) => {
  const { id } = req.params;
  const { displayName } = req.body;
  const { _id: userId } = req.user;

  try {
    if (!id) return res.status(400).json({ message: "User ID is required" });
    if (!Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "Invalid user ID" });

    if (id === userId.toString()) {
      const userDetails = await UserDetailsModel.findOneAndUpdate(
        { userId },
        { displayName },
      );

      if (!userDetails)
        return res
          .status(400)
          .json({ message: "Cannot update your display name." });

      return res
        .status(200)
        .json({ message: "Display name updated successfully", displayName });
    } else {
      console.error("The params ID doesn't match to Token ID");
      return res.status(400).json({
        message: "ID mismatch. Please make sure you are not changing the URL.",
      });
    }
  } catch (error) {
    const parsedError = error as AoNoteError;
    res
      .status(400)
      .json({ message: parsedError.message, error: parsedError.error });
  }
};
