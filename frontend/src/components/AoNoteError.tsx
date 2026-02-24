import type { HTMLAttributes } from "react";

type AoNoteError = HTMLAttributes<HTMLDivElement> & { error: string };

export default function AoNoteError({ error, className }: AoNoteError) {
  return (
    <div
      className={`${error && "opacity-100 rounded-lg text-error p-4 border-2 border-error bg-error/30 mb-4 h-max"} w-full ${className} transition-[opacity_height]`}
    >
      {error}
    </div>
  );
}
