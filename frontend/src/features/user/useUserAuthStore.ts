import { create } from "zustand";
import type { User, UserAuthResponse, UserAuthStore } from "./user.types";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { postOptions } from "../../shared/utils/http/fetch-options.utils";
import { BUFFER, DEFAULT_TOKEN_EXPIRY, guestToken } from "./user.config";
import { jwtDecoder } from "./jwt-decoder.util";
import { createGuestToken, decodeGuestToken } from "./user-guest-token.util";
import { refreshAccessToken } from "./ref-access-token.util";
import { jwtDecode, type JwtPayload } from "jwt-decode";

const useUserAuthStore = create<UserAuthStore>((set) => ({
  username: "",
  password: "",
  confirmPassword: "",
  _id: "",
  role: "",
  token: "",
  actions: {
    useLogin: async (username: string, password: string) => {
      const payload = {
        username: username.trim(),
        password,
      };

      const response = await aoNoteFetch("/api/users/login", {
        ...postOptions<User>(payload),
      });

      const result: UserAuthResponse = await response.json();

      set(() => ({
        _id: jwtDecoder(result.token)._id,
        role: jwtDecoder(result.token).role,
        token: result.token,
      }));

      localStorage.removeItem(guestToken);

      return { response, result };
    },

    useSignup: async (username: string, password: string) => {
      const payload = {
        username: username.trim(),
        password,
      };

      const response = await aoNoteFetch("/api/users/signup", {
        ...postOptions<User>(payload),
      });

      const result = await response.json();

      set(() => ({
        _id: jwtDecoder(result.token)._id,
        role: jwtDecoder(result.token).role,
        token: result.token,
      }));

      localStorage.removeItem(guestToken);

      return { response, result };
    },

    useInitializeUserAuth: async (cookie: string) => {
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

    useInitializeGuestAuth: () => {
      createGuestToken();
      const isGuestTokenExists = localStorage.getItem(guestToken);
      if (isGuestTokenExists) {
        const decodedGuest = decodeGuestToken(isGuestTokenExists);
        set(() => ({
          _id: decodedGuest.token,
          role: decodedGuest.role,
          token: decodedGuest.token,
        }));
      }
    },

    useRefreshUserAuth: async (token: string, cookie: string) => {
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

export const useAuthUsername = () =>
  useUserAuthStore((state) => state.username);
export const useAuthPassword = () =>
  useUserAuthStore((state) => state.password);
export const useAuthConfirmPassword = () =>
  useUserAuthStore((state) => state.confirmPassword);
export const useAuthId = () => useUserAuthStore((state) => state._id);
export const useAuthRole = () => useUserAuthStore((state) => state.role);
export const useAuthToken = () => useUserAuthStore((state) => state.token);
export const useAuthActions = () => useUserAuthStore((state) => state.actions);

export const setUserAuthStore = (params: () => Partial<UserAuthStore>) =>
  useUserAuthStore.setState(params);
export const getUserAuthStore = () => useUserAuthStore.getState();
