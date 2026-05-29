"use client";
import React, { useState, useMemo } from "react";

/**
 * §3.5 — Matryoshka Representation Learning
 * Slider: truncation point over full 1024-dim vector
 * Shows: heatmap, quality curve, storage savings, and use-case decision matrix
 */

const S = {
  ink: "var(--foreground)",
  ink2: "color-mix(in oklab, var(--foreground) 85%, transparent)",
  ink3: "var(--foreground-muted)",
  bg: "var(--background-elevated)",
  bgSunk: "var(--background-soft)",
  rule: "var(--border)",
  ruleStrong: "var(--border-strong)",
  blue: "var(--accent-p2)",
  teal: "var(--accent-p4)",
  amber: "var(--accent-p5)",
  rose: "var(--accent-p6)",
  violet: "var(--accent-p1)",
  amberBg: "rgba(251, 191, 36, 0.10)",
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const fmt = (n: number, d = 2) => Number(n).toLocaleString(undefined, { maximumFractionDigits: d });

function Section({
  id, eyebrow, title, kicker, children,
}: {
  id: string; eyebrow: string; title: string; kicker?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-12" style={{ borderTop: `2px solid ${S.blue}` }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: S.blue, marginBottom: 8, fontFamily: "var(--mono)" }}>
        {eyebrow}
      </div>
      <h2 className="tracking-tight" style={{ fontSize: 32, fontWeight: 600, color: S.ink, lineHeight: 1.1, marginBottom: 12 }}>
        {title}
      </h2>
      {kicker && <p style={{ fontSize: 15, color: S.ink2, fontStyle: "italic", lineHeight: 1.6, marginBottom: 24 }}>{kicker}</p>}
      {children}
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 40, marginBottom: 8 }}>
      <h3 className="tracking-tight" style={{ fontSize: 22, fontWeight: 600, color: S.ink, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15.5, color: S.ink2, lineHeight: 1.7, marginBottom: 16 }}>{children}</p>;
}

