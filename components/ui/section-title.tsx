import { cn } from "@/lib/utils";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  className
}: SectionTitleProps) {
  return (
    <header className={cn("section-title", className)}>
      {eyebrow && <p className="section-title__eyebrow">{eyebrow}</p>}
      <h1 className="section-title__heading">{title}</h1>
      {subtitle && <p className="section-title__subtitle">{subtitle}</p>}
    </header>
  );
}
