import { verifyEnv } from "../utils/verify-env.util";

export const MONGODB_URI: string = verifyEnv("MONGODB_URI");
export const PORT: string = verifyEnv("PORT");
export const BACKEND_URL: string = verifyEnv("BACKEND_URL");
export const FRONTEND_URL: string = verifyEnv("FRONTEND_URL");
export const ACCESS_SECRET: string = verifyEnv("ACCESS_SECRET");
export const REFRESH_SECRET: string = verifyEnv("REFRESH_SECRET");
export const MODE: string = verifyEnv("MODE");
export const isProduction: boolean = MODE === "production";
