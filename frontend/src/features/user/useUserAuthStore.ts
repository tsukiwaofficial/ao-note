import { create } from "zustand";
import type { User, UserAuthResponse, UserAuthStore } from "./user.types";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { postOptions } from "../../shared/utils/http/fetch-options.utils";
import { BUFFER, DEFAULT_TOKEN_EXPIRY, guestToken } from "./user.config";
import { tokenDecoder } from "./token-decoder.util";
import { createGuestToken } from "./user-guest-token.util";
import { refreshAccessToken } from "./ref-access-token.util";
import { jwtDecode, type JwtPayload } from "jwt-decode";

const useUserAuthStore = create<UserAuthStore>((set) => ({
  _id: "",
  role: "",
  token: "",
  actions: {
    login: async (user) => {
      const payload = {
        username: user.username.trim(),
        password: user.password,
      };

      const response = await aoNoteFetch("/api/users/login", {
        ...postOptions<User>(payload),
      });

      const result: UserAuthResponse = await response.json();

      if (!response.ok)
        return {
          response,
          result,
        };
      else {
        set(() => ({
          _id: tokenDecoder(result.token)._id,
          role: tokenDecoder(result.token).role,
          token: result.token,
        }));

        localStorage.removeItem(guestToken);

        return { response, result };
      }
    },

    signup: async (user) => {
      const payload = {
        username: user.username.trim(),
        password: user.password,
      };

      const response = await aoNoteFetch("/api/users/signup", {
        ...postOptions<User>(payload),
      });

      const result: UserAuthResponse = await response.json();

      if (!response.ok)
        return {
          response,
          result,
        };
      else {
        set(() => ({
          _id: tokenDecoder(result.token)._id,
          role: tokenDecoder(result.token).role,
          token: result.token,
        }));

        localStorage.removeItem(guestToken);

        return { response, result };
      }
    },

    initializeUserAuth: async (cookie) => {
      if (cookie) {
        const user = await refreshAccessToken();
        if (user)
          set(() => ({
            _id: user._id,
            role: user.role,
            token: user.token,
          }));
      } else
        throw new Error(
          "Something went wrong during authentication initialization.",
        );
    },

    initializeGuestAuth: () => {
      console.log("creating a new guest account");

      createGuestToken();
      const isGuestTokenExists = localStorage.getItem(guestToken);
      if (isGuestTokenExists) {
        const decodedGuest = tokenDecoder(isGuestTokenExists);
        set(() => ({
          _id: decodedGuest.token,
          role: decodedGuest.role,
          token: decodedGuest.token,
        }));
      }
    },

    refreshUserAuth: async (token, cookie) => {
      if (token && cookie) {
        const { exp } = jwtDecode<JwtPayload>(token);

        const refreshTime = exp
          ? exp * 1000 - Date.now() - BUFFER
          : DEFAULT_TOKEN_EXPIRY - BUFFER;

        const timer = setTimeout(async () => {
          if (!cookie) return;

          const newToken = await refreshAccessToken();

          if (newToken)
            set(() => ({
              token: newToken.token,
            }));
        }, refreshTime);

        return () => clearTimeout(timer);
      }
    },
  },
}));

export const useUserAuthId = () => useUserAuthStore((state) => state._id);
export const useUserAuthRole = () => useUserAuthStore((state) => state.role);
export const useUserAuthToken = () => useUserAuthStore((state) => state.token);
export const useUserAuthActions = () =>
  useUserAuthStore((state) => state.actions);

export const setUserAuthStore = (params: () => Partial<UserAuthStore>) =>
  useUserAuthStore.setState(params);
export const getUserAuthStore = () => useUserAuthStore.getState();
