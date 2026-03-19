import { createContext } from "react";
import type { UserContextAction } from "./user.types";

export const UserContext = createContext<UserContextAction | null>(null);
