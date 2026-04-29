import { jwtDecode } from "jwt-decode";
import type { AoNoteJwtPayload, UserAuth } from "./user.types";

export const tokenDecoder = (token: string): UserAuth => {
  const parts = token.split(".");

  if (!parts.includes("guest") && token) {
    const decoded = jwtDecode<AoNoteJwtPayload>(token);

    const payload = { _id: decoded._id, role: decoded.role, token: token };

    return payload;
  } else {
    const id = parts[1];

    const payload: UserAuth = { _id: id, role: "guest", token: token };

    return payload;
  }
};
