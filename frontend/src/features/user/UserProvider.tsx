import { useEffect, useReducer } from "react";
import type { UserAction, UserDetails } from "./user.types";
import { UserContext } from "./UserContext";
import { useAuthContext } from "./useAuthContext";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";

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
  const { state: userAuth } = useAuthContext();

  useEffect(() => {
    const getUserDetails = async (id: string) => {
      const response = await aoNoteFetch(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      });

      if (!response.ok) throw new Error("User details cannot be found");

      const user: UserDetails = await response.json();

      dispatch({ type: "GET_USER", payload: user });
    };

    if (userAuth.role === "user") getUserDetails(userAuth._id);
  }, [userAuth]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}
