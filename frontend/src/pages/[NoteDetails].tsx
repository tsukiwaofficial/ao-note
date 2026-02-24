import Section from "../layouts/Section";
import NoteDetailsForm from "../features/notes/NoteDetailsForm";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function NoteDetails() {
  const { id } = useParams();

  return (
    <Section>{id ? <NoteDetailsForm id={id} /> : <LoadingSpinner />}</Section>
  );
}
