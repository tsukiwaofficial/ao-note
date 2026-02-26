import { useEffect, useReducer } from "react";
import type { UserAuthAction, UserAuth } from "./user.types";
import { AuthContext } from "./AuthContext";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { createGuestToken, decodeGuestToken } from "./user-guest-token.util";
import { BUFFER, DEFAULT_TOKEN_EXPIRY, guestToken } from "./user.config";
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
    if (state.token && cookies.isLoggedIn) {
      const { exp } = jwtDecode<JwtPayload>(state.token);

      const refreshTime = exp
        ? exp * 1000 - Date.now() - BUFFER
        : DEFAULT_TOKEN_EXPIRY - BUFFER;

      const timer = setTimeout(async () => {
        if (!cookies.isLoggedIn) return;

        const newToken = await refreshAccessToken();

        if (newToken) {
          dispatch({
            type: "LOGIN",
            payload: { ...state, token: newToken.token },
          });
        }
      }, refreshTime);

      return () => clearTimeout(timer);
    }
  }, [state.token, cookies.isLoggedIn]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
