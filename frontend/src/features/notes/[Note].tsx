import { Link, useNavigate, useParams } from "react-router-dom";
import type { Note } from "./note.types";
import { useEffect, useState, type FormEvent } from "react";
import { useNoteContext } from "./useNoteContext";
import { FaTrash, FaPencil, FaCheck, FaXmark } from "react-icons/fa6";
import { timer } from "../../shared/utils/timer.util";
import { deleteNote } from "./delete-note.util";
import { formatDistanceToNow } from "date-fns";
import Section from "../../layouts/Section";
import { handleKeyDown } from "./note-keydown.util";

export default function Note() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: note, dispatch } = useNoteContext();
  const [noteData, setNoteData] = useState<Note>({} as Note);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNoteData((prev) => ({ ...prev, [name]: value }));
  };

  const updateNote = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsUpdating(true);

    if (isUpdating) {
      const payload = {
        ...noteData,
        title: noteData.title.trim(),
        content: noteData.content.trim(),
      };

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/notes/" + noteData._id,
        {
          method: "PUT",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message);
        if (result.emptyFields) {
          switch (true) {
            case result.emptyFields.includes("title"):
              setEmptyFields(result.emptyFields);
              break;
            case result.emptyFields.includes("content"):
              setEmptyFields(result.emptyFields);
              break;
          }
        }

        await timer(3);
        setError("");

        return;
      }

      dispatch({
        type: "UPDATE_NOTE",
        payload: { ...payload },
      });
      setNoteData(payload);
      setEmptyFields([]);
      setIsUpdating(false);
    }
  };

  const cancelUpdateNote = () => {
    setIsUpdating(false);
    setEmptyFields([]);
    setError("");

    const result = note.find((item) => item._id === id);

    if (!result)
      throw new Error(
        "Could not cancel the update. The ID might be mismatched.",
      );

    setNoteData(result);
  };

  useEffect(() => {
    const getNote = async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + `/notes/${id}`,
      );
      const result = await response.json();

      if (!response.ok)
        throw new Error(`Could not find the note with an ID of ${id}`);

      dispatch({ type: "GET_NOTE", payload: result });
      setNoteData(result);
    };

    getNote();
  }, [dispatch, id]);

  return (
    <Section className="p-50">
      <form
        className="w-full flex items-start justify-between gap-10"
        onSubmit={updateNote}
      >
        <div className=" w-full">
          <div
            onClick={() => setIsUpdating(true)}
            className="flex flex-col cursor-text"
          >
            {isUpdating ? (
              <textarea
                name="title"
                id="update-title"
                className={`${emptyFields.includes("title") && "placeholder:text-error/50 animate-shake focus:outline-none"} rounded-none border-none focus:outline-none pl-2 bg-transparent field-sizing-content resize-none text-3xl font-bold text-primary transition-colors`}
                placeholder="Title"
                value={noteData.title}
                onChange={handleUpdateChange}
                onKeyDown={(event) => handleKeyDown(event, updateNote)}
              />
            ) : (
              <h5 className="whitespace-normal pl-2 text-primary">
                {noteData.title}
              </h5>
            )}
            <div className="mt-1 mb-10 ml-2">
              {noteData.createdAt && (
                <span className="text-sm text-slate-400">
                  Created{" "}
                  {formatDistanceToNow(new Date(noteData.createdAt), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                </span>
              )}
              {noteData.updatedAt &&
                noteData.createdAt !== noteData.updatedAt && (
                  <span className="text-sm text-slate-400">
                    {" "}
                    (Updated{" "}
                    {formatDistanceToNow(new Date(noteData.updatedAt), {
                      addSuffix: true,
                      includeSeconds: true,
                    })}
                    )
                  </span>
                )}
            </div>
            {isUpdating ? (
              <textarea
                name="content"
                id="update-content"
                className={`${emptyFields.includes("content") && "placeholder:text-error/50 animate-shake focus:outline-none"} rounded-none border-none focus:outline-none pl-2 bg-transparent field-sizing-content min-h-15 resize-none`}
                placeholder="Content"
                value={noteData.content}
                onChange={handleUpdateChange}
                onKeyDown={(event) => handleKeyDown(event, updateNote)}
              />
            ) : (
              <div className="whitespace-pre-line pl-2">{noteData.content}</div>
            )}
          </div>
          <div
            className={`${error ? "opacity-100 rounded-lg text-error p-4 border-2 border-error bg-error/30 mb-4 h-max" : "h-0"} w-max mt-30 transition-[opacity_height]`}
          >
            {error}
          </div>
        </div>
        <div className="flex items-start justify-between gap-5">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => {
                deleteNote(noteData._id, dispatch);
                navigate("/");
              }}
              className="rounded-full p-4 hover:bg-error cursor-pointer hover:text-white transition-colors"
            >
              <FaTrash />
            </button>
            <button
              type="submit"
              className="rounded-full p-4 hover:bg-primary cursor-pointer hover:text-white transition-colors"
            >
              {isUpdating ? <FaCheck /> : <FaPencil />}
            </button>
            {isUpdating && (
              <button
                onClick={cancelUpdateNote}
                className="rounded-full p-4 hover:bg-error cursor-pointer hover:text-white transition-colors"
              >
                <FaXmark />
              </button>
            )}
          </div>
          <Link
            to="/"
            className="p-4 ml-auto rounded-lg cursor-pointer border-2 border-transparent bg-primary font-semibold text-slate-200 hover:bg-primary-variant transition-colors"
          >
            Back
          </Link>
        </div>
      </form>
    </Section>
  );
}
