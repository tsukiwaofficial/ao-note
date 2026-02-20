import type { UserDocument } from "../../features/user/user.types";

declare global {
  namespace Express {
    export interface Request {
      user: UserDocument;
    }
  }
}

export {};
