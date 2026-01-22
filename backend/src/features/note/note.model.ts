import { Model, Schema } from "../../shared/lib/mongoose";
import { noteStatics } from "./note.statics";
import type { NoteDocument, NoteDocumentModel } from "./note.types";

const NoteSchema = new Schema<NoteDocument, NoteDocumentModel>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

NoteSchema.statics = {
  ...NoteSchema.statics,
  ...noteStatics,
};

const NoteModel = Model<NoteDocument, NoteDocumentModel>("Note", NoteSchema);

export default NoteModel;
