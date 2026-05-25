import type { MongoDbDefaults } from "../../shared/types/mongodb.types";

export interface Note extends MongoDbDefaults {
  title: string;
  content: string;
}

export interface NoteResponse extends Response {
  message?: string;
}

interface NoteActions {
  actions: {
    getNotes: () => Promise<{
      response: NoteResponse;
      result: Note[];
    }>;
    getNote: (id: string) => Promise<{ response: NoteResponse; result: Note }>;
    addNote: (note: Note) => Promise<void>;
    updateNote: (note: Note) => Promise<void>;
    deleteNote: (_id: string | undefined) => Promise<void>;
  };
}

export interface NoteStore extends NoteActions {
  note: Note;
  notes: Note[];
}
