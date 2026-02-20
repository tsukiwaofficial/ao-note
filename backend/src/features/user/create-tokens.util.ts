import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import { ACCESS_SECRET, REFRESH_SECRET } from "../../shared/config/env.config";

export const createTokens = (id: Types.ObjectId, role: string = "user") => {
  const accessToken = jwt.sign({ _id: id, role }, ACCESS_SECRET, {
    expiresIn: "5m",
  });

  const refreshToken = jwt.sign({ _id: id, role }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
