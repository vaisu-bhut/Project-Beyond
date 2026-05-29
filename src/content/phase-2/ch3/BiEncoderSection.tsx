"use client";
import React, { useState, useEffect } from "react";
import { Cpu } from "lucide-react";

/**
 * §3.2 — Bi-Encoder Mechanics
 * BiEncoderDemo: animated pipeline (encode query, encode doc, compute cosine)
 * PoolingDemo: CLS vs Mean vs Max token collapse visualized
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
  tealBg: "rgba(52, 211, 153, 0.08)",
  violetBg: "rgba(167, 139, 250, 0.08)",
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

// ── VecBar ──
function VecBar({ vec, color, active }: { vec: number[]; color: string; active: boolean }) {
  const MAX_H = 28;
  return (
    <div style={{
      display: "flex", gap: 2, alignItems: "center",
      height: MAX_H * 2 + 8, padding: "2px 0", position: "relative",
    }}>
      <div style={{
        position: "absolute", left: 0, right: 0, top: "50%",
        height: 1, background: S.rule,
        transform: "translateY(-0.5px)", zIndex: 0,
      }} />
      {vec.map((v, i) => {
        const h = Math.abs(v) * MAX_H;
        const isPositive = v >= 0;
        return (
          <div key={i} style={{
            width: 14, height: MAX_H * 2,
            position: "relative", display: "flex",
            flexDirection: "column", justifyContent: "center",
            alignItems: "center", zIndex: 1,
          }}>
            <div style={{
              position: "absolute",
              top: isPositive ? `calc(50% - ${h}px)` : "50%",
              width: 14, height: h,
              background: active ? color : S.ruleStrong,
              opacity: active ? (isPositive ? 1 : 0.6) : 0.35,
              borderRadius: 1,
              transition: "all 0.5s ease",
            }} />
          </div>
        );
      })}
    </div>
  );
}

// ── Bi-Encoder Demo ──
function BiEncoderDemo() {
  const [activeExample, setActiveExample] = useState(0);
  const [phase, setPhase] = useState(0); // 0: idle, 1: encoding, 2: vectors, 3: similarity

  const examples = [
    {
      query: "best pizza in Brookline",
      doc: "Boston neighborhoods including Brookline have many pizzerias",
      qVec: [0.42, -0.18, 0.71, 0.05, -0.33, 0.62, 0.21, -0.49],
      dVec: [0.38, -0.21, 0.65, 0.12, -0.29, 0.58, 0.18, -0.44],
      sim: 0.96,
    },
    {
      query: "how do transformers work",
      doc: "A toaster oven uses electric coils to brown bread",
      qVec: [0.62, 0.31, -0.45, 0.18, 0.52, -0.21, 0.38, 0.14],
      dVec: [-0.31, 0.42, 0.58, -0.62, -0.18, 0.45, -0.22, 0.51],
      sim: -0.34,
    },
    {
      query: "who won the 2017 marathon",
      doc: "The 2014 marathon results were record-breaking",
      qVec: [0.55, -0.12, 0.48, -0.31, 0.22, 0.41, -0.18, 0.35],
      dVec: [0.51, -0.18, 0.44, -0.28, 0.19, 0.45, -0.15, 0.38],
      sim: 0.71,
    },
  ];

  const ex = examples[activeExample];

  useEffect(() => {
    if (phase === 0) return;
    const t = setTimeout(() => {
      if (phase < 3) setPhase((p) => p + 1);
    }, 900);
    return () => clearTimeout(t);
  }, [phase]);

  const reset = (i: number) => { setActiveExample(i); setPhase(0); };
  const play = () => { setPhase(1); };

  const simColor = ex.sim > 0.7 ? S.teal : ex.sim > 0 ? S.amber : S.rose;

  return (
    <VisualCard figNum="FIG. 02 · Bi-encoder pipeline · interactive">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 11, color: S.ink3, fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Select a query-doc pair
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {examples.map((_, i) => (
            <button
              key={i}
              className={`p2-btn-pill ${activeExample === i ? "p2-btn-pill-active" : ""}`}
              onClick={() => reset(i)}
            >
              Pair {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Two parallel rows: query and doc */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginTop: 8 }}>
        {/* Query row */}
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 100px 1fr", gap: 12, alignItems: "center" }}>
          <div className="p2-glass p2-card" style={{
            padding: "10px 12px",
            borderLeft: `3px solid ${phase >= 1 ? S.teal : S.rule}`,
            transition: "all 0.4s",
          }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: S.teal, fontFamily: "var(--mono)", marginBottom: 4 }}>QUERY</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: S.ink }}>&ldquo;{ex.query}&rdquo;</div>
          </div>

          {/* arrow */}
          <svg width="100%" height="28" viewBox="0 0 200 28">
            <line x1="0" y1="14" x2="196" y2="14"
              stroke={phase >= 1 ? S.teal : S.rule}
              strokeWidth="1.5"
              strokeDasharray={phase >= 1 ? "6 4" : "0"}
            />
            <polygon points="200,14 192,10 192,18"
              fill={phase >= 1 ? S.teal : S.rule} />
          </svg>

          <div className="p2-glass p2-card" style={{
            padding: "12px 8px", textAlign: "center",
            borderLeft: `3px solid ${phase >= 1 ? S.teal : S.rule}`,
            background: phase >= 1 ? S.tealBg : "transparent",
            transition: "all 0.4s",
          }}>
            <Cpu size={16} style={{ color: phase >= 1 ? S.teal : S.ink3 }} />
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: S.ink3, marginTop: 4 }}>Encoder</div>
          </div>

          <div style={{ paddingLeft: 8 }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 4 }}>Q-VECTOR</div>
            <VecBar vec={ex.qVec} color={S.teal} active={phase >= 2} />
          </div>
        </div>

        {/* Doc row */}
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 100px 1fr", gap: 12, alignItems: "center" }}>
          <div className="p2-glass p2-card" style={{
            padding: "10px 12px",
            borderLeft: `3px solid ${phase >= 1 ? S.violet : S.rule}`,
            transition: "all 0.4s",
          }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: S.violet, fontFamily: "var(--mono)", marginBottom: 4 }}>DOCUMENT</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: S.ink }}>&ldquo;{ex.doc}&rdquo;</div>
          </div>

          <svg width="100%" height="28" viewBox="0 0 200 28">
            <line x1="0" y1="14" x2="196" y2="14"
              stroke={phase >= 1 ? S.violet : S.rule}
              strokeWidth="1.5"
              strokeDasharray={phase >= 1 ? "6 4" : "0"}
            />
            <polygon points="200,14 192,10 192,18"
              fill={phase >= 1 ? S.violet : S.rule} />
          </svg>

          <div className="p2-glass p2-card" style={{
            padding: "12px 8px", textAlign: "center",
            borderLeft: `3px solid ${phase >= 1 ? S.violet : S.rule}`,
            background: phase >= 1 ? S.violetBg : "transparent",
            transition: "all 0.4s",
          }}>
            <Cpu size={16} style={{ color: phase >= 1 ? S.violet : S.ink3 }} />
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: S.ink3, marginTop: 4, lineHeight: 1.3 }}>Encoder<br />(shared wts)</div>
          </div>

          <div style={{ paddingLeft: 8 }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 4 }}>D-VECTOR</div>
            <VecBar vec={ex.dVec} color={S.violet} active={phase >= 2} />
          </div>
        </div>
      </div>

      {/* Similarity result */}
      <div style={{
        marginTop: 24, padding: "18px 22px",
        background: phase >= 3 ? S.amberBg : "transparent",
        borderRadius: 8,
        border: `1px solid ${phase >= 3 ? S.amber : S.rule}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.4s",
      }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, marginBottom: 4 }}>
            cosine similarity = (q · d) / (‖q‖ · ‖d‖)
          </div>
          <div style={{ fontSize: 13, color: S.ink3, fontStyle: "italic" }}>
            One scalar carries the entire semantic relationship.
          </div>
        </div>
        <div style={{
          fontFamily: "var(--sans)", fontSize: 42,
          color: phase >= 3 ? simColor : S.ink3,
          fontWeight: 600, letterSpacing: "-0.02em",
        }}>
          {phase >= 3 ? fmt(ex.sim, 2) : "—"}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, gap: 16 }}>
        <div style={{ fontSize: 13, color: S.ink3, fontStyle: "italic" }}>
          {phase === 0 && "Press play to encode."}
          {phase === 1 && "Forward pass: text → token IDs → transformer → hidden states."}
          {phase === 2 && "Pooled vectors emerge. Each captures the input in 8 dimensions (truncated for display)."}
          {phase === 3 && "The dot product fires. Notice what one number can and cannot say."}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button className="p2-btn-pill" onClick={() => setPhase(0)}>↺ Reset</button>
          <button className={`p2-btn-pill ${phase === 0 ? "p2-btn-pill-active" : ""}`} onClick={play} disabled={phase > 0}>
            {phase > 0 ? "Running…" : "▸ Play encoding"}
          </button>
        </div>
      </div>
    </VisualCard>
  );
}

// ── Pooling Demo ──
function PoolingDemo() {
  const tokens = ["[CLS]", "best", "pizza", "in", "Brookline", "[SEP]"];
  const hidden: number[][] = [
    [0.20, -0.30, 0.45, 0.12, -0.18, 0.55, 0.25, -0.10],
    [0.62, -0.21, 0.10, 0.48, -0.05, 0.32, 0.18, -0.40],
    [0.85, -0.05, 0.55, 0.62, -0.32, 0.18, 0.41, -0.22],
    [0.15, -0.35, 0.20, 0.08, -0.42, 0.28, 0.15, -0.18],
    [0.78, -0.12, 0.65, 0.55, -0.28, 0.40, 0.52, -0.30],
    [0.10, -0.40, 0.05, -0.10, -0.05, 0.20, 0.08, -0.15],
  ];
  const D = 8;

  const cls = hidden[0];
  const mean = Array.from({ length: D }, (_, j) =>
    hidden.reduce((s, row) => s + row[j], 0) / hidden.length);
  const max = Array.from({ length: D }, (_, j) =>
    Math.max(...hidden.map((r) => r[j])));

  const [mode, setMode] = useState<"cls" | "mean" | "max">("mean");
  const pooled = mode === "cls" ? cls : mode === "mean" ? mean : max;

  const heatColor = (v: number) => {
    const intensity = clamp(Math.abs(v) * 1.4, 0.05, 1);
    return v >= 0
      ? `rgba(52, 211, 153, ${intensity})`
      : `rgba(251, 113, 133, ${intensity})`;
  };

  const modeDescriptions = {
    cls: "[CLS] pooling — original BERT recipe. The first token's hidden state is trained to summarize the sequence. Cheap, but Sentence-BERT (2019) showed it loses to mean pooling for retrieval tasks.",
    mean: "Mean pooling — average across non-padding tokens. The modern default for sentence embeddings. Every token contributes; the summary is genuinely about the whole sequence.",
    max: "Max pooling — element-wise max across tokens. Captures the strongest signal per dimension; useful when you want to detect presence of features rather than averaged semantics.",
  };

  return (
    <VisualCard figNum="FIG. 03 · Pooling · how token-level hidden states collapse to one vector">
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 20 }}>
        {(["cls", "mean", "max"] as const).map((m) => (
          <button
            key={m}
            className={`p2-btn-pill ${mode === m ? "p2-btn-pill-active" : ""}`}
            onClick={() => setMode(m)}
          >
            {m === "cls" ? "[CLS] token" : m === "mean" ? "Mean pool" : "Max pool"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, alignItems: "center" }}>
        {tokens.map((tok, i) => (
          <React.Fragment key={i}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 12.5,
              color: mode === "cls" && i === 0 ? S.amber : S.ink2,
              textAlign: "right", paddingRight: 8,
              fontWeight: mode === "cls" && i === 0 ? 600 : 400,
              transition: "color 0.3s",
            }}>
              {tok}
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: `repeat(${D}, 1fr)`, gap: 3,
              opacity: mode === "cls" && i !== 0 ? 0.2 : 1,
              transition: "opacity 0.3s",
            }}>
              {hidden[i].map((v, j) => (
                <div key={j} style={{
                  height: 22, background: heatColor(v), borderRadius: 2,
                  border: `1px solid ${S.rule}`,
                  fontFamily: "var(--mono)", fontSize: 9,
                  color: Math.abs(v) > 0.5 ? "rgba(5,6,10,0.85)" : S.ink3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s",
                }}>
                  {fmt(v, 1)}
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}

        {/* arrow */}
        <div />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 0" }}>
          <svg width="100%" height="20" viewBox="0 0 400 20">
            <text x="200" y="14" textAnchor="middle" fontFamily="var(--sans)" fontSize="13" fill={S.amber} fontStyle="italic">
              ↓ {mode === "cls" ? "take [CLS] vector" : mode === "mean" ? "average column-wise" : "element-wise max"} ↓
            </text>
          </svg>
        </div>

        {/* pooled row */}
        <div style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: S.amber, textAlign: "right", paddingRight: 8, fontWeight: 600 }}>
          pooled
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${D}, 1fr)`, gap: 3,
          padding: 4, background: S.amberBg, borderRadius: 6,
          border: `1px solid ${S.ruleStrong}`,
        }}>
          {pooled.map((v, j) => (
            <div key={j} style={{
              height: 26, background: heatColor(v), borderRadius: 2,
              border: `1px solid ${S.ruleStrong}`,
              fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600,
              color: Math.abs(v) > 0.5 ? "rgba(5,6,10,0.9)" : S.ink,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s",
            }}>
              {fmt(v, 2)}
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 13.5, color: S.ink3, marginTop: 18, lineHeight: 1.6, fontStyle: "italic" }}>
        {modeDescriptions[mode]}
      </div>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionBiEncoder() {
  return (
    <Section
      id="bi-encoder"
      eyebrow="3.2 · Bi-Encoder Mechanics"
      title="Bi-encoders: one vector per text"
      kicker="Encode query and document separately. Compare with dot product. The entire document corpus can be precomputed offline — retrieval is just a nearest-neighbour search."
    >
      <Para>
        A bi-encoder passes query and document through the same encoder model independently.
        Each produces a dense vector. Similarity is a single dot product. Because documents
        never change, you encode the entire corpus once, store the vectors in an ANN index,
        and at query time you only need to encode the query.
      </Para>

      <BiEncoderDemo />

      <Callout borderColor={S.teal} labelColor={S.teal} label="Why the dot product loses information">
        Bi-encoders compress a whole document — potentially thousands of tokens — into a single
        vector. That vector can't represent everything. Token-level interactions between query
        and document words (like detecting that the year{" "}
        <Mono color={S.teal}>2017</Mono> in the query doesn't match{" "}
        <Mono color={S.teal}>2014</Mono> in the doc) are irrecoverably lost.
        This is the central limitation that ColBERT and cross-encoders address.
      </Callout>

      <Sub title="Pooling: how token-level states become one vector">
        <Para>
          The encoder produces one hidden state per token. Pooling is the function that
          collapses those into a single vector. The choice matters.
        </Para>
        <PoolingDemo />
      </Sub>

      <Callout borderColor={S.amber} labelColor={S.amber} label="The bi-encoder training recipe (Sentence-BERT)">
        Sentence-BERT fine-tunes a pre-trained transformer with a contrastive objective:{" "}
        <strong style={{ color: S.ink }}>
          push (query, relevant-doc) pairs close, push (query, irrelevant-doc) pairs apart.
        </strong>{" "}
        Without this fine-tuning, BERT embeddings are terrible for semantic similarity.
        A vanilla BERT pooling cosine sim on NLI pairs is basically random.
        The contrastive stage is what makes them useful.
      </Callout>
    </Section>
  );
}
