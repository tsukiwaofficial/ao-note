import { useEffect } from "react";
import NoteCard from "../features/notes/NoteCard";
import Banner from "../components/Banner";
import Section from "../layouts/Section";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUserAuthRole } from "../features/user/useUserAuthStore";
import { useNoteActions, useNotes } from "../features/notes/useNoteStore";
import { useIsLoading } from "../hooks/useIsLoading";

export default function Home() {
  const { isLoading, setIsLoading } = useIsLoading();
  const role = useUserAuthRole();
  const notes = useNotes();
  const { getNotes } = useNoteActions();

  useEffect(() => {
    setIsLoading(true);
    getNotes();
    if (notes.length > 0) setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, notes.length]);

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
            {isLoading ? (
              <LoadingSpinner className="mx-auto my-20" />
            ) : notes.length > 0 ? (
              notes.map((note) => <NoteCard key={note._id} {...note} />)
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
