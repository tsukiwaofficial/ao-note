import { useState, type FormEvent } from "react";
import type { Note } from "./note.types";
import { postOptions } from "../../shared/utils/http/post.options";
import { useNoteContext } from "./useNoteContext";
import { timer } from "../../shared/utils/timer.util";
import { notePlaceholders } from "../placeholders/placeholders.config";
import { getPlaceholder } from "../placeholders/get-placeholder.util";
import { handleKeyDown } from "./note-keydown.util";
import Section from "../../layouts/Section";
import { Link, useNavigate } from "react-router-dom";

const { title: titlePlaceholder, content: contentPlaceholder } =
  getPlaceholder(notePlaceholders);

export default function NoteForm() {
  const [noteData, setNoteData] = useState<Note>({
    title: "",
    content: "",
  });
  const [error, setError] = useState<string>("");
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const { dispatch } = useNoteContext();
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNoteData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    const payload = {
      title: noteData.title.trim(),
      content: noteData.content.trim(),
    };

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/notes",
      postOptions<Note>(payload),
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

    dispatch({ type: "ADD_NOTE", payload: result });
    navigate("/");
    setError("");
    setEmptyFields([]);
  };

  return (
    <Section className="px-[5vw]">
      {/* <img
        src="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyaDV0ZGtxbms5bXg1aGY2OXNwM3NrdG4zMmU5djZrMjhsemUxOG92eCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/boOoHL2PAFXahZyObR/giphy.gif"
        alt=""
        className="absolute max-w-70 -top-45 -right-20"
      /> */}
      <form
        className={`w-full flex flex-col xl:flex-row items-end xl:items-start justify-between gap-10 ${error && "animate-shake"}`}
        onSubmit={handleSubmit}
      >
        <div className="w-full h-max">
          <div className="w-full flex flex-col gap-11 cursor-text">
            <textarea
              name="title"
              id="title"
              className={`${emptyFields.includes("title") ? "placeholder:text-error/50 focus:outline-none" : ""} rounded-none border-none focus:outline-none pl-2 bg-transparent field-sizing-content resize-none text-3xl font-bold text-primary transition-colors`}
              placeholder={`Type here the title of your note. For example, ${titlePlaceholder}`}
              value={noteData.title}
              onChange={handleInputChange}
              onKeyDown={(event) => handleKeyDown(event, handleSubmit)}
              autoFocus
            />
            <textarea
              name="content"
              id="content"
              className={`${emptyFields.includes("content") ? "placeholder:text-error/50 focus:outline-none" : ""} rounded-none border-none focus:outline-none pl-2 bg-transparent field-sizing-content min-h-15 resize-none`}
              placeholder={contentPlaceholder}
              value={noteData.content}
              onChange={handleInputChange}
              onKeyDown={(event) => handleKeyDown(event, handleSubmit)}
            />
          </div>
          <div
            className={`${error ? "opacity-100 rounded-lg text-error p-4 border-2 border-error bg-error/30 mb-4 h-max" : "h-0"} w-max mt-30 transition-[opacity_height]`}
          >
            {error}
          </div>
        </div>
        <div className="flex xl:flex-col gap-5">
          <Link
            to="/"
            className="p-4 ml-auto rounded-lg cursor-pointer border-2 border-transparent bg-primary font-semibold text-slate-200 hover:bg-primary-variant transition-colors"
          >
            Back
          </Link>
          <button
            type="submit"
            className="rounded-lg p-4 cursor-pointer border-2 border-transparent bg-primary font-semibold text-slate-200 hover:bg-primary-variant  transition-colors"
          >
            Add
          </button>
        </div>
      </form>
    </Section>
  );
}
