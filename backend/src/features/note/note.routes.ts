import express, { Router } from "express";
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from "./note.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router: Router = express.Router();

router.use(authMiddleware);

router.get("/", getNotes);
router.get("/:id", getNote);
router.post("/", createNote);
router.post("/add-note", createNote);
router.delete("/:id", deleteNote);
router.put("/:id", updateNote);

export default router;
