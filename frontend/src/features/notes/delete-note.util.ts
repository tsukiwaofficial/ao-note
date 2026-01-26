import type { NoteAction } from "./note.types";

export const deleteNote = async (
  _id: string | undefined,
  dispatch: React.Dispatch<NoteAction>,
) => {
  if (!_id)
    throw new Error("ID is missing for this note to be able to be deleted.");

  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/notes/" + _id,
    {
      method: "DELETE",
    },
  );

  const result = await response.json();

  if (!response.ok) throw new Error(result.error);

  if (_id) dispatch({ type: "DELETE_NOTE", payload: { _id } });
  else throw new Error("Note ID is missing");
};
