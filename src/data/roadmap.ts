export type SubChapter = {
  /** Anchor id matching the `<section id="...">` in the content file. */
  id: string;
  /** Dotted number like "1.1", "2.0", "2.5". Section-relative. */
  number: string;
  title: string;
};

export type Chapter = {
  id: string;
  /** Single-digit number within its section: "1", "2", ... */
  number: string;
  title: string;
  subchapters: SubChapter[];
};

export type SectionKind = "theory" | "builds" | "exit";

export type Section = {
  id: SectionKind;
  /** Zero-padded ordinal for display: "01", "02", "03". */
  number: string;
  title: string;
  /**
   * Only Theory has chapters today. Build Block and Exit Criteria stay as
   * flat sections — add a `chapters` array later if they grow nested content.
   */
  chapters?: Chapter[];
};

export type RoadmapNode = {
  id: string;
  slug: string;
  kind: "phase" | "bonus";
  index: number;
  title: string;
  tagline: string;
  duration: string;
  goal: string;
  keyOutput: string;
  accent: string;
  accentVar: string;
  builds: number;
  /** Short bullet summary rendered above the sections. */
  overview?: string[];
  /**
   * The three top-level sections of a phase: Theory, Build Block, Exit Criteria.
   * Only Theory is allowed nested chapters / sub-chapters today.
   */
  sections: Section[];
};

/** The default three-section skeleton — no chapters yet. */
const EMPTY_SECTIONS: Section[] = [
  { id: "theory", number: "01", title: "Theory" },
  { id: "builds", number: "02", title: "Build Block" },
  { id: "exit",   number: "03", title: "Exit Criteria" },
];

