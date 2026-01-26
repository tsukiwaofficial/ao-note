import { useEffect } from "react";
import type { Note } from "../features/notes/note.types";
import NoteDetails from "../features/notes/NoteDetails";
import NoteForm from "../features/notes/NoteForm";
import { useNoteContext } from "../features/notes/useNoteContext";
import Banner from "../components/Banner";

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
    <div className="container mx-auto pt-50 pb-25 space-y-15">
      <div className="flex justify-between gap-20">
        <div className="space-y-5 w-full">
          <h3>Notes</h3>
          <div className="h-max grid grid-cols-1 gap-y-5">
            {notes.length > 0 ? (
              notes.map(
                ({ _id, title, content, createdAt, updatedAt }: Note) => (
                  <NoteDetails
                    key={_id}
                    _id={_id}
                    title={title}
                    content={content}
                    createdAt={createdAt}
                    updatedAt={updatedAt}
                  />
                ),
              )
            ) : (
              <div className="">No notes found</div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <NoteForm />
          <Banner />
        </div>
      </div>
    </div>
  );
}
