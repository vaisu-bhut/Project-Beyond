"use client";
import React, { useState, useEffect } from "react";

/**
 * §2.1 — In-Context Learning
 * Animated attention visualizer: query attends backward over demonstrations
 */

const S = {
  ink: "var(--foreground)",
  ink2: "color-mix(in oklab, var(--foreground) 85%, transparent)",
  ink3: "var(--foreground-muted)",
  bg: "var(--background-elevated)",
  bgSunk: "var(--background-soft)",
  rule: "var(--border)",
  blue: "var(--accent-p2)",
  teal: "var(--accent-p4)",
  amber: "var(--accent-p5)",
  rose: "var(--accent-p6)",
  violet: "var(--accent-p1)",
  blueSoft: "rgba(96, 165, 250, 0.12)",
  tealSoft: "rgba(52, 211, 153, 0.12)",
  amberSoft: "rgba(251, 191, 36, 0.15)",
};

function Section({
  id,
  eyebrow,
  title,
  kicker,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
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
  borderColor,
  labelColor,
  label,
  children,
}: {
  borderColor?: string;
  labelColor?: string;
  label: string;
  children: React.ReactNode;
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

function VisualCard({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <div style={{ margin: "28px 0" }}>
      <div className="p2-glass p2-visual-card" style={{ borderRadius: 16, padding: "28px 24px" }}>{children}</div>
      {caption && (
        <div style={{ fontSize: 12, color: S.ink3, fontStyle: "italic", marginTop: 10, maxWidth: 720, margin: "10px auto 0", lineHeight: 1.6, padding: "0 16px", textAlign: "center" }}>
          {caption}
        </div>
      )}
    </div>
  );
}

function Mono({ children, color }: { children: React.ReactNode; color?: string }) {
  return <span style={{ fontFamily: "var(--mono)", color: color || S.ink, fontSize: "0.92em" }}>{children}</span>;
}

// ── Attention Visualizer ──
function AttentionVisualizer() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const demos = [
    { input: "cat", output: "chat" },
    { input: "dog", output: "chien" },
    { input: "horse", output: "cheval" },
  ];
  const query = "bird";

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setStep((s) => (s + 1) % 5);
    }, 1200);
    return () => clearTimeout(t);
  }, [step, playing]);

  const attentionWeights = [
    [0, 0, 0],
    [0.15, 0.1, 0.05],
    [0.35, 0.3, 0.2],
    [0.55, 0.6, 0.45],
    [0.7, 0.85, 0.55],
  ];
  const weights = attentionWeights[step];

  return (
    <VisualCard caption="The query token attends backward over demonstrations. Each step shows growing attention weights — no gradient update, purely forward-pass pattern matching.">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)" }}>
          Live attention simulation — query attends backward
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="p2-btn-pill" onClick={() => { setStep(0); setPlaying(false); }}>
            Reset
          </button>
          <button className={`p2-btn-pill ${playing ? "p2-btn-pill-active" : ""}`} onClick={() => setPlaying(!playing)}>
            {playing ? "Pause" : "Animate"}
          </button>
        </div>
      </div>

      <svg width="100%" viewBox="0 0 720 320" style={{ display: "block" }}>
        <defs>
          <marker id="attn-arr-icl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1 L9 5 L2 9" fill="none" stroke={S.blue} strokeWidth="1.5" strokeLinecap="round" />
          </marker>
        </defs>

        <text x="360" y="24" textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill={S.ink3} letterSpacing="2">
          PROMPT CONTEXT (LEFT TO RIGHT)
        </text>

        {demos.map((d, i) => {
          const x = 50 + i * 180;
          return (
            <g key={i}>
              <rect x={x} y={50} width={140} height={70} rx={6}
                fill={weights[i] > 0.4 ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.02)"}
                stroke={weights[i] > 0.4 ? S.blue : S.rule}
                strokeWidth={weights[i] > 0.4 ? 2 : 1}
                opacity={0.4 + weights[i] * 0.7}
              />
              <text x={x + 70} y={72} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill={S.ink3} letterSpacing="1">
                DEMO {i + 1}
              </text>
              <text x={x + 70} y={96} textAnchor="middle" fontFamily="var(--sans)" fontSize="15" fill={S.ink} fontWeight={500}>
                {d.input} → {d.output}
              </text>
              {weights[i] > 0 && (
                <text x={x + 70} y={138} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill={S.blue}>
                  w = {weights[i].toFixed(2)}
                </text>
              )}
            </g>
          );
        })}

        {/* Query box */}
        <rect x={580} y={50} width={120} height={70} rx={6}
          fill={S.amberSoft}
          stroke={S.amber} strokeWidth={2}
        />
        <text x={640} y={72} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill={S.amber} letterSpacing="1">
          QUERY
        </text>
        <text x={640} y={96} textAnchor="middle" fontFamily="var(--sans)" fontSize="15" fill={S.ink} fontWeight={500}>
          {query} → {step >= 4 ? "oiseau" : "?"}
        </text>

        {/* Attention curves */}
        {weights.map((w, i) => {
          if (w === 0) return null;
          const fromX = 640, fromY = 120;
          const toX = 50 + i * 180 + 70, toY = 120;
          const midY = 210 + i * 15;
          return (
            <path
              key={i}
              d={`M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`}
              fill="none"
              stroke={S.blue}
              strokeWidth={1 + w * 3}
              opacity={0.3 + w * 0.7}
              markerEnd="url(#attn-arr-icl)"
              strokeDasharray={playing && step < 4 ? "5 4" : "0"}
            />
          );
        })}

        <text x={360} y={270} textAnchor="middle" fontFamily="var(--sans)" fontSize="14" fill={S.ink2} fontStyle="italic">
          {step === 0 && "Step 0: model hasn't started attending yet"}
          {step === 1 && "Step 1: attention diffuse, low weights across all demos"}
          {step === 2 && "Step 2: attention strengthening as model processes context"}
          {step === 3 && "Step 3: pattern recognition — the model has identified the structure"}
          {step === 4 && "Step 4: prediction emitted — demonstrations acted as fast-weights"}
        </text>
        <text x={360} y={295} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill={S.ink3}>
          NO GRADIENT UPDATE · FROZEN PARAMETERS · PURE FORWARD PASS
        </text>
      </svg>

      <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
        {[0, 1, 2, 3, 4].map((s) => (
          <button
            key={s}
            onClick={() => { setStep(s); setPlaying(false); }}
            className={`p2-btn-pill ${step === s ? "p2-btn-pill-active" : ""}`}
            style={{ flex: 1, textAlign: "center" }}
          >
            {s}
          </button>
        ))}
      </div>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionICL() {
  return (
    <Section
      id="icl"
      eyebrow="2.1 · In-Context Learning"
      title="In-Context Learning"
      kicker="The model learns from examples in the prompt itself — zero gradient updates, zero fine-tuning. Pure forward-pass pattern matching via attention."
    >
      <Para>
        In-context learning (ICL) is the ability of a large language model to adapt its behavior at
        inference time by reading a few labeled examples prepended to the input. The weights never
        change. The optimizer never runs. The adaptation happens entirely inside a single forward pass.
      </Para>

      <Sub title="How attention enables ICL">
        <Para>
          When the model processes the prompt, the query token attends backward over all demonstration
          tokens. The (input, output) pairs act as{" "}
          <strong style={{ color: S.blue }}>fast weights</strong> — the KV cache stores the
          pattern, and the prediction head reads from it.
        </Para>
        <AttentionVisualizer />
      </Sub>

      <Callout borderColor={S.teal} labelColor={S.teal} label="The fast-weights interpretation">
        Each demonstration shifts the effective weight matrix of the prediction head without modifying
        a single parameter. Garg et al. (2022) showed that Transformers trained on in-context
        regression tasks implicitly run gradient descent inside the forward pass. The demos are not
        just examples — they are a compressed training set.
      </Callout>

      <Sub title="What makes a good demonstration?">
        <Para>
          Three empirical findings from Min et al. (2022) and follow-up work:
        </Para>
        <div className="p2-glass p2-card" style={{ borderRadius: 12, padding: "20px 24px", margin: "20px 0" }}>
          {[
            {
              num: "1",
              title: "Label correctness matters less than you think",
              desc: 'Randomly flipping labels in demonstrations barely hurts performance on many benchmarks. The model is learning the input distribution and label space, not memorizing specific (x→y) pairs. "The answer is 42" teaches the format; whether 42 is correct is secondary.',
              color: S.blue,
            },
            {
              num: "2",
              title: "Input distribution matters a lot",
              desc: "Demonstrations drawn from a similar distribution to the test input outperform random or out-of-distribution examples. The KV cache must encode inputs the prediction head has learned to read.",
              color: S.teal,
            },
            {
              num: "3",
              title: "Recency bias is real",
              desc: "The last demonstration in the context has disproportionate influence. When ordering matters, put your most representative example last.",
              color: S.amber,
            },
          ].map((item) => (
            <div key={item.num} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700, color: item.color, minWidth: 28, lineHeight: 1 }}>
                {item.num}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: S.ink, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: S.ink2, lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Sub>

      <Callout borderColor={S.rose} labelColor={S.rose} label="ICL vs fine-tuning — when to use which">
        ICL is the right choice when:{" "}
        <strong style={{ color: S.ink }}>
          (a) you have fewer than ~50 examples, (b) task distribution shifts frequently, or (c) you
          cannot afford a fine-tuning run.
        </strong>{" "}
        Fine-tuning wins when you have thousands of examples and the task is stable — the gradient
        updates compress the demonstrations into the weights permanently, freeing context for longer
        inputs.
      </Callout>
    </Section>
  );
}
