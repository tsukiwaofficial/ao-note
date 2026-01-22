import type { Note } from "./note.types";
import { FaTrash, FaPencil } from "react-icons/fa6";
import { useNoteContext } from "./useNoteContext";
import { formatDistanceToNow } from "date-fns";

export default function NoteDetails({ _id, title, content, createdAt }: Note) {
  const { dispatch } = useNoteContext();

  const deleteNote = async () => {
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

  return (
    <div className="p-8 shadow bg-surface rounded-lg flex items-start justify-between gap-8 hover:-translate-y-1 hover:shadow-lg transition-transform">
      <div className="space-y-4">
        <div className="">
          <h5 className="line-clamp-1 capitalize text-primary">{title}</h5>
          <p className="line-clamp-2">{content}</p>
        </div>
        {createdAt && (
          <span className="text-sm text-slate-400">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </span>
        )}
      </div>
      <div className="flex flex-col items-center justify-between">
        <button
          onClick={deleteNote}
          className="rounded-full p-4 hover:bg-error cursor-pointer hover:text-white transition-colors"
        >
          <FaTrash />
        </button>
        <button className="rounded-full p-4 hover:bg-primary cursor-pointer hover:text-white transition-colors">
          <FaPencil />
        </button>
      </div>
    </div>
  );
}
