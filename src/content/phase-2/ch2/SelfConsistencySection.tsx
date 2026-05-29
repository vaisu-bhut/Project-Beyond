"use client";
import React, { useState, useEffect, useMemo } from "react";

/**
 * §2.3 — Self-Consistency
 * N-sample temperature simulator with vote tally histogram
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
  tealSoft: "rgba(52, 211, 153, 0.12)",
  roseSoft: "rgba(251, 113, 133, 0.12)",
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

// ── Self-Consistency Simulator ──
function SelfConsistencySimulator() {
  const [N, setN] = useState(5);
  const [temp, setTemp] = useState(0.7);
  const [samples, setSamples] = useState<typeof traces>([]);
  const [animating, setAnimating] = useState(false);

  const traces = [
    { id: "A", text: "Sister was half of 6, so 3. Age gap is 3. Now 70, so 67.", answer: 67, baseLogit: 1.8 },
    { id: "B", text: "When I was 6 she was 3. She's 3 years younger. 70 − 3 = 67.", answer: 67, baseLogit: 1.5 },
    { id: "C", text: "She was 3 when I was 6. Difference is 3. So 67.", answer: 67, baseLogit: 1.3 },
    { id: "D", text: "Sister is half my age, so 70/2 = 35.", answer: 35, baseLogit: 1.0 },
    { id: "E", text: "Half of 70 is 35.", answer: 35, baseLogit: 0.8 },
    { id: "F", text: "If she was half then, she's half now: 35.", answer: 35, baseLogit: 0.6 },
    { id: "G", text: "Age gap is 3, but sister is now 70-3-... wait, 64.", answer: 64, baseLogit: 0.2 },
    { id: "H", text: "When I was 6, she was 3. Now 6 years passed. She's 9... no, 70.", answer: 70, baseLogit: 0.15 },
  ];

  const probs = useMemo(() => {
    const T = Math.max(temp, 0.01);
    const scaled = traces.map((t) => t.baseLogit / T);
    const maxL = Math.max(...scaled);
    const exps = scaled.map((s) => Math.exp(s - maxL));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  }, [temp]);

  const runSamples = () => {
    setAnimating(true);
    setSamples([]);
    const drawn: typeof traces = [];
    for (let i = 0; i < N; i++) {
      const r = Math.random();
      let acc = 0;
      let chosen = traces[0];
      for (let j = 0; j < traces.length; j++) {
        acc += probs[j];
        if (r <= acc) { chosen = traces[j]; break; }
      }
      drawn.push(chosen);
    }
    drawn.forEach((d, i) => {
      setTimeout(() => {
        setSamples((s) => [...s, d]);
        if (i === drawn.length - 1) setAnimating(false);
      }, 250 * i);
    });
  };

  useEffect(() => { runSamples(); }, []);

  const tally = samples.reduce<Record<number, number>>((acc, s) => {
    acc[s.answer] = (acc[s.answer] || 0) + 1;
    return acc;
  }, {});
  const sortedAnswers = Object.entries(tally).sort((a, b) => +b[1] - +a[1]);
  const winner = sortedAnswers[0]?.[0];

  const answerColor = (ans: string | number) =>
    String(ans) === "67" ? S.teal : String(ans) === "35" ? S.rose : S.ink3;

  return (
    <VisualCard caption="Adjust N and temperature, then resample. Low temperature collapses to a single trace; high temperature surfaces the full distribution.">
      {/* Problem */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 6 }}>
          Problem (a known CoT failure mode)
        </div>
        <p style={{ fontStyle: "italic", fontSize: 16, color: S.ink, marginBottom: 6 }}>
          "When I was 6 my sister was half my age. Now I'm 70. How old is my sister?"
        </p>
        <p style={{ fontSize: 13, color: S.ink3 }}>
          Correct answer is <strong style={{ color: S.teal }}>67</strong> (3-year gap, fixed forever).
          The trap: many CoT chains shortcut to <strong style={{ color: S.rose }}>35</strong> by treating "half" as eternal.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {[
          {
            label: "N (samples)", value: N.toString(), min: 1, max: 40, step: 1,
            note: "More samples → more reliable majority, more cost.",
            onChange: (v: number) => setN(v),
          },
          {
            label: "Temperature", value: temp.toFixed(2), min: 0.05, max: 2, step: 0.05,
            note: "T → 0: deterministic. T high: more diversity, also more noise.",
            onChange: (v: number) => setTemp(v),
          },
        ].map(({ label, value, min, max, step, note, onChange }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)" }}>{label}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: S.blue }}>{value}</span>
            </div>
            <input
              type="range" min={min} max={max} step={step} value={label === "N (samples)" ? N : temp}
              onChange={(e) => onChange(+e.target.value)}
              style={{ width: "100%", accentColor: "var(--accent-p2)" }}
            />
            <div style={{ fontSize: 12, color: S.ink3, marginTop: 4 }}>{note}</div>
          </div>
        ))}
      </div>

      <button className="p2-btn-pill p2-btn-pill-active" onClick={runSamples} disabled={animating} style={{ marginBottom: 20 }}>
        {animating ? "Sampling…" : "▸ Resample"}
      </button>

      {/* Distribution bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 8 }}>
          Underlying trace distribution at T = {temp.toFixed(2)}
        </div>
        <div style={{ display: "flex", height: 24, marginTop: 8, borderRadius: 4, overflow: "hidden", border: `1px solid ${S.rule}` }}>
          {traces.map((t, i) => (
            <div
              key={t.id}
              title={`${t.id}: ${(probs[i] * 100).toFixed(1)}% — answer ${t.answer}`}
              style={{
                width: `${probs[i] * 100}%`,
                background: t.answer === 67 ? S.teal : t.answer === 35 ? S.rose : S.ink3,
                opacity: 0.5 + probs[i] * 0.9,
                borderRight: "1px solid rgba(0,0,0,0.15)",
                minWidth: probs[i] > 0.005 ? 1 : 0,
                transition: "width 0.4s ease",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 11, fontFamily: "var(--mono)", color: S.ink3 }}>
          {[{ c: S.teal, l: "answer 67 (correct)" }, { c: S.rose, l: "answer 35" }, { c: S.ink3, l: "other wrong" }].map(({ c, l }) => (
            <span key={l}><span style={{ display: "inline-block", width: 10, height: 10, background: c, marginRight: 4, borderRadius: 2 }} />{l}</span>
          ))}
        </div>
      </div>

      {/* Sample list */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 8 }}>
          Sampled traces
        </div>
        <div style={{ maxHeight: 220, overflowY: "auto", border: `1px solid ${S.rule}`, borderRadius: 6, background: "var(--background-soft)" }}>
          {samples.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "8px 14px",
                borderBottom: i < samples.length - 1 ? `1px solid ${S.rule}` : "none",
                display: "flex", alignItems: "center", gap: 12, fontSize: 13,
              }}
            >
              <span style={{ fontFamily: "var(--mono)", color: S.ink3, fontSize: 11, minWidth: 24 }}>#{i + 1}</span>
              <span style={{ flex: 1, color: S.ink2 }}>{s.text}</span>
              <span style={{
                background: answerColor(s.answer),
                color: "var(--background)",
                padding: "2px 8px", borderRadius: 4,
                fontSize: 12, fontWeight: 600, fontFamily: "var(--mono)",
              }}>
                → {s.answer}
              </span>
            </div>
          ))}
          {samples.length === 0 && (
            <div style={{ padding: 14, color: S.ink3, fontSize: 13 }}>No samples yet.</div>
          )}
        </div>
      </div>

      {/* Vote tally + Outcome */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 10 }}>
            Vote tally
          </div>
          {sortedAnswers.map(([ans, count], i) => {
            const isWinner = i === 0;
            const isCorrect = ans === "67";
            return (
              <div key={ans} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: isWinner ? 700 : 400, color: S.ink }}>
                    {isWinner ? "▸ " : "  "}answer = {ans}
                    {isCorrect && <span style={{ color: S.teal, marginLeft: 6 }}>✓</span>}
                  </span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: S.ink3 }}>
                    {count} / {samples.length}
                  </span>
                </div>
                <div style={{ height: 6, background: "var(--border)", borderRadius: 2 }}>
                  <div style={{
                    height: "100%",
                    width: `${(+count / N) * 100}%`,
                    background: answerColor(ans),
                    transition: "width 0.3s ease",
                    borderRadius: 2,
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 10 }}>
            Outcome
          </div>
          <div className="p2-glass p2-card" style={{ borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, color: S.ink3, marginBottom: 8 }}>Without self-consistency:</div>
            {samples[0] && (
              <div style={{ fontSize: 32, fontWeight: 700, color: answerColor(samples[0].answer), marginBottom: 16, fontFamily: "var(--font-sans)" }}>
                {samples[0].answer} {samples[0].answer === 67 ? "✓" : "✗"}
              </div>
            )}
            <div style={{ fontSize: 13, color: S.ink3, marginBottom: 8 }}>With self-consistency (majority of N):</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: winner ? answerColor(winner) : S.ink3, fontFamily: "var(--font-sans)" }}>
              {winner || "—"} {winner === "67" ? "✓" : winner ? "✗" : ""}
            </div>
          </div>
        </div>
      </div>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionSelfConsistency() {
  return (
    <Section
      id="self-consistency"
      eyebrow="2.3 · Self-Consistency"
      title="Self-Consistency"
      kicker="Sample N diverse reasoning paths, take the majority vote. Wrong paths scatter; correct paths converge. The margin widens with N."
    >
      <Para>
        Wang et al. (2022) showed that generating multiple chain-of-thought paths and
        marginalizing over answers — taking the plurality — outperforms a single CoT pass by a
        large margin on reasoning benchmarks. The intuition: correct answers have a higher-probability
        region in reasoning space; wrong answers spread across many inconsistent paths.
      </Para>

      <Sub title="Simulate it yourself">
        <Para>
          The problem below is a known CoT failure mode. Vary N and temperature to see how
          self-consistency recovers from individual chain errors.
        </Para>
        <SelfConsistencySimulator />
      </Sub>

      <Callout borderColor={S.teal} labelColor={S.teal} label="Try: T = 0.05 vs. T = 1.5">
        At T = 0.05, only the top trace fires — self-consistency collapses to N copies of the same
        answer. Set T = 1.5 with N = 30: correct paths still converge while wrong paths scatter, so
        the majority is reliably right.{" "}
        <strong style={{ color: S.teal }}>
          Self-consistency only helps when the model is sometimes right and sometimes wrong on the
          same problem.
        </strong>
      </Callout>

      <Callout borderColor={S.amber} labelColor={S.amber} label="Cost structure">
        Self-consistency costs N × (CoT inference cost). At N = 10 and a 20-token CoT, that's 200×
        zero-shot cost. In practice, you often need only N = 5–10 before the majority vote
        stabilizes. For high-stakes decisions (medical triage, legal summarization), the cost is
        justified. For cheap classification, it isn't.
      </Callout>

      <Sub title="When to reach for self-consistency">
        <div className="p2-glass p2-card" style={{ borderRadius: 12, padding: "20px 24px", margin: "20px 0" }}>
          {[
            { check: true, text: "The task has a verifiable correct answer (math, logic, code output)" },
            { check: true, text: "The model's single-pass CoT is unreliable but sometimes correct (~40–70% accuracy)" },
            { check: true, text: "You can afford N× the inference budget" },
            { check: false, text: "The model is always wrong — no amount of sampling helps. Fix the model first." },
            { check: false, text: "The task is open-ended (creative writing, opinion) — majority vote is meaningless." },
          ].map((item) => (
            <div key={item.text} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <span style={{ color: item.check ? S.teal : S.rose, fontFamily: "var(--mono)", fontSize: 14, minWidth: 16 }}>
                {item.check ? "✓" : "✗"}
              </span>
              <span style={{ fontSize: 14, color: S.ink2, lineHeight: 1.6 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </Sub>
    </Section>
  );
}
