import type { HTMLAttributes } from "react";

type SectionProps = HTMLAttributes<HTMLElement>;

export default function Section({ children, className }: SectionProps) {
  return (
    <section className={`relative ao-note-container pt-30 pb-25 ${className}`}>
      {children}
    </section>
  );
}
