import { jwtDecode } from "jwt-decode";
import type { AoNoteJwtPayload, UserAuth } from "./user.types";

export const jwtDecoder = (token: string): UserAuth => {
  const decoded = jwtDecode<AoNoteJwtPayload>(token);

  return { role: decoded.role, token: token };
};
