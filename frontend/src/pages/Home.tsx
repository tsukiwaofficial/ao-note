import { useEffect } from "react";
import type { Note } from "../features/notes/note.types";
import NoteDetails from "../features/notes/NoteDetails";
import NoteForm from "../features/notes/NoteForm";
import { useNoteContext } from "../features/notes/useNoteContext";

export default function Home() {
  const { state: notes, dispatch } = useNoteContext();

  useEffect(() => {
    const getNotes = async () => {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/notes");
      const result = await response.json();

      if (response.ok) {
        dispatch({ type: "GET_NOTES", payload: result });
      }
    };

    getNotes();
  }, [dispatch]);

  return (
    <div className="container mx-auto py-50 flex justify-between">
      <div className="grid grid-cols-1 gap-y-4 w-full mr-50">
        {notes &&
          notes.map(
            ({ _id, title, content, createdAt }: Note, index: number) => (
              <NoteDetails
                key={index}
                _id={_id}
                title={title}
                content={content}
                createdAt={createdAt}
              />
            ),
          )}
      </div>
      <NoteForm />
    </div>
  );
}
