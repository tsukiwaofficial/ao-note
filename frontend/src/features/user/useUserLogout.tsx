import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { createGuestToken, decodeGuestToken } from "./user-guest-token.util";
import { guestToken } from "./user.config";
import { useNoteContext } from "../notes/useNoteContext";

export const useUserLogout = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const { dispatch: noteDispatch } = useNoteContext();

  const logout = async () => {
    await aoNoteFetch("/api/user/logout", { method: "POST" });
    navigate("/login");
    createGuestToken();
    const token = localStorage.getItem(guestToken);

    if (token) {
      const decoded = decodeGuestToken(token);
      dispatch({ type: "LOGOUT", payload: decoded });
    }

    noteDispatch({ type: "GET_NOTES", payload: [] });
  };

  return {
    logout,
  };
};
