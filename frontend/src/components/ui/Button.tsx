import { type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { styleMerge } from "../../shared/utils/style-merge.util";
import { buttonVariants } from "../../shared/config/ui-variants/button-variants.config";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={styleMerge(buttonVariants({ variant, className }))}
        {...props}
      />
    );
  },
);
