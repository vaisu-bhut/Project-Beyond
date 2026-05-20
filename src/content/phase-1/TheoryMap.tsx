"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect, useMemo } from "react";
import { ChapterDivider } from "@/components/book/ChapterDivider";
import NeuralNetworkComponents from "./Chapter3";
import GradientDescent3D from "./GradientDescent3D";
import AITaxonomy from "./AITaxonomy";
import EvaluationFundamentals from "./EvaluationFundamentals";

const ACCENT = "--accent-p1";

// ───────────────────────────────────────────────────────────────────────────
//  PHASE 1 · THEORY MAP
//  Section 1: Five learning paradigms · training stages · RL taxonomy
//  Section 2: Cross-entropy · softmax · KL · gradient descent · Adam ·
//             bias-variance · loss-functions-in-the-wild · synthesis
//  Adapted to the Project Beyond dark theme. Content preserved verbatim.
// ───────────────────────────────────────────────────────────────────────────

const STYLES = `
  .p1-root {
    /* Map the original tokens onto our theme variables. */
    --bg: transparent;
    --bg-elev: var(--background-elevated);
    --bg-sunken: var(--background-soft);
    --ink: var(--foreground);
    --ink-2: color-mix(in oklab, var(--foreground) 85%, transparent);
    --ink-3: var(--foreground-muted);
    --rule: var(--border);
    --indigo: #a78bfa;
    --indigo-soft: rgba(167, 139, 250, 0.16);
    --amber: #fbbf24;
    --amber-soft: rgba(251, 191, 36, 0.14);
    --teal: #34d399;
    --teal-soft: rgba(52, 211, 153, 0.14);
    --crimson: #fb7185;
    --crimson-soft: rgba(251, 113, 133, 0.14);
    --serif: var(--font-geist-sans), system-ui, sans-serif;
    --sans: var(--font-geist-sans), system-ui, sans-serif;
    --mono: var(--font-geist-mono), ui-monospace, monospace;
    color: var(--ink);
    font-family: var(--sans);
  }

  .p1-serif { font-family: var(--serif); letter-spacing: -0.01em; }
  .p1-mono  { font-family: var(--mono); }

  .p1-h1 { font-family: var(--serif); font-weight: 700; letter-spacing: -0.025em; line-height: 1.05; }
  .p1-h2 { font-family: var(--serif); font-weight: 600; letter-spacing: -0.02em;  line-height: 1.15; }
  .p1-h3 { font-family: var(--serif); font-weight: 600; letter-spacing: -0.015em; }
  .p1-body { font-size: 15px; line-height: 1.65; color: var(--ink-2); }
  .p1-body strong { color: var(--ink); font-weight: 500; }
  .p1-eyebrow { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); }

  .p1-card        { background: var(--bg-elev);    border: 1px solid var(--rule); border-radius: 12px; backdrop-filter: blur(8px); }
  .p1-card-sunken { background: var(--bg-sunken);  border: 1px solid var(--rule); border-radius: 10px; }
  .p1-rule { height: 1px; background: var(--rule); border: none; margin: 0; }

  .p1-tag { display: inline-block; font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; }
  .p1-tag-indigo  { background: var(--indigo-soft);  color: var(--indigo);  border: 1px solid color-mix(in oklab, var(--indigo) 35%, transparent); }
  .p1-tag-amber   { background: var(--amber-soft);   color: var(--amber);   border: 1px solid color-mix(in oklab, var(--amber) 35%, transparent); }
  .p1-tag-teal    { background: var(--teal-soft);    color: var(--teal);    border: 1px solid color-mix(in oklab, var(--teal) 35%, transparent); }
  .p1-tag-crimson { background: var(--crimson-soft); color: var(--crimson); border: 1px solid color-mix(in oklab, var(--crimson) 35%, transparent); }

  .p1-btn {
    font-family: var(--sans); font-size: 12px; padding: 6px 12px;
    background: var(--background-soft); border: 1px solid var(--rule);
    color: var(--ink-2); border-radius: 6px; cursor: pointer; transition: all 0.15s;
  }
  .p1-btn:hover { background: var(--border); color: var(--ink); border-color: var(--border-strong); }
  .p1-btn-active { background: var(--ink); color: var(--background); border-color: var(--ink); }
  .p1-btn-active:hover { background: var(--ink); color: var(--background); }

  .p1-slider {
    -webkit-appearance: none; appearance: none;
    height: 2px; background: var(--rule); border-radius: 2px; outline: none;
  }
  .p1-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 14px; height: 14px; border-radius: 50%;
    background: var(--indigo); cursor: pointer;
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--indigo) 20%, transparent);
  }
  .p1-slider::-moz-range-thumb {
    width: 14px; height: 14px; border-radius: 50%;
    background: var(--indigo); cursor: pointer; border: none;
  }

  .p1-fade-in { animation: p1Fade 0.3s ease-in; }
  @keyframes p1Fade { from { opacity: 0; } to { opacity: 1; } }
  .p1-num { font-variant-numeric: tabular-nums; font-family: var(--mono); }
`;

// ─── PRIMITIVES ─────────────────────────────────────────────────────────────

