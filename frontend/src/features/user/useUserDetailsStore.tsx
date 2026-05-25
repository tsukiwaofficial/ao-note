import { create } from "zustand";
import type {
  UserDetailsStore,
  UserDetailsResponse,
  UserDetails,
} from "./user.types";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { defaultAvatar } from "./user.config";
import { getUserAuthStore } from "./useUserAuthStore";
import { putOptions } from "../../shared/utils/http/fetch-options.utils";

const useUserDetailsStore = create<UserDetailsStore>((set) => ({
  avatar: "",
  displayName: "",
  _id: "",
  createdAt: "",
  updatedAt: "",
  actions: {
    getUserDetails: async (cookie) => {
      const id = getUserAuthStore()._id;
      const token = getUserAuthStore().token;
      const role = getUserAuthStore().role;

      if (cookie && role === "user") {
        const response = await aoNoteFetch(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("User details cannot be found");

        const result: UserDetailsResponse = await response.json();

        set(() => ({
          ...result,
        }));

        return result;
      } else if (role === "guest") {
        const guest: UserDetails = {
          avatar: defaultAvatar,
          displayName: "Guest User",
          _id: token,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        };

        set(() => ({
          ...guest,
        }));

        return guest;
      } else return {} as UserDetails;
    },

    updateAvatar: async (imageURL) => {
      const _id = getUserAuthStore()._id;
      const token = getUserAuthStore().token;

      const payload = {
        avatar: imageURL,
      };

      const response = await aoNoteFetch(`/api/users/${_id}/avatar`, {
        ...putOptions(payload),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Cannot update user avatar.");

      const result: UserDetailsResponse = await response.json();

      set(() => ({
        ...payload,
      }));

      return result;
    },

    updateDisplayName: async (name) => {
      const _id = getUserAuthStore()._id;
      const token = getUserAuthStore().token;

      const payload = {
        displayName: name,
      };

      const response = await aoNoteFetch(`/api/users/${_id}/name`, {
        ...putOptions(payload),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Cannon update the display name.");

      const result: UserDetailsResponse = await response.json();

      set(() => ({
        ...payload,
      }));

      return result;
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
