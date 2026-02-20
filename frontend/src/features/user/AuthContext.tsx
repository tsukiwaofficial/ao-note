import { createContext } from "react";
import type { UserAuthContextAction } from "./user.types";

export const AuthContext = createContext<UserAuthContextAction | null>(null);
