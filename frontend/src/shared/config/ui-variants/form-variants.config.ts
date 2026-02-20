import { cva } from "class-variance-authority";

export const formVariants = cva("w-full", {
  variants: {
    variant: {
      default:
        "flex flex-col xl:flex-row items-end xl:items-start justify-between gap-10",
      login: "px-15 py-20 bg-surface/80 backdrop-blur-lg",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
