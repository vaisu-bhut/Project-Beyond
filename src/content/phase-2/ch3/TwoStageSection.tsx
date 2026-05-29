"use client";
import React, { useState } from "react";

/**
 * §3.3 — Cross-Encoder Architecture & Two-Stage Pipeline
 * TwoStagePipeline: corpus→candidates→LLM funnel with latency calculator
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
};

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

// ── Two-Stage Pipeline ──
function TwoStagePipeline() {
  const [corpusSize, setCorpusSize] = useState(1_000_000);
  const [topK, setTopK] = useState(100);
  const [finalK, setFinalK] = useState(10);

  // Illustrative latency constants
  const biEncodeMs = 20;      // ANN lookup
  const crossEncodeMs = 8;    // per doc pair
  const biStageCost = biEncodeMs;
  const reStageCost = topK * crossEncodeMs;
  const totalLatency = biStageCost + reStageCost;
  const naiveLatency = corpusSize * crossEncodeMs;

  const formatTime = (ms: number) =>
    ms >= 86_400_000 ? `${fmt(ms / 86_400_000, 1)} days`
    : ms >= 3_600_000 ? `${fmt(ms / 3_600_000, 1)} hr`
    : ms >= 60_000 ? `${fmt(ms / 60_000, 1)} min`
    : ms >= 1000 ? `${fmt(ms / 1000, 1)} s`
    : `${fmt(ms, 0)} ms`;

  return (
    <VisualCard figNum="FIG. 04 · Two-stage retrieval · the practical compromise">
      {/* Funnel SVG */}
      <svg viewBox="0 0 720 260" style={{ width: "100%", height: "auto", marginBottom: 12 }}>
        <defs>
          <linearGradient id="ch3-funnel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-p4)" stopOpacity="0.18" />
            <stop offset="50%" stopColor="var(--accent-p1)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent-p5)" stopOpacity="0.20" />
          </linearGradient>
        </defs>

        {/* Funnel shape */}
        <path
          d="M 40 50 L 320 50 L 460 90 L 540 115 L 660 128 L 660 148 L 540 165 L 460 190 L 320 228 L 40 228 Z"
          fill="url(#ch3-funnel)" stroke={S.ruleStrong} strokeWidth="0.5"
        />

        {/* Stage 1 */}
        <text x="180" y="34" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill={S.teal} letterSpacing="1" fontWeight="600">
          STAGE 1 · BI-ENCODER
        </text>
        <text x="180" y="142" textAnchor="middle" fontFamily="var(--sans)" fontSize="28" fill={S.teal} fontWeight="600">
          {corpusSize.toLocaleString()}
        </text>
        <text x="180" y="164" textAnchor="middle" fontFamily="var(--sans)" fontSize="13" fill={S.ink2} fontStyle="italic">
          documents
        </text>
        <text x="180" y="196" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill={S.ink3}>
          ANN over precomputed vectors
        </text>

        {/* Stage 2 */}
        <text x="490" y="34" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill={S.violet} letterSpacing="1" fontWeight="600">
          STAGE 2 · RERANK
        </text>
        <text x="490" y="142" textAnchor="middle" fontFamily="var(--sans)" fontSize="24" fill={S.violet} fontWeight="600">
          {topK}
        </text>
        <text x="490" y="162" textAnchor="middle" fontFamily="var(--sans)" fontSize="12" fill={S.ink2} fontStyle="italic">
          candidates
        </text>
        <text x="490" y="190" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill={S.ink3}>
          cross-encoder · full attention
        </text>

        {/* Output */}
        <text x="648" y="34" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill={S.amber} letterSpacing="1" fontWeight="600">
          OUTPUT
        </text>
        <text x="648" y="142" textAnchor="middle" fontFamily="var(--sans)" fontSize="22" fill={S.amber} fontWeight="600">
          {finalK}
        </text>
        <text x="648" y="162" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill={S.ink2} fontStyle="italic">
          to LLM
        </text>

        {/* Arrows */}
        <line x1="330" y1="140" x2="420" y2="140" stroke={S.ink3} strokeWidth="1" strokeDasharray="3 4" />
        <line x1="560" y1="140" x2="630" y2="140" stroke={S.ink3} strokeWidth="1" strokeDasharray="3 4" />
        <polygon points="424,136 420,140 424,144" fill={S.ink3} />
        <polygon points="634,136 630,140 634,144" fill={S.ink3} />
      </svg>

      {/* Sliders */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 20 }}>
        {[
          {
            label: "Corpus size",
            value: corpusSize.toLocaleString(),
            color: S.teal,
            min: 3, max: 9, step: 1,
            sliderVal: Math.log10(corpusSize),
            onChange: (v: number) => setCorpusSize(Math.pow(10, v)),
          },
          {
            label: "Stage-1 top-K",
            value: topK.toString(),
            color: S.violet,
            min: 20, max: 500, step: 10,
            sliderVal: topK,
            onChange: (v: number) => setTopK(v),
          },
          {
            label: "Final K (to LLM)",
            value: finalK.toString(),
            color: S.amber,
            min: 3, max: 50, step: 1,
            sliderVal: finalK,
            onChange: (v: number) => setFinalK(v),
          },
        ].map(({ label, value, color, min, max, step, sliderVal, onChange }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: S.ink3, marginBottom: 6, fontFamily: "var(--mono)" }}>
              <span>{label}</span>
              <span style={{ color }}>{value}</span>
            </div>
            <input
              type="range"
              min={min} max={max} step={step} value={sliderVal}
              onChange={(e) => onChange(Number(e.target.value))}
              style={{ width: "100%", accentColor: color }}
            />
          </div>
        ))}
      </div>

      {/* Latency comparison */}
      <div style={{
        marginTop: 24, padding: 16,
        background: "var(--background-soft)", borderRadius: 8,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
      }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, marginBottom: 4 }}>
            Naïve: cross-encode everything
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 26, color: S.rose, fontWeight: 600 }}>
            {formatTime(naiveLatency)}
          </div>
          <div style={{ fontSize: 12, color: S.ink3, fontStyle: "italic" }}>
            forward pass × every doc in corpus
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, marginBottom: 4 }}>
            Two-stage: bi-encoder + rerank
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 26, color: S.teal, fontWeight: 600 }}>
            {formatTime(totalLatency)}
          </div>
          <div style={{ fontSize: 12, color: S.ink3, fontStyle: "italic" }}>
            {fmt(naiveLatency / totalLatency, 0)}× speedup
          </div>
        </div>
      </div>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionTwoStage() {
  return (
    <Section
      id="two-stage-retrieval"
      eyebrow="3.3 · Cross-Encoder & Two-Stage Retrieval"
      title="Cross-encoders and the retrieval funnel"
      kicker="Cross-encoders have the best accuracy by far. They also can't scale past a few hundred documents. The solution: use them only as a final reranker."
    >
      <Para>
        A cross-encoder concatenates query and document as a single input and runs a single
        forward pass over both simultaneously. Every query token can attend to every document
        token. This is the same architecture as reading comprehension — and it's where the
        quality ceiling lives.
      </Para>

      <Para>
        The catch: you can't precompute anything. Every query-document pair requires a fresh
        forward pass. For a corpus of 1 million documents, that's 1 million forward passes per
        query. At 8ms per pass, that's 2+ hours per query.
      </Para>

      <Sub title="The two-stage solution">
        <Para>
          Use a bi-encoder to retrieve a small candidate set cheaply via ANN, then apply a
          cross-encoder to rerank only the candidates. You get most of the cross-encoder's
          quality at a fraction of the cost.
        </Para>
        <TwoStagePipeline />
      </Sub>

      <Callout borderColor={S.teal} labelColor={S.teal} label="The quality gain from reranking">
        In practice, cross-encoder reranking over top-100 bi-encoder candidates recovers{" "}
        <strong style={{ color: S.ink }}>80–90% of the quality gap</strong> between bi-encoder
        and full cross-encoder scoring. The remaining 10–20% requires retrieving more candidates
        (higher top-K) or a better bi-encoder to avoid losing the right answer in stage 1.
      </Callout>

      <Callout borderColor={S.rose} labelColor={S.rose} label="The critical failure mode">
        If the correct document is not in the stage-1 top-K, reranking cannot save you — you're
        reranking a set that doesn't contain the answer. This is{" "}
        <strong style={{ color: S.ink }}>recall@K</strong>: the fraction of queries where the
        correct answer is in the top-K. Optimize the bi-encoder for recall@K, not MRR. A
        better reranker with low bi-encoder recall is worthless.
      </Callout>

      <Sub title="When cross-encoders win alone">
        <div className="p2-glass p2-card" style={{ borderRadius: 12, padding: "20px 24px", margin: "20px 0" }}>
          {[
            { case: "Legal / medical document review", reason: "Corpus is small (thousands, not millions). Correctness justifies cost." },
            { case: "Deduplication / near-duplicate detection", reason: "Every pair must be scored — no ANN shortcut." },
            { case: "Factual QA over a small KB", reason: "High-stakes retrieval where a bi-encoder's misses are unacceptable." },
            { case: "Training signal generation", reason: "Cross-encoder scores used as soft labels for distilling a bi-encoder." },
          ].map(({ case: c, reason }) => (
            <div key={c} style={{ display: "flex", gap: 16, marginBottom: 14, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, background: `${S.rose}15`, color: S.rose, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap", marginTop: 2 }}>
                {c}
              </span>
              <span style={{ fontSize: 14, color: S.ink2, lineHeight: 1.6 }}>{reason}</span>
            </div>
          ))}
        </div>
      </Sub>
    </Section>
  );
}
