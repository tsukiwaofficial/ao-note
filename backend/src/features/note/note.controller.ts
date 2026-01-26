import type { Request, Response } from "express";
import NoteModel from "./note.model";
import mongoose from "mongoose";
import type { Note } from "./note.types";

export const getNotes = async (req: Request, res: Response) => {
  const result = await NoteModel.find().sort({ createdAt: -1 });

  if (!result) return res.status(404).json({ message: "No notes found" });

  res.status(200).json(result);
};

export const getNote = async (
  req: { params: { id: string } },
  res: Response,
) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Note ID is required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "Invalid note ID" });

  const result = await NoteModel.findById({ _id: id });

  if (!result)
    return res
      .status(404)
      .json({ message: "Cannot find the note with this ID." });

  res.status(200).json(result);
};

export const createNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  const emptyFields = [];

  if (!title) emptyFields.push("title");
  if (!content) emptyFields.push("content");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ message: "Please fill up all the fields", emptyFields });
  }

  const result = await NoteModel.create({ title, content });

  if (!result)
    return res.status(400).json({ message: "Failed to create note" });

  res.status(201).json(result);
};

export const deleteNote = async (
  req: { params: { id: string } },
  res: Response,
) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Note ID is required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "Invalid note ID" });

  const result = await NoteModel.findByIdAndDelete({ _id: id });

  if (!result) return res.status(404).json({ message: "Note not found" });

  res.status(200).json({ message: "Note deleted successfully" });
};

export const updateNote = async (
  req: { body: Note; params: { id: string } },
  res: Response,
) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const emptyFields = [];

  if (!title) emptyFields.push("title");
  if (!content) emptyFields.push("content");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ message: "Please fill up all the fields", emptyFields });
  }

  if (!id) return res.status(400).json({ message: "Note ID is required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "Invalid note ID" });

  const result = await NoteModel.findOneAndUpdate({ _id: id }, req.body);

  if (!result) return res.status(404).json({ message: "Note not found" });

  res.status(200).json({ message: "Note updated successfully" });
};
