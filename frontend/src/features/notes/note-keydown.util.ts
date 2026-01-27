import type { KeyboardEvent } from "react";

export const handleKeyDown = (
  event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  callback?: () => void,
) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    if (callback) callback();
  }
};
