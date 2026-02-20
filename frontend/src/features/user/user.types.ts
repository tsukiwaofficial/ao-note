import type { Dispatch } from "react";
import type { Note } from "../notes/note.types";
import type { JwtPayload } from "jwt-decode";

export interface User {
  _id?: string;
  avatar?: string;
  username: string;
  password: string;
  notes?: Note[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type ConfirmUser = User & { confirmPassword: string };

export interface UserAuth {
  role: string;
  token: string;
}

export type AoNoteJwtPayload = JwtPayload & { role: string };

export type UserAuthAction =
  | { type: "LOGIN"; payload: UserAuth }
  | { type: "LOGOUT"; payload: UserAuth };

export interface UserAuthContextAction {
  state: UserAuth;
  dispatch: Dispatch<UserAuthAction>;
}

export type Guest = User;
