import type { Dispatch } from "react";

export interface Note {
  _id?: string;
  title: string;
  content: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type NoteAction =
  | { type: "GET_NOTES"; payload: Note[] }
  | { type: "GET_NOTE"; payload: Note }
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "DELETE_NOTE"; payload: { _id: string } }
  | { type: "UPDATE_NOTE"; payload: Note };

export interface NoteContextAction {
  state: Note[];
  dispatch: Dispatch<NoteAction>;
}
