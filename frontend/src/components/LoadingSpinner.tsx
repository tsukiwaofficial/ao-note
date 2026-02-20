import type { HTMLAttributes } from "react";
import { FaSpinner } from "react-icons/fa6";

type LoadingSpinnerProps = HTMLAttributes<HTMLDivElement>;

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={`text-primary ${className}`}>
      <FaSpinner className="animate-spin" />
    </div>
  );
}
