import { cn } from "@/lib/utils";

type StarProgressProps = {
  value: number;
  total?: number;
  label?: string;
  className?: string;
};

export function StarProgress({
  value,
  total = 12,
  label,
  className
}: StarProgressProps) {
  const activeCount = Math.max(0, Math.min(total, Math.round(value)));

  return (
    <div
      className={cn("star-progress", className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={activeCount}
    >
      {label && (
        <div className="star-progress__label">
          <span>{label}</span>
          <span>
            {activeCount}/{total}
          </span>
        </div>
      )}
      <div className="star-progress__track">
        {Array.from({ length: total }).map((_, index) => (
          <span
            className={cn(
              "star-progress__dot",
              index < activeCount && "star-progress__dot--active"
            )}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
