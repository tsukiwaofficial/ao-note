import cors, { type CorsOptions } from "cors";
import { FRONTEND_URL, BACKEND_URL } from "../shared/config/env.config.js";

const ALLOWED_ORIGINS: string[] = [BACKEND_URL, FRONTEND_URL];

const corsOptions: CorsOptions = {
  origin: ALLOWED_ORIGINS,

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
