import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "info" | "warning" | "success" | "build" | "awareness";

const STYLES: Record<Variant, string> = {
  info: "border-blue-500/30 bg-blue-500/[0.04]",
  warning: "border-amber-500/30 bg-amber-500/[0.04]",
  success: "border-emerald-500/30 bg-emerald-500/[0.04]",
  build: "border-emerald-500/30 bg-emerald-500/[0.04]",
  awareness: "border-blue-500/30 bg-blue-500/[0.04]",
};

const LABELS: Record<Variant, string> = {
  info: "Info",
  warning: "Exit Criteria",
  success: "Done",
  build: "Build",
  awareness: "Awareness Map",
};

type Props = {
  variant?: Variant;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Callout({ variant = "info", title, children, className }: Props) {
  return (
    <div className={cn("rounded-xl border p-5", STYLES[variant], className)}>
      {title !== undefined && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-widest text-foreground-muted font-mono">
            {LABELS[variant]}
          </span>
          {title && <h4 className="font-semibold text-foreground">{title}</h4>}
        </div>
      )}
      <div className="text-foreground/90 leading-relaxed">{children}</div>
    </div>
  );
}
