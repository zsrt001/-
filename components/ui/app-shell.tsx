import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  accent?: string;
  glowColor?: string;
};

export function AppShell({
  children,
  className,
  contentClassName,
  accent = "#c4a35d",
  glowColor = "rgba(196, 163, 93, 0.18)"
}: AppShellProps) {
  return (
    <main
      className={cn("atlas-shell", className)}
      style={
        {
          "--atlas-accent": accent,
          "--atlas-glow": glowColor
        } as CSSProperties
      }
    >
      <div className="atlas-shell__background" aria-hidden="true" />
      <div className="atlas-shell__overlay" aria-hidden="true" />
      <div className={cn("atlas-shell__content", contentClassName)}>
        {children}
        <p className="compliance-note">
          测试结果仅供娱乐、自我探索与社交分享参考。
        </p>
      </div>
    </main>
  );
}
