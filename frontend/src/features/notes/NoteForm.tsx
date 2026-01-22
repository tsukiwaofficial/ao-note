import { useState } from "react";
import type { Note } from "./note.types";
import { postOptions } from "../../shared/utils/http/post.options";
import { useNoteContext } from "./useNoteContext";

export default function NoteForm() {
  const [noteData, setNoteData] = useState<Note>({
    title: "",
    content: "",
  });
  const [error, setError] = useState<string>("");
  const [emptyFields, setEmptyFields] = useState<string[]>([""]);
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
    <form className="space-y-8" onSubmit={handleSubmit}>
      <h3 className="">Create a note</h3>
      <div className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="title" className="">
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
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            className={`${emptyFields.includes("content") ? "border-error" : ""}`}
            placeholder="Content"
            value={noteData.content}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <button
        type="submit"
        className="rounded-lg p-4 cursor-pointer border-2 border-primary bg-primary/50 font-semibold text-slate-700 hover:bg-primary hover:text-slate-200 transition-colors"
      >
        Create Note
      </button>
      {error && (
        <div className="rounded-lg text-error p-4 border-2 border-error bg-error/30">
          {error}
        </div>
      )}
    </form>
  );
}
