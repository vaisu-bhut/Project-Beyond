import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  number: number;
  title: string;
  duration: string;
  summary: string;
  checklist: string[];
  accentVar?: string;
  children?: ReactNode;
};

export function BuildCard({
  number,
  title,
  duration,
  summary,
  checklist,
  accentVar = "--accent-p2",
  children,
}: Props) {
  return (
    <div className="glass rounded-2xl overflow-hidden group hover:border-white/20 transition-all">
      <div
        className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between"
        style={{ background: `color-mix(in oklab, var(${accentVar}) 8%, transparent)` }}
      >
        <div className="flex items-center gap-4">
          <div
            className="size-11 rounded-xl flex items-center justify-center font-mono font-bold text-base shrink-0"
            style={{
              background: `color-mix(in oklab, var(${accentVar}) 18%, transparent)`,
              color: `var(${accentVar})`,
              border: `1px solid color-mix(in oklab, var(${accentVar}) 35%, transparent)`,
            }}
          >
            {String(number).padStart(2, "0")}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-foreground-muted font-mono">{duration}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 pl-4" style={{ borderColor: `var(${accentVar})` }}>
          {summary}
        </p>

        <ul className="space-y-2">
          {checklist.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground/85">
              <span
                className={cn(
                  "mt-1.5 size-1.5 rounded-full shrink-0 opacity-70",
                )}
                style={{ background: `var(${accentVar})` }}
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        {children}
      </div>
    </div>
  );
}
