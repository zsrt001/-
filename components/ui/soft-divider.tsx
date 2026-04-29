import { cn } from "@/lib/utils";

type SoftDividerProps = {
  className?: string;
};

export function SoftDivider({ className }: SoftDividerProps) {
  return <div className={cn("soft-divider", className)} role="separator" />;
}
