import type { JwtPayload } from "jwt-decode";
import type { MongoDbDefaults } from "../../shared/types/mongodb.types";

export interface User {
  username: string;
  password: string;
}

export type ConfirmUser = User & { confirmPassword: string };

export interface UserAuth {
  _id: string;
  role: "user" | "guest" | "";
  token: string;
}

export interface UserAuthResponse extends Response, UserAuth {
  message: string;
  error?: string;
}

interface UserAuthActions {
  actions: {
    login: (user: User) => Promise<UserAuthResponse>;
    signup: (user: User) => Promise<UserAuthResponse>;
    initializeUserAuth: (cookie?: string) => Promise<void>;
    refreshUserAuth: (token: string, cookie: string) => void;
  };
}

export interface UserAuthStore extends UserAuth, UserAuthActions {}

export interface UserDetails extends MongoDbDefaults {
  avatar: string;
  displayName: string;
}

export interface UserDetailsResponse extends Response, UserDetails {
  message?: string;
}

interface UserDetailsActions {
  actions: {
    getUserDetails: (
      cookie: string,
    ) => Promise<UserDetailsResponse | UserDetails>;
    updateAvatar: (imageURL: string) => Promise<UserDetailsResponse>;
    updateDisplayName: (name: string) => Promise<UserDetailsResponse>;
  };
}

export interface UserDetailsStore extends UserDetails, UserDetailsActions {}

export type AoNoteJwtPayload = JwtPayload & UserAuth;
