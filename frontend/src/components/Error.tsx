import type { HTMLAttributes } from "react";

type ErrorProps = HTMLAttributes<HTMLDivElement> & { error: string };

export default function Error({ error, ...props }: ErrorProps) {
  return (
    <div
      className={`${error && "opacity-100 rounded-lg text-error p-4 border-2 border-error bg-error/30 mb-4 h-max"} w-full transition-[opacity_height]`}
      {...props}
    >
      {error}
    </div>
  );
}
