import type { CookieOptions } from "express";
import { isProduction } from "../config/env.config";

export const cookieOptions = (
  httpOnly: "token" | "status",
  maxAge?: number,
): CookieOptions => {
  return {
    httpOnly: httpOnly === "token" ? true : false,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: maxAge,
    path: "/",
  };
};
