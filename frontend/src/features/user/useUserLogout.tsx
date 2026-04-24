import { useNavigate } from "react-router-dom";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { useNoteContext } from "../notes/useNoteContext";
import { useUserContext } from "./useUserContext";
import type { UserDetails } from "./user.types";
import { useAuthActions } from "./useUserAuthStore";
import { useCookies } from "react-cookie";

export const useUserLogout = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["isLoggedIn"]);
  const { dispatch: noteDispatch } = useNoteContext();
  const { dispatch: userDetailsDispatch } = useUserContext();
  const { useInitializeGuestAuth } = useAuthActions();

  const logout = async () => {
    await aoNoteFetch("/api/users/logout", { method: "POST" });
    navigate("/login");
    useInitializeGuestAuth(cookies.isLoggedIn);

    noteDispatch({ type: "GET_NOTES", payload: [] });
    userDetailsDispatch({ type: "GET_USER", payload: {} as UserDetails });
  };

  return {
    logout,
  };
};