type SectionHeaderProps = { eyebrow: string; title: string; sub?: string };
function SectionHeader({ eyebrow, title, sub }: SectionHeaderProps) {
  return (
    <div className="mb-10">
      <div className="p1-eyebrow mb-4">{eyebrow}</div>
      <h2 className="p1-h2 text-3xl md:text-4xl mb-4" style={{ color: "var(--ink)" }}>
        {title}
      </h2>
      {sub && (
        <p className="p1-body max-w-3xl" style={{ fontFamily: "var(--serif)", fontSize: "17px", lineHeight: 1.55 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

type SliderProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  units?: string;
};
function Slider({ label, min, max, step, value, onChange, format = (v) => v.toFixed(2), units }: SliderProps) {
  return (
    <div className="flex items-center gap-3 mb-2.5">
      <span className="text-xs" style={{ color: "var(--ink-3)", minWidth: "120px" }}>
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="p1-slider flex-1"
      />
      <span className="p1-num text-xs" style={{ color: "var(--ink)", minWidth: "52px", textAlign: "right" }}>
        {format(value)}
        {units}
      </span>
    </div>
  );
}

type Preset = { key: string; label: string; apply?: () => void };
function PresetRow({ presets, active, onPick }: { presets: Preset[]; active?: string; onPick: (p: Preset) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {presets.map((p) => (
        <button
          key={p.key}
          className={"p1-btn " + (active === p.key ? "p1-btn-active" : "")}
          onClick={() => onPick(p)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

// ─── 1.1 · FIVE PARADIGMS ──────────────────────────────────────────────────

const PARADIGMS = [
  {
    key: "supervised",
    name: "Supervised",
    eq: "(x, y) → predict y",
    where: "Image classifiers, sentiment analysis, fine-tuning",
    desc: "Labeled pairs. Model learns f(x) ≈ y by minimizing the gap (cross-entropy or MSE) between prediction and true label.",
    flavors: ["Classification (cross-entropy)", "Regression (MSE/MAE)"],
    bottleneck: "Labels are expensive — radiologist labels at $10/image cap supervised at scale.",
  },
  {
    key: "unsupervised",
    name: "Unsupervised",
    eq: "(x) → find structure",
    where: "Clustering, dimensionality reduction, anomaly detection",
    desc: "No labels. Discover structure: clusters (k-means), low-D projections (PCA, t-SNE, UMAP), density (GMMs), or outliers.",
    flavors: ["k-means, DBSCAN", "PCA, UMAP, t-SNE", "GMMs, anomaly detection"],
    bottleneck: "Largely displaced in deep learning by self-supervised methods, which work better.",
  },
  {
    key: "self",
    name: "Self-Supervised",
    eq: "(x) → labels from x itself",
    where: "Every LLM, ViT, audio FM, CLIP — all foundation models",
    desc: "Construct labels from the data: hide tokens, predict them. Converts unlimited unlabeled data into a supervised problem. The paradigm of the 2020s.",
    flavors: [
      "Next-token prediction (GPT, Claude)",
      "Masked language modeling (BERT)",
      "Contrastive (CLIP, SimCLR)",
      "Masked images (MAE)",
    ],
    bottleneck: "Pretext task design matters — the right task creates rich representations.",
    star: true,
  },
  {
    key: "semi",
    name: "Semi-Supervised",
    eq: "small labeled + large unlabeled",
    where: "Medical imaging, niche domains",
    desc: "Combine a small labeled set with a much larger unlabeled set. Pseudo-labeling, consistency regularization, FixMatch.",
    flavors: ["Pseudo-labeling", "Consistency regularization", "FixMatch, MixMatch"],
    bottleneck: "Mostly displaced by pretraining + small SFT set, but still alive in specialized domains.",
  },
  {
    key: "rl",
    name: "Reinforcement Learning",
    eq: "state → action → reward",
    where: "AlphaGo, robotics, RLHF, reasoning models",
    desc: "Agent acts in an environment, gets scalar rewards, learns a policy that maximizes long-term return. No 'right answer' label — learn by trial and error.",
    flavors: [
      "Value-based (DQN)",
      "Policy-based (REINFORCE)",
      "Actor-critic (PPO, SAC)",
      "RLHF, DPO, GRPO for LLMs",
    ],
    bottleneck: "Reward design is the hardest part. Sparse and delayed rewards make credit assignment difficult.",
  },
];

function ParadigmsSection() {
  const [open, setOpen] = useState("self");
  const active = PARADIGMS.find((p) => p.key === open) ?? PARADIGMS[0];

  return (
    <section id="paradigms" className="scroll-mt-24 py-16 md:py-20" style={{ borderBottom: "1px solid var(--rule)" }}>
      <SectionHeader
        eyebrow="2.1 · Five Paradigms"
        title="What is the model being taught from?"
        sub="Each paradigm differs in what kind of supervision signal exists. The right mental model isn't 'when in training' — it's 'what shape does the data come in?'"
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
        {PARADIGMS.map((p, idx) => (
          <button
            key={p.key}
            onClick={() => setOpen(p.key)}
            className="text-left p-4 transition-all"
            style={{
              background: open === p.key ? "var(--ink)" : "var(--bg-elev)",
              color: open === p.key ? "var(--background)" : "var(--ink)",
              border: "1px solid " + (open === p.key ? "var(--ink)" : "var(--rule)"),
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <div className="p1-mono text-[10px] uppercase tracking-wider opacity-60 mb-2">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div className="p1-serif text-base md:text-lg font-medium leading-tight">{p.name}</div>
            {p.star && open !== p.key && (
              <div className="p1-mono text-[10px] mt-2" style={{ color: "var(--amber)" }}>
                ★ dominant in modern ML
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="p1-card p-6 md:p-8 p1-fade-in" key={open}>
        <div className="flex flex-wrap items-baseline gap-3 mb-4">
          <h3 className="p1-h3 text-2xl">{active.name}</h3>
          <code className="p1-mono text-sm" style={{ color: "var(--indigo)" }}>
            {active.eq}
          </code>
        </div>
        <p className="p1-body mb-5">{active.desc}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4" style={{ borderTop: "1px solid var(--rule)" }}>
          <div>
            <div className="p1-eyebrow mb-2">Flavors</div>
            <ul className="p1-body text-sm space-y-1" style={{ listStyle: "none", padding: 0 }}>
              {active.flavors.map((f, i) => (
                <li key={i} style={{ borderLeft: "1px solid var(--rule)", paddingLeft: "10px" }}>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="p1-eyebrow mb-2">Where you see it</div>
            <p className="p1-body text-sm">{active.where}</p>
          </div>
          <div>
            <div className="p1-eyebrow mb-2">Bottleneck</div>
            <p className="p1-body text-sm">{active.bottleneck}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 1.2 · TRAINING STAGE PIPELINE ─────────────────────────────────────────

function PipelineSection() {
  return (
    <section id="pipeline" className="scroll-mt-24 py-16 md:py-20" style={{ borderBottom: "1px solid var(--rule)" }}>
      <SectionHeader
        eyebrow="2.2 · Training Stages"
        title="Where each paradigm lives in the modern pipeline"
        sub="Pretraining gives knowledge. SFT gives manners. Preference optimization gives taste. After that, weights are frozen."
      />

      <div className="p1-card p-6 md:p-10 mb-6">
        <svg viewBox="0 0 1000 280" className="w-full h-auto">
          <defs>
            <marker id="pipeArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-3)" />
            </marker>
          </defs>

          {/* Pretraining */}
          <g>
            <rect x="40" y="50" width="220" height="120" rx="8" fill="var(--indigo-soft)" stroke="var(--indigo)" strokeWidth="0.8" />
            <text x="150" y="78" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" letterSpacing="2" fill="var(--indigo)">STAGE 1</text>
            <text x="150" y="102" textAnchor="middle" fontFamily="var(--serif)" fontSize="20" fontWeight="600" fill="var(--ink)">Pretraining</text>
            <text x="150" y="125" textAnchor="middle" fontFamily="var(--sans)" fontSize="12" fill="var(--ink-2)">Self-supervised</text>
            <text x="150" y="142" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--ink-3)">trillions of tokens</text>
            <text x="150" y="158" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--ink-3)">→ knowledge</text>
          </g>
          <line x1="262" y1="110" x2="298" y2="110" stroke="var(--ink-3)" strokeWidth="0.8" markerEnd="url(#pipeArrow)" />

          {/* SFT */}
          <g>
            <rect x="300" y="50" width="220" height="120" rx="8" fill="var(--teal-soft)" stroke="var(--teal)" strokeWidth="0.8" />
            <text x="410" y="78" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" letterSpacing="2" fill="var(--teal)">STAGE 2</text>
            <text x="410" y="102" textAnchor="middle" fontFamily="var(--serif)" fontSize="20" fontWeight="600" fill="var(--ink)">SFT</text>
            <text x="410" y="125" textAnchor="middle" fontFamily="var(--sans)" fontSize="12" fill="var(--ink-2)">Supervised</text>
            <text x="410" y="142" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--ink-3)">10k–100k pairs</text>
            <text x="410" y="158" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--ink-3)">→ manners</text>
          </g>
          <line x1="522" y1="110" x2="558" y2="110" stroke="var(--ink-3)" strokeWidth="0.8" markerEnd="url(#pipeArrow)" />

          {/* Post-training */}
          <g>
            <rect x="560" y="50" width="220" height="120" rx="8" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="0.8" />
            <text x="670" y="78" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" letterSpacing="2" fill="var(--amber)">STAGE 3</text>
            <text x="670" y="102" textAnchor="middle" fontFamily="var(--serif)" fontSize="20" fontWeight="600" fill="var(--ink)">Post-training</text>
            <text x="670" y="125" textAnchor="middle" fontFamily="var(--sans)" fontSize="12" fill="var(--ink-2)">RL / Preference</text>
            <text x="670" y="142" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--ink-3)">RLHF, DPO, GRPO</text>
            <text x="670" y="158" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--ink-3)">→ taste</text>
          </g>
          <line x1="782" y1="110" x2="818" y2="110" stroke="var(--ink-3)" strokeWidth="0.8" markerEnd="url(#pipeArrow)" />

          {/* Frozen */}
          <g>
            <rect x="820" y="50" width="140" height="120" rx="8" fill="var(--bg-sunken)" stroke="var(--ink-3)" strokeWidth="0.8" />
            <text x="890" y="78" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" letterSpacing="2" fill="var(--ink-3)">DEPLOY</text>
            <text x="890" y="102" textAnchor="middle" fontFamily="var(--serif)" fontSize="18" fontWeight="600" fill="var(--ink)">Frozen</text>
            <text x="890" y="125" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--ink-3)">weights locked</text>
            <text x="890" y="142" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--ink-3)">no learning</text>
            <text x="890" y="158" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--ink-3)">from chats</text>
          </g>

          <text x="500" y="220" textAnchor="middle" fontFamily="var(--serif)" fontStyle="italic" fontSize="14" fill="var(--ink-2)">
            "Continuous learning" within a chat happens in the context window, not in the weights.
          </text>
          <text x="500" y="245" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--ink-3)">
            Memory systems and RAG retrieve external state into the prompt — they don't update parameters.
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p1-card-sunken p-5">
          <div className="p1-eyebrow mb-2" style={{ color: "var(--indigo)" }}>Stage 1 · Knowledge</div>
          <p className="p1-body text-sm">
            Predict the next token across all of the internet. Loss = cross-entropy at every position. Output: a base model that
            <em> completes </em>
            text but doesn't yet follow instructions.
          </p>
        </div>
        <div className="p1-card-sunken p-5">
          <div className="p1-eyebrow mb-2" style={{ color: "var(--teal)" }}>Stage 2 · Manners</div>
          <p className="p1-body text-sm">
            Train on human-curated <span className="p1-mono text-xs">(prompt, response)</span> pairs. Same loss as pretraining, different
            data shape. Now the model imitates "good answers" — but has no taste between two reasonable ones.
          </p>
        </div>
        <div className="p1-card-sunken p-5">
          <div className="p1-eyebrow mb-2" style={{ color: "var(--amber)" }}>Stage 3 · Taste</div>
          <p className="p1-body text-sm">
            Train on <span className="p1-mono text-xs">(preferred, rejected)</span> response pairs. The model learns the
            <em> gradient </em>
            between good and bad — refusal, helpfulness, honesty in subtle cases SFT can't reach.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 1.3 · RL TAXONOMY ─────────────────────────────────────────────────────

function RLTaxonomy() {
  return (
    <section id="rl-taxonomy" className="scroll-mt-24 py-16 md:py-20" style={{ borderBottom: "1px solid var(--rule)" }}>
      <SectionHeader
        eyebrow="2.3 · RL Family Tree"
        title="The RL family tree"
        sub="Classical RL gave us PPO; LLM post-training built RLHF on top of PPO; DPO and friends rearranged the math to skip RL entirely while solving the same problem."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classical RL */}
        <div className="p1-card p-6">
          <div className="p1-eyebrow mb-3" style={{ color: "var(--indigo)" }}>Classical RL</div>
          <h3 className="p1-h3 text-xl mb-4">Games, robotics, control</h3>

          <div className="space-y-3">
            {[
              { name: "Value-based", ex: "Q-learning · DQN", note: "Learn Q(s, a). Policy is implicit: argmax." },
              { name: "Policy-based", ex: "REINFORCE · TRPO", note: "Learn π(a|s) directly. Higher variance." },
              { name: "Actor-critic", ex: "A2C · PPO · SAC", note: "Combine both. Modern deep RL lives here." },
              { name: "Model-based", ex: "MuZero · Dreamer", note: "Learn environment dynamics, then plan." },
            ].map((m) => (
              <div key={m.name} className="pl-4" style={{ borderLeft: "2px solid var(--rule)" }}>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="p1-serif text-base font-medium">{m.name}</span>
                  <code className="p1-mono text-xs" style={{ color: "var(--ink-3)" }}>{m.ex}</code>
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--ink-2)" }}>{m.note}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--rule)" }}>
            <div className="p1-eyebrow mb-1.5">Orthogonal axis</div>
            <p className="p1-body text-xs">
              <strong>On-policy</strong> (PPO) only learns from current-policy data — toss after each update.{" "}
              <strong>Off-policy</strong> (DQN) reuses old data — sample-efficient, harder to stabilize.
            </p>
          </div>
        </div>

        {/* RL for LLMs */}
        <div className="p1-card p-6" style={{ borderColor: "color-mix(in oklab, var(--amber) 40%, transparent)" }}>
          <div className="p1-eyebrow mb-3" style={{ color: "var(--amber)" }}>RL for LLMs</div>
          <h3 className="p1-h3 text-xl mb-4">Alignment, post-training</h3>

          <div className="mb-4">
            <div className="p1-mono text-[10px] tracking-wider uppercase mb-2" style={{ color: "var(--ink-3)" }}>
              Full RL pipeline
            </div>
            <div className="space-y-2.5">
              {[
                { name: "RLHF", ex: "PPO + reward model + human prefs", note: "InstructGPT recipe. Stable but heavy infra." },
                { name: "RLAIF", ex: "RLHF with AI-generated preferences", note: "Scales beyond human labelers." },
                { name: "Constitutional AI", ex: "Self-critique against principles", note: "Anthropic's approach." },
                { name: "GRPO", ex: "PPO without value model", note: "DeepSeek R1's reasoning recipe." },
              ].map((m) => (
                <div key={m.name} className="pl-4" style={{ borderLeft: "2px solid var(--amber)" }}>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="p1-serif text-base font-medium">{m.name}</span>
                    <code className="p1-mono text-[11px]" style={{ color: "var(--ink-3)" }}>{m.ex}</code>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--ink-2)" }}>{m.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="p1-mono text-[10px] tracking-wider uppercase mb-2" style={{ color: "var(--ink-3)" }}>
              Preference opt (no RL loop)
            </div>
            <div className="space-y-2.5">
              {[
                { name: "DPO", ex: "Direct preference optimization", note: "Skip the reward model. The 2023 game-changer." },
                { name: "IPO", ex: "Identity preference optimization", note: "Fixes DPO's overfitting on dense prefs." },
                { name: "KTO", ex: "Kahneman-Tversky optimization", note: "Single ratings, not pairs." },
              ].map((m) => (
                <div key={m.name} className="pl-4" style={{ borderLeft: "2px solid var(--teal)" }}>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="p1-serif text-base font-medium">{m.name}</span>
                    <code className="p1-mono text-[11px]" style={{ color: "var(--ink-3)" }}>{m.ex}</code>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--ink-2)" }}>{m.note}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="p1-body text-xs mt-4 italic" style={{ color: "var(--ink-3)" }}>
            Note: DPO/IPO/KTO are <em>technically</em> not RL — no environment, no rollouts. They solve the same alignment
            problem with a clever loss instead of an RL loop.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 2.0 · LOSS FUNCTIONS IN PRODUCTION ────────────────────────────────────

function LossExamplesSection() {
  const rows = [
    {
      loss: "Cross-entropy",
      tag: "indigo" as const,
      output: "Discrete class / token",
      models:
        "GPT, Claude, Llama (next-token) · ResNet, ViT (image classes) · Whisper (text tokens) · DistilBERT (sentiment) · AlphaFold distogram (binned distances)",
      why: "Penalizes confident wrongness asymmetrically — drives calibrated probabilities.",
    },
    {
      loss: "MSE",
      tag: "teal" as const,
      output: "Continuous, clean data",
      models:
        "Stable Diffusion / FLUX (predict noise) · AlphaFold coordinates · house prices · weather · RL value functions",
      why: "Differentiable everywhere. Outliers get squared — sometimes a feature, sometimes a bug.",
    },
    {
      loss: "MAE",
      tag: "amber" as const,
      output: "Continuous, outlier-heavy",
      models: "Robust financial regression · depth estimation · optical flow · quantile regression",
      why: "Linear, not quadratic. Outliers can't dominate the gradient.",
    },
    {
      loss: "Contrastive",
      tag: "crimson" as const,
      output: "Embeddings / representations",
      models: "CLIP · SimCLR · DINO · sentence embeddings · two-tower recsys",
      why: "Cares about relative similarity, not absolute values. Pull positives together, push negatives apart.",
    },
    {
      loss: "KL divergence",
      tag: "indigo" as const,
      output: "Distribution-to-distribution",
      models: "VAEs (encoder ↔ prior) · RLHF/PPO (policy ↔ reference) · knowledge distillation (student ↔ teacher) · MoE load balance",
      why: "Information-theoretic distance. Used as a constraint or a matching loss.",
    },
    {
      loss: "DPO loss",
      tag: "amber" as const,
      output: "Preference between responses",
      models: "Modern open-weight LLM post-training · Tulu · Zephyr · Llama-Instruct",
      why: "Encodes 'A > B' as a log-sigmoid gap, no separate reward model needed.",
    },
  ];

  return (
    <section id="losses" className="scroll-mt-24 py-16 md:py-20" style={{ borderBottom: "1px solid var(--rule)" }}>
      <SectionHeader
        eyebrow="3.0 · Losses in the Wild"
        title="What real models actually minimize"
        sub="The shape of the loss is the specification of the task. Different output shapes call for different shapes of pain."
      />

      <div className="p1-card overflow-hidden">
        <div
          className="hidden md:grid grid-cols-12 gap-4 p-4 px-6"
          style={{ borderBottom: "1px solid var(--rule)", background: "var(--bg-sunken)" }}
        >
          <div className="col-span-2 p1-eyebrow">Loss</div>
          <div className="col-span-2 p1-eyebrow">Output type</div>
          <div className="col-span-5 p1-eyebrow">Real-world models</div>
          <div className="col-span-3 p1-eyebrow">Why this shape</div>
        </div>

        {rows.map((r, i) => (
          <div
            key={r.loss}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 px-6"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--rule)" : "none" }}
          >
            <div className="md:col-span-2">
              <div className={"p1-tag p1-tag-" + r.tag + " mb-1"}>{r.loss}</div>
            </div>
            <div className="md:col-span-2 p1-body text-sm">{r.output}</div>
            <div className="md:col-span-5 p1-body text-sm">{r.models}</div>
            <div className="md:col-span-3 p1-body text-sm italic" style={{ color: "var(--ink-3)" }}>
              {r.why}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── EQ 1 · CROSS-ENTROPY ──────────────────────────────────────────────────

function CrossEntropySection() {
  const [p, setP] = useState<number[]>([70, 20, 7, 3]);
  const labels = ["cat", "dog", "bird", "fish"];
  const trueIdx = 0;

  const presets: Preset[] = [
    { key: "right", label: "Confident · right", apply: () => setP([90, 6, 2, 2]) },
    { key: "uncertain", label: "Uncertain", apply: () => setP([40, 30, 20, 10]) },
    { key: "wrong", label: "Confident · wrong", apply: () => setP([3, 90, 5, 2]) },
    { key: "uniform", label: "Pure guessing", apply: () => setP([25, 25, 25, 25]) },
  ];

  const sum = p.reduce((a, b) => a + b, 0);
  const probs = p.map((v) => v / sum);
  const pTrue = Math.max(probs[trueIdx], 1e-9);
  const loss = -Math.log(pTrue);

  let verdict: string;
  let vColor: "teal" | "amber" | "crimson";
  if (loss < 0.5) {
    verdict = "Low loss — confident & right";
    vColor = "teal";
  } else if (loss < 1.5) {
    verdict = "Medium — uncertain";
    vColor = "amber";
  } else {
    verdict = "High loss — confidently wrong";
    vColor = "crimson";
  }

  const curveD = useMemo(() => {
    let d = "";
    for (let i = 1; i <= 100; i++) {
      const pp = i / 100;
      const ll = Math.min(-Math.log(pp), 6);
      const x = 60 + pp * 500;
      const y = 200 - ll * 30;
      d += (i === 1 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    }
    return d;
  }, []);

  const dotX = 60 + pTrue * 500;
  const dotY = 200 - Math.min(loss, 6) * 30;

  return (
    <section id="cross-entropy" className="scroll-mt-24 py-16 md:py-20" style={{ borderBottom: "1px solid var(--rule)" }}>
      <SectionHeader
        eyebrow="3.1 · Cross-Entropy"
        title="−log(p_true) — the asymmetric punishment"
        sub="Confident & right gets near-zero loss. Confident & wrong gets catastrophic loss. The asymmetry is what forces models to be calibrated."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p1-card p-6">
          <div className="p1-eyebrow mb-3">Try it · 4-class image classifier</div>
          <p className="p1-body text-sm mb-4">
            True class: <span className="p1-tag p1-tag-teal">cat</span>
          </p>

          <PresetRow presets={presets} onPick={(pp) => pp.apply?.()} />

          {labels.map((lab, i) => (
            <Slider
              key={lab}
              label={`P(${lab})`}
              min={1}
              max={97}
              step={1}
              value={p[i]}
              onChange={(v) => {
                const np = [...p];
                np[i] = v;
                setP(np);
              }}
              format={() => (p[i] / sum).toFixed(2)}
            />
          ))}

          <div className="flex gap-1.5 mt-4 items-end" style={{ height: "100px", borderBottom: "1px solid var(--rule)" }}>
            {probs.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <span className="p1-num text-[10px] mb-1" style={{ color: "var(--ink-2)" }}>
                  {Math.round(v * 100)}%
                </span>
                <div
                  style={{
                    width: "100%",
                    height: `${v * 80 + 2}px`,
                    background: i === trueIdx ? "var(--teal)" : "var(--indigo)",
                    borderRadius: "3px 3px 0 0",
                    transition: "height 0.15s",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 pt-1.5">
            {labels.map((l, i) => (
              <div key={l} className="flex-1 text-center text-[10px]" style={{ color: "var(--ink-3)" }}>
                {l}
                {i === trueIdx && " ★"}
              </div>
            ))}
          </div>

          <div
            className="mt-4 p-3 flex items-baseline gap-3"
            style={{ background: "var(--bg-sunken)", borderRadius: "8px", border: "1px solid var(--rule)" }}
          >
            <span className="p1-num text-2xl" style={{ color: "var(--ink)" }}>
              {loss.toFixed(2)}
            </span>
            <span className="text-xs" style={{ color: "var(--ink-3)" }}>cross-entropy loss</span>
            <span className={"p1-tag p1-tag-" + vColor + " ml-auto"}>{verdict}</span>
          </div>
        </div>

        <div className="p1-card p-6">
          <div className="p1-eyebrow mb-3">The shape · −log(p)</div>
          <p className="p1-body text-sm mb-4">
            As p → 0, loss → ∞. The vertical wall on the left is what makes confident wrongness so unsurvivable.
          </p>

          <svg viewBox="0 0 600 240" className="w-full">
            <line x1="60" y1="20" x2="60" y2="200" stroke="var(--rule)" strokeWidth="0.5" />
            <line x1="60" y1="200" x2="560" y2="200" stroke="var(--rule)" strokeWidth="0.5" />
            {[0, 2, 4, 6].map((y, i) => (
              <text key={y} x="56" y={200 - i * 60} textAnchor="end" dominantBaseline="central" fontSize="10" fill="var(--ink-3)" fontFamily="var(--mono)">
                {y === 6 ? "6+" : y}
              </text>
            ))}
            <text x="60" y="220" textAnchor="start" fontSize="10" fill="var(--ink-3)" fontFamily="var(--mono)">p = 0</text>
            <text x="560" y="220" textAnchor="end" fontSize="10" fill="var(--ink-3)" fontFamily="var(--mono)">p = 1</text>
            <path d={curveD} fill="none" stroke="var(--indigo)" strokeWidth="2" />
            <line x1={dotX} y1={dotY} x2={dotX} y2="200" stroke="var(--amber)" strokeWidth="0.6" strokeDasharray="3 3" />
            <circle cx={dotX} cy={dotY} r="6" fill="var(--amber)" stroke="var(--background)" strokeWidth="2" />
          </svg>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { p: "0.99", l: "0.01" },
              { p: "0.50", l: "0.69" },
              { p: "0.10", l: "2.30" },
              { p: "0.01", l: "4.61" },
            ].map((r) => (
              <div key={r.p} className="p1-card-sunken p-2.5">
                <div className="text-[10px]" style={{ color: "var(--ink-3)" }}>p = {r.p}</div>
                <div className="p1-num text-sm" style={{ color: "var(--ink)" }}>{r.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── EQ 2 · SOFTMAX ────────────────────────────────────────────────────────

function SoftmaxSection() {
  const [logits, setLogits] = useState<number[]>([3.2, 2.1, 1.5, 0.4, -1.0]);
  const [T, setT] = useState(1.0);
  const labels = ["sat", "jumped", "ran", "slept", "exploded"];

  const presets: Preset[] = [
    { key: "typical", label: "Typical scores", apply: () => setLogits([3.2, 2.1, 1.5, 0.4, -1.0]) },
    { key: "close", label: "Close call", apply: () => setLogits([2.5, 2.3, 2.0, 1.8, 1.2]) },
    { key: "clear", label: "Clear winner", apply: () => setLogits([5.5, 1.0, 0.5, -0.5, -1.5]) },
    { key: "tied", label: "Two-way tie", apply: () => setLogits([3.0, 3.0, 0.5, 0.0, -1.0]) },
  ];

  const scaled = logits.map((z) => z / T);
  const m = Math.max(...scaled);
  const exps = scaled.map((z) => Math.exp(z - m));
  const sumE = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map((e) => e / sumE);

  const minL = Math.min(...logits, 0);
  const maxL = Math.max(...logits, 1);
  const range = maxL - minL || 1;

  let verdict: string;
  if (T < 0.4) verdict = `Low T (${T.toFixed(2)}) — peaky, near-deterministic. Top choice dominates.`;
  else if (T < 0.85) verdict = `Cool (${T.toFixed(2)}) — sharper, more confident. Common in production.`;
  else if (T < 1.15) verdict = `Standard (${T.toFixed(2)}) — sample proportional to model's beliefs.`;
  else if (T < 2) verdict = `Warm (${T.toFixed(2)}) — flattening. More creative, more risk.`;
  else verdict = `Hot (${T.toFixed(2)}) — approaching uniform. Output gets chaotic.`;

  return (
    <section id="softmax" className="scroll-mt-24 py-16 md:py-20" style={{ borderBottom: "1px solid var(--rule)" }}>
      <SectionHeader
        eyebrow="3.2 · Softmax"
        title="e^{z_i} / Σ e^{z_j} — turning scores into probabilities"
        sub="Exponentials make everything positive; division normalizes to sum 1. The temperature dial in every LLM API is exactly this T."
      />

      <div className="p1-card p-6">
        <PresetRow presets={presets} onPick={(pp) => pp.apply?.()} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <div className="p1-eyebrow mb-2">Logits (raw network output)</div>
            {labels.map((lab, i) => (
              <Slider
                key={lab}
                label={`"${lab}"`}
                min={-3}
                max={6}
                step={0.1}
                value={logits[i]}
                onChange={(v) => {
                  const nl = [...logits];
                  nl[i] = v;
                  setLogits(nl);
                }}
                format={(v) => v.toFixed(1)}
              />
            ))}
          </div>
          <div>
            <div className="p1-eyebrow mb-2">Temperature</div>
            <Slider label="T" min={0.1} max={3} step={0.05} value={T} onChange={setT} />
            <div className="mt-3 p1-card-sunken p-3 text-xs" style={{ color: "var(--ink-2)" }}>
              {verdict}
            </div>
          </div>
        </div>

        <hr className="p1-rule my-5" />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-center text-xs mb-2" style={{ color: "var(--ink-3)" }}>Logits (input)</div>
            <div className="flex gap-1.5 items-end" style={{ height: "120px", borderBottom: "1px solid var(--rule)" }}>
              {logits.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <span className="p1-num text-[10px] mb-1" style={{ color: "var(--ink-2)" }}>{v.toFixed(1)}</span>
                  <div
                    style={{
                      width: "100%",
                      height: `${((v - minL) / range) * 95 + 2}px`,
                      background: "var(--ink-3)",
                      borderRadius: "3px 3px 0 0",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 pt-1.5">
              {labels.map((l) => (
                <div key={l} className="flex-1 text-center text-[9px]" style={{ color: "var(--ink-3)" }}>{l}</div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-center text-xs mb-2" style={{ color: "var(--ink-3)" }}>Probabilities (after softmax)</div>
            <div className="flex gap-1.5 items-end" style={{ height: "120px", borderBottom: "1px solid var(--rule)" }}>
              {probs.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <span className="p1-num text-[10px] mb-1" style={{ color: "var(--ink-2)" }}>
                    {Math.round(v * 100)}%
                  </span>
                  <div
                    style={{
                      width: "100%",
                      height: `${v * 100 + 2}px`,
                      background: "var(--indigo)",
                      borderRadius: "3px 3px 0 0",
                      transition: "height 0.15s",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 pt-1.5">
              {labels.map((l) => (
                <div key={l} className="flex-1 text-center text-[9px]" style={{ color: "var(--ink-3)" }}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── EQ 3 · KL DIVERGENCE ──────────────────────────────────────────────────

function KLDivergenceSection() {
  const [pRaw, setPRaw] = useState<number[]>([50, 30, 15, 5]);
  const [qRaw, setQRaw] = useState<number[]>([40, 35, 15, 10]);

  const presets: Preset[] = [
    { key: "match", label: "Perfect match", apply: () => { setPRaw([50, 30, 15, 5]); setQRaw([50, 30, 15, 5]); } },
    { key: "close", label: "Close approximation", apply: () => { setPRaw([50, 30, 15, 5]); setQRaw([45, 32, 16, 7]); } },
    { key: "shifted", label: "Shifted", apply: () => { setPRaw([50, 30, 15, 5]); setQRaw([10, 30, 40, 20]); } },
    { key: "disaster", label: "Q misses P's mode", apply: () => { setPRaw([70, 20, 8, 2]); setQRaw([3, 40, 40, 17]); } },
  ];

  const norm = (a: number[]) => {
    const s = a.reduce((x, y) => x + y, 0);
    return a.map((v) => v / s);
  };
  const p = norm(pRaw);
  const q = norm(qRaw);
  const klFn = (a: number[], b: number[]) =>
    a.reduce(
      (acc, ai, i) =>
        acc + Math.max(ai, 1e-12) * Math.log(Math.max(ai, 1e-12) / Math.max(b[i], 1e-12)),
      0,
    );
  const klPQ = klFn(p, q);
  const klQP = klFn(q, p);

  return (
    <section id="kl" className="scroll-mt-24 py-16 md:py-20" style={{ borderBottom: "1px solid var(--rule)" }}>
      <SectionHeader
        eyebrow="3.3 · KL Divergence"
        title="Σ P log(P/Q) — how poorly Q approximates P"
        sub="Always ≥ 0. Zero only when distributions match exactly. Asymmetric (KL(P‖Q) ≠ KL(Q‖P)) — used as a constraint in RLHF, a matching loss in distillation, and the inner cousin of cross-entropy."
      />

      <div className="p1-card p-6">
        <PresetRow presets={presets} onPick={(pp) => pp.apply?.()} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="p1-eyebrow mb-2" style={{ color: "var(--indigo)" }}>P · reference distribution</div>
            {["A", "B", "C", "D"].map((lab, i) => (
              <Slider
                key={"p" + lab}
                label={`P(${lab})`}
                min={1}
                max={90}
                step={1}
                value={pRaw[i]}
                onChange={(v) => {
                  const n = [...pRaw];
                  n[i] = v;
                  setPRaw(n);
                }}
                format={() => p[i].toFixed(2)}
              />
            ))}
          </div>
          <div>
            <div className="p1-eyebrow mb-2" style={{ color: "var(--teal)" }}>Q · approximation</div>
            {["A", "B", "C", "D"].map((lab, i) => (
              <Slider
                key={"q" + lab}
                label={`Q(${lab})`}
                min={1}
                max={90}
                step={1}
                value={qRaw[i]}
                onChange={(v) => {
                  const n = [...qRaw];
                  n[i] = v;
                  setQRaw(n);
                }}
                format={() => q[i].toFixed(2)}
              />
            ))}
          </div>
        </div>

        <hr className="p1-rule my-5" />

        <div className="flex gap-2 items-end" style={{ height: "120px", borderBottom: "1px solid var(--rule)" }}>
          {["A", "B", "C", "D"].map((lab, i) => (
            <div key={lab} className="flex-1 flex flex-col items-center">
              <div className="text-[10px] mb-1">
                <span className="p1-num" style={{ color: "var(--indigo)" }}>{Math.round(p[i] * 100)}</span>
                <span className="mx-1" style={{ color: "var(--ink-3)" }}>/</span>
                <span className="p1-num" style={{ color: "var(--teal)" }}>{Math.round(q[i] * 100)}</span>
              </div>
              <div className="flex w-full gap-1 items-end" style={{ height: "95px" }}>
                <div style={{ flex: 1, height: `${p[i] * 90 + 2}px`, background: "var(--indigo)", borderRadius: "3px 3px 0 0" }} />
                <div style={{ flex: 1, height: `${q[i] * 90 + 2}px`, background: "var(--teal)", borderRadius: "3px 3px 0 0" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1.5">
          {["A", "B", "C", "D"].map((l) => (
            <div key={l} className="flex-1 text-center text-xs" style={{ color: "var(--ink-3)" }}>{l}</div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="p1-card-sunken p-4">
            <div className="text-xs mb-1" style={{ color: "var(--ink-3)" }}>KL(P‖Q)</div>
            <div className="p1-num text-2xl" style={{ color: "var(--ink)" }}>{klPQ.toFixed(2)}</div>
            <div className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>How poorly Q approximates P</div>
          </div>
          <div className="p1-card-sunken p-4">
            <div className="text-xs mb-1" style={{ color: "var(--ink-3)" }}>KL(Q‖P)</div>
            <div className="p1-num text-2xl" style={{ color: "var(--ink-2)" }}>{klQP.toFixed(2)}</div>
            <div className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>Note: different from KL(P‖Q) — KL is asymmetric</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONNECTION DIAGRAM ────────────────────────────────────────────────────

function ConnectionsSection() {
  return (
    <section id="connections" className="scroll-mt-24 py-16 md:py-20" style={{ borderBottom: "1px solid var(--rule)", background: "var(--bg-sunken)" }}>
      <SectionHeader
        eyebrow="3.4 · Connections"
        title="How softmax, cross-entropy, and KL connect"
        sub="They're not three concepts — they're one mechanism viewed three ways. This is the inner loop of every classifier and language model."
      />

      <div className="p1-card p-6 md:p-10 mb-6">
        <svg viewBox="0 0 1000 220" className="w-full h-auto">
          <defs>
            <marker id="arrSyn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-3)" />
            </marker>
          </defs>

          <g>
            <rect x="20" y="60" width="180" height="80" rx="8" fill="var(--bg-elev)" stroke="var(--rule)" strokeWidth="0.8" />
            <text x="110" y="88" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" letterSpacing="2" fill="var(--ink-3)">RAW LOGITS</text>
            <text x="110" y="110" textAnchor="middle" fontFamily="var(--mono)" fontSize="14" fill="var(--ink)">z = [2.1, 0.8, ...]</text>
            <text x="110" y="128" textAnchor="middle" fontFamily="var(--sans)" fontSize="10" fill="var(--ink-3)">network's last layer</text>
          </g>

          <g>
            <line x1="200" y1="100" x2="280" y2="100" stroke="var(--ink-3)" strokeWidth="0.8" markerEnd="url(#arrSyn)" />
            <text x="240" y="92" textAnchor="middle" fontFamily="var(--serif)" fontStyle="italic" fontSize="13" fill="var(--indigo)">softmax</text>
            <text x="240" y="115" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-3)">e^z / Σe^z</text>
          </g>

          <g>
            <rect x="290" y="60" width="180" height="80" rx="8" fill="var(--indigo-soft)" stroke="var(--indigo)" strokeWidth="0.8" />
            <text x="380" y="88" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" letterSpacing="2" fill="var(--indigo)">DISTRIBUTION Q</text>
            <text x="380" y="110" textAnchor="middle" fontFamily="var(--mono)" fontSize="14" fill="var(--ink)">[0.65, 0.20, ...]</text>
            <text x="380" y="128" textAnchor="middle" fontFamily="var(--sans)" fontSize="10" fill="var(--ink-3)">model's prediction</text>
          </g>

          <g>
            <line x1="470" y1="100" x2="550" y2="100" stroke="var(--ink-3)" strokeWidth="0.8" markerEnd="url(#arrSyn)" />
            <text x="510" y="92" textAnchor="middle" fontFamily="var(--serif)" fontStyle="italic" fontSize="13" fill="var(--amber)">cross-entropy</text>
            <text x="510" y="115" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-3)">−log Q(true)</text>
          </g>

          <g>
            <rect x="560" y="60" width="180" height="80" rx="8" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="0.8" />
            <text x="650" y="88" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" letterSpacing="2" fill="var(--amber)">SCALAR LOSS</text>
            <text x="650" y="110" textAnchor="middle" fontFamily="var(--mono)" fontSize="14" fill="var(--ink)">L = 0.43</text>
            <text x="650" y="128" textAnchor="middle" fontFamily="var(--sans)" fontSize="10" fill="var(--ink-3)">single number</text>
          </g>

          <g>
            <line x1="740" y1="100" x2="820" y2="100" stroke="var(--ink-3)" strokeWidth="0.8" markerEnd="url(#arrSyn)" />
            <text x="780" y="92" textAnchor="middle" fontFamily="var(--serif)" fontStyle="italic" fontSize="13" fill="var(--teal)">backprop</text>
            <text x="780" y="115" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-3)">∂L/∂z = Q − P</text>
          </g>

          <g>
            <rect x="830" y="60" width="150" height="80" rx="8" fill="var(--teal-soft)" stroke="var(--teal)" strokeWidth="0.8" />
            <text x="905" y="88" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" letterSpacing="2" fill="var(--teal)">UPDATE θ</text>
            <text x="905" y="110" textAnchor="middle" fontFamily="var(--mono)" fontSize="13" fill="var(--ink)">θ ← θ − η∇L</text>
            <text x="905" y="128" textAnchor="middle" fontFamily="var(--sans)" fontSize="10" fill="var(--ink-3)">SGD or Adam</text>
          </g>

          <text x="500" y="180" textAnchor="middle" fontFamily="var(--serif)" fontStyle="italic" fontSize="14" fill="var(--ink-2)">
            Cross-entropy = KL(P ‖ Q) + H(P)
          </text>
          <text x="500" y="200" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--ink-3)">
            When P is fixed (one-hot label), minimizing cross-entropy is equivalent to minimizing KL divergence.
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p1-card p-5">
          <div className="p1-eyebrow mb-2" style={{ color: "var(--indigo)" }}>Connection 1</div>
          <p className="p1-body text-sm">
            Softmax produces the input that cross-entropy consumes. Inside <code className="p1-mono text-xs">F.cross_entropy</code>, both happen — fused for numerical stability.
          </p>
        </div>
        <div className="p1-card p-5">
          <div className="p1-eyebrow mb-2" style={{ color: "var(--amber)" }}>Connection 2</div>
          <p className="p1-body text-sm">
            Cross-entropy <em>is</em> KL divergence (plus a constant H(P) that doesn't affect gradients). Same optimization problem, dressed differently.
          </p>
        </div>
        <div className="p1-card p-5">
          <div className="p1-eyebrow mb-2" style={{ color: "var(--teal)" }}>Connection 3</div>
          <p className="p1-body text-sm">
            The gradient with respect to logits is <code className="p1-mono text-xs">Q − P</code>. Famously clean. This is why softmax+CE dominates classification.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── EQ 4 · GRADIENT DESCENT ───────────────────────────────────────────────

function GradientDescentSection() {
  return (
    <section id="gradient-descent" className="scroll-mt-24 py-16 md:py-20" style={{ borderBottom: "1px solid var(--rule)" }}>
      <SectionHeader
        eyebrow="3.5 · Gradient Descent"
        title="θ ← θ − η∇L — rolling downhill"
        sub="The single mechanism behind every neural network's training. The whole story is in what η does."
      />
      <GradientDescent3D />
    </section>
  );
}

// ─── EQ 5 · ADAM ───────────────────────────────────────────────────────────

function AdamSection() {
  const [b1, setB1] = useState(0.9);
  const [b2, setB2] = useState(0.999);
  const [mode, setMode] = useState<"noisy" | "drift" | "clean" | "spike">("noisy");

  const presets: Preset[] = [
    { key: "noisy", label: "Noisy gradient" },
    { key: "drift", label: "Drifting gradient" },
    { key: "clean", label: "Clean gradient" },
    { key: "spike", label: "Sudden spike" },
  ];

  const N = 80;
  const eps = 1e-8;

  const gradients = useMemo(() => {
    const arr: number[] = [];
    for (let t = 0; t < N; t++) {
      const seed = mode === "noisy" ? 0 : mode === "drift" ? 1 : mode === "clean" ? 2 : 3;
      const r2 = (((Math.sin(t * 7.123 + 41.5 + seed * 11) * 12345.6789) % 1) + 1) % 1;
      let g: number;
      if (mode === "noisy") g = 0.4 + (r2 - 0.5) * 1.6;
      else if (mode === "drift") g = 0.8 - t * 0.012 + (r2 - 0.5) * 0.5;
      else if (mode === "clean") g = 0.6 + (r2 - 0.5) * 0.15;
      else {
        g = 0.3 + (r2 - 0.5) * 0.3;
        if (t === 25) g = 3.5;
        if (t === 26) g = 2.8;
        if (t === 50) g = -2.5;
      }
      arr.push(g);
    }
    return arr;
  }, [mode]);

  const { mSeq, vSeq, stepSeq } = useMemo(() => {
    let m = 0;
    let v = 0;
    const ms: number[] = [];
    const vs: number[] = [];
    const ss: number[] = [];
    for (let t = 0; t < N; t++) {
      const g = gradients[t];
      m = b1 * m + (1 - b1) * g;
      v = b2 * v + (1 - b2) * g * g;
      const mh = m / (1 - Math.pow(b1, t + 1));
      const vh = v / (1 - Math.pow(b2, t + 1));
      ms.push(m);
      vs.push(Math.sqrt(v));
      ss.push(mh / (Math.sqrt(vh) + eps));
    }
    return { mSeq: ms, vSeq: vs, stepSeq: ss };
  }, [gradients, b1, b2]);

  const xPlot = (t: number, w = 640, padL = 40, padR = 20) => padL + (t / (N - 1)) * (w - padL - padR);

  const renderPath = (vals: number[], h: number, norm: number) => {
    let d = "";
    for (let t = 0; t < N; t++) {
      const x = xPlot(t);
      const y = h / 2 - (vals[t] / norm) * (h / 2 - 8);
      d += (t === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    }
    return d;
  };

  const gNormBars = Math.max(...gradients.map(Math.abs), 1);
  const overall = Math.max(Math.max(...mSeq.map(Math.abs), 1), Math.max(...vSeq, 1));
  const stepNorm = Math.max(...stepSeq.map(Math.abs), 1);

  return (
    <section id="adam" className="scroll-mt-24 py-16 md:py-20" style={{ borderBottom: "1px solid var(--rule)" }}>
      <SectionHeader
        eyebrow="3.6 · Adam"
        title="m / √v — momentum divided by magnitude"
        sub="Two filters on the gradient stream: a low-pass on direction (m), a low-pass on magnitude (√v). Divide the first by the second. That's Adam."
      />

      <div className="p1-card p-6">
        <PresetRow presets={presets} active={mode} onPick={(p) => setMode(p.key as typeof mode)} />

        <Slider label="β₁ (momentum decay)" min={0} max={0.99} step={0.01} value={b1} onChange={setB1} />
        <Slider label="β₂ (variance decay)" min={0.9} max={0.999} step={0.001} value={b2} onChange={setB2} format={(v) => v.toFixed(3)} />

        <div className="p1-card-sunken p-3 mt-4">
          <div className="p1-eyebrow mb-2">Raw gradient g (per step)</div>
          <svg viewBox="0 0 640 90" className="w-full">
            <line x1="40" y1="45" x2="620" y2="45" stroke="var(--rule)" strokeWidth="0.5" strokeDasharray="2 2" />
            {gradients.map((g, t) => {
              const x = xPlot(t);
              const h = (g / gNormBars) * 30;
              const y = 45 - h;
              return <rect key={t} x={(x - 2).toFixed(2)} y={Math.min(45, y).toFixed(2)} width="4" height={Math.abs(h).toFixed(2)} fill="var(--ink-3)" opacity="0.85" />;
            })}
          </svg>
        </div>

        <div className="p1-card-sunken p-3 mt-3">
          <div className="p1-eyebrow mb-2">m (smoothed direction) and √v (smoothed magnitude)</div>
          <svg viewBox="0 0 640 100" className="w-full">
            <line x1="40" y1="50" x2="620" y2="50" stroke="var(--rule)" strokeWidth="0.5" strokeDasharray="2 2" />
            <path d={renderPath(mSeq, 100, overall)} fill="none" stroke="var(--indigo)" strokeWidth="2" />
            <path d={renderPath(vSeq, 100, overall)} fill="none" stroke="var(--teal)" strokeWidth="2" />
          </svg>
          <div className="flex gap-4 mt-2 text-[11px]" style={{ color: "var(--ink-3)" }}>
            <span>
              <span className="inline-block w-3 h-0.5 align-middle mr-1" style={{ background: "var(--indigo)" }} />m
            </span>
            <span>
              <span className="inline-block w-3 h-0.5 align-middle mr-1" style={{ background: "var(--teal)" }} />√v
            </span>
          </div>
        </div>

        <div className="p1-card-sunken p-3 mt-3">
          <div className="p1-eyebrow mb-2">Adam's step (smooth) vs SGD's step (raw)</div>
          <svg viewBox="0 0 640 100" className="w-full">
            <line x1="40" y1="50" x2="620" y2="50" stroke="var(--rule)" strokeWidth="0.5" strokeDasharray="2 2" />
            <path d={renderPath(stepSeq, 100, stepNorm)} fill="none" stroke="var(--amber)" strokeWidth="2" />
            <path d={renderPath(gradients, 100, gNormBars)} fill="none" stroke="var(--ink-3)" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
          </svg>
          <div className="flex gap-4 mt-2 text-[11px]" style={{ color: "var(--ink-3)" }}>
            <span>
              <span className="inline-block w-3 h-0.5 align-middle mr-1" style={{ background: "var(--amber)" }} />Adam step
            </span>
            <span>
              <span className="inline-block w-3 align-middle mr-1" style={{ borderTop: "1px dashed var(--ink-3)" }} />SGD step
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          <div className="p1-card-sunken p-4">
            <div className="p1-eyebrow mb-2" style={{ color: "var(--indigo)" }}>Trick 1 · Momentum</div>
            <p className="p1-body text-xs">
              m = β₁m + (1−β₁)g · running average of recent gradients. Smooths noise; consistent direction → bigger step.
            </p>
          </div>
          <div className="p1-card-sunken p-4">
            <div className="p1-eyebrow mb-2" style={{ color: "var(--teal)" }}>Trick 2 · Adaptive scaling</div>
            <p className="p1-body text-xs">
              v = β₂v + (1−β₂)g² · running average of squared gradients. Divide by √v: each parameter auto-tunes its own learning rate.
            </p>
          </div>
        </div>

        <div className="p1-card-sunken p-4 mt-3">
          <div className="p1-eyebrow mb-2" style={{ color: "var(--amber)" }}>AdamW · the LLM-era variant</div>
          <p className="p1-body text-xs">
            Adam with decoupled weight decay — apply <span className="p1-mono">θ ← (1−λ)θ</span> separately from the Adam step instead of folding decay into the gradient.
            Every modern LLM (GPT, Claude, Llama, DeepSeek, Mixtral) trains with AdamW. Cost: 16 bytes/param of state in mixed precision —
            the reason FSDP and ZeRO exist for distributed training (Phase 4).
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── EQ 6 · BIAS-VARIANCE ──────────────────────────────────────────────────

function BiasVarianceSection() {
  const [degree, setDegree] = useState(3);
  const [noise, setNoise] = useState(0.4);
  const [nSamples, setNSamples] = useState(14);
  const [seed, setSeed] = useState(12345);

  const trueFn = (x: number) => Math.sin(x * 1.6) + 0.3 * x;

  const { data, testData } = useMemo(() => {
    let s = seed;
    const r = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const train: { x: number; y: number }[] = [];
    for (let i = 0; i < nSamples; i++) {
      const x = -2.5 + r() * 5;
      const y = trueFn(x) + (r() - 0.5) * 2 * noise;
      train.push({ x, y });
    }
    const test: { x: number; y: number }[] = [];
    for (let i = 0; i < 200; i++) {
      const x = -2.5 + (i / 200) * 5;
      const y = trueFn(x) + (r() - 0.5) * 2 * noise;
      test.push({ x, y });
    }
    return { data: train, testData: test };
  }, [seed, noise, nSamples]);

  const w = useMemo(() => {
    const k = degree + 1;
    const X = data.map((d) => Array.from({ length: k }, (_, p) => Math.pow(d.x, p)));
    const yv = data.map((d) => d.y);
    const XtX = Array.from({ length: k }, () => Array(k).fill(0));
    const Xty = Array(k).fill(0);
    for (let i = 0; i < data.length; i++) {
      for (let a = 0; a < k; a++) {
        Xty[a] += X[i][a] * yv[i];
        for (let b = 0; b < k; b++) XtX[a][b] += X[i][a] * X[i][b];
      }
    }
    for (let a = 0; a < k; a++) XtX[a][a] += 1e-6;
    const M = XtX.map((row, i) => [...row, Xty[i]]);
    for (let pi = 0; pi < k; pi++) {
      let mr = pi;
      for (let r2 = pi + 1; r2 < k; r2++) if (Math.abs(M[r2][pi]) > Math.abs(M[mr][pi])) mr = r2;
      [M[pi], M[mr]] = [M[mr], M[pi]];
      if (Math.abs(M[pi][pi]) < 1e-12) continue;
      for (let r2 = pi + 1; r2 < k; r2++) {
        const f = M[r2][pi] / M[pi][pi];
        for (let c = pi; c <= k; c++) M[r2][c] -= f * M[pi][c];
      }
    }
    const wOut: number[] = Array(k).fill(0);
    for (let pi = k - 1; pi >= 0; pi--) {
      let sum = M[pi][k];
      for (let c = pi + 1; c < k; c++) sum -= M[pi][c] * wOut[c];
      wOut[pi] = sum / (M[pi][pi] || 1e-12);
    }
    return wOut;
  }, [data, degree]);

  const evalPoly = (x: number) => w.reduce((s, wi, p) => s + wi * Math.pow(x, p), 0);

  const trainErr = data.reduce((s, d) => s + Math.pow(d.y - evalPoly(d.x), 2), 0) / Math.max(data.length, 1);
  const testErr = testData.reduce((s, d) => s + Math.pow(d.y - evalPoly(d.x), 2), 0) / Math.max(testData.length, 1);

  const xMap = (x: number) => 40 + ((x + 3) * 560) / 6;
  const yMap = (y: number) => 280 - ((y + 2) * 260) / 4;

  const truthD = useMemo(() => {
    let d = "";
    for (let i = 0; i <= 200; i++) {
      const x = -2.5 + (i / 200) * 5;
      const y = trueFn(x);
      const X = xMap(x);
      const Y = yMap(y);
      if (Y >= 20 && Y <= 280) d += (d === "" ? "M" : "L") + X.toFixed(1) + " " + Y.toFixed(1) + " ";
    }
    return d;
  }, []);

  const fitD = useMemo(() => {
    const evalPolyLocal = (x: number) => w.reduce((s, wi, p) => s + wi * Math.pow(x, p), 0);
    let d = "";
    for (let i = 0; i <= 400; i++) {
      const x = -2.5 + (i / 400) * 5;
      const yRaw = evalPolyLocal(x);
      const y = Math.max(-2.5, Math.min(2.5, yRaw));
      const X = xMap(x);
      const Y = yMap(y);
      if (Y >= 20 && Y <= 280) d += (d === "" ? "M" : "L") + X.toFixed(1) + " " + Y.toFixed(1) + " ";
    }
    return d;
  }, [w]);

  let diag: string;
  let dColor: "teal" | "amber" | "crimson";
  if (degree <= 1) {
    diag = "High bias · underfitting";
    dColor = "amber";
  } else if (degree >= 8) {
    diag = "High variance · overfitting";
    dColor = "crimson";
  } else {
    diag = "Sweet spot";
    dColor = "teal";
  }

  const presets: Preset[] = [
    { key: "linear", label: "Linear (deg 1)", apply: () => setDegree(1) },
    { key: "cubic", label: "Cubic (deg 3)", apply: () => setDegree(3) },
    { key: "wild", label: "Wild (deg 13)", apply: () => setDegree(13) },
  ];

  return (
    <section id="bias-variance" className="scroll-mt-24 py-16 md:py-20" style={{ borderBottom: "1px solid var(--rule)" }}>
      <SectionHeader
        eyebrow="3.7 · Bias-Variance"
        title="Error = Bias² + Variance + Noise"
        sub="Too simple → can't capture the truth (high bias). Too complex → chases noise (high variance). The classical job is finding the bottom of the U."
      />

      <div className="p1-card p-6">
        <PresetRow presets={presets} onPick={(pp) => pp.apply?.()} />

        <Slider label="Model complexity (deg)" min={1} max={15} step={1} value={degree} onChange={setDegree} format={(v) => v.toFixed(0)} />
        <Slider label="Noise level" min={0} max={1} step={0.05} value={noise} onChange={setNoise} />
        <Slider label="Number of samples" min={6} max={40} step={1} value={nSamples} onChange={setNSamples} format={(v) => v.toFixed(0)} />

        <div className="p1-card-sunken p-3 my-4">
          <svg viewBox="0 0 640 320" className="w-full">
            <line x1="40" y1="280" x2="600" y2="280" stroke="var(--rule)" strokeWidth="0.5" />
            <line x1="40" y1="20" x2="40" y2="280" stroke="var(--rule)" strokeWidth="0.5" />
            {[-2, 0, 2].map((y) => (
              <text key={y} x="36" y={yMap(y)} textAnchor="end" dominantBaseline="central" fontSize="10" fill="var(--ink-3)" fontFamily="var(--mono)">
                {y}
              </text>
            ))}
            <path d={truthD} fill="none" stroke="var(--teal)" strokeWidth="2" strokeDasharray="4 4" />
            <path d={fitD} fill="none" stroke="var(--indigo)" strokeWidth="2" />
            {data.map((d, i) => (
              <circle key={i} cx={xMap(d.x).toFixed(2)} cy={yMap(d.y).toFixed(2)} r="3.5" fill="var(--amber)" />
            ))}
          </svg>
        </div>

        <div className="flex flex-wrap gap-4 mb-4 text-[11px]" style={{ color: "var(--ink-3)" }}>
          <span>
            <span className="inline-block w-3 align-middle mr-1" style={{ borderTop: "2px dashed var(--teal)" }} />true function
          </span>
          <span>
            <span className="inline-block w-3 h-0.5 align-middle mr-1" style={{ background: "var(--indigo)" }} />fitted model
          </span>
          <span>
            <span className="inline-block w-2 h-2 rounded-full align-middle mr-1" style={{ background: "var(--amber)" }} />training data
          </span>
        </div>

        <button className="p1-btn mb-4" onClick={() => setSeed(Math.floor(Math.random() * 1e6))}>
          Resample data ↻
        </button>

        <div className="grid grid-cols-3 gap-2">
          <div className="p1-card-sunken p-3">
            <div className="text-[10px]" style={{ color: "var(--ink-3)" }}>TRAIN ERROR</div>
            <div className="p1-num text-base">{trainErr.toFixed(2)}</div>
          </div>
          <div className="p1-card-sunken p-3">
            <div className="text-[10px]" style={{ color: "var(--ink-3)" }}>TEST ERROR</div>
            <div className="p1-num text-base">{testErr.toFixed(2)}</div>
          </div>
          <div className="p1-card-sunken p-3">
            <div className="text-[10px]" style={{ color: "var(--ink-3)" }}>DIAGNOSIS</div>
            <span className={"p1-tag p1-tag-" + dColor}>{diag}</span>
          </div>
        </div>
      </div>

      <div className="p1-card-sunken p-5 mt-4">
        <div className="p1-eyebrow mb-2">Modern wrinkle · double descent</div>
        <p className="p1-body text-sm">
          Very large neural networks <em>violate</em> the classical U-curve: error first goes up (overfitting),
          then comes back down again at massive overparameterization. Modern foundation models live in the second descent.
          The diagnostic frame (train vs test loss) still works; the relationship between parameter count and variance is just subtler than the textbook.
        </p>
      </div>
    </section>
  );
}

// ─── FINAL SYNTHESIS ───────────────────────────────────────────────────────

function SynthesisSection() {
  return (
    <section
      id="synthesis"
      className="scroll-mt-24 py-20 px-6 md:px-10 rounded-3xl my-12 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--indigo) 14%, transparent), color-mix(in oklab, var(--teal) 8%, transparent) 60%, color-mix(in oklab, var(--amber) 12%, transparent))",
        border: "1px solid var(--rule)",
      }}
    >
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]" />
      <div className="relative">
        <div className="p1-eyebrow mb-5">3.8 · Synthesis — the whole loop</div>
        <h2 className="p1-h2 text-3xl md:text-5xl mb-10" style={{ color: "var(--ink)" }}>
          One mechanism, end to end.
        </h2>

        <div
          className="space-y-5 max-w-3xl"
          style={{ color: "var(--ink-2)", fontFamily: "var(--serif)", fontSize: "18px", lineHeight: 1.6 }}
        >
          {[
            <>The network produces <em>logits</em> — raw real numbers from the final matrix multiplication.</>,
            <><span style={{ color: "var(--ink)" }}>Softmax</span> converts logits to a probability distribution Q. Exponential makes positive; division normalizes.</>,
            <>The true label defines distribution P (one-hot for classification, a single token for next-token prediction).</>,
            <><span style={{ color: "var(--ink)" }}>Cross-entropy loss</span> = −log Q(true) — equivalently, KL(P ‖ Q) plus a constant.</>,
            <><span style={{ color: "var(--ink)" }}>Backprop</span> computes ∂L/∂z = Q − P at the logits, then chain-rules backward through every weight.</>,
            <><span style={{ color: "var(--ink)" }}>AdamW</span> takes the gradient, smooths it via momentum, normalizes its magnitude per-parameter, scales by η, and updates θ.</>,
            <>Repeat across batches. Watch train and test loss to diagnose <span style={{ color: "var(--ink)" }}>bias vs variance</span>; tune accordingly.</>,
          ].map((line, i) => (
            <p key={i} className="flex gap-3">
              <span className="p1-mono text-xs uppercase tracking-wider mt-1.5" style={{ color: "var(--ink-3)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{line}</span>
            </p>
          ))}
        </div>

        <hr className="p1-rule my-10" />

        <p className="p1-serif italic text-2xl md:text-3xl leading-snug max-w-3xl" style={{ color: "var(--ink)" }}>
          Architecture varies wildly. Scale varies wildly. This loop is invariant —{" "}
          <span style={{ color: "var(--ink-2)" }}>
            it's running inside Llama, AlphaFold, ResNet, BERT, and every classifier you'll ever train.
          </span>
        </p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { eq: "−log p_true", lbl: "Cross-entropy" },
            { eq: "e^z / Σe^z", lbl: "Softmax" },
            { eq: "Σ P log(P/Q)", lbl: "KL divergence" },
            { eq: "θ ← θ − η∇L", lbl: "Gradient descent" },
            { eq: "m / √v", lbl: "Adam" },
            { eq: "Bias² + Var + ε", lbl: "Bias-variance" },
            { eq: "Q − P", lbl: "Logit gradient" },
            { eq: "θ frozen", lbl: "After deploy" },
          ].map((c) => (
            <div key={c.lbl} className="p-4" style={{ borderTop: "1px solid var(--rule)" }}>
              <div className="p1-mono text-sm mb-2" style={{ color: "var(--ink)" }}>{c.eq}</div>
              <div className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-3)" }}>{c.lbl}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="p1-mono text-[11px] tracking-widest uppercase" style={{ color: "var(--ink-3)" }}>
            Phase 1 of 7 · Modern ML Foundations
          </p>
          <p className="p1-mono text-[11px] tracking-widest uppercase mt-2" style={{ color: "var(--ink-3)" }}>
            Next → Neural network components · MLPs, activations, normalization
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── ROOT ───────────────────────────────────────────────────────────────────

export default function Phase1TheoryMap() {
  return (
    <div className="p1-root">
      <style>{STYLES}</style>

      <ChapterDivider number="1" title="The Broad View: AI & ML Landscape" accentVar={ACCENT} />
      <AITaxonomy />

      <ChapterDivider number="2" title="Paradigms & Pipeline" accentVar={ACCENT} />
      <ParadigmsSection />
      <PipelineSection />
      <RLTaxonomy />

      <ChapterDivider number="3" title="Equations & Loss Surfaces" accentVar={ACCENT} />
      <LossExamplesSection />
      <CrossEntropySection />
      <SoftmaxSection />
      <KLDivergenceSection />
      <ConnectionsSection />
      <GradientDescentSection />
      <AdamSection />
      <BiasVarianceSection />
      <SynthesisSection />

      <ChapterDivider number="4" title="Neural Network Components" accentVar={ACCENT} />
      <NeuralNetworkComponents />

      <ChapterDivider number="5" title="Evaluation Fundamentals" accentVar={ACCENT} />
      <EvaluationFundamentals />
    </div>
  );
}
