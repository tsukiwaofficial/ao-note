import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Note } from "./note.types";
import { FaTrash, FaPencil, FaCheck, FaXmark } from "react-icons/fa6";
import { useNoteContext } from "./useNoteContext";

export default function NoteDetails({
  _id,
  title,
  content,
  createdAt,
  updatedAt,
}: Note) {
  const { dispatch } = useNoteContext();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [noteData, setNoteData] = useState<Note>({
    title,
    content,
  });
  const [error, setError] = useState<string>("");

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

  const updateNote = async () => {
    setIsUpdating(!isUpdating);

    if (isUpdating) {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/notes/" + _id,
        {
          method: "PUT",
          body: JSON.stringify(noteData),
          headers: { "Content-Type": "application/json" },
        },
      );

      const result = await response.json();

      if (!response.ok) setError(result.message);

      dispatch({
        type: "UPDATE_NOTE",
        payload: { _id, ...noteData, createdAt, updatedAt },
      });
    }
  };

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNoteData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-8 shadow bg-surface max-h-max rounded-lg hover:-translate-y-1 hover:shadow-lg transition-transform">
      <div className="w-full flex items-start justify-between gap-10">
        <div className="space-y-4">
          <div className="flex flex-col w-full">
            {isUpdating ? (
              <input
                type="text"
                name="title"
                id="update-title"
                className="mb-2"
                placeholder="Title"
                value={noteData.title}
                onChange={handleUpdateChange}
              />
            ) : (
              <h5 className="line-clamp-1 capitalize text-primary mb-1">
                {title}
              </h5>
            )}
            {isUpdating ? (
              <textarea
                name="content"
                id="update-content"
                className=""
                placeholder="Content"
                value={noteData.content}
                onChange={handleUpdateChange}
              />
            ) : (
              <p className="line-clamp-2">{content}</p>
            )}
          </div>
          {error && (
            <div className="rounded-lg text-error p-4 border-2 border-error bg-error/30 w-max">
              {error}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-between">
          <button
            onClick={deleteNote}
            className="rounded-full p-4 hover:bg-error cursor-pointer hover:text-white transition-colors"
          >
            <FaTrash />
          </button>
          <button
            onClick={updateNote}
            className="rounded-full p-4 hover:bg-primary cursor-pointer hover:text-white transition-colors"
          >
            {isUpdating ? <FaCheck /> : <FaPencil />}
          </button>
          {isUpdating && (
            <button
              onClick={() => setIsUpdating(false)}
              className="rounded-full p-4 hover:bg-error cursor-pointer hover:text-white transition-colors"
            >
              <FaXmark />
            </button>
          )}
        </div>
      </div>
      {createdAt && (
        <span className="text-sm text-slate-400 capitalize">
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            includeSeconds: true,
          })}
        </span>
      )}
      {updatedAt && createdAt !== updatedAt && (
        <span className="text-sm text-slate-400 capitalize">
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
  );
}
