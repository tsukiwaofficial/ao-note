import type { HTMLAttributes } from "react";
import KuruKuru from "../assets/images/kurukuru.png";

type LoadingSpinnerProps = HTMLAttributes<HTMLDivElement>;

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div
      className={`pointer-events-none text-primary rounded-full max-w-50 overflow-hidden ${className}`}
    >
      <img src={KuruKuru} alt="herta" className="object-cover w-full h-full" />
    </div>
  );
}
