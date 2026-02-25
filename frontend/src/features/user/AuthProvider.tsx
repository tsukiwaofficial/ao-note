import { useEffect, useReducer } from "react";
import type { UserAuthAction, UserAuth } from "./user.types";
import { AuthContext } from "./AuthContext";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { createGuestToken, decodeGuestToken } from "./user-guest-token.util";
import { guestToken } from "./user.config";
import { useRefreshAccessToken } from "./useRefreshAccessToken";
import { useCookies } from "react-cookie";

const authReducer = (prevState: UserAuth, action: UserAuthAction): UserAuth => {
  switch (action.type) {
    case "LOGIN":
      return { ...action.payload };
    case "LOGOUT":
      return { ...action.payload };
    default:
      return prevState;
  }
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(authReducer, {} as UserAuth);
  const { refreshAccessToken } = useRefreshAccessToken();
  const [cookies] = useCookies(["isLoggedIn"]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!state.token) {
        if (cookies.isLoggedIn) {
          const user = await refreshAccessToken();
          if (user)
            dispatch({
              type: "LOGIN",
              payload: { role: user.role, token: user.token },
            });
        } else {
          createGuestToken();
          const isGuestTokenExists = localStorage.getItem(guestToken);
          if (isGuestTokenExists) {
            const decoded = decodeGuestToken(isGuestTokenExists);
            dispatch({
              type: "LOGIN",
              payload: { role: decoded.role, token: decoded.token },
            });
          }
        }
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const verifyUser = async () => {
      if (state.token && state.role === "user") {
        const { exp } = jwtDecode<JwtPayload>(state.token);

        const refreshTime = exp! * 1000 - Date.now() - 60000;

        const timer = setTimeout(async () => {
          const newToken = await refreshAccessToken();

          if (newToken) {
            dispatch({
              type: "LOGIN",
              payload: { ...state, token: newToken.token },
            });
          }
        }, refreshTime);

        return () => clearTimeout(timer);
      } else return;
    };

    verifyUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
