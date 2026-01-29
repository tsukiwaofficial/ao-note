import { Link } from "react-router-dom";
import { buttonVariants } from "../../shared/config/ui-variants/button-variants.config";
import type { AnchorHTMLAttributes } from "react";

type BackBtnProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export default function BackBtn({ className }: BackBtnProps) {
  return (
    <Link
      to="/"
      className={`${buttonVariants({ variant: "outline" })} ${className}`}
    >
      Back
    </Link>
  );
}
