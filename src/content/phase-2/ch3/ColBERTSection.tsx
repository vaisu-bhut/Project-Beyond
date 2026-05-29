"use client";
import React, { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";

/**
 * §3.4 — ColBERT MaxSim — The Centerpiece
 * Animated MaxSim operator: query tokens "shop" doc for best match
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
  tealBg: "rgba(52, 211, 153, 0.08)",
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

// ── MaxSim Demo ──
function MaxSimDemo() {
  const queryTokens = ["boston", "marathon", "2017", "winner"];
  const docTokens = ["the", "2017", "boston", "marathon", "was", "won", "by", "a", "kenyan"];

  // Pre-computed token-level cosine sims (hand-crafted to be intuitive)
  const sim: number[][] = [
    [0.10, 0.18, 0.92, 0.45, 0.05, 0.12, 0.04, 0.02, 0.28], // boston
    [0.05, 0.30, 0.42, 0.95, 0.08, 0.22, 0.06, 0.03, 0.18], // marathon
    [0.04, 0.98, 0.18, 0.25, 0.02, 0.05, 0.03, 0.02, 0.06], // 2017
    [0.08, 0.15, 0.18, 0.22, 0.10, 0.78, 0.12, 0.04, 0.35], // winner
  ];

  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (step >= queryTokens.length) { setPlaying(false); return; }
    const t = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [step, playing]);

  const play = () => {
    if (step >= queryTokens.length) {
      setStep(-1);
      setTimeout(() => { setStep(0); setPlaying(true); }, 80);
    } else {
      setStep(0);
      setPlaying(true);
    }
  };

  const W = 720, H = 340;
  const qY = 60, dY = 272;
  const qSpacing = W / (queryTokens.length + 1);
  const dSpacing = W / (docTokens.length + 1);
  const qX = (i: number) => (i + 1) * qSpacing;
  const dX = (i: number) => (i + 1) * dSpacing;

  const activeRow = step >= 0 && step < queryTokens.length ? step : -1;
  const completed = step >= queryTokens.length;

  const maxes = queryTokens.map((_, i) => {
    const row = sim[i];
    const maxIdx = row.indexOf(Math.max(...row));
    return { qIdx: i, dIdx: maxIdx, value: row[maxIdx] };
  });

  const visibleMaxes = completed
    ? maxes
    : activeRow >= 0
    ? maxes.slice(0, activeRow + 1)
    : [];

  const totalScore = visibleMaxes.reduce((s, m) => s + m.value, 0);

  const descriptions: Record<number, string> = {
    [-1]: "For each query token, find its best-matching doc token. Sum the maxes. That's the entire scoring function.",
    [0]: '"boston" finds itself in the doc — high cosine. Other doc tokens contribute weakly.',
    [1]: '"marathon" lights up against "marathon". Term-level matching that a bi-encoder\'s single dot product would smear.',
    [2]: '"2017" matches "2017" almost perfectly — temporal grounding that pooled-vector approaches lose.',
    [3]: '"winner" loosely matches "won". Not perfect, but the morphological link comes through.',
  };

  return (
    <VisualCard
      figNum="FIG. 05 · ColBERT MaxSim · the late-interaction aha"
      caption="Each query token finds its best-matching doc token. The sum of maxes is the ColBERT score."
    >
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }}>
        <button className="p2-btn-pill" onClick={() => { setStep(-1); setPlaying(false); }}>
          <RotateCcw size={12} style={{ display: "inline" }} /> Reset
        </button>
        <button
          className={`p2-btn-pill ${!playing ? "p2-btn-pill-active" : ""}`}
          onClick={play}
          disabled={playing}
        >
          {playing ? "Running…" : step >= queryTokens.length ? "▸ Replay" : "▸ Play MaxSim"}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {/* Row labels */}
        <text x="14" y={qY + 4} fontFamily="var(--mono)" fontSize="9" fill={S.ink3} letterSpacing="1">QUERY</text>
        <text x="14" y={dY + 4} fontFamily="var(--mono)" fontSize="9" fill={S.ink3} letterSpacing="1">DOC</text>

        {/* All similarity lines for active row */}
        {activeRow >= 0 && !completed && sim[activeRow].map((s, j) => {
          const opacity = clamp(s * 1.2, 0.05, 0.95);
          const width = clamp(s * 5, 0.4, 5);
          return (
            <line key={j}
              x1={qX(activeRow)} y1={qY + 18}
              x2={dX(j)} y2={dY - 18}
              stroke={S.amber} strokeWidth={width}
              opacity={opacity} strokeLinecap="round"
            />
          );
        })}

        {/* Max connections for completed rows */}
        {(completed ? maxes : visibleMaxes.slice(0, activeRow)).map((m, i) => (
          <line key={i}
            x1={qX(m.qIdx)} y1={qY + 18}
            x2={dX(m.dIdx)} y2={dY - 18}
            stroke={S.amber} strokeWidth={clamp(m.value * 5, 1, 5)}
            opacity={0.7} strokeLinecap="round"
          />
        ))}

        {/* Highlight max for active row */}
        {activeRow >= 0 && !completed && (() => {
          const m = maxes[activeRow];
          return (
            <line
              x1={qX(m.qIdx)} y1={qY + 18}
              x2={dX(m.dIdx)} y2={dY - 18}
              stroke={S.teal} strokeWidth={clamp(m.value * 5, 2, 6) + 1}
              opacity={1} strokeLinecap="round"
            />
          );
        })()}

        {/* Query tokens */}
        {queryTokens.map((tok, i) => {
          const isActive = i === activeRow;
          const isDone = activeRow > i || completed;
          return (
            <g key={`q-${i}`}>
              <rect x={qX(i) - 48} y={qY - 18} width="96" height="36" rx="4"
                fill={isActive ? S.amberBg : isDone ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)"}
                stroke={isActive ? S.amber : isDone ? `${S.amber}60` : S.rule}
                strokeWidth={isActive ? 1.5 : 1}
              />
              <text x={qX(i)} y={qY + 5} textAnchor="middle"
                fontFamily="var(--mono)" fontSize="12"
                fill={isActive ? S.amber : isDone ? S.ink : S.ink2}
                fontWeight={isActive ? 600 : 400}
              >
                {tok}
              </text>
            </g>
          );
        })}

        {/* Doc tokens */}
        {docTokens.map((tok, i) => {
          const isMax = visibleMaxes.find((m) => m.dIdx === i);
          return (
            <g key={`d-${i}`}>
              <rect x={dX(i) - 28} y={dY - 18} width="56" height="36" rx="4"
                fill={isMax ? S.tealBg : "rgba(255,255,255,0.02)"}
                stroke={isMax ? S.teal : S.rule}
                strokeWidth={isMax ? 1.5 : 1}
              />
              <text x={dX(i)} y={dY + 5} textAnchor="middle"
                fontFamily="var(--mono)" fontSize="11"
                fill={isMax ? S.teal : S.ink2}
                fontWeight={isMax ? 600 : 400}
              >
                {tok}
              </text>
            </g>
          );
        })}

        {/* Score badge */}
        <g transform={`translate(${W - 190}, ${H - 58})`}>
          <rect x="0" y="0" width="180" height="48" rx="6"
            fill="rgba(255,255,255,0.03)" stroke={S.ruleStrong} strokeWidth="1" />
          <text x="12" y="18" fontFamily="var(--mono)" fontSize="9" fill={S.ink3} letterSpacing="1">
            SCORE = Σ MAX
          </text>
          <text x="168" y="38" textAnchor="end" fontFamily="var(--sans)" fontSize="24" fill={S.amber} fontWeight="600">
            {fmt(totalScore, 2)}
          </text>
        </g>
      </svg>

      <div style={{ fontSize: 13.5, color: S.ink3, marginTop: 8, lineHeight: 1.6, fontStyle: "italic" }}>
        {completed
          ? "All four query tokens contribute their best match. This per-token specificity is exactly what bi-encoders give up — and what cross-encoders pay for with quadratic compute."
          : descriptions[activeRow]}
      </div>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionColBERT() {
  return (
    <Section
      id="colbert-maxsim"
      eyebrow="3.4 · ColBERT & MaxSim"
      title="ColBERT: late interaction"
      kicker="Store a vector per token, not per document. At query time, match each query token to its best doc token. Sum the maxes. That's it."
    >
      <Para>
        ColBERT (Contextualized Late Interaction over BERT) is a middle path between the
        bi-encoder and the cross-encoder. Like a bi-encoder, document vectors are precomputed
        offline — but at the token level, not the document level. Like a cross-encoder,
        query and document tokens interact at scoring time — but only as a lightweight
        dot-product lookup, not a full transformer forward pass.
      </Para>

      <MaxSimDemo />

      <Callout borderColor={S.violet} labelColor={S.violet} label="Why MaxSim preserves what bi-encoders lose">
        A bi-encoder pools all token-level information into one vector. The year{" "}
        <Mono color={S.violet}>2017</Mono> and the word{" "}
        <Mono color={S.violet}>marathon</Mono> get averaged together and become
        indistinguishable from a document that happens to have similar average semantics.
        MaxSim preserves exact token matches — temporal specificity, entity grounding,
        morphological similarity — at a storage cost of{" "}
        <Mono>num_tokens × dim</Mono> per document instead of <Mono>dim</Mono>.
      </Callout>

      <Sub title="The PLAID engine — making ColBERT practical">
        <Para>
          Vanilla ColBERT still requires scoring each query token against every doc token
          in the entire corpus at query time. PLAID (Progressive Late Interaction via Dynamic
          pruning) speeds this up with two tricks:
        </Para>
        <div className="p2-glass p2-card" style={{ borderRadius: 12, padding: "20px 24px", margin: "20px 0" }}>
          {[
            {
              title: "Centroid-based coarse filtering",
              desc: "Token vectors are clustered offline. At query time, only docs containing at least one token close to a query centroid are scored exactly. The rest are pruned early.",
              color: S.violet,
            },
            {
              title: "Progressive candidate refinement",
              desc: "PLAID scores candidates in passes of increasing precision, eliminating unlikely candidates cheaply before applying the full MaxSim. 95%+ of docs never see the slow path.",
              color: S.teal,
            },
          ].map(({ title, desc, color }) => (
            <div key={title} style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
              <div style={{ width: 4, flexShrink: 0, alignSelf: "stretch", background: color, borderRadius: 2 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: S.ink, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 13.5, color: S.ink2, lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Sub>

      <Callout borderColor={S.amber} labelColor={S.amber} label="Practical ColBERT: RAGatouille">
        For most teams the easiest entry point is{" "}
        <Mono color={S.amber}>RAGatouille</Mono> — a Python library that wraps ColBERT v2 +
        PLAID into a{" "}
        <Mono color={S.amber}>.index()</Mono> / <Mono color={S.amber}>.search()</Mono> API.
        It handles chunking, indexing, and compression. The storage overhead versus a
        bi-encoder is ~10–30× depending on max token length — plan your infrastructure accordingly.
      </Callout>
    </Section>
  );
}
