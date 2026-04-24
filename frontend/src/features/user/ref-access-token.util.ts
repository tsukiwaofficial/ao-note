import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { jwtDecoder } from "./jwt-decoder.util";
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
      _id: jwtDecoder(data.token)._id,
      role: jwtDecoder(data.token).role,
      token: data.token,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error in response in getting a new access token.");
  }
};
