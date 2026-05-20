import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { RoadmapNode } from "@/data/roadmap";

export function PhaseHeader({ node }: { node: RoadmapNode }) {
  const label =
    node.kind === "phase"
      ? `Phase ${node.index}`
      : `Bonus Track ${String.fromCharCode(64 + node.index - 7)}`;

  return (
    <div className="relative border-b border-foreground/[0.08]">
      {/* Thin accent hairline at the top — keeps the phase's identity without a heavy wash */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, var(${node.accentVar}) 50%, transparent 100%)`,
          opacity: 0.55,
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to roadmap
        </Link>

        <div className="flex items-center gap-2.5 mb-4">
          <span
            className="size-1.5 rounded-full"
            style={{ background: `var(${node.accentVar})` }}
          />
          <span
            className="text-[11px] uppercase tracking-[0.22em] font-mono font-semibold"
            style={{ color: `var(${node.accentVar})` }}
          >
            {label} · {node.duration}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
          {node.title}
        </h1>
        <p className="text-base md:text-lg text-foreground/70 max-w-3xl leading-relaxed mb-4">
          {node.tagline}
        </p>
        <p className="text-sm md:text-base text-foreground-muted max-w-3xl leading-relaxed">
          {node.goal}
        </p>
      </div>
    </div>
  );
}