function Callout({
  borderColor, labelColor, label, children,
}: {
  borderColor?: string; labelColor?: string; label: string; children: React.ReactNode;
}) {
  return (
    <div className="p2-glass p2-callout" style={{ borderLeft: `3px solid ${borderColor || S.blue}`, padding: "16px 20px", margin: "24px 0", borderRadius: "0 12px 12px 0" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, color: labelColor || S.blue, marginBottom: 6, fontFamily: "var(--mono)" }}>
        {label}
      </div>
      <div style={{ fontSize: 14.5, color: S.ink2, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function VisualCard({ children, caption, figNum }: { children: React.ReactNode; caption?: string; figNum?: string }) {
  return (
    <div style={{ margin: "28px 0" }}>
      {figNum && (
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 8 }}>
          {figNum}
        </div>
      )}
      <div className="p2-glass p2-visual-card" style={{ borderRadius: 12, padding: "24px" }}>{children}</div>
      {caption && (
        <div style={{ fontSize: 12, color: S.ink3, fontStyle: "italic", marginTop: 10, maxWidth: 680, margin: "10px auto 0", lineHeight: 1.6, padding: "0 16px", textAlign: "center" }}>
          {caption}
        </div>
      )}
    </div>
  );
}

function Mono({ children, color }: { children: React.ReactNode; color?: string }) {
  return <span style={{ fontFamily: "var(--mono)", color: color || S.ink, fontSize: "0.92em" }}>{children}</span>;
}

// ── Matryoshka Demo ──
function MatryoshkaDemo() {
  const FULL_DIM = 1024;
  const [dim, setDim] = useState(256);

  // Deterministic pseudo-random vector, front-loaded signal, decaying tail
  const fullVec = useMemo(() => {
    const v: number[] = [];
    let seed = 42;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < FULL_DIM; i++) {
      const decay = Math.exp(-i / 350);
      const sign = rand() > 0.5 ? 1 : -1;
      v.push(sign * decay * (0.3 + rand() * 0.7));
    }
    return v;
  }, []);

  // Quality curve: logarithmic saturation
  const qualityAt = (d: number) => {
    const maxQ = 0.78, minQ = 0.32;
    return minQ + (maxQ - minQ) *
      (Math.log10(d) - Math.log10(8)) /
      (Math.log10(FULL_DIM) - Math.log10(8));
  };

  // 128 cells representing the 1024-dim vector
  const CELLS = 128;
  const cellWidth = FULL_DIM / CELLS;
  const cellValues = useMemo(() => {
    return Array.from({ length: CELLS }, (_, i) => {
      const start = Math.floor(i * cellWidth);
      const end = Math.floor((i + 1) * cellWidth);
      let sum = 0;
      for (let j = start; j < end; j++) sum += Math.abs(fullVec[j]);
      return sum / (end - start);
    });
  }, [fullVec, cellWidth]);

  const activeCellCount = Math.round((dim / FULL_DIM) * CELLS);

  // Storage per million vectors at 4 bytes/float
  const fullStorageGB = (FULL_DIM * 4 * 1_000_000) / 1e9;
  const truncStorageGB = (dim * 4 * 1_000_000) / 1e9;
  const quality = qualityAt(dim);
  const fullQuality = qualityAt(FULL_DIM);
  const qualityPct = Math.round((quality / fullQuality) * 100);

  // Quality curve points for mini sparkline
  const dims = [8, 16, 32, 64, 128, 256, 512, 1024];
  const qualities = dims.map(qualityAt);
  const maxQ = Math.max(...qualities);
  const minQ = Math.min(...qualities);
  const sparkW = 400, sparkH = 80;
  const sparkX = (i: number) => (i / (dims.length - 1)) * sparkW;
  const sparkY = (q: number) => sparkH - ((q - minQ) / (maxQ - minQ)) * sparkH;
  const sparkPath = dims.map((d, i) => `${i === 0 ? "M" : "L"} ${sparkX(i)} ${sparkY(qualities[i])}`).join(" ");

  // Current dim's position on sparkline
  const curveIdx = dims.findIndex((d) => d >= dim);
  const sparkCurX = curveIdx >= 0 ? sparkX(curveIdx) : sparkW;
  const dimQualIdx = dims.reduce((closest, d, i) =>
    Math.abs(d - dim) < Math.abs(dims[closest] - dim) ? i : closest, 0);
  const sparkCurXInterp = sparkX(dimQualIdx);
  const sparkCurYInterp = sparkY(qualities[dimQualIdx]);

  return (
    <VisualCard figNum="FIG. 06 · Matryoshka · the nested-doll embedding" caption="Drag the slider to see how truncation affects storage and quality. MRL training ensures the first D dimensions are always the most informative.">
      {/* Vector heatmap */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: S.ink3 }}>
            embedding[0:{dim}]
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: S.ink3 }}>
            ← active · discarded →
          </div>
        </div>
        <div style={{ display: "flex", gap: 1.5, height: 52 }}>
          {cellValues.map((v, i) => {
            const isActive = i < activeCellCount;
            const intensity = clamp(v * 2, 0.1, 1);
            return (
              <div key={i} style={{
                flex: 1,
                background: isActive
                  ? `rgba(251, 191, 36, ${intensity})`
                  : `rgba(80, 70, 55, ${intensity * 0.35})`,
                borderRadius: 1,
                transition: "background 0.12s",
                border: "0.5px solid transparent",
              }} />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: S.ink3 }}>dim 0</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: S.amber }}>dim {dim}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: S.ink3 }}>dim {FULL_DIM}</span>
        </div>
      </div>

      {/* Slider */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: S.ink3, fontFamily: "var(--mono)", marginBottom: 8 }}>
          <span>Truncation point</span>
          <span style={{ color: S.amber }}>{dim} / {FULL_DIM} dims</span>
        </div>
        <input
          type="range" min="0" max="10" step="1"
          value={Math.log2(dim)}
          onChange={(e) => setDim(Math.pow(2, Number(e.target.value)))}
          style={{ width: "100%", accentColor: S.amber }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: S.ink3, fontFamily: "var(--mono)", marginTop: 4 }}>
          {[8, 16, 32, 64, 128, 256, 512, 1024].map((d) => (
            <span key={d} style={{ color: dim === d ? S.amber : undefined }}>{d}</span>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          {
            label: "Storage / 1M vecs",
            value: `${fmt(truncStorageGB, 2)} GB`,
            subValue: `vs ${fmt(fullStorageGB, 1)} GB full`,
            color: S.teal,
          },
          {
            label: "Storage savings",
            value: `${fmt(100 - (dim / FULL_DIM) * 100, 0)}%`,
            subValue: `${FULL_DIM / dim}× smaller`,
            color: S.amber,
          },
          {
            label: "Quality retained",
            value: `~${qualityPct}%`,
            subValue: "of full-dim NDCG",
            color: dim >= 256 ? S.teal : dim >= 64 ? S.amber : S.rose,
          },
        ].map(({ label, value, subValue, color }) => (
          <div key={label} className="p2-glass p2-card" style={{ borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 26, fontWeight: 600, color, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, color: S.ink3 }}>{subValue}</div>
          </div>
        ))}
      </div>

      {/* Quality sparkline */}
      <div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, marginBottom: 10 }}>
          Quality curve (NDCG vs dimension)
        </div>
        <svg viewBox={`0 0 ${sparkW} ${sparkH + 24}`} style={{ width: "100%", height: "auto" }}>
          {/* fill under curve */}
          <path
            d={`${sparkPath} L ${sparkW} ${sparkH} L 0 ${sparkH} Z`}
            fill={`${S.amber}12`}
          />
          {/* curve */}
          <path d={sparkPath} stroke={S.amber} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* current dim marker */}
          <circle cx={sparkCurXInterp} cy={sparkCurYInterp} r="5" fill={S.amber} />
          <line x1={sparkCurXInterp} y1={sparkCurYInterp} x2={sparkCurXInterp} y2={sparkH} stroke={S.amber} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          {/* x-axis labels */}
          {dims.map((d, i) => (
            <text key={d} x={sparkX(i)} y={sparkH + 18} textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill={d === dim ? S.amber : S.ink3}>
              {d >= 1024 ? "1k" : d}
            </text>
          ))}
        </svg>
      </div>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionMatryoshka() {
  return (
    <Section
      id="matryoshka"
      eyebrow="3.5 · Matryoshka Representation Learning"
      title="Matryoshka embeddings"
      kicker="Train once, truncate anywhere. The first D dimensions always contain the most semantically important information. The rest is progressive refinement."
    >
      <Para>
        Matryoshka Representation Learning (MRL), introduced by Kusupati et al. (2022),
        trains a single embedding model such that any prefix of the embedding is already
        a high-quality shorter embedding. You embed once at full dimensionality, then
        truncate to whatever size your latency and storage budget allows.
      </Para>

      <Para>
        Traditional embeddings have a fixed dimensionality chosen at training time.
        More dimensions → more quality → more storage → more compute for ANN search.
        MRL breaks this coupling: you pick the tradeoff at inference time, not training time.
      </Para>

      <MatryoshkaDemo />

      <Callout borderColor={S.amber} labelColor={S.amber} label="How MRL training works">
        During fine-tuning, the model is optimized with a{" "}
        <strong style={{ color: S.ink }}>nested loss</strong>: simultaneously minimize the
        contrastive loss using the first 8 dimensions, the first 16, 32, 64, 128, 256, 512, and
        1024 dimensions. This forces the model to pack the most discriminative information into
        the earliest dimensions. The later dimensions add precision, not a new representation.
      </Callout>

      <Sub title="Where each dimension count wins">
        <div className="p2-glass p2-card" style={{ borderRadius: 12, padding: "20px 24px", margin: "20px 0" }}>
          {[
            {
              dim: "64–128",
              useCase: "Fast re-ranking candidate pre-filter",
              tradeoff: "~70% quality at 16× storage reduction. Good enough to cut corpus from 1M → 10K before exact scoring.",
              color: S.rose,
            },
            {
              dim: "256",
              useCase: "Production RAG / semantic search",
              tradeoff: "~88% quality at 4× storage reduction. The sweet spot for most applications. Use this as your default.",
              color: S.amber,
            },
            {
              dim: "512",
              useCase: "High-stakes retrieval",
              tradeoff: "~95% quality at 2× storage reduction. Marginal gain over 256 for most tasks. Justified for legal/medical.",
              color: S.teal,
            },
            {
              dim: "1024",
              useCase: "Maximum precision benchmarking",
              tradeoff: "Full quality. Full cost. Only if 512 is measurably insufficient for your task.",
              color: S.blue,
            },
          ].map(({ dim, useCase, tradeoff, color }) => (
            <div key={dim} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${S.rule}` }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{dim}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: S.ink3, marginTop: 2 }}>dims</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: S.ink, marginBottom: 4 }}>{useCase}</div>
                <div style={{ fontSize: 13, color: S.ink2, lineHeight: 1.6 }}>{tradeoff}</div>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: S.ink3, fontStyle: "italic", marginTop: 4 }}>
            Quality percentages are approximate and task-dependent. Always evaluate on your own dataset.
          </div>
        </div>
      </Sub>

      <Callout borderColor={S.teal} labelColor={S.teal} label="Practical deployment: the two-index trick">
        A common production pattern: maintain two indexes — a small <Mono color={S.teal}>dim=128</Mono> index
        for fast coarse recall over the full corpus, and a large <Mono color={S.teal}>dim=768</Mono> index
        for precise reranking of the top-K. Both use the same underlying model.
        No cross-encoder overhead. Total storage is ~0.7× a single full-dimension index.
        This is how OpenAI's embedding documentation recommends using{" "}
        <Mono color={S.teal}>text-embedding-3-*</Mono> with its{" "}
        <Mono color={S.teal}>dimensions</Mono> parameter.
      </Callout>

      <Callout borderColor={S.violet} labelColor={S.violet} label="Models with MRL support (as of 2025)">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            "text-embedding-3-small",
            "text-embedding-3-large",
            "Nomic Embed",
            "GTE-Qwen2",
            "Snowflake Arctic-embed",
            "mxbai-embed-large",
            "BAAI/bge-m3",
          ].map((model) => (
            <span key={model} style={{
              fontFamily: "var(--mono)", fontSize: 11,
              background: `${S.violet}14`, color: S.violet,
              padding: "3px 10px", borderRadius: 4,
              border: `1px solid ${S.violet}30`,
            }}>
              {model}
            </span>
          ))}
        </div>
      </Callout>
    </Section>
  );
}
