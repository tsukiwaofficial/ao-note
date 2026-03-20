import { useAuthContext } from "../features/user/useAuthContext";
import UserProfile from "../features/user/UserProfile";
import Section from "../layouts/Section";
import { useNoteContext } from "../features/notes/useNoteContext";
import { useEffect } from "react";
import { aoNoteFetch } from "../shared/utils/http/ao-note-fetch.util";
import { guestNotes } from "../features/user/user.config";
import type { Note } from "../features/notes/note.types";

export default function Profile() {
  const { state: userAuth } = useAuthContext();
  const { state: notes, dispatch } = useNoteContext();

  useEffect(() => {
    const getNotes = async () => {
      const response = await aoNoteFetch("/notes", {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      });
      const result = await response.json();

      if (response.ok) {
        dispatch({ type: "GET_NOTES", payload: result });
      }
    };

    const getLocalNotes = async () => {
      const localResult = localStorage.getItem(guestNotes);

      const parsedLocalNotes = localResult
        ? (JSON.parse(localResult) as Note[])
        : [];

      const sortedNotes = parsedLocalNotes.sort((noteA, noteB) => {
        const dateA = new Date(noteA.updatedAt as string).getTime();
        const dateB = new Date(noteB.updatedAt as string).getTime();
        return dateB - dateA;
      });

      dispatch({ type: "GET_NOTES", payload: sortedNotes });
    };

    if (userAuth.role === "user") getNotes();
    else if (userAuth.role === "guest") getLocalNotes();
  }, [userAuth, dispatch]);

  return (
    <Section className="flex gap-10">
      {userAuth.role === "user" && <UserProfile role="user" />}
      {userAuth.role === "guest" && <UserProfile role="guest" />}
      <div className="w-full h-max bg-surface shadow-lg rounded-xl px-10 py-8">
        <div className="w-max flex flex-col gap-2 items-center">
          <h6 className="text-primary">Total Notes</h6>
          <span>{notes.length}</span>
        </div>
      </div>
    </Section>
  );
}
