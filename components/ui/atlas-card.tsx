import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AtlasCardProps = {
  children: ReactNode;
  className?: string;
};

export function AtlasCard({ children, className }: AtlasCardProps) {
  return (
    <section className={cn("atlas-card", className)}>
      <div className="atlas-card__content">{children}</div>
    </section>
  );
}
