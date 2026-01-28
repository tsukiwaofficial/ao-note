import { formatDistanceToNow } from "date-fns";
import type { Note } from "./note.types";
import type { HTMLAttributes } from "react";

type NoteDateProps = HTMLAttributes<HTMLDivElement> &
  Omit<Note, "title" | "content">;

export default function NoteDate({
  className,
  createdAt,
  updatedAt,
}: NoteDateProps) {
  return (
    <div className={className}>
      {createdAt && (
        <span className="text-xs text-slate-400">
          Created{" "}
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            includeSeconds: true,
          })}
        </span>
      )}
      {updatedAt && createdAt !== updatedAt && (
        <span className="text-xs text-slate-400">
          {" "}
          (Updated{" "}
          {formatDistanceToNow(new Date(updatedAt), {
            addSuffix: true,
            includeSeconds: true,
          })}
          )
        </span>
      )}
    </div>
  );
}
