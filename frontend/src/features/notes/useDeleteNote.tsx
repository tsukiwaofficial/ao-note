import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { useAuthContext } from "../user/useAuthContext";
import { guestNotes } from "../user/user.config";
import type { Note, NoteAction } from "./note.types";

export const useDeleteNote = () => {
  const { state: user } = useAuthContext();

  const deleteNote = async (
    _id: string | undefined,
    dispatch: React.Dispatch<NoteAction>,
  ) => {
    if (!_id)
      throw new Error("ID is missing for this note to be able to be deleted.");

    if (user.role === "user") {
      const response = await aoNoteFetch(`/notes/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      if (_id) dispatch({ type: "DELETE_NOTE", payload: { _id } });
      else throw new Error("Note ID is missing");
    } else {
      const existingLocalNotes = localStorage.getItem(guestNotes);

      if (existingLocalNotes) {
        const parsedLocalNotes = JSON.parse(existingLocalNotes) as Note[];
        const updatedLocalNotes = parsedLocalNotes.filter(
          (note) => note._id !== _id,
        );
        localStorage.setItem(guestNotes, JSON.stringify(updatedLocalNotes));
      }
      dispatch({ type: "DELETE_NOTE", payload: { _id } });
    }
  };

  return {
    deleteNote,
  };
};
