import { formatDistanceToNow } from "date-fns";
import type { Note } from "./note.types";
import { FaTrash, FaPencil } from "react-icons/fa6";
import { useNoteContext } from "./useNoteContext";
import { Link } from "react-router-dom";
import { deleteNote } from "./delete-note.util";

export default function NoteDetails({
  _id,
  title,
  content,
  createdAt,
  updatedAt,
}: Note) {
  const { dispatch } = useNoteContext();

  return (
    <div className="overflow-hidden w-full shadow bg-surface rounded-lg flex items-center justify-between hover:-translate-y-2 hover:shadow-xl group transition-[shadow_transform]">
      <Link to={`/${_id}`} className="w-full p-8">
        <div className="space-y-8 w-full max-w-200">
          <div className="flex flex-col">
            <h5 className="line-clamp-1 text-primary mb-1">{title}</h5>
            <p className="line-clamp-2">{content}</p>
          </div>
          {createdAt && (
            <span className="text-sm text-slate-400">
              Created{" "}
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                includeSeconds: true,
              })}
            </span>
          )}
          {updatedAt && createdAt !== updatedAt && (
            <span className="text-sm text-slate-400">
              {" "}
              (Updated{" "}
              {formatDistanceToNow(new Date(updatedAt), {
                addSuffix: true,
                includeSeconds: true,
              })}
              )
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-col items-center justify-center h-full p-8">
        <button
          type="button"
          onClick={() => deleteNote(_id, dispatch)}
          className="rounded-full p-4 hover:bg-error cursor-pointer hover:text-white transition-colors"
        >
          <FaTrash />
        </button>
        <Link
          to={`/${_id}`}
          className="rounded-full p-4 hover:bg-primary hover:text-white transition-colors"
        >
          <FaPencil />
        </Link>
      </div>
    </div>
  );
}
