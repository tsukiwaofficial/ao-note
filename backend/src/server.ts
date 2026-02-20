import express from "express";
import cookieParser from "cookie-parser";
import type { Express } from "express";
import { corsMiddleware } from "./middlewares/cors.middleware";

// Routes
import NoteRoutes from "./features/note/note.routes";
import UserRoutes from "./features/user/user.routes";

const app: Express = express();
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());

app.use("/notes", NoteRoutes);
app.use("/api/user", UserRoutes);

export default app;
