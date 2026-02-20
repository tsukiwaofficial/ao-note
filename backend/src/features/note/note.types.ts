import { Document, Model, Types } from "mongoose";

export interface Note {
  title: string;
  content: string;
}

export interface NoteDocument extends Note, Document {
  userId: Types.ObjectId;
}

export interface NoteDocumentModel extends Model<NoteDocument> {
  doesNoteExist(_id: string): Promise<boolean>;
}
