import type { Dispatch } from "react";
import type { JwtPayload } from "jwt-decode";

export interface User {
  _id?: string;
  username: string;
  password: string;
}

export type ConfirmUser = User & { confirmPassword: string };

export interface UserDetails {
  _id?: string;
  avatar: string;
  displayName: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface UserAuth {
  _id: string;
  role: string;
  token: string;
}

export type AoNoteJwtPayload = JwtPayload & { _id: string; role: string };

export type UserAuthAction =
  | { type: "LOGIN"; payload: UserAuth }
  | { type: "LOGOUT"; payload: UserAuth };

export interface UserAuthContextAction {
  state: UserAuth;
  dispatch: Dispatch<UserAuthAction>;
}

export type UserAction =
  | { type: "GET_USER"; payload: UserDetails }
  | { type: "UPDATE_AVATAR"; payload: string }
  | { type: "UPDATE_DISPLAY_NAME"; payload: string };

export interface UserContextAction {
  state: UserDetails;
  dispatch: Dispatch<UserAction>;
}
