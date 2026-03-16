import { jwtDecode } from "jwt-decode";
import type { AoNoteJwtPayload, UserAuth } from "./user.types";

export const jwtDecoder = (token: string): UserAuth => {
  const decoded = jwtDecode<AoNoteJwtPayload>(token);

  return { _id: decoded._id, role: decoded.role, token: token };
};
