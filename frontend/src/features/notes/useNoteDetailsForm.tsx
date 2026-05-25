import { useNavigate } from "react-router-dom";
import { useEffect, useState, type SubmitEvent } from "react";
import type { Note } from "./note.types";
import { formChecker } from "../../shared/utils/form-checker.util";
import { timer } from "../../shared/utils/timer.util";
import { useNote, useNoteActions } from "./useNoteStore";
import { useError } from "../../hooks/useError";
import { useErrorFields } from "../../hooks/useErrorFields";

export const useNoteDetailsForm = (id: string) => {
  const navigate = useNavigate();
  const note = useNote();
  const { getNote, updateNote } = useNoteActions();
  const [noteData, setNoteData] = useState<Note>({
    _id: "",
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { error, setError } = useError();
  const { errorFields, setErrorFields } = useErrorFields();

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNoteData((prev) => ({ ...prev, [name]: value }));
  };

  const updateNoteProcess = async (e?: SubmitEvent<HTMLFormElement>) => {
    e?.preventDefault();

    const emptyKeys = formChecker<Note>(noteData);

    if (emptyKeys.length > 0) {
      setErrorFields(emptyKeys);
      switch (true) {
        case emptyKeys.includes("title") && emptyKeys.includes("content"):
          setError("You can't update a note to being empty.");
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

    if (isUpdating) {
      updateNote(noteData);

      setErrorFields([]);
      setIsUpdating(false);
    }
  };

  const cancelUpdateNote = () => {
    setIsUpdating(false);
    setErrorFields([]);
    setError("");
  };

  useEffect(() => {
    getNote(id);
    setNoteData(note);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, note._id]);

  return {
    noteData,
    setNoteData,
    navigate,
    error,
    errorFields,
    isUpdating,
    setIsUpdating,
    handleUpdateChange,
    updateNoteProcess,
    cancelUpdateNote,
  };
};
