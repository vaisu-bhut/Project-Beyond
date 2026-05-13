import Link from "next/link";
import { ArrowRight, Compass, GitBranch, Sparkles, Workflow } from "lucide-react";
import { NeuralWeb } from "@/components/hero/NeuralWeb";
import { ROADMAP, PHASES, BONUSES } from "@/data/roadmap";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-50">
            <NeuralWeb />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono mb-6 fade-up">
            <span className="size-1.5 rounded-full bg-emerald-400 pulse-glow" />
            <span className="text-foreground-muted">ML &amp; LLM Builder&apos;s Roadmap · 2026</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Stop reading.
            <br />
            <span className="gradient-text">Start shipping.</span>
          </h1>

          <p
            className="mt-6 text-lg md:text-xl text-foreground/70 max-w-2xl leading-relaxed fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Top-down. Theory upfront as a map, implementation as the bulk. Deep learning foundations
            through alignment, distributed training, reasoning, and biopharma — everything frontier
            labs and FAANG ML ask in 2026 interviews.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 fade-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="#phases"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
            >
              Explore the path
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/phase-1"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-strong text-foreground font-medium hover:border-white/20 transition-colors"
            >
              Start with Phase 1
            </Link>
          </div>

          <div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { icon: Compass, label: "Phases", value: "7 + 3 bonus" },
              { icon: Workflow, label: "Builds", value: "31" },
              { icon: GitBranch, label: "Cadence", value: "12–15 hrs/wk" },
              { icon: Sparkles, label: "Horizon", value: "14–18 mo" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 text-foreground-muted text-xs font-mono mb-1">
                  <Icon className="size-3.5" />
                  {label}
                </div>
                <div className="font-semibold text-foreground">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Path at a glance */}
      <section className="max-w-6xl mx-auto px-6 mt-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted font-mono mb-2">
              The full path
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">At a glance</h2>
          </div>
          <p className="text-sm text-foreground-muted hidden md:block max-w-sm text-right leading-relaxed">
            Each phase ships public artifacts. If it&apos;s not shipped, the phase isn&apos;t done.
          </p>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-foreground-muted text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Phase</th>
                <th className="px-5 py-3 text-left font-medium">Focus</th>
                <th className="px-5 py-3 text-left font-medium hidden md:table-cell">Duration</th>
                <th className="px-5 py-3 text-left font-medium hidden md:table-cell">Key Output</th>
              </tr>
            </thead>
            <tbody>
              {ROADMAP.map((node) => (
                <tr
                  key={node.id}
                  className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-5 py-3.5">
                    <Link href={`/${node.slug}`} className="flex items-center gap-2 font-mono text-xs">
                      <span
                        className="size-1.5 rounded-full"
                        style={{
                          background: `var(${node.accentVar})`,
                          boxShadow: `0 0 8px var(${node.accentVar})`,
                        }}
                      />
                      <span style={{ color: `var(${node.accentVar})` }} className="font-semibold">
                        {node.kind === "phase"
                          ? `Phase ${node.index}`
                          : `Bonus ${String.fromCharCode(64 + node.index - 7)}`}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/${node.slug}`}
                      className="text-foreground font-medium group-hover:text-foreground transition-colors"
                    >
                      {node.title}
                    </Link>
                    <p className="text-xs text-foreground-muted mt-0.5">{node.tagline}</p>
                  </td>
                  <td className="px-5 py-3.5 text-foreground-muted font-mono text-xs hidden md:table-cell">
                    {node.duration}
                  </td>
                  <td className="px-5 py-3.5 text-foreground/85 hidden md:table-cell">
                    {node.keyOutput}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Phase cards */}
      <section id="phases" className="max-w-6xl mx-auto px-6 mt-24 scroll-mt-20">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted font-mono mb-2">
            Phases 1–7
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The core path</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {PHASES.map((node, i) => (
            <PhaseCard key={node.id} node={node} index={i} />
          ))}
        </div>
      </section>

      {/* Bonus tracks */}
      <section className="max-w-6xl mx-auto px-6 mt-24">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted font-mono mb-2">
            Bonus Tracks
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Optional, slot anywhere</h2>
          <p className="text-foreground-muted mt-3 max-w-2xl leading-relaxed">
            Drop these in based on the roles you target. Graphs for retrieval-research and
            infrastructure ML; multimodal for frontier labs; recsys for FAANG product ML.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {BONUSES.map((node, i) => (
            <PhaseCard key={node.id} node={node} index={i} compact />
          ))}
        </div>
      </section>

      {/* Manifesto block */}
      <section className="max-w-6xl mx-auto px-6 mt-24">
        <div className="glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted font-mono mb-4">
              How to actually run this
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-3xl leading-tight">
              Shipping is the differentiator.
            </h2>
            <div className="mt-8 grid md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
              {[
                { day: "Mon · Wed · Fri", task: "2 hrs building. Code, debug, ship." },
                { day: "Tue · Thu", task: "1 hr theory skim or paper read." },
                { day: "Saturday", task: "4 hr deep build session." },
                { day: "Sunday", task: "1 hr writing. README, blog, or paper draft." },
              ].map((r) => (
                <div
                  key={r.day}
                  className="flex items-baseline gap-4 border-b border-white/[0.04] pb-3"
                >
                  <span className="text-foreground-muted font-mono text-xs uppercase tracking-wider w-32 shrink-0">
                    {r.day}
                  </span>
                  <span className="text-foreground/90">{r.task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PhaseCard({
  node,
  index,
  compact = false,
}: {
  node: (typeof ROADMAP)[number];
  index: number;
  compact?: boolean;
}) {
  const label =
    node.kind === "phase"
      ? `Phase ${node.index}`
      : `Bonus ${String.fromCharCode(64 + node.index - 7)}`;
  return (
    <Link
      href={`/${node.slug}`}
      className="group glass rounded-2xl p-6 transition-all hover:border-white/20 hover:translate-y-[-3px] relative overflow-hidden fade-up flex flex-col"
      style={{ animationDelay: `${0.05 + index * 0.04}s` }}
    >
      <div
        className="absolute -top-20 -right-20 size-48 rounded-full blur-3xl opacity-25 group-hover:opacity-40 transition-opacity"
        style={{ background: `var(${node.accentVar})` }}
      />

      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="size-1.5 rounded-full"
              style={{
                background: `var(${node.accentVar})`,
                boxShadow: `0 0 10px var(${node.accentVar})`,
              }}
            />
            <span
              className="text-xs uppercase tracking-[0.18em] font-mono font-semibold"
              style={{ color: `var(${node.accentVar})` }}
            >
              {label}
            </span>
          </div>
          <span className="text-xs text-foreground-muted font-mono">{node.duration}</span>
        </div>

        <h3 className="text-xl font-semibold tracking-tight mb-2 text-foreground">{node.title}</h3>
        <p className="text-sm text-foreground-muted leading-relaxed mb-5">{node.tagline}</p>

        {!compact && (
          <p className="text-sm text-foreground/70 leading-relaxed mb-5">{node.goal}</p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.04] mt-auto">
          <span className="text-xs text-foreground-muted font-mono">{node.builds} builds</span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground group-hover:gap-2 transition-all">
            Open
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
