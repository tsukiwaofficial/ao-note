import type { HTMLAttributes } from "react";

type SectionProps = HTMLAttributes<HTMLElement>;

export default function Section({ children, className }: SectionProps) {
  return (
    <section className={`container mx-auto pt-50 pb-25 ${className}`}>
      {children}
    </section>
  );
}
