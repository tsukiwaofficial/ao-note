import { createContext } from "react";
import type { NoteContextAction } from "./note.types";

export const NoteContext = createContext<NoteContextAction | null>(null);