export const ROADMAP: RoadmapNode[] = [
  {
    id: "phase-1",
    slug: "phase-1",
    kind: "phase",
    index: 1,
    title: "Modern ML Foundations",
    tagline: "DL foundations, first models",
    duration: "6–8 weeks",
    goal: "Recognize every equation in a modern ML paper. Train your first models end-to-end with PyTorch.",
    keyOutput: "3 builds, PyTorch fluency",
    accent: "violet",
    accentVar: "--accent-p1",
    builds: 3,
    overview: [
      "Five learning paradigms — supervised, unsupervised, self-supervised, semi-supervised, and reinforcement learning — and where each one lives in the modern training pipeline.",
      "Six equations every paper assumes you recognize: cross-entropy, softmax, KL divergence, gradient descent, Adam, and the bias-variance tradeoff.",
      "Loss functions in production: from GPT's next-token cross-entropy to AlphaFold's coordinate MSE to CLIP's contrastive objective.",
      "PyTorch fluency through three shipped builds — vision baselines, transfer learning, and tabular gradient boosting.",
    ],
    sections: [
      {
        id: "theory",
        number: "01",
        title: "Theory",
        chapters: [
          {
            id: "ch-1",
            number: "1",
            title: "Paradigms & Pipeline",
            subchapters: [
              { id: "paradigms",   number: "1.1", title: "Five Paradigms" },
              { id: "pipeline",    number: "1.2", title: "Training Stages" },
              { id: "rl-taxonomy", number: "1.3", title: "RL Family Tree" },
            ],
          },
          {
            id: "ch-2",
            number: "2",
            title: "Equations & Loss Surfaces",
            subchapters: [
              { id: "losses",           number: "2.0", title: "Losses in the Wild" },
              { id: "cross-entropy",    number: "2.1", title: "Cross-Entropy" },
              { id: "softmax",          number: "2.2", title: "Softmax" },
              { id: "kl",               number: "2.3", title: "KL Divergence" },
              { id: "connections",      number: "2.4", title: "Connections" },
              { id: "gradient-descent", number: "2.5", title: "Gradient Descent" },
              { id: "adam",             number: "2.6", title: "Adam" },
              { id: "bias-variance",    number: "2.7", title: "Bias-Variance" },
              { id: "synthesis",        number: "2.8", title: "Synthesis" },
            ],
          },
          {
            id: "ch-3",
            number: "3",
            title: "Neural Network Components",
            subchapters: [
              { id: "architecture", number: "3.1", title: "Architecture" },
              { id: "activations", number: "3.2", title: "Activations" },
              { id: "normalization", number: "3.3", title: "Normalization" },
              { id: "regularization", number: "3.4", title: "Regularization" },
              { id: "optimizers", number: "3.5", title: "Optimizers" },
              { id: "lr-schedules", number: "3.6", title: "Learning Rate Schedules" },
              { id: "initialization", number: "3.7", title: "Initialization" },
            ],
          },
        ],
      },
      { id: "builds", number: "02", title: "Build Block" },
      { id: "exit",   number: "03", title: "Exit Criteria" },
    ],
  },
  {
    id: "phase-2",
    slug: "phase-2",
    kind: "phase",
    index: 2,
    title: "LLM Application Portfolio",
    tagline: "Ship 6 LLM apps of increasing complexity",
    duration: "10–14 weeks",
    goal: "By the end, you can build any standard 2026 LLM application asked in an interview within hours.",
    keyOutput: "6 builds, deployed demos",
    accent: "blue",
    accentVar: "--accent-p2",
    builds: 6,
    sections: EMPTY_SECTIONS,
  },
  {
    id: "phase-3",
    slug: "phase-3",
    kind: "phase",
    index: 3,
    title: "Inside the Model",
    tagline: "Stop treating LLMs as black boxes",
    duration: "6–8 weeks",
    goal: "Understand training, inference, and internals enough to debug, optimize, and discuss them.",
    keyOutput: "4 builds, tiny LM trained, mech interp project",
    accent: "cyan",
    accentVar: "--accent-p3",
    builds: 4,
    sections: EMPTY_SECTIONS,
  },
  {
    id: "phase-4",
    slug: "phase-4",
    kind: "phase",
    index: 4,
    title: "Distributed Training & MLOps",
    tagline: "The production engineering layer",
    duration: "5–7 weeks",
    goal: "Frontier labs and FAANG ML interviews lean heavily here. Most candidates skip it. You won't.",
    keyOutput: "Multi-GPU training, full ops stack",
    accent: "emerald",
    accentVar: "--accent-p4",
    builds: 4,
    sections: EMPTY_SECTIONS,
  },
  {
    id: "phase-5",
    slug: "phase-5",
    kind: "phase",
    index: 5,
    title: "Post-Training & Reasoning",
    tagline: "Where the field has moved most since 2023",
    duration: "8–10 weeks",
    goal: "The post-training stack circa 2026 plus reasoning models — strongest hireability signal.",
    keyOutput: "DPO + reasoning model + synthetic data",
    accent: "amber",
    accentVar: "--accent-p5",
    builds: 5,
    sections: EMPTY_SECTIONS,
  },
  {
    id: "phase-6",
    slug: "phase-6",
    kind: "phase",
    index: 6,
    title: "Alignment, Safety & Research",
    tagline: "Become a credible alignment-leaning researcher",
    duration: "4–6 months",
    goal: "Workshop / conference papers shipped. Built and broken alignment methods, not just read about them.",
    keyOutput: "Workshop / conference papers",
    accent: "rose",
    accentVar: "--accent-p6",
    builds: 3,
    sections: EMPTY_SECTIONS,
  },
  {
    id: "phase-7",
    slug: "phase-7",
    kind: "phase",
    index: 7,
    title: "Biopharma & Drug Discovery",
    tagline: "Boston biopharma ML hireable",
    duration: "6–8 weeks",
    goal: "AlphaFold / ESM / RDKit fluency. Read protein engineering papers. Talk drug discovery.",
    keyOutput: "5 builds, AlphaFold/ESM/RDKit fluency",
    accent: "teal",
    accentVar: "--accent-p7",
    builds: 6,
    sections: EMPTY_SECTIONS,
  },
  {
    id: "bonus-a",
    slug: "bonus-a",
    kind: "bonus",
    index: 8,
    title: "Graphs & Networks",
    tagline: "GNNs, GraphRAG, knowledge graphs",
    duration: "4–6 weeks",
    goal: "Graph foundations to support DataAlchemist work and infrastructure-resilience collaborations.",
    keyOutput: "GraphRAG benchmark",
    accent: "indigo",
    accentVar: "--accent-bA",
    builds: 2,
    sections: EMPTY_SECTIONS,
  },
  {
    id: "bonus-b",
    slug: "bonus-b",
    kind: "bonus",
    index: 9,
    title: "Multimodal Awareness",
    tagline: "Vision, diffusion, VLMs, audio",
    duration: "2 weeks",
    goal: "Recognize the vocabulary. Frontier labs are increasingly multimodal — be conversant.",
    keyOutput: "Vision-language demo",
    accent: "fuchsia",
    accentVar: "--accent-bB",
    builds: 1,
    sections: EMPTY_SECTIONS,
  },
  {
    id: "bonus-c",
    slug: "bonus-c",
    kind: "bonus",
    index: 10,
    title: "Recsys & Search at Scale",
    tagline: "What FAANG ML actually runs",
    duration: "2–3 weeks",
    goal: "Two-stage retrieval/ranking systems for FAANG-style product ML and content/ads startups.",
    keyOutput: "Production-style retrieval",
    accent: "yellow",
    accentVar: "--accent-bC",
    builds: 1,
    sections: EMPTY_SECTIONS,
  },
];

export function getNode(slug: string): RoadmapNode | undefined {
  return ROADMAP.find((p) => p.slug === slug);
}

export const PHASES = ROADMAP.filter((p) => p.kind === "phase");
export const BONUSES = ROADMAP.filter((p) => p.kind === "bonus");
