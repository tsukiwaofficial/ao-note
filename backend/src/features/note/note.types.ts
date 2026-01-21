import { Document, Model } from "mongoose";

export interface Note {
  title: string;
  content: string;
}

export interface NoteDocument extends Note, Document {}

export interface NoteDocumentModel extends Model<NoteDocument> {
  doesNoteExist(_id: string): Promise<boolean>;
}
