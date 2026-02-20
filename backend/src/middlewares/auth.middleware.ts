import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ACCESS_SECRET } from "../shared/config/env.config";
import { UserModel } from "../features/user/user.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ message: "Authorization token required." });

  const token = authorization.split(" ")[1];

  try {
    if (token) {
      const result = jwt.verify(token, ACCESS_SECRET) as
        | JwtPayload
        | { _id: string };

      req.user = await UserModel.findOne({ _id: result._id }).select("_id");
      next();
    } else throw new Error("No token found.");
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Request is not authorized." });
  }
};
