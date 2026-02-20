import { useEffect, useState } from "react";
import type { Note } from "../features/notes/note.types";
import NoteDetails from "../features/notes/NoteDetails";
import { useNoteContext } from "../features/notes/useNoteContext";
import Banner from "../components/Banner";
import Section from "../layouts/Section";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuthContext } from "../features/user/useAuthContext";
import { aoNoteFetch } from "../shared/utils/http/ao-note-fetch.util";
import { guestNotes } from "../features/user/user.config";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const { state: notes, dispatch } = useNoteContext();
  const { state: user } = useAuthContext();
  const [loading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getNotes = async () => {
      setIsLoading(true);
      const response = await aoNoteFetch("/notes", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const result = await response.json();

      if (response.ok) {
        dispatch({ type: "GET_NOTES", payload: result });
      }
      setIsLoading(false);
    };

    const getLocalNotes = async () => {
      setIsLoading(true);
      const localResult = localStorage.getItem(guestNotes);

      const parsedLocalNotes = localResult
        ? (JSON.parse(localResult) as Note[])
        : [];

      const sortedNotes = parsedLocalNotes.sort((noteA, noteB) => {
        const dateA = new Date(noteA.updatedAt as string).getTime();
        const dateB = new Date(noteB.updatedAt as string).getTime();
        return dateB - dateA;
      });

      dispatch({ type: "GET_NOTES", payload: sortedNotes });
      setIsLoading(false);
    };

    if (user.role === "user") getNotes();
    else if (user.role === "guest") getLocalNotes();
  }, [user, dispatch]);

  return (
    <Section>
      <h3 className="mb-5">Notes</h3>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
        <div className="xl:col-span-3 space-y-5 w-full">
          <Link
            to="/add-note"
            className="w-full h-max p-10 text-4xl font-bold font-primary flex items-center justify-center gap-5 shadow-lg bg-surface text-primary rounded-lg hover:-translate-y-2 hover:shadow-xl hover:bg-primary hover:text-white transition-[shadow_color]"
          >
            <FaPlus />
            Add Note
          </Link>
          <div className="h-max grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5">
            {loading ? (
              <LoadingSpinner className="mx-auto my-20 text-5xl" />
            ) : notes.length > 0 ? (
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
              <div className="text-slate-500 mx-auto my-20">No notes found</div>
            )}
          </div>
        </div>
        <div className="xl:col-span-2 w-full flex flex-col gap-10">
          <Banner />
        </div>
      </div>
    </Section>
  );
}
