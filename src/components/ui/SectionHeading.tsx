import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  accentVar?: string;
  children?: ReactNode;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, accentVar, children, className }: Props) {
  return (
    <div className={cn("space-y-3 mb-8", className)}>
      {eyebrow && (
        <div className="flex items-center gap-2">
          <span
            className="size-1.5 rounded-full"
            style={accentVar ? { background: `var(${accentVar})` } : undefined}
          />
          <span className="text-xs uppercase tracking-[0.18em] text-foreground-muted font-mono">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
      {description && (
        <p className="text-base text-foreground-muted leading-relaxed max-w-3xl">{description}</p>
      )}
      {children}
    </div>
  );
}

export function SubHeading({ children, accentVar }: { children: ReactNode; accentVar?: string }) {
  return (
    <h3
      className="text-xl font-semibold text-foreground mt-10 mb-4 flex items-center gap-3 pb-2 border-b border-foreground/[0.08]"
    >
      <span
        className="inline-block w-1 h-5 rounded-sm"
        style={accentVar ? { background: `var(${accentVar})` } : { background: "currentColor" }}
      />
      {children}
    </h3>
  );
}
