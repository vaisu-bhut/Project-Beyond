type Props = {
  /** Chapter number within its section, e.g. "1", "2". */
  number: string;
  title: string;
  accentVar: string;
};

/**
 * Mid-level break inside a section (currently used inside Theory).
 * Visually lighter than `<SectionDivider />` so the section break stays dominant.
 */
export function ChapterDivider({ number, title, accentVar }: Props) {
  return (
    <div className="scroll-mt-24 mt-16 mb-2">
      <div className="flex items-baseline gap-3">
        <span
          className="font-mono text-[11px] tabular-nums uppercase tracking-[0.2em]"
          style={{ color: `var(${accentVar})` }}
        >
          Chapter {number}
        </span>
        <span
          className="h-px flex-1 self-center"
          style={{
            background: `linear-gradient(90deg, color-mix(in oklab, var(${accentVar}) 25%, transparent), transparent 80%)`,
          }}
        />
      </div>
      <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-foreground/95">
        {title}
      </h3>
    </div>
  );
}
