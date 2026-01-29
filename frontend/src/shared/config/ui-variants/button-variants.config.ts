import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "rounded p-4 border-2 font-semibold hover:text-slate-200 transition-[colors_transform]",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary/50 text-slate-200 hover:bg-primary",
        icon: "rounded-full border-transparent",
        cta: "rounded-lg bg-primary text-slate-200 hover:bg-primary-variant transition-colors",
        outline: "text-primary border-primary hover:bg-primary  rounded-lg ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
