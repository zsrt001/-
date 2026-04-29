import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type OptionButtonProps = {
  children: ReactNode;
  index?: number;
  selected?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function OptionButton({
  children,
  index,
  selected = false,
  className,
  type = "button",
  ...buttonProps
}: OptionButtonProps) {
  return (
    <button
      className={cn(
        "option-button",
        selected && "option-button--selected",
        className
      )}
      type={type}
      {...buttonProps}
    >
      {typeof index === "number" && (
        <span className="option-button__index">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <span className="option-button__text">{children}</span>
    </button>
  );
}
