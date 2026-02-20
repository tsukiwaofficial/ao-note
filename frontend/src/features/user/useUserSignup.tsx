import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postOptions } from "../../shared/utils/http/fetch-options.utils";
import { timer } from "../../shared/utils/timer.util";
import { useAuthContext } from "./useAuthContext";
import type { ConfirmUser, User } from "./user.types";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { jwtDecoder } from "./jwt-decoder.util";
import { guestToken } from "./user.config";
import { useNoteContext } from "../notes/useNoteContext";

export const useUserSignup = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const { dispatch: noteDispatch } = useNoteContext();
  const [userData, setUserData] = useState<ConfirmUser>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signup = async (username: string, password: string) => {
    noteDispatch({ type: "GET_NOTES", payload: [] });
    setError("");
    setIsLoading(true);
    setErrorFields([]);

    const userDataKeys = Object.keys(userData);

    const emptyKeys = userDataKeys.filter((key) => {
      const value = userData[key as keyof ConfirmUser];
      return value === "" || value === null || value === undefined;
    });

    if (emptyKeys.length > 0) {
      setErrorFields((prevState) => [...prevState, ...emptyKeys]);
      setError("Please fill up all the fields.");
      setIsLoading(false);

      await timer(3);
      setError("");

      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setErrorFields(["password", "confirmPassword"]);
      setError("Password does not match.");
      setIsLoading(false);

      await timer(3);
      setError("");

      return;
    }

    const payload = {
      username: username.trim(),
      password,
    };

    const response = await aoNoteFetch("/api/user/signup", {
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
    signup,
  };
};
