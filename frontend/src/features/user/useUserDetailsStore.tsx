import { create } from "zustand";
import type { UserDetailsStore, UserDetailsResponse } from "./user.types";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { defaultAvatar } from "./user.config";
import { getUserAuthStore } from "./useUserAuthStore";
import { putOptions } from "../../shared/utils/http/fetch-options.utils";
// import { tokenDecoder } from "./token-decoder.util";

const useUserDetailsStore = create<UserDetailsStore>((set) => ({
  avatar: "",
  displayName: "",
  _id: "",
  createdAt: "",
  updatedAt: "",
  actions: {
    getUserDetails: async (id, token, cookie) => {
      // const { token: decodedToken } = tokenDecoder(token);

      if (cookie) {
        const response = await aoNoteFetch(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("User details cannot be found");

        const user: UserDetailsResponse = await response.json();

        set(() => ({
          ...user,
        }));

        return { response, user };
      } else {
        const guest: UserDetailsResponse = {
          avatar: defaultAvatar,
          displayName: "Guest User",
          _id: token,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
          message: "Guest account created.",
        };

        set(() => ({
          ...guest,
        }));

        return {
          response: new Response(JSON.stringify(guest.message), {
            status: 200,
          }),
          user: guest,
        };
      }
    },

    updateAvatar: async (imageURL) => {
      const _id = getUserAuthStore()._id;
      const role = getUserAuthStore().role;
      const token = getUserAuthStore().token;

      const payload = {
        avatar: imageURL,
      };

      const response = await aoNoteFetch(`/api/users/${_id}/avatar`, {
        ...putOptions<{ avatar: string }>(payload),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result: UserDetailsResponse = await response.json();

      if (role === "user") {
        set(() => ({
          ...payload,
        }));

        if (!response.ok) throw new Error("Cannot update user avatar.");

        return { response, result };
      } else
        return {
          response,
          result,
        };
    },

    updateDisplayName: async (name) => {
      const _id = getUserAuthStore()._id;
      const role = getUserAuthStore().role;
      const token = getUserAuthStore().token;

      const payload = {
        displayName: name,
      };

      const response = await aoNoteFetch(`/api/users/${_id}/name`, {
        ...putOptions<{ displayName: string }>(payload),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result: UserDetailsResponse = await response.json();

      if (role === "user") {
        set(() => ({
          ...payload,
        }));

        if (!response.ok) throw new Error("Cannon update the display name.");

        return { response, result };
      } else {
        return { response, result };
      }
    },
  },
}));

export const useUserDetailsAvatar = () =>
  useUserDetailsStore((state) => state.avatar);
export const useUserDetailsDisplayName = () =>
  useUserDetailsStore((state) => state.displayName);
export const useUserDetailsId = () => useUserDetailsStore((state) => state._id);
export const useUserDetailsCreatedAt = () =>
  useUserDetailsStore((state) => state.createdAt);
export const useUserDetailsActions = () =>
  useUserDetailsStore((state) => state.actions);

export const getUserDetailsStore = () => useUserDetailsStore.getState();
