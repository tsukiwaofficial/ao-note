import { useNavigate } from "react-router-dom";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { useUserAuthActions } from "./useUserAuthStore";

export const useUserLogout = () => {
  const navigate = useNavigate();
  const { initializeUserAuth } = useUserAuthActions();

  const logout = async () => {
    await aoNoteFetch("/api/users/logout", { method: "POST" });
    initializeUserAuth();
    navigate("/login");
  };

  return {
    logout,
  };
};
