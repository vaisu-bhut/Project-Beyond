const COMPANIES = [
  {
    name: "Anthropic",
    role: "Research engineer · MTS",
    accent: "--accent-p1",
    asks: [
      "Transformer internals: attention, normalization, RoPE. Whiteboard expected.",
      "Mech interp depth: SAEs, circuits, activation patching.",
      "Constitutional AI, alignment papers (recent Anthropic blog posts in detail).",
      "Coding: clean PyTorch implementation under time pressure.",
      "Research taste: discuss a paper, identify weaknesses, propose follow-ups.",
      "Strong systems thinking for research engineer roles (training infra, inference, eval).",
    ],
  },
  {
    name: "OpenAI",
    role: "Applied AI · Research engineer",
    accent: "--accent-p2",
    asks: [
      "Reasoning models, post-training, RLHF / RLAIF / GRPO.",
      "Coding fluency, especially Python and modern PyTorch.",
      "Eval design and capability measurement.",
      "Production ML: serving, optimization, latency engineering.",
    ],
  },
  {
    name: "Google DeepMind",
    role: "Research scientist · engineer",
    accent: "--accent-p3",
    asks: [
      "More theoretical depth than the others (esp. research scientist).",
      "Algorithmic interviews still heavy.",
      "RL fundamentals matter more here than at Anthropic / OpenAI.",
      "Multimodal: Gemini-style multimodal training and eval.",
      "Research culture: publication track matters.",
    ],
  },
  {
    name: "Meta AI / FAIR",
    role: "Product ML · FAIR research",
    accent: "--accent-p4",
    asks: [
      "Recsys at scale (DLRM, two-tower) for product teams.",
      "LLM serving and efficiency (Llama family training and inference).",
      "Strong systems engineering, especially for infra-adjacent roles.",
      "Open science culture, expect open-source contribution questions.",
    ],
  },
  {
    name: "Google Cloud AI · Vertex",
    role: "Applied ML · platform",
    accent: "--accent-p5",
    asks: [
      "Production ML engineering: pipelines, serving, monitoring.",
      "LLM application building (RAG, agents, fine-tuning).",
      "MLOps stack fluency.",
    ],
  },
  {
    name: "AI startups (Series A–C)",
    role: "Generalist / founding ML",
    accent: "--accent-p6",
    asks: [
      "Building speed: can you ship a working LLM app in a day?",
      "Pragmatic eval: do you measure things or just vibe-check?",
      "Cost awareness: model selection, prompt economics.",
      "Full-stack capability: backend + ML + sometimes frontend.",
      "Breadth over depth in any single area.",
    ],
  },
];

const SYSTEM_DESIGN = [
  "Design a feed ranking system (recsys architecture).",
  "Design an LLM-powered search / Q&A system (RAG architecture, eval, monitoring).",
  "Design an LLM serving infrastructure (vLLM, autoscaling, caching).",
  "Design a fine-tuning pipeline (data → training → eval → deployment).",
  "Design an eval system for a new model capability.",
  "Design an agent that does X (state, memory, error recovery, observability).",
];

export default function AppendixPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted font-mono mb-3">
          Appendix
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          What specific companies <span className="gradient-text">ask in 2026.</span>
        </h1>
        <p className="mt-4 text-foreground-muted max-w-2xl leading-relaxed">
          Per-company emphasis so you can allocate study time in the final stretch before applying.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-16">
        {COMPANIES.map((c) => (
          <div key={c.name} className="glass rounded-2xl p-6 relative overflow-hidden">
            <div
              className="absolute -top-16 -right-16 size-40 rounded-full blur-3xl opacity-20"
              style={{ background: `var(${c.accent})` }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="size-1.5 rounded-full"
                  style={{
                    background: `var(${c.accent})`,
                    boxShadow: `0 0 8px var(${c.accent})`,
                  }}
                />
                <span
                  className="text-xs uppercase tracking-[0.18em] font-mono font-semibold"
                  style={{ color: `var(${c.accent})` }}
                >
                  {c.role}
                </span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">{c.name}</h2>
              <ul className="space-y-2.5">
                {c.asks.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/85">
                    <span
                      className="mt-1.5 size-1 rounded-full shrink-0"
                      style={{ background: `var(${c.accent})` }}
                    />
                    <span className="leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-strong rounded-3xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted font-mono mb-2">
          System design for ML interviews
        </p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
          The recurring patterns
        </h2>
        <ul className="grid md:grid-cols-2 gap-3 text-foreground/90 text-sm">
          {SYSTEM_DESIGN.map((s) => (
            <li key={s} className="flex items-start gap-3 leading-relaxed">
              <span className="text-foreground-muted font-mono shrink-0">→</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
