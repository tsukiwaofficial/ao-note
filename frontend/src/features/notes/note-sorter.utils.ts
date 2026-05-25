import type { Note } from "./note.types";

export const sortNotesByLatestDate = (notes: Note[]) => {
  return notes.sort((noteA, noteB) => {
    const dateA = new Date(
      noteA.updatedAt || (noteA.createdAt as string),
    ).getTime();
    const dateB = new Date(
      noteB.updatedAt || (noteB.createdAt as string),
    ).getTime();

    return dateB - dateA;
  });
};
