import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type GoldButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "quiet";
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function GoldButton({
  children,
  href,
  variant = "solid",
  className,
  type = "button",
  ...buttonProps
}: GoldButtonProps) {
  const classes = cn(
    "gold-button",
    variant === "quiet" && "gold-button--quiet",
    className
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  );
}
