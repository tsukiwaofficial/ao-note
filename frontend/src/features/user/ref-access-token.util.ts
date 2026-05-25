import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { tokenDecoder } from "./token-decoder.util";
import type { UserAuth } from "./user.types";

export const refreshAccessToken = async (): Promise<UserAuth> => {
  try {
    const response = await aoNoteFetch("/api/users/refresh", {
      method: "POST",
    });

    if (!response.ok)
      throw new Error("Error in response in getting a new access token.");

    const data: UserAuth = await response.json();

    return {
      _id: tokenDecoder(data.token)._id,
      role: tokenDecoder(data.token).role,
      token: data.token,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error in response in getting a new access token.");
  }
};
