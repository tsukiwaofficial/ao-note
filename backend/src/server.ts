import express from "express";
import type { Express } from "express";
import { corsMiddleware } from "./middlewares/cors.middleware";

// Routes
import NoteRoutes from "./features/note/note.routes";

const app: Express = express();
app.use(corsMiddleware);
app.use(express.json());

app.use("/notes", NoteRoutes);

export default app;
