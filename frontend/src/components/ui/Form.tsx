import type { VariantProps } from "class-variance-authority";
import { forwardRef, type FormHTMLAttributes } from "react";
import { formVariants } from "../../shared/config/ui-variants/form-variants.config";
import { styleMerge } from "../../shared/utils/style-merge.util";

interface FormProps
  extends FormHTMLAttributes<HTMLFormElement>,
    VariantProps<typeof formVariants> {}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ variant, className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={styleMerge(formVariants({ variant, className }))}
        {...props}
      />
    );
  },
);
