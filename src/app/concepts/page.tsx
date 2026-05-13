import Link from "next/link";
import { CONCEPTS } from "@/data/concepts";
import { getNode } from "@/data/roadmap";

export default function ConceptsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted font-mono mb-3">
          Concept-to-Phase Map
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Where every <span className="gradient-text">buzzword</span> lives.
        </h1>
        <p className="mt-4 text-foreground-muted max-w-2xl leading-relaxed">
          The 2026 ML vocabulary mapped to the phases that cover it. Click any phase pill to
          jump in.
        </p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-white/[0.03] text-xs uppercase tracking-wider text-foreground-muted">
          <div className="col-span-8 font-medium">Concept</div>
          <div className="col-span-4 font-medium">Phase</div>
        </div>
        {CONCEPTS.map((c, i) => (
          <div
            key={c.name}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
            style={{ animationDelay: `${i * 0.015}s` }}
          >
            <div className="md:col-span-8 text-foreground/90 text-sm leading-relaxed">
              {c.name}
            </div>
            <div className="md:col-span-4 flex flex-wrap gap-1.5">
              {c.phases.map((slug) => {
                const node = getNode(slug);
                if (!node) return null;
                const label =
                  node.kind === "phase"
                    ? `Phase ${node.index}`
                    : `Bonus ${String.fromCharCode(64 + node.index - 7)}`;
                return (
                  <Link
                    key={slug}
                    href={`/${slug}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition-colors"
                    style={{
                      background: `color-mix(in oklab, var(${node.accentVar}) 10%, transparent)`,
                      borderColor: `color-mix(in oklab, var(${node.accentVar}) 35%, transparent)`,
                      color: `var(${node.accentVar})`,
                    }}
                  >
                    <span className="size-1.5 rounded-full" style={{ background: `var(${node.accentVar})` }} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
