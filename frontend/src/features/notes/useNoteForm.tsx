import { useNavigate } from "react-router-dom";
import { useState, type SubmitEvent } from "react";
import type { Note } from "./note.types";
import { formChecker } from "../../shared/utils/form-checker.util";
import { timer } from "../../shared/utils/timer.util";
import { useNoteActions } from "./useNoteStore";

export const useNoteForm = () => {
  const navigate = useNavigate();
  const [noteData, setNoteData] = useState<Note>({
    title: "",
    content: "",
  });
  const [error, setError] = useState<string>("");
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const { addNote } = useNoteActions();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNoteData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e?: SubmitEvent<HTMLFormElement>) => {
    e?.preventDefault();

    const emptyKeys = formChecker<Note>(noteData);

    if (emptyKeys.length > 0) {
      setEmptyFields(emptyKeys);
      switch (true) {
        case emptyKeys.includes("title") && emptyKeys.includes("content"):
          setError("You can't submit an empty note.");
          break;
        case emptyKeys.includes("title"):
          setError("Title can't be empty.");
          break;
        case emptyKeys.includes("content"):
          setError("Content can't be empty.");
          break;
      }

      await timer(3);
      setError("");

      return;
    }

    addNote(noteData);

    navigate("/");
    setError("");
    setEmptyFields([]);
  };

  return {
    noteData,
    error,
    emptyFields,
    handleInputChange,
    handleSubmit,
  };
};
