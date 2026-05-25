import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Note, NoteStore } from "./note.types";
import { aoNoteFetch } from "../../shared/utils/http/ao-note-fetch.util";
import { getUserAuthStore } from "../user/useUserAuthStore";
import { guestNotes } from "../user/user.config";
import {
  postOptions,
  putOptions,
} from "../../shared/utils/http/fetch-options.utils";
import { sortNotesByLatestDate } from "./note-sorter.utils";

const useNoteStore = create<NoteStore>((set) => ({
  note: {
    _id: "",
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  },
  notes: [],
  actions: {
    getNotes: async () => {
      const role = getUserAuthStore().role;
      const token = getUserAuthStore().token;

      if (role === "user") {
        const response = await aoNoteFetch("/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result: Note[] = await response.json();

        if (!response.ok) {
          return { response, result };
        } else {
          set(() => ({ notes: result }));

          return { response, result };
        }
      } else {
        const localResult = localStorage.getItem(guestNotes);

        const parsedLocalNotes = localResult
          ? (JSON.parse(localResult) as Note[])
          : [];

        const sortedNotes = sortNotesByLatestDate(parsedLocalNotes);

        set(() => ({ notes: sortedNotes }));

        return {
          response: new Response(
            JSON.stringify({ message: "Local notes retrieved successfully." }),
            { status: 200 },
          ),
          result: sortedNotes,
        };
      }
    },

    getNote: async (id: string) => {
      const role = getUserAuthStore().role;
      const token = getUserAuthStore().token;

      if (role === "user") {
        const response = await aoNoteFetch(`/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result: Note = await response.json();

        if (!response.ok) return { response, result };
        else {
          set(() => ({
            note: result,
          }));

          return { response, result };
        }
      } else {
        const existingLocalNotes = localStorage.getItem(guestNotes);

        if (existingLocalNotes) {
          const parsedLocalNotes = JSON.parse(existingLocalNotes) as Note[];

          const note = parsedLocalNotes.find((note) => note._id === id);

          if (note) {
            set(() => ({ note }));
          }
        }

        return {
          response: new Response(
            JSON.stringify({ message: "Local note retrieved successfully." }),
            { status: 200 },
          ),
          result: JSON.parse(existingLocalNotes || "[]").find(
            (note: Note) => note._id === id,
          ),
        };
      }
    },

    addNote: async (note) => {
      const role = getUserAuthStore().role;
      const token = getUserAuthStore().token;

      const payload = {
        title: note.title.trim(),
        content: note.content.trim(),
      };

      const guestPayload = {
        _id: uuidv4(),
        ...payload,
        createdAt: new Date().toISOString(),
      };

      if (role === "user") {
        const response = await aoNoteFetch("/api/notes", {
          ...postOptions<Note>(payload),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result: Note = await response.json();

        if (!response.ok) {
          return;
        }

        set(() => ({ note: result }));
      } else {
        const existingNotes = localStorage.getItem(guestNotes);
        const parsedLocalNotes = existingNotes ? JSON.parse(existingNotes) : [];
        parsedLocalNotes.push(guestPayload);
        localStorage.setItem(guestNotes, JSON.stringify(parsedLocalNotes));

        set(() => ({ note: guestPayload }));
      }
    },

    updateNote: async (note) => {
      const role = getUserAuthStore().role;
      const token = getUserAuthStore().token;

      const payload = {
        ...note,
        title: note.title.trim(),
        content: note.content.trim(),
      };

      const guestPayload = {
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      if (role === "user") {
        const response = await aoNoteFetch(`/api/notes/${note._id}`, {
          ...putOptions<Note>(payload),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result: Note = await response.json();

        if (!response.ok) throw new Error("Failed to update the note.");

        set(() => ({ note: result }));
      } else {
        const localResult = localStorage.getItem(guestNotes);
        const parsedLocalNotes = localResult
          ? (JSON.parse(localResult) as Note[])
          : [];

        const updatedNotes = parsedLocalNotes.map((note) =>
          note._id === guestPayload._id ? { ...guestPayload } : note,
        );

        localStorage.setItem(guestNotes, JSON.stringify(updatedNotes));
        set(() => ({ note: guestPayload }));
      }
    },

    deleteNote: async (id) => {
      const role = getUserAuthStore().role;
      const token = getUserAuthStore().token;

      if (!id)
        throw new Error(
          "ID is missing for this note to be able to be deleted.",
        );

      if (role === "user") {
        const response = await aoNoteFetch(`/api/notes/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to delete the note.");

        set((state) => ({
          notes: state.notes.filter((note) => note._id !== id),
        }));
      } else {
        const existingLocalNotes = localStorage.getItem(guestNotes);

        const localResult = existingLocalNotes
          ? JSON.parse(existingLocalNotes).filter(
              (note: Note) => note._id !== id,
            )
          : [];

        set(() => ({ notes: localResult }));
        localStorage.setItem(guestNotes, JSON.stringify(localResult));
      }
    },
  },
}));

export const useNote = () => useNoteStore((state) => state.note);
export const useNotes = () => useNoteStore((state) => state.notes);
export const useNoteActions = () => useNoteStore((state) => state.actions);

export const getNoteStore = () => useNoteStore.getState();
