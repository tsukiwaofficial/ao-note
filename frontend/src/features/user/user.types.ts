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

export interface UserAuthResponse extends UserAuth {
  message: string;
  error?: string;
}

interface UserAuthActions {
  actions: {
    login: (user: User) => Promise<{
      response: Response;
      result: UserAuthResponse;
    }>;
    signup: (user: User) => Promise<{
      response: Response;
      result: UserAuthResponse;
    }>;
    initializeUserAuth: (cookie: string) => Promise<void>;
    refreshUserAuth: (token: string, cookie: string) => void;
    initializeGuestAuth: () => void;
  };
}

export interface UserAuthStore extends UserAuth, UserAuthActions {}

export interface UserDetails extends MongoDbDefaults {
  avatar: string;
  displayName: string;
}

export type UserDetailsResponse = UserDetails & {
  message: string;
};

interface UserDetailsActions {
  actions: {
    getUserDetails: (
      id: string,
      token: string,
      cookie: string,
    ) => Promise<{ response: Response; user: UserDetailsResponse }>;
    updateAvatar: (
      imageURL: string,
    ) => Promise<{ response: Response; result: UserDetailsResponse }>;
    updateDisplayName: (
      name: string,
    ) => Promise<{ response: Response; result: UserDetailsResponse }>;
  };
}

export interface UserDetailsStore extends UserDetails, UserDetailsActions {}

export type AoNoteJwtPayload = JwtPayload & UserAuth;
