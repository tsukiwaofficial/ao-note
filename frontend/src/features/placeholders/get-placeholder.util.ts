import type { NotePlaceholder } from "../types/placeholder.type";

export const getPlaceholder = (array: NotePlaceholder[]) => {
  const random = Math.floor(Math.random() * array.length);

  const placeholder = array[random];

  return {
    title: placeholder.series,
    content: placeholder.quote + " — " + placeholder.character,
  };
};
