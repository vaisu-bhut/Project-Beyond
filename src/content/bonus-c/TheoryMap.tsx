const ACCENT = "--accent-bC";

export default function BonusCTheoryMap() {
  return (
    <div className="space-y-12">
      <EmptySection accentVar={ACCENT} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Add your content here.

   Hierarchy (terminology):
     phase → section → chapter → sub-chapter
   Theory may grow chapters and sub-chapters; Build Block & Exit Criteria
   typically stay flat. Render chapter breaks via:

     import { ChapterDivider } from "@/components/book/ChapterDivider";
     <ChapterDivider number="1" title="..." accentVar={ACCENT} />

   Each sub-chapter is a <section>:

     <section id="sub-slug" className="scroll-mt-24">
       ... content ...
     </section>

   Then register the chapter / sub-chapter in src/data/roadmap.ts so it
   appears in the live-book sidebar TOC with its dotted number.

   Theme-matched primitives:
     import { FormulaCard }  from "@/components/ui/FormulaCard";
     import { BuildCard }    from "@/components/ui/BuildCard";
     import { Callout }      from "@/components/ui/Callout";
     import { ConceptTag }   from "@/components/ui/ConceptTag";
     import { NotesSection } from "@/components/ui/NotesSection";

   Phase accent: "--accent-bC"
   ──────────────────────────────────────────────────────────────────────── */

function EmptySection({ accentVar }: { accentVar: string }) {
  return (
    <div
      className="rounded-2xl border border-dashed border-white/[0.08] p-10 text-center"
      style={{
        background: `color-mix(in oklab, var(${accentVar}) 3%, transparent)`,
      }}
    >
      <p className="text-sm text-foreground-muted">This section is empty.</p>
      <p className="text-[11px] text-foreground-muted font-mono mt-2 opacity-70">
        Edit <span className="text-foreground/85">src/content/bonus-c/TheoryMap.tsx</span>
      </p>
    </div>
  );
}
