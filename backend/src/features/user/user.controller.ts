import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { User } from "./user.types";
import { UserModel } from "./user.model";
import { AoNoteError } from "../../shared/lib/error";
import { createTokens } from "./create-tokens.util";
import { ACCESS_SECRET, REFRESH_SECRET } from "../../shared/config/env.config";
import { cookieOptions } from "../../shared/lib/cookie";

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

export const login = async (req: { body: User }, res: Response) => {
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
      cookieOptions(7 * 24 * 60 * 60 * 1000),
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
  res.clearCookie("refreshToken", cookieOptions(7 * 24 * 60 * 60 * 1000));

  res.status(200).json({ message: "Logged out successfully." });
};

export const signup = async (req: { body: User }, res: Response) => {
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
      cookieOptions(7 * 24 * 60 * 60 * 1000),
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
