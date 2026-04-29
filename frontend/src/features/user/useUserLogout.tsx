import { useNavigate } from "react-router-dom";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { useNoteContext } from "../notes/useNoteContext";
import { useUserAuthActions } from "./useUserAuthStore";

export const useUserLogout = () => {
  const navigate = useNavigate();
  const { dispatch: noteDispatch } = useNoteContext();
  const { initializeGuestAuth } = useUserAuthActions();

  const logout = async () => {
    await aoNoteFetch("/api/users/logout", { method: "POST" });
    navigate("/login");
    initializeGuestAuth();

    noteDispatch({ type: "GET_NOTES", payload: [] });
  };

  return {
    logout,
  };
};
