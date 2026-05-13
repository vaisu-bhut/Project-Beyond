import type { SectionKind } from "@/data/roadmap";

type Props = {
  id: SectionKind;
  number: string;        // "01", "02", "03"
  title: string;
  accentVar: string;
};

/**
 * Top-level break between Theory · Build Block · Exit Criteria.
 * Rendered between sections of a phase.
 */
export function SectionDivider({ id, number, title, accentVar }: Props) {
  return (
    <header
      id={id}
      className="scroll-mt-24 pt-24 md:pt-32 pb-4 mb-4 first:pt-0"
    >
      <div className="flex items-center gap-4 mb-5">
        <span
          className="font-mono text-[11px] tabular-nums uppercase tracking-[0.22em]"
          style={{ color: `var(${accentVar})` }}
        >
          Section {number}
        </span>
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, color-mix(in oklab, var(${accentVar}) 45%, transparent), transparent)`,
          }}
        />
      </div>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
    </header>
  );
}
