"use client";
import React, { useState } from "react";

/**
 * §3.1 — The Fundamental Tension
 * Tradeoff plot: Joint Reasoning vs Offline Precomputation
 * Three architectures (Bi-encoder, ColBERT, Cross-encoder) as hoverable points
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
  amberSoft: "rgba(251, 191, 36, 0.12)",
  tealSoft: "rgba(52, 211, 153, 0.12)",
  roseSoft: "rgba(251, 113, 133, 0.12)",
  violetSoft: "rgba(167, 139, 250, 0.12)",
};

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

function Para({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15.5, color: S.ink2, lineHeight: 1.7, marginBottom: 16 }}>{children}</p>;
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 40, marginBottom: 8 }}>
      <h3 className="tracking-tight" style={{ fontSize: 22, fontWeight: 600, color: S.ink, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
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

// ── Tradeoff Plot ──
function TradeoffPlot() {
  const [hovered, setHovered] = useState<string | null>(null);

  const points = [
    { id: "bi",    label: "Bi-encoder",    x: 0.92, y: 0.42, color: S.teal,   desc: "Fast. Two separate forwards. One vector per doc. Precompute everything offline." },
    { id: "col",   label: "ColBERT",       x: 0.62, y: 0.72, color: S.violet, desc: "Middle ground. Token-level vectors stored offline, late interaction at query time." },
    { id: "cross", label: "Cross-encoder", x: 0.12, y: 0.96, color: S.rose,   desc: "Slow. Full attention between query and every doc token — can't precompute." },
  ];

  const W = 720, H = 380, PAD = 64;
  const px = (x: number) => PAD + x * (W - 2 * PAD);
  const py = (y: number) => H - PAD - y * (H - 2 * PAD);

  return (
    <VisualCard figNum="FIG. 01 · The architectural triangle" caption="A frontier curve, not three discrete options — any architecture lives somewhere on this tradeoff.">
      <div style={{ textAlign: "right", fontSize: 11, color: S.ink3, fontFamily: "var(--mono)", marginBottom: 8 }}>
        Hover a point
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        <defs>
          <pattern id="ch3-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="var(--border)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* background grid */}
        <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} fill="url(#ch3-grid)" />
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={S.ruleStrong} strokeWidth="1" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={S.ruleStrong} strokeWidth="1" />

        {/* axis labels */}
        <text x={W - PAD} y={H - PAD + 22} textAnchor="end" fontFamily="var(--mono)" fontSize="11" fill={S.ink3}>
          ← cheaper · OFFLINE PRECOMPUTATION FRIENDLY
        </text>
        <text x={PAD - 8} y={PAD - 14} textAnchor="start" fontFamily="var(--mono)" fontSize="11" fill={S.ink3}>
          JOINT REASONING POWER ↑
        </text>

        {/* Pareto frontier curve */}
        <path
          d={`M ${px(0.05)} ${py(0.98)} Q ${px(0.4)} ${py(0.78)}, ${px(0.65)} ${py(0.62)} T ${px(0.95)} ${py(0.38)}`}
          stroke={S.ruleStrong}
          strokeWidth="1"
          strokeDasharray="4 5"
          fill="none"
        />

        {/* Points */}
        {points.map((p) => {
          const cx = px(p.x), cy = py(p.y);
          const isHovered = hovered === p.id;
          return (
            <g
              key={p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={cx} cy={cy} r={isHovered ? 30 : 24} fill={p.color} opacity={0.10} />
              <circle cx={cx} cy={cy} r={isHovered ? 11 : 7} fill={p.color} opacity={isHovered ? 1 : 0.85} />
              <text
                x={cx} y={cy - 20}
                textAnchor="middle"
                fontFamily="var(--sans)"
                fontSize="14"
                fill={isHovered ? p.color : S.ink}
                fontWeight={isHovered ? 600 : 400}
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* hover description */}
        <text x={PAD + 12} y={H - PAD - 12} fontFamily="var(--sans)" fontSize="14" fill={S.ink2} fontStyle="italic">
          {hovered ? points.find((p) => p.id === hovered)!.desc : "Click or hover a point to see the tradeoff."}
        </text>
      </svg>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionArchitectureTriangle() {
  return (
    <Section
      id="embedding-architecture"
      eyebrow="3.1 · Embedding Architecture"
      title="The fundamental tension"
      kicker="Every embedding architecture makes the same bet: how much compute do you spend at query time vs. index time? The answer determines your entire retrieval stack."
    >
      <Para>
        Text embeddings collapse variable-length sequences into fixed-size vectors. The distance
        between two vectors approximates semantic similarity. That's the whole game — but
        <em> how</em> you build those vectors determines speed, quality, and operational cost.
      </Para>

      <Para>
        Three canonical architectures live on a single tradeoff curve:{" "}
        <strong style={{ color: S.teal }}>bi-encoders</strong> encode query and document independently
        and compare with a dot product,{" "}
        <strong style={{ color: S.violet }}>ColBERT</strong> stores token-level vectors for late
        interaction, and{" "}
        <strong style={{ color: S.rose }}>cross-encoders</strong> read query and document jointly in
        a single forward pass.
      </Para>

      <TradeoffPlot />

      <Callout borderColor={S.amber} labelColor={S.amber} label="The key insight">
        Offline precomputation is free at query time. Joint reasoning is expensive at query time.
        Every architecture is a bet on which matters more for your use case.{" "}
        <strong style={{ color: S.ink }}>
          For retrieval over millions of docs, you almost always start with a bi-encoder.
        </strong>{" "}
        For reranking a small candidate set, a cross-encoder dominates.
      </Callout>

      <Sub title="Why this decision dominates everything downstream">
        <Para>
          The architecture choice isn't just a quality tradeoff — it's an infrastructure decision.
          Bi-encoders require an <Mono>ANN</Mono> index (FAISS, Qdrant, Pinecone, Weaviate).
          Cross-encoders require batched inference at query time. ColBERT requires a specialized
          retrieval engine (<Mono>PLAID</Mono>, <Mono>RAGatouille</Mono>). The retrieval stack
          you choose in week one is the stack you'll operate for years.
        </Para>
        <div className="p2-glass p2-card" style={{ borderRadius: 12, padding: "20px 24px", margin: "20px 0" }}>
          {[
            { arch: "Bi-encoder", index: "ANN (FAISS / Qdrant / Pinecone)", latency: "~20ms", storage: "low — one vector/doc", quality: "good", color: S.teal },
            { arch: "ColBERT", index: "PLAID / RAGatouille", latency: "~80ms", storage: "high — one vector/token", quality: "very good", color: S.violet },
            { arch: "Cross-encoder", index: "none — runtime inference", latency: "O(corpus)", storage: "none", quality: "best", color: S.rose },
          ].map(({ arch, index, latency, storage, quality, color }) => (
            <div key={arch} style={{ display: "grid", gridTemplateColumns: "140px 1fr 80px 120px 80px", gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${S.rule}`, alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color, fontWeight: 600 }}>{arch}</span>
              <span style={{ fontSize: 13, color: S.ink3 }}>{index}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: S.ink2 }}>{latency}</span>
              <span style={{ fontSize: 12, color: S.ink3 }}>{storage}</span>
              <span style={{ fontSize: 12, color: S.teal }}>{quality}</span>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 80px 120px 80px", gap: 12 }}>
            {["Architecture", "Index Required", "Latency", "Storage", "Quality"].map((h) => (
              <span key={h} style={{ fontFamily: "var(--mono)", fontSize: 10, color: S.ink3, letterSpacing: "0.1em" }}>{h}</span>
            ))}
          </div>
        </div>
      </Sub>
    </Section>
  );
}
