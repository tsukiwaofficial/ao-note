import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { jwtDecoder } from "./jwt-decoder.util";
import type { UserAuth } from "./user.types";

export const useRefreshAccessToken = () => {
  const refreshAccessToken = async (): Promise<UserAuth | null> => {
    try {
      const response = await aoNoteFetch("/api/user/refresh", {
        method: "POST",
      });

      if (!response.ok)
        throw new Error("Error in response in getting a new access token.");

      const data = await response.json();

      return { role: jwtDecoder(data.token).role, token: data.token };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return {
    refreshAccessToken,
  };
};
