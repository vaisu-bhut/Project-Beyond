"use client";
import React, { useState } from "react";

/**
 * §2.2 — Compute Depth & Chain-of-Thought
 * Token-streaming demo: zero-shot vs. CoT, forward pass count visualization
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

// ── Compute Depth Demo ──
function ComputeDepthDemo() {
  const [mode, setMode] = useState<"zero" | "cot">("cot");
  const [generated, setGenerated] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const zeroShot = ["27"];
  const cot = [
    "Roger", " starts", " with", " 5", " balls.",
    " 2", " cans", " ×", " 3", " =", " 6", ".",
    " 5", " +", " 6", " =", " 11", ".",
    " Answer:", " 11", ".",
  ];

  const tokens = mode === "zero" ? zeroShot : cot;
  const correct = mode !== "zero";

  const start = () => {
    setGenerated([]);
    setDone(false);
    tokens.forEach((tok, i) => {
      setTimeout(() => {
        setGenerated((g) => [...g, tok]);
        if (i === tokens.length - 1) setDone(true);
      }, 220 * i + 200);
    });
  };

  return (
    <VisualCard caption="Each intermediate token gets its own forward pass. The model's scratchpad grows left-to-right, and every answer token attends back over all the reasoning tokens already generated.">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 280px" }}>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)" }}>Problem</span>
          <p style={{ marginTop: 6, marginBottom: 0, fontSize: 15, color: S.ink2 }}>
            "Roger has 5 tennis balls. He buys 2 cans, each with 3 balls. How many now?"
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={`p2-btn-pill ${mode === "zero" ? "p2-btn-pill-active" : ""}`}
            onClick={() => { setMode("zero"); setGenerated([]); setDone(false); }}
          >
            Zero-shot
          </button>
          <button
            className={`p2-btn-pill ${mode === "cot" ? "p2-btn-pill-active" : ""}`}
            onClick={() => { setMode("cot"); setGenerated([]); setDone(false); }}
          >
            Chain-of-thought
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div style={{
        background: "var(--background-soft)",
        border: `1px solid var(--border)`,
        color: "var(--foreground)",
        padding: 18,
        borderRadius: 8,
        fontFamily: "var(--mono)",
        fontSize: 13.5,
        minHeight: 110,
        lineHeight: 1.8,
        position: "relative",
      }}>
        <div style={{ color: S.ink3, fontSize: 11, marginBottom: 8 }}>
          {mode === "zero" ? "▸ Q: ... A:" : "▸ Q: ... A: Let's think step by step."}
        </div>
        <div>
          {generated.map((tok, i) => (
            <span
              key={i}
              style={{
                color: S.amber,
                background: i === generated.length - 1 && !done ? `${S.amber}22` : "transparent",
                padding: "0 1px",
                transition: "background 0.2s",
              }}
            >
              {tok}
            </span>
          ))}
          {!done && generated.length > 0 && (
            <span style={{ color: S.amber, animation: "pulse-glow 1.4s ease-in-out infinite" }}>▎</span>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 20 }}>
        {[
          {
            label: "Forward passes used",
            value: `${generated.length} / ${tokens.length}`,
            color: mode === "zero" ? S.rose : S.teal,
          },
          {
            label: "Compute depth for answer",
            value: mode === "zero" ? "1×" : `${cot.length}×`,
            color: S.ink,
          },
          {
            label: "Output",
            value: done ? (correct ? "11 ✓" : "27 ✗") : "—",
            color: done ? (correct ? S.teal : S.rose) : S.ink3,
          },
        ].map((stat) => (
          <div key={stat.label} className="p2-glass p2-card" style={{ borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 8 }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 28, lineHeight: 1, fontWeight: 600, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, fontSize: 14, color: S.ink2 }}>
        {mode === "zero" ? (
          <>
            The model has <strong style={{ color: S.ink }}>one forward pass</strong> to map the entire problem to its answer.
            Arithmetic and reading comprehension must happen in parallel inside that single pass. Often fails.
          </>
        ) : (
          <>
            Each intermediate token gets its own forward pass. The token <Mono color={S.teal}>6</Mono> is generated while
            attending to <Mono color={S.teal}>2 × 3</Mono>; the token <Mono color={S.teal}>11</Mono> while attending to{" "}
            <Mono color={S.teal}>5</Mono> and <Mono color={S.teal}>6</Mono>. Compute serialized through the token stream.
          </>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="p2-btn-pill p2-btn-pill-active" onClick={start}>
          ▸ Generate
        </button>
      </div>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionComputeDepth() {
  return (
    <Section
      id="compute-depth"
      eyebrow="2.2 · Chain-of-Thought & Compute Depth"
      title="Compute depth through the token stream"
      kicker="CoT isn't magic — it's serial compute. Every intermediate token is a forward pass that can attend back over prior reasoning. More tokens, more compute, harder problems solved."
    >
      <Para>
        The core insight: a standard transformer has a fixed compute budget per token — roughly{" "}
        proportional to model depth × hidden size. For a problem that requires more than one step of
        reasoning, <strong style={{ color: S.blue }}>a single forward pass is not enough</strong>.
        Chain-of-thought bypasses this by spreading the reasoning across multiple tokens, each with
        their own forward pass.
      </Para>

      <Sub title="One forward pass vs. many">
        <Para>
          Zero-shot: the model maps the problem directly to the answer in a single pass. Every
          intermediate computation (multiplication, addition, comparison) must happen in parallel
          inside the residual stream. For arithmetic, this almost always fails.
        </Para>
        <Para>
          Chain-of-thought: the model generates intermediate steps as tokens. Each step is a new
          forward pass, and the next step can <em>attend back</em> to every previous token. The
          scratch-pad is built in context.
        </Para>
        <ComputeDepthDemo />
      </Sub>

      <Callout borderColor={S.teal} labelColor={S.teal} label="Why 'Let's think step by step' works">
        This four-word phrase, discovered by Kojima et al. (2022), unlocks reasoning behavior that was
        baked in during instruction tuning. The model has been trained to produce
        intermediate steps when prompted with it — the tokens that follow change the distribution of
        what comes next, which changes what the model attends to, which changes its final answer.
        It is not incantation. It is <strong style={{ color: S.teal }}>distribution shift</strong>.
      </Callout>

      <Callout borderColor={S.amber} labelColor={S.amber} label="The cost tradeoff">
        CoT trades <strong style={{ color: S.ink }}>latency and token cost</strong> for accuracy.
        A 20-token CoT is ~20× the inference cost of a 1-token zero-shot answer. For production
        systems, you decide: cheap + sometimes wrong, or expensive + more reliable. Self-consistency
        (§2.3) compounds this — running 10 CoT samples costs 200× the zero-shot price.
      </Callout>

      <Sub title="When does CoT help?">
        <Para>
          Empirically, CoT yields large gains on tasks that require:
        </Para>
        <div className="p2-glass p2-card" style={{ borderRadius: 12, padding: "20px 24px", margin: "20px 0" }}>
          {[
            { tag: "Multi-step arithmetic", note: "Each operation gets its own pass." },
            { tag: "Symbolic reasoning", note: "Logic chains, constraint satisfaction, deduction." },
            { tag: "Commonsense that requires enumeration", note: "Listing intermediate facts before concluding." },
            { tag: "Code generation with tests", note: "Write the plan before writing the code." },
          ].map((item) => (
            <div key={item.tag} style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, background: `${S.blue}18`, color: S.blue, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>
                {item.tag}
              </span>
              <span style={{ fontSize: 14, color: S.ink2 }}>{item.note}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, fontSize: 13, color: S.ink3, fontStyle: "italic" }}>
            CoT rarely helps on tasks solvable in one pass: classification, simple retrieval, format
            conversion. The cost isn't worth it there.
          </div>
        </div>
      </Sub>
    </Section>
  );
}
