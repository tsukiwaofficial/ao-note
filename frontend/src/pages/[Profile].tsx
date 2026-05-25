import UserProfile from "../features/user/UserProfile";
import Section from "../layouts/Section";
import { useEffect } from "react";
import {
  useUserAuthRole,
  useUserAuthToken,
} from "../features/user/useUserAuthStore";
import { useNoteActions, useNotes } from "../features/notes/useNoteStore";

export default function Profile() {
  const role = useUserAuthRole();
  const token = useUserAuthToken();
  const notes = useNotes();
  const { getNotes } = useNoteActions();

  useEffect(() => {
    getNotes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, token]);

  return (
    <Section className="flex gap-10">
      {role === "user" && <UserProfile role="user" />}
      {role === "guest" && <UserProfile role="guest" />}
      <div className="w-full h-max bg-surface shadow-lg rounded-xl px-10 py-8">
        <div className="w-max flex flex-col gap-2 items-center">
          <h6 className="text-primary">Total Notes</h6>
          <span>{notes.length}</span>
        </div>
      </div>
    </Section>
  );
}
