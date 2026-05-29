"use client";
import React, { useState } from "react";

/**
 * §2.4 — ICL Methods Explorer
 * Side-by-side comparison of 6 prompting methods across 4 problems
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

function Mono({ children, color }: { children: React.ReactNode; color?: string }) {
  return <span style={{ fontFamily: "var(--mono)", color: color || S.ink, fontSize: "0.92em" }}>{children}</span>;
}

// ── Data ──
const problems = {
  arith: {
    name: "Arithmetic",
    tag: "math",
    question: "Roger has 5 tennis balls. He buys 2 cans of tennis balls, each with 3 balls. How many tennis balls does he have now?",
    correct: "11",
  },
  sentiment: {
    name: "Sentiment",
    tag: "nlp",
    question: "Classify the sentiment of this review: \"The food arrived cold and late, but the waiter was incredibly kind and the dessert was outstanding.\"",
    correct: "mixed",
  },
  trap: {
    name: "Reasoning trap",
    tag: "logic",
    question: "When I was 6, my sister was half my age. Now I am 70. How old is my sister?",
    correct: "67",
  },
  translation: {
    name: "Translation",
    tag: "nlp",
    question: "Translate to French: \"The bird is sitting on the tree.\"",
    correct: "L'oiseau est assis sur l'arbre.",
  },
} as const;
type ProblemId = keyof typeof problems;

const methods = {
  zero: {
    name: "Zero-shot",
    tagline: "Just the question. No examples. No nudges.",
    mechanism: "Single forward pass mapping problem → answer. The model relies entirely on pretraining + post-training to know the answer shape. Works when the task is well-represented in training data and the answer is shallow.",
    when: "Common tasks the model has seen thousands of times during instruction tuning (summarize, translate, classify, basic QA).",
    cost: "1×",
    reliability: 0.35,
    prompts: {
      arith: `Q: ${problems.arith.question}\nA:`,
      sentiment: problems.sentiment.question,
      trap: `Q: ${problems.trap.question}\nA:`,
      translation: problems.translation.question,
    },
    outputs: {
      arith: { text: "27", correct: false, note: "Confidently wrong. Single forward pass had no room for two-step arithmetic." },
      sentiment: { text: "positive", correct: false, note: "Misses the mixed signal — overweights the strong positive ending." },
      trap: { text: "35", correct: false, note: "Trap-pattern wins. The model shortcuts to half of 70." },
      translation: { text: "L'oiseau est assis sur l'arbre.", correct: true, note: "Translation is well-represented in training — zero-shot is enough." },
    },
  },
  instructed: {
    name: "Zero-shot + instruction",
    tagline: "Add a system instruction or output-format spec, no examples.",
    mechanism: "Same compute budget as zero-shot, but the instruction primes the model's behavior. RLHF training means the model weights explicit instructions heavily — this often raises reliability without cost increase.",
    when: "Tasks where format matters (JSON outputs, length limits, style constraints) or where you need the model to adopt a specific evaluation lens.",
    cost: "1×",
    reliability: 0.45,
    prompts: {
      arith: `You are a careful arithmetic assistant. Give only the final numeric answer.\n\nQ: ${problems.arith.question}\nA:`,
      sentiment: `Classify the sentiment as one of: positive, negative, mixed, neutral. Answer with only the label.\n\nReview: "The food arrived cold and late, but the waiter was incredibly kind and the dessert was outstanding."\n\nSentiment:`,
      trap: `Solve carefully. Pay attention to whether quantities are fixed or change over time.\n\nQ: ${problems.trap.question}\nA:`,
      translation: `Translate the following English sentence to natural, native-sounding French.\n\nEnglish: "The bird is sitting on the tree."\nFrench:`,
    },
    outputs: {
      arith: { text: "11", correct: true, note: "The 'careful' prime nudges the model toward a more measured pass. Still no scratch space — fragile on harder problems." },
      sentiment: { text: "mixed", correct: true, note: "The explicit label set forces the model to consider 'mixed' as an option it might otherwise skip." },
      trap: { text: "35", correct: false, note: "Instruction prime isn't enough. The trap pattern is too strong without CoT." },
      translation: { text: "L'oiseau est posé sur l'arbre.", correct: true, note: "More natural verb choice ('posé' vs 'assis' for a bird) — instruction influences register." },
    },
  },
  fewshot: {
    name: "Few-shot (k-shot)",
    tagline: "Prepend k labeled examples. Pure ICL.",
    mechanism: "Demonstrations enter the KV cache and act as fast weights. The prediction-slot token attends backward to (input, output) pairs and uses them as templates. Order matters; recency biases the model toward the last example.",
    when: "Format-sensitive tasks, classification with a specific label set, novel formats not seen in pretraining.",
    cost: "1×",
    reliability: 0.55,
    prompts: {
      arith: `Q: There are 15 trees in the grove. Workers planted some and now there are 21. How many did they plant?\nA: 6\n\nQ: A baker has 24 cookies. He sells 7 and bakes 12 more. How many does he have?\nA: 29\n\nQ: ${problems.arith.question}\nA:`,
      sentiment: `Review: "Loved the atmosphere, hated the food."\nSentiment: mixed\n\nReview: "Best meal I've had in years."\nSentiment: positive\n\nReview: "Cold soup, rude staff."\nSentiment: negative\n\nReview: "The food arrived cold and late, but the waiter was incredibly kind and the dessert was outstanding."\nSentiment:`,
      trap: `Q: When I was 10, my brother was 5. Now I am 40. How old is my brother?\nA: 35\n\nQ: ${problems.trap.question}\nA:`,
      translation: `English: "The cat is on the mat."\nFrench: "Le chat est sur le tapis."\n\nEnglish: "The book is on the table."\nFrench: "Le livre est sur la table."\n\nEnglish: "The bird is sitting on the tree."\nFrench:`,
    },
    outputs: {
      arith: { text: "11", correct: true, note: "Examples teach the format (single number, no explanation). Model imitates correctly." },
      sentiment: { text: "mixed", correct: true, note: "The 'mixed' label gets in-context probability mass from the first example." },
      trap: { text: "67", correct: true, note: "The single demo teaches the 'fixed age gap' pattern. Few-shot can break a trap that zero-shot cannot." },
      translation: { text: "L'oiseau est sur l'arbre.", correct: true, note: "Demonstrations bias toward the literal pattern." },
    },
  },
  cot_zero: {
    name: "Zero-shot CoT",
    tagline: "Append \"Let's think step by step.\" No demonstrations needed.",
    mechanism: "The trigger phrase unlocks reasoning behavior baked in during instruction tuning. Each generated reasoning token gets its own forward pass; the answer token attends back to the scratch. Trades inference cost for serialized compute depth.",
    when: "Multi-step problems where the answer can't be computed in one pass. Arithmetic, logic, planning. Cheap to try before building few-shot CoT.",
    cost: "~4–8×",
    reliability: 0.7,
    prompts: {
      arith: `Q: ${problems.arith.question}\nA: Let's think step by step.`,
      sentiment: `Classify the sentiment of this review. Let's think step by step.\n\nReview: "The food arrived cold and late, but the waiter was incredibly kind and the dessert was outstanding."`,
      trap: `Q: ${problems.trap.question}\nA: Let's think step by step.`,
      translation: `Translate to French. Let's think step by step about word choice and grammar.\n\nEnglish: "The bird is sitting on the tree."`,
    },
    outputs: {
      arith: { text: "Roger starts with 5. He buys 2 cans × 3 balls = 6 new balls. 5 + 6 = 11. The answer is 11.", correct: true, note: "Each intermediate token expands compute. The multiplication and addition each get their own pass." },
      sentiment: { text: "The review mentions cold food and lateness (negative) but praises the waiter and dessert (positive). Both signals are strong. Answer: mixed.", correct: true, note: "CoT forces the model to enumerate both signals rather than pattern-matching to the strongest." },
      trap: { text: "When I was 6, my sister was 3 (half of 6). So she's 3 years younger than me. Now I'm 70, so she's 70 − 3 = 67.", correct: true, note: "Critical: CoT made the model commit to 'sister is 3 years younger' before computing 'now'." },
      translation: { text: "'Bird' = oiseau. 'Sitting' on a tree → 'perché' (more natural). 'On the tree' = sur l'arbre. Result: L'oiseau est perché sur l'arbre.", correct: true, note: "CoT improves quality by exposing the linguistic decisions." },
    },
  },
  cot_few: {
    name: "Few-shot CoT",
    tagline: "Demonstrations that include the reasoning, not just the answer.",
    mechanism: "Combines fast-weight pattern matching with serialized compute. The demos teach both reasoning style and answer format. Stronger and more reliable than zero-shot CoT — the model has a concrete template to imitate rather than an abstract instruction to interpret.",
    when: "Production CoT use. When zero-shot CoT is unreliable or when the reasoning style needs to follow a specific template (legal citation, medical SOAP notes, structured analysis).",
    cost: "~4–8×",
    reliability: 0.8,
    prompts: {
      arith: `Q: A pet store has 8 puppies. They get 4 more shipments of 2 puppies each. How many now?\nA: Started with 8. Got 4 × 2 = 8 more. Total: 8 + 8 = 16.\n\nQ: ${problems.arith.question}\nA:`,
      sentiment: `Review: "Great service but the food was bland."\nReasoning: Service is praised (positive), food is criticized (negative). Both significant.\nSentiment: mixed\n\nReview: "The food arrived cold and late, but the waiter was incredibly kind and the dessert was outstanding."\nReasoning:`,
      trap: `Q: My uncle was twice my age when I was 10. I am 50 now. How old is he?\nA: When I was 10, uncle was 20. Age gap = 10. Now I am 50, so uncle is 60.\n\nQ: ${problems.trap.question}\nA:`,
      translation: `English: "She is reading a book in the garden."\nThinking: 'reading' → 'lit', 'in the garden' → 'dans le jardin'.\nFrench: "Elle lit un livre dans le jardin."\n\nEnglish: "The bird is sitting on the tree."\nThinking:`,
    },
    outputs: {
      arith: { text: "Started with 5. Got 2 × 3 = 6 more. Total: 5 + 6 = 11. The answer is 11.", correct: true, note: "Output mirrors the demo's exact phrasing. Format consistency is maximal." },
      sentiment: { text: "Cold food and late delivery criticized (negative); waiter and dessert praised (positive). Both significant. Sentiment: mixed", correct: true, note: "Reasoning template is now anchored. Highly reliable across many similar inputs." },
      trap: { text: "When I was 6, sister was 3 (half of 6). Age gap = 3. Now I am 70, so sister is 67.", correct: true, note: "Strongest reliability against trap problems. The demo + reasoning combination is hard to break." },
      translation: { text: "'Sitting' on a tree → 'perché'. 'On the tree' → 'sur l'arbre'. French: \"L'oiseau est perché sur l'arbre.\"", correct: true, note: "Highest-quality translation with the format and style locked." },
    },
  },
  persona: {
    name: "Persona priming",
    tagline: "Prime the model with an identity. \"You are an expert mathematician...\"",
    mechanism: "Not a separate compute pattern — it's a zero-shot variant where the system prompt establishes a persona. The model has been RLHF-trained to behave consistently with assigned roles. Effects are real but moderate; often over-claimed.",
    when: "Domain-specific tasks where vocabulary, register, or rigor matters (medical, legal, code review). Less effective for raw reasoning capability.",
    cost: "1×",
    reliability: 0.45,
    prompts: {
      arith: `You are an expert mathematics tutor known for solving problems carefully and showing your work concisely.\n\nProblem: ${problems.arith.question}\n\nAnswer:`,
      sentiment: `You are a professional review analyst who specializes in distinguishing genuine sentiment from surface-level word polarity.\n\nReview: "The food arrived cold and late, but the waiter was incredibly kind and the dessert was outstanding."\n\nClassification:`,
      trap: `You are a careful logician who pays close attention to what changes versus what stays constant over time.\n\nProblem: ${problems.trap.question}\n\nAnswer:`,
      translation: `You are a French literary translator with a native ear for natural phrasing.\n\nTranslate: "The bird is sitting on the tree."`,
    },
    outputs: {
      arith: { text: "11 (Roger has 5 balls + 2 × 3 = 6 from the cans = 11 total)", correct: true, note: "The 'expert tutor' persona elicits brief work-showing. Not as powerful as CoT but cheaper." },
      sentiment: { text: "mixed — the review contains genuinely opposing signals of similar weight", correct: true, note: "The 'distinguish genuine sentiment' framing helps. Real effect, modest size." },
      trap: { text: "35", correct: false, note: "Persona priming alone doesn't beat the trap. The model needs actual reasoning tokens, not just an attitude." },
      translation: { text: "L'oiseau est perché sur l'arbre.", correct: true, note: "Best lexical choice — 'perché' is the literary register. This is where persona priming earns its keep." },
    },
  },
} as const;
type MethodId = keyof typeof methods;

// ── ICL Methods Explorer ──
function ICLMethodsExplorer() {
  const [problemId, setProblemId] = useState<ProblemId>("arith");
  const [methodId, setMethodId] = useState<MethodId>("zero");

  const p = problems[problemId];
  const method = methods[methodId];
  const output = method.outputs[problemId];
  const prompt = method.prompts[problemId];
  const reliabilityPct = Math.round(method.reliability * 100);

  const reliabilityColor =
    method.reliability >= 0.7 ? S.teal :
    method.reliability >= 0.5 ? S.amber : S.rose;

  return (
    <div className="p2-glass p2-card" style={{ borderRadius: 16, padding: "28px" }}>
      {/* Problem selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 8 }}>
          Pick a problem
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(Object.entries(problems) as [ProblemId, typeof problems[ProblemId]][]).map(([id, prob]) => (
            <button
              key={id}
              className={`p2-btn-pill ${problemId === id ? "p2-btn-pill-active" : ""}`}
              onClick={() => setProblemId(id)}
            >
              {prob.name}
            </button>
          ))}
        </div>
        <div className="p2-glass p2-callout" style={{ marginTop: 12, padding: "12px 16px", borderLeft: `3px solid ${S.rule}`, borderRadius: "0 8px 8px 0" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: S.ink3, letterSpacing: 1.5 }}>
            CORRECT ANSWER: <span style={{ color: S.teal, fontWeight: 600 }}>{p.correct}</span>
          </span>
          <p style={{ marginTop: 6, marginBottom: 0, fontSize: 15, fontStyle: "italic", color: S.ink2 }}>"{p.question}"</p>
        </div>
      </div>

      {/* Method selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 8 }}>
          Pick a method
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {(Object.entries(methods) as [MethodId, typeof methods[MethodId]][]).map(([id, m]) => (
            <button
              key={id}
              className={`p2-btn-pill ${methodId === id ? "p2-btn-pill-active" : ""}`}
              style={{ textAlign: "left", lineHeight: 1.3, padding: "8px 10px" }}
              onClick={() => setMethodId(id)}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Method header */}
      <div style={{ paddingTop: 20, borderTop: `1px solid ${S.rule}`, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
          <h3 className="tracking-tight" style={{ fontSize: 22, fontWeight: 700, color: S.blue, margin: 0 }}>{method.name}</h3>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, background: `${S.blue}18`, color: S.blue, padding: "2px 8px", borderRadius: 4 }}>
            {method.cost} compute
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, background: `${reliabilityColor}18`, color: reliabilityColor, padding: "2px 8px", borderRadius: 4 }}>
            ~{reliabilityPct}% typical reliability
          </span>
        </div>
        <p style={{ fontSize: 15, color: S.ink2, fontStyle: "italic", margin: "0 0 16px" }}>{method.tagline}</p>
      </div>

      {/* Prompt */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 6 }}>
          The literal prompt sent to the model
        </div>
        <pre style={{
          background: "var(--background-soft)", border: `1px solid ${S.rule}`,
          borderRadius: 8, padding: "14px 18px", fontFamily: "var(--mono)",
          fontSize: 12.5, lineHeight: 1.65, overflowX: "auto", color: "var(--foreground)",
          margin: 0, whiteSpace: "pre-wrap",
        }}>
          {prompt}
        </pre>
      </div>

      {/* Output */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 6 }}>
          Typical model output
        </div>
        <div style={{
          borderLeft: `3px solid ${output.correct ? S.teal : S.rose}`,
          background: output.correct ? "rgba(52,211,153,0.06)" : "rgba(251,113,133,0.06)",
          padding: "14px 16px", borderRadius: "0 8px 8px 0",
        }}>
          <div style={{ fontSize: 15, color: S.ink, marginBottom: 10, lineHeight: 1.6 }}>{output.text}</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12 }}>
            <span style={{ fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: 1, color: output.correct ? S.teal : S.rose, whiteSpace: "nowrap" }}>
              {output.correct ? "✓ Correct" : "✗ Wrong"}
            </span>
            <span style={{ color: S.ink3, fontStyle: "italic", lineHeight: 1.5 }}>{output.note}</span>
          </div>
        </div>
      </div>

      {/* Mechanism + When */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        {[
          { label: "Mechanism", text: method.mechanism },
          { label: "When to use it", text: method.when },
        ].map(({ label, text }) => (
          <div key={label} className="p2-glass p2-callout" style={{ padding: "14px 16px", borderLeft: `3px solid ${S.rule}`, borderRadius: "0 8px 8px 0" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, color: S.ink3, marginBottom: 6, fontFamily: "var(--mono)" }}>
              {label}
            </div>
            <div style={{ fontSize: 13.5, color: S.ink2, lineHeight: 1.6 }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Export ──
export default function SectionICLMethods() {
  return (
    <Section
      id="icl-methods"
      eyebrow="2.4 · ICL Methods Explorer"
      title="Six prompting methods, one explorer"
      kicker="The same method has wildly different success rates depending on the task. Compute-shape must match problem-shape."
    >
      <Para>
        There is no universally best prompting strategy. Zero-shot wins translation but loses
        arithmetic. Persona priming helps register but doesn't beat reasoning traps. Few-shot CoT
        is the strongest general method but costs 4–8× more compute and requires carefully crafted
        demonstrations.
      </Para>

      <ICLMethodsExplorer />

      <Callout borderColor={S.amber} labelColor={S.amber} label="The decision tree for prompting">
        <div style={{ display: "grid", gap: 8 }}>
          {[
            { q: "Task in pretraining distribution?", a: "Zero-shot. Done." },
            { q: "Format-sensitive or novel label set?", a: "Add few-shot examples." },
            { q: "Multi-step reasoning needed?", a: "Add CoT (zero-shot first, then few-shot if unreliable)." },
            { q: "Still unreliable?", a: "Self-consistency over N samples." },
            { q: "Domain-specific register matters?", a: "Persona prime + CoT." },
          ].map(({ q, a }) => (
            <div key={q} style={{ display: "flex", gap: 10 }}>
              <span style={{ fontFamily: "var(--mono)", color: S.amber, minWidth: 12, fontSize: 13 }}>▸</span>
              <span style={{ fontSize: 14, color: S.ink2 }}><strong style={{ color: S.ink }}>{q}</strong> → {a}</span>
            </div>
          ))}
        </div>
      </Callout>
    </Section>
  );
}
