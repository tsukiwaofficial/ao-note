import { useReducer } from "react";
import { NoteContext } from "./NoteContext";
import type { Note, NoteAction } from "./note.types";

const noteReducer = (prevState: Note[], action: NoteAction): Note[] => {
  switch (action.type) {
    case "GET_NOTES":
      return [...action.payload];
    case "ADD_NOTE":
      return [action.payload, ...prevState];
    case "DELETE_NOTE":
      return prevState.filter((note) => note._id !== action.payload._id);
    case "UPDATE_NOTE":
      return prevState.map((note) =>
        note._id === action.payload._id ? action.payload : note,
      );
    default:
      return prevState;
  }
};

export default function NoteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(noteReducer, []);

  return (
    <NoteContext.Provider value={{ state, dispatch }}>
      {children}
    </NoteContext.Provider>
  );
}
