import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { createGuestToken, decodeGuestToken } from "./user-guest-token.util";
import { guestToken } from "./user.config";
import { useNoteContext } from "../notes/useNoteContext";
import { useUserContext } from "./useUserContext";
import type { UserDetails } from "./user.types";

export const useUserLogout = () => {
  const navigate = useNavigate();
  const { dispatch: userAuthDispatch } = useAuthContext();
  const { dispatch: noteDispatch } = useNoteContext();
  const { dispatch: userDetailsDispatch } = useUserContext();

  const logout = async () => {
    await aoNoteFetch("/api/users/logout", { method: "POST" });
    navigate("/login");
    createGuestToken();
    const token = localStorage.getItem(guestToken);

    if (token) {
      const decoded = decodeGuestToken(token);
      userAuthDispatch({ type: "LOGOUT", payload: decoded });
    }

    noteDispatch({ type: "GET_NOTES", payload: [] });
    userDetailsDispatch({ type: "GET_USER", payload: {} as UserDetails });
  };

  return {
    logout,
  };
};
