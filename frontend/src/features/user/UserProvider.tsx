import { useEffect, useReducer } from "react";
import type { UserAction, UserDetails } from "./user.types";
import { UserContext } from "./UserContext";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { useCookies } from "react-cookie";
import {
  useAuthActions,
  useAuthId,
  useAuthRole,
  useAuthToken,
} from "./useUserAuthStore";

const userReducer = (
  prevState: UserDetails,
  action: UserAction,
): UserDetails => {
  switch (action.type) {
    case "GET_USER":
      return { ...action.payload };
    case "UPDATE_AVATAR":
      return { ...prevState, avatar: action.payload };
    case "UPDATE_DISPLAY_NAME":
      return { ...prevState, displayName: action.payload };
    default:
      return prevState;
  }
};

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(userReducer, {} as UserDetails);
  const [cookies] = useCookies(["isLoggedIn"]);
  const _id = useAuthId();
  const role = useAuthRole();

  const token = useAuthToken();
  const { useInitializeUserAuth, useRefreshUserAuth, useInitializeGuestAuth } =
    useAuthActions();

  if (cookies.isLoggedIn) useInitializeUserAuth(cookies.isLoggedIn);
  else useInitializeGuestAuth(cookies.isLoggedIn);

  useEffect(() => {
    useRefreshUserAuth(token, cookies.isLoggedIn);
  }, [token]);

  useEffect(() => {
    const getUserDetails = async (id: string) => {
      const response = await aoNoteFetch(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("User details cannot be found");

      const user: UserDetails = await response.json();

      dispatch({ type: "GET_USER", payload: user });
    };

    if (role === "user") getUserDetails(_id);
  }, [role, _id, token]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}
