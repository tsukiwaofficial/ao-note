import { useNavigate } from "react-router-dom";
import { useNoteContext } from "./useNoteContext";
import { useAuthContext } from "../user/useAuthContext";
import { useState, type FormEvent } from "react";
import type { Note } from "./note.types";
import { formChecker } from "../../shared/utils/form-checker.util";
import { timer } from "../../shared/utils/timer.util";
import { v4 as uuidv4 } from "uuid";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { postOptions } from "../../shared/utils/http/fetch-options.utils";
import { guestNotes } from "../user/user.config";

export const useNoteForm = () => {
  const navigate = useNavigate();
  const { dispatch } = useNoteContext();
  const { state: user } = useAuthContext();
  const [noteData, setNoteData] = useState<Note>({
    title: "",
    content: "",
  });
  const [error, setError] = useState<string>("");
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNoteData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
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

    const payload = {
      title: noteData.title.trim(),
      content: noteData.content.trim(),
    };

    const guestPayload = {
      _id: uuidv4(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (user.role === "user") {
      const response = await aoNoteFetch("/notes", {
        ...postOptions<Note>(payload),
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

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
    } else {
      const existingNotes = localStorage.getItem(guestNotes);
      const parsedLocalNotes = existingNotes ? JSON.parse(existingNotes) : [];
      parsedLocalNotes.push(guestPayload);
      localStorage.setItem(guestNotes, JSON.stringify(parsedLocalNotes));

      dispatch({ type: "ADD_NOTE", payload: guestPayload });
    }

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
