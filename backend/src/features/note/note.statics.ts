import NoteModel from "./note.model";

export const noteStatics = {
  async doesNoteExist(_id: string): Promise<boolean> {
    const note = await NoteModel.findById(_id);
    return !!note;
  },
};
