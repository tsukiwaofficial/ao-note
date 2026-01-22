import express, { Router } from "express";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "./note.controller";

const router: Router = express.Router();

router.get("/", getNotes);
router.post("/", createNote);
router.delete("/:id", deleteNote);
router.put("/:id", updateNote);

export default router;
