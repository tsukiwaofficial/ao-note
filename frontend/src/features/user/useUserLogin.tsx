import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { User } from "./user.types";
import { timer } from "../../shared/utils/timer.util";
import { postOptions } from "../../shared/utils/http/fetch-options.utils";
import { useAuthContext } from "./useAuthContext";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { jwtDecoder } from "./jwt-decoder.util";
import { guestToken } from "./user.config";
import { useNoteContext } from "../notes/useNoteContext";
import { formChecker } from "../../shared/utils/form-checker.util";

export const useUserLogin = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const { dispatch: noteDispatch } = useNoteContext();
  const [userData, setUserData] = useState<User>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (username: string, password: string) => {
    noteDispatch({ type: "GET_NOTES", payload: [] });
    setError("");
    setIsLoading(true);
    setErrorFields([]);

    const emptyKeys = formChecker<User>(userData);

    if (emptyKeys.length > 0) {
      setErrorFields((prevState) => [...prevState, ...emptyKeys]);
      setError("Please fill up all the fields.");
      setIsLoading(false);

      await timer(3);
      setError("");

      return;
    }

    const payload = {
      username: username.trim(),
      password,
    };

    const response = await aoNoteFetch("/api/user/login", {
      ...postOptions<User>(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(result.message);
      if (result.error) setErrorFields([result.error]);

      await timer(3);
      setError("");

      return;
    }

    dispatch({
      type: "LOGIN",
      payload: { role: jwtDecoder(result.token).role, token: result.token },
    });
    localStorage.removeItem(guestToken);
    setIsLoading(false);
    setError("");
    setErrorFields([]);
    navigate("/");
  };

  return {
    userData,
    setUserData,
    error,
    errorFields,
    isLoading,
    login,
  };
};
