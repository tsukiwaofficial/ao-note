import type { CookieOptions } from "express";
import { isProduction } from "../config/env.config";

export const cookieOptions = (maxAge?: number): CookieOptions => {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: maxAge,
    path: "/",
  };
};
