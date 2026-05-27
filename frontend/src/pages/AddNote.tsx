import NoteForm from "../features/notes/NoteForm";
import NoteShortcuts from "../features/notes/NoteShortcuts";
import Section from "../layouts/Section";

export default function AddNote() {
  return (
    <Section className="flex flex-col justify-between">
      <NoteForm />
      <NoteShortcuts purposeParams="add" />
    </Section>
  );
}
