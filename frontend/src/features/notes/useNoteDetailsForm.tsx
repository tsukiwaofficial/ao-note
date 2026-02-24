import { useNavigate } from "react-router-dom";
import { useNoteContext } from "./useNoteContext";
import { useEffect, useState, type FormEvent } from "react";
import type { Note } from "./note.types";
import { useAuthContext } from "../user/useAuthContext";
import { useDeleteNote } from "./useDeleteNote";
import { formChecker } from "../../shared/utils/form-checker.util";
import { timer } from "../../shared/utils/timer.util";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { putOptions } from "../../shared/utils/http/fetch-options.utils";
import { guestNotes } from "../user/user.config";

export const useNoteDetailsForm = (id: string) => {
  const navigate = useNavigate();
  const { state: note, dispatch } = useNoteContext();
  const [noteData, setNoteData] = useState<Note>({} as Note);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const { state: user } = useAuthContext();
  const { deleteNote } = useDeleteNote();

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNoteData((prev) => ({ ...prev, [name]: value }));
  };

  const updateNote = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsUpdating(true);

    const emptyKeys = formChecker<Note>(noteData);

    if (emptyKeys.length > 0) {
      setEmptyFields(emptyKeys);
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
      const payload = {
        ...noteData,
        title: noteData.title.trim(),
        content: noteData.content.trim(),
      };

      const guestPayload = {
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      if (user.role === "user") {
        const response = await aoNoteFetch(`/notes/${noteData._id}`, {
          ...putOptions<Note>(payload),
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

        dispatch({
          type: "UPDATE_NOTE",
          payload: { ...payload },
        });
        setNoteData(payload);
      } else {
        const localResult = localStorage.getItem(guestNotes);
        const parsedLocalNotes = localResult
          ? (JSON.parse(localResult) as Note[])
          : [];

        const updatedNotes = parsedLocalNotes.map((note) =>
          note._id === noteData._id ? { ...guestPayload } : note,
        );

        localStorage.setItem(guestNotes, JSON.stringify(updatedNotes));
        dispatch({ type: "UPDATE_NOTE", payload: guestPayload });
        setNoteData(guestPayload);
      }

      setEmptyFields([]);
      setIsUpdating(false);
    }
  };

  const cancelUpdateNote = (id: string) => {
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
      const response = await aoNoteFetch(`/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(`Could not find the note with an ID of ${id}`);

      dispatch({ type: "GET_NOTE", payload: result });
      setNoteData(result);
    };

    const getLocalNote = async () => {
      const existingLocalNotes = localStorage.getItem(guestNotes);

      if (existingLocalNotes) {
        const parsedLocalNotes = JSON.parse(existingLocalNotes) as Note[];

        const note = parsedLocalNotes.find((note) => note._id === id);

        if (note) {
          dispatch({ type: "GET_NOTE", payload: note });
          setNoteData(note);
        }
      }
    };
    if (user.role === "user") getNote();
    else getLocalNote();
  }, [user, dispatch, id]);

  return {
    noteData,
    setNoteData,
    dispatch,
    navigate,
    error,
    emptyFields,
    isUpdating,
    setIsUpdating,
    deleteNote,
    handleUpdateChange,
    updateNote,
    cancelUpdateNote,
  };
};
