import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type SealMarkProps = {
  label?: string;
  className?: string;
  accent?: string;
};

export function SealMark({
  label = "鉴",
  className,
  accent = "#a5332a"
}: SealMarkProps) {
  return (
    <span
      className={cn("seal-mark", className)}
      style={{ "--seal-accent": accent } as CSSProperties}
      aria-label={label}
    >
      {label}
    </span>
  );
}
