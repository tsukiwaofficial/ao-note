import { useState } from "react";
import type { Note } from "./note.types";
import { postOptions } from "../../shared/utils/http/post.options";
import { useNoteContext } from "./useNoteContext";
import { timer } from "../../shared/utils/timer.util";

export default function NoteForm() {
  const [noteData, setNoteData] = useState<Note>({
    title: "",
    content: "",
  });
  const [error, setError] = useState<string>("");
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const { dispatch } = useNoteContext();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNoteData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/notes",
      postOptions<Note>(noteData),
    );

    const result = await response.json();

    if (!response.ok) {
      setError(result.error);
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

    dispatch({ type: "ADD_NOTE", payload: result });

    setNoteData({
      title: "",
      content: "",
    });
    setError("");
    setEmptyFields([]);
  };

  return (
    <div className="space-y-5">
      <h3 className="">Add a note</h3>
      <form
        className={`relative space-y-8 w-125 bg-surface shadow-lg rounded-lg p-10 hover:shadow-xl hover:-translate-y-1 transition-[shadow_transform] ${error && "animate-shake"}`}
        onSubmit={handleSubmit}
      >
        <img
          src="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyaDV0ZGtxbms5bXg1aGY2OXNwM3NrdG4zMmU5djZrMjhsemUxOG92eCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/boOoHL2PAFXahZyObR/giphy.gif"
          alt=""
          className="absolute max-w-70 -top-60 -right-25"
        />
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-2 text-primary font-semibold">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className={`${emptyFields.includes("title") ? "border-error" : ""}`}
              placeholder="Title"
              value={noteData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="content"
              className="mb-2 text-primary font-semibold"
            >
              Content
            </label>
            <textarea
              name="content"
              id="content"
              className={`${emptyFields.includes("content") ? "border-error" : ""} min-h-50`}
              placeholder="Content"
              value={noteData.content}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg p-4 cursor-pointer border-2 border-transparent bg-primary font-semibold text-slate-200 hover:bg-primary-variant  transition-colors"
        >
          Create Note
        </button>
        <div
          className={`${error ? "opacity-100 rounded-lg text-error p-4 border-2 border-error bg-error/30 h-max" : "h-0"} transition-[opacity_height]`}
        >
          {error}
        </div>
      </form>
    </div>
  );
}
