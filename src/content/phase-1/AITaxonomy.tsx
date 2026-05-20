"use client";

import React, { useState, useMemo } from 'react';
import { 
  Brain, Binary, Cpu, Database, Layers, GitBranch, Sparkles, 
  Settings, Eye, Shuffle, Network, Activity, Workflow, TrendingUp,
  Info, Compass, HelpCircle, ChevronRight, BookOpen, Route, Code2,
  Shield, GraduationCap, Gamepad2, Bot, Search, Dice5, Puzzle,
  BarChart3, TreeDeciduous, Trees, Zap, Target, Users, Mail,
  ScatterChart, Minimize2, Sigma
} from 'lucide-react';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Interfaces
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface Example {
  name: string;
  desc: string;
}

interface TaxonomyNode {
  id: string;
  label: string;
  shortLabel?: string;
  tagline: string;
  eyebrow: string;
  color: 'stone' | 'indigo' | 'teal' | 'rose' | 'amber';
  icon: React.ComponentType<any>;
  analogy: string;
  definition: string;
  examples: Example[];
  parent?: string;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Theme Palette Constants (Adapted dynamically to Light/Dark)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const colorStyles = {
  stone: {
    border: 'var(--rule)',
    bg: 'var(--bg-sunken)',
    text: 'var(--ink-2)',
    accent: 'var(--ink-3)',
    glow: 'rgba(255, 255, 255, 0.05)',
    glowColor: 'rgba(120, 120, 120, 0.3)',
    activeBg: 'rgba(255, 255, 255, 0.08)',
    activeBorder: 'var(--ink-2)',
  },
  indigo: {
    border: 'color-mix(in oklab, var(--indigo) 20%, transparent)',
    bg: 'var(--indigo-soft)',
    text: 'var(--indigo)',
    accent: 'var(--indigo)',
    glow: 'rgba(167, 139, 250, 0.15)',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    activeBg: 'rgba(167, 139, 250, 0.2)',
    activeBorder: 'var(--indigo)',
  },
  teal: {
    border: 'color-mix(in oklab, var(--teal) 20%, transparent)',
    bg: 'var(--teal-soft)',
    text: 'var(--teal)',
    accent: 'var(--teal)',
    glow: 'rgba(52, 211, 153, 0.15)',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    activeBg: 'rgba(52, 211, 153, 0.2)',
    activeBorder: 'var(--teal)',
  },
  rose: {
    border: 'color-mix(in oklab, var(--crimson) 20%, transparent)',
    bg: 'var(--crimson-soft)',
    text: 'var(--crimson)',
    accent: 'var(--crimson)',
    glow: 'rgba(251, 113, 133, 0.15)',
    glowColor: 'rgba(251, 113, 133, 0.4)',
    activeBg: 'rgba(251, 113, 133, 0.2)',
    activeBorder: 'var(--crimson)',
  },
  amber: {
    border: 'color-mix(in oklab, var(--amber) 20%, transparent)',
    bg: 'var(--amber-soft)',
    text: 'var(--amber)',
    accent: 'var(--amber)',
    glow: 'rgba(251, 191, 36, 0.15)',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    activeBg: 'rgba(251, 191, 36, 0.2)',
    activeBorder: 'var(--amber)',
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Taxonomy Map
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const taxonomyData: Record<string, TaxonomyNode> = {
  ai: {
    id: 'ai',
    label: 'Artificial Intelligence',
    shortLabel: 'AI Umbrella',
    tagline: 'The Investigation Agency',
    eyebrow: 'System Paradigm',
    color: 'stone',
    icon: Brain,
    analogy: 'Picture a sprawling investigation agency that takes on any case requiring intelligence. Some detectives follow a written rulebook. Some learn from past cases. Some go into the field. Some run searches across mountains of records. AI is the whole agency â€” not any one method.',
    definition: 'The broad field of building systems that perform tasks requiring intelligence. Encompasses rule-based systems, search, planning, probabilistic reasoning, and machine learning. ML is one room in the building; deep learning is one wing of that room.',
    examples: [
      { name: 'Deep Blue (1997)', desc: 'Beat Kasparov with handcrafted heuristics + alpha-beta search. Zero learning. Pure AI.' },
      { name: 'TurboTax, airline reservation logic', desc: 'Mountains of business rules. AI in the broad sense, no ML in sight.' },
      { name: 'IBM Watson on Jeopardy (2011)', desc: 'Hybrid: information retrieval + ML scoring. A bridge era.' },
      { name: 'Claude, GPT-5, Gemini', desc: 'Modern LLMs. AI built on deep learning.' },
    ],
  },
  symbolic: {
    id: 'symbolic',
    label: 'Symbolic / Rule-based AI',
    shortLabel: 'Symbolic AI',
    tagline: 'The Rulebook Detective',
    eyebrow: 'Logic Era',
    color: 'amber',
    icon: Binary,
    parent: 'ai',
    analogy: 'Works strictly from a rulebook a human wrote. Every conclusion traces back to an explicit rule. Brittle outside what was written down â€” but interpretable and verifiable in a way modern ML simply is not.',
    definition: 'Knowledge is hand-encoded as rules, facts, and logical relations. Reasoning is logical inference. Mostly displaced by ML for perception and language, but alive and well in verification, planning, and formal methods.',
    examples: [
      { name: 'MYCIN (1972)', desc: 'Expert system diagnosing bacterial infections from ~600 hand-coded rules. The archetype.' },
      { name: 'STRIPS, PDDL planning', desc: 'Action-sequence planning for robotics and logistics.' },
      { name: 'Prolog, CLIPS, Drools', desc: 'Programming languages and engines purpose-built for rule reasoning.' },
      { name: 'SAT / SMT solvers (Z3)', desc: 'Used in hardware verification, security analysis, optimization.' },
      { name: 'Theorem provers (Lean, Coq, Isabelle)', desc: 'Formal mathematics. Quietly powering serious 2026 math-AI work.' },
    ],
  },
  ml: {
    id: 'ml',
    label: 'Machine Learning',
    shortLabel: 'Machine Learning',
    tagline: 'Detectives Who Learn From Cases',
    eyebrow: 'Data Paradigm',
    color: 'indigo',
    icon: Cpu,
    parent: 'ai',
    analogy: 'Instead of being told the rules, these detectives study solved cases and learn patterns. Show them enough credit-card fraud examples and they will spot it on a new card without anyone writing a single rule.',
    definition: 'Algorithms that improve from experience (data) without being explicitly programmed. The dominant paradigm in AI since roughly 2010. Splits into classical ML (no deep neural networks) and deep learning (multi-layer neural networks).',
    examples: [
      { name: 'Credit card fraud systems', desc: 'Classifies card activity on high-speed transaction streams.' },
      { name: 'Ad CTR click prediction', desc: 'Determines click probability using massive generalized linear models.' },
      { name: 'Modern Search engines', desc: 'Hybrid retrieval + neural ranking.' },
    ],
  },
  'classical-ml': {
    id: 'classical-ml',
    label: 'Classical ML',
    shortLabel: 'Classical ML',
    tagline: 'Trained Specialists',
    eyebrow: 'Statistical ML',
    color: 'teal',
    icon: Database,
    parent: 'ml',
    analogy: 'Each specialist has a particular technique they are best at. Strong on tabular data, structured features, smaller datasets, and anywhere interpretability matters. A senior fraud team or insurance underwriting model in 2026 is still probably gradient boosting, not a transformer.',
    definition: "ML methods that don't use multi-layer neural networks. Often need hand-engineered features. Train on far less data and compute than deep learning. Still the right tool for most tabular problems and many real production systems.",
    examples: [
      { name: 'Linear & Logistic Regression', desc: 'The arithmetic specialist. Credit scoring, A/B test analysis, the universal first baseline.' },
      { name: 'Decision Trees (CART, C4.5)', desc: 'The flowchart specialist. Interpretable medical triage, simple business policy systems.' },
      { name: 'Random Forest (bagging)', desc: 'A panel of trees, voting. General-purpose tabular ML, feature importance ranking.' },
      { name: 'Gradient Boosting (XGBoost, LightGBM)', desc: "Trees correcting each other's mistakes in sequence. Dominates Kaggle tabular, Ad CTR, search ranking, and fraud forecasting." },
      { name: 'Support Vector Machines (SVM)', desc: 'The boundary finder. Pre-BERT text classification, gene-expression classification.' },
      { name: 'k-Nearest Neighbors (k-NN)', desc: 'Match a new case to the most similar old ones. Recommender baselines.' },
      { name: 'Naive Bayes', desc: 'Probabilistic classification under independence assumptions. Built first-generation spam filters.' },
      { name: 'k-means & DBSCAN', desc: 'Unsupervised clustering. Customer segmentation, document clustering.' },
      { name: 'PCA & UMAP', desc: 'Dimensionality reduction. Compress high-dim embeddings to 2D for visualization.' },
      { name: 'Gaussian Processes', desc: 'Bayesian regression with uncertainty. Hyperparameter tuning (BoTorch).' },
    ],
  },
  dl: {
    id: 'dl',
    label: 'Deep Learning',
    shortLabel: 'Deep Learning',
    tagline: 'Detectives With Deep Pattern Brains',
    eyebrow: 'Neural Networks',
    color: 'rose',
    icon: Layers,
    parent: 'ml',
    analogy: "Many layers of learned representations. Raw input goes in one end â€” pixels, characters, audio waveforms, atom coordinates â€” and an answer comes out the other end. No hand-crafted features, no human-curated intermediate representations. The model figures out what to extract on its own.",
    definition: 'ML using neural networks with many layers (typically tens to hundreds). Trained end-to-end with backpropagation on large datasets and large compute. Has its own zoo of architectures.',
    examples: [
      { name: 'ImageNet classification', desc: 'The historic catalyst of the DL revolution.' },
      { name: 'Generative Foundation Models', desc: 'Universal code, logic, translation, and reasoning agents.' },
      { name: 'Self-driving perception pipelines', desc: 'Real-time multi-camera sensor fusion.' },
    ],
  },
  mlp: {
    id: 'mlp',
    label: 'MLP (Multi-Layer Perceptron)',
    shortLabel: 'MLP',
    tagline: 'The Generalist Deep Brain',
    eyebrow: 'DL Architectures',
    color: 'rose',
    icon: Settings,
    parent: 'dl',
    analogy: "Stacked dense layers where every neuron connects to every neuron in the next layer. The simplest deep architecture â€” but also the building block inside almost every fancier one. The 'feed-forward' sublayer inside every transformer block is literally an MLP.",
    definition: 'Feed-forward neural network with fully-connected layers and nonlinear activations. Universal function approximator in theory. Excellent for fixed-size vector inputs.',
    examples: [
      { name: 'Inside every transformer block', desc: 'The FFN/SwiGLU sublayer in GPT, Claude, Llama is an MLP.' },
      { name: 'DLRM (Meta)', desc: 'MLPs over embedding tables for ad ranking at hyperscale.' },
      { name: 'Output heads everywhere', desc: 'Classification heads, regression heads, policy/value heads in RL â€” almost always small MLPs on top of richer backbones.' },
    ],
  },
  cnn: {
    id: 'cnn',
    label: 'CNN (Convolutional Network)',
    shortLabel: 'CNN',
    tagline: 'The Vision Specialist',
    eyebrow: 'DL Architectures',
    color: 'rose',
    icon: Eye,
    parent: 'dl',
    analogy: 'Slides small magnifying glasses (filters) across the input, sharing the same lens parameters everywhere. Built for grid-structured data where local patterns matter the same way no matter where they appear â€” a cat is a cat in the top-left or bottom-right.',
    definition: 'Neural network using convolution operations and (often) pooling. Translation-equivariant by construction. Dominated computer vision from 2012 to roughly 2020; now sharing the throne with Vision Transformers.',
    examples: [
      { name: 'AlexNet (2012)', desc: 'Won ImageNet by 10+ percentage points and ended the classical CV era overnight.' },
      { name: 'ResNet (2015)', desc: 'Residual connections that made 100+ layer networks trainable. Still a universal baseline.' },
      { name: 'U-Net', desc: 'Medical image segmentation. Also the original backbone for Stable Diffusion 1.x denoisers.' },
      { name: 'YOLO family, DETR', desc: 'Real-time object detection and segmentation.' },
    ],
  },
  rnn: {
    id: 'rnn',
    label: 'RNN / LSTM / GRU',
    shortLabel: 'RNN',
    tagline: 'The Sequence-Walker (Legacy)',
    eyebrow: 'DL Architectures',
    color: 'rose',
    icon: Shuffle,
    parent: 'dl',
    analogy: 'Walks through input token-by-token in order, carrying a hidden state forward. Reading a book one word at a time, remembering only what fits in working memory. Beautiful, biologically suggestive â€” and largely retired since 2017 because attention does it better at scale.',
    definition: 'Recurrent neural networks process sequences sequentially with a recurrent hidden state. LSTMs and GRUs add gating to fight vanishing gradients. Largely replaced by transformers for language.',
    examples: [
      { name: 'seq2seq translation (2014â€“2017)', desc: 'Google Translate used bidirectional LSTM encoder-decoders before the transformer takeover.' },
      { name: 'DeepSpeech, RNN-T', desc: 'RNN-based speech recognition; RNN-T variants are still production in some on-device ASR.' },
      { name: 'Time-series forecasting', desc: 'LSTMs are still common in finance and IoT where sequences are short.' },
    ],
  },
  transformer: {
    id: 'transformer',
    label: 'Transformer',
    shortLabel: 'Transformer',
    tagline: 'The Simultaneous-Thinker',
    eyebrow: 'DL Architectures',
    color: 'rose',
    icon: Sparkles,
    parent: 'dl',
    analogy: 'Sees the whole input at once. Each token attends to every other token in parallel rather than walking through sequentially. The architectural revolution of the last decade â€” first conquered language, then vision, then audio, now proteins, code, and time series.',
    definition: 'Attention-based architecture (Vaswani et al., 2017). Decoder-only variants power every modern LLM. Encoder-only variants power most modern embedding and retrieval models.',
    examples: [
      { name: 'GPT, Claude, Llama, Gemini, DeepSeek', desc: 'Every modern LLM is a decoder-only transformer with GQA, RoPE, RMSNorm, SwiGLU.' },
      { name: 'BERT, RoBERTa, ModernBERT', desc: 'Encoder-only transformers. Embeddings, classification, retrieval, reranking.' },
      { name: 'AlphaFold2/3, ESM, Boltz', desc: 'Transformer-based protein structure prediction and generation. Phase 7 cornerstone.' },
    ],
  },
  gnn: {
    id: 'gnn',
    label: 'GNN (Graph Neural Network)',
    shortLabel: 'GNN',
    tagline: 'The Connection-Tracer',
    eyebrow: 'DL Architectures',
    color: 'rose',
    icon: Network,
    parent: 'dl',
    analogy: 'Each node updates by gathering messages from its neighbors, who in turn gathered from theirs. Built for data where what matters is who is connected to whom â€” molecules, social networks, knowledge graphs, transit systems, code dependencies.',
    definition: 'Neural networks that operate on graph-structured data via message passing. Foundation of modern molecular ML, knowledge graph reasoning, and infrastructure modeling.',
    examples: [
      { name: 'GCN, GraphSAGE, GAT', desc: 'Foundational message-passing architectures.' },
      { name: 'PinSage (Pinterest)', desc: 'Large-scale recommendation via graph convolutions on the user-pin bipartite graph.' },
      { name: 'GraphRAG (Microsoft, 2024)', desc: 'Retrieve a subgraph, verbalize it for the LLM. Hot research area in 2025â€“2026.' },
    ],
  },
  diffusion: {
    id: 'diffusion',
    label: 'Diffusion Models',
    shortLabel: 'Diffusion',
    tagline: 'The Un-Blurring Artist',
    eyebrow: 'DL Architectures',
    color: 'rose',
    icon: Activity,
    parent: 'dl',
    analogy: "Learn to remove noise step by step from any data type. To generate, start from pure static and progressively de-noise it until something coherent emerges. Like watching a photo develop in reverse â€” except the 'photo' is a protein, a video, or a molecule.",
    definition: 'Generative models trained to reverse a gradual noising process. Currently the dominant paradigm for image, video, and molecular/protein generation.',
    examples: [
      { name: 'Stable Diffusion, FLUX', desc: 'State-of-the-art open-weight text-to-image systems.' },
      { name: 'Sora, Veo, Kling', desc: 'High-fidelity video generation.' },
      { name: 'RFdiffusion (Baker lab)', desc: 'Protein backbone generation. Phase 7 cornerstone.' },
    ],
  },
  ssm: {
    id: 'ssm',
    label: 'State Space Models (Mamba)',
    shortLabel: 'SSM',
    tagline: 'The New Sequence-Walker',
    eyebrow: 'DL Architectures',
    color: 'rose',
    icon: Workflow,
    parent: 'dl',
    analogy: 'Modern revival of the RNN idea, but with mathematical structure (linear state-space dynamics with selective gating) that lets it parallelize during training and scale to very long sequences. streams a compressed memory forward.',
    definition: "Linear state-space models adapted for deep learning. Compete with transformers especially on very long sequences where attention's quadratic cost hurts.",
    examples: [
      { name: 'Mamba, Mamba-2 (2023â€“2024)', desc: 'Pure SSM language models with selective scans.' },
      { name: 'Jamba (AI21), Zamba', desc: 'Hybrid transformer + SSM architectures. Often what wins in practice on long context.' },
    ],
  },
  'gan-vae': {
    id: 'gan-vae',
    label: 'GANs & VAEs',
    shortLabel: 'GAN / VAE',
    tagline: 'Pre-Diffusion Generative',
    eyebrow: 'DL Architectures',
    color: 'rose',
    icon: TrendingUp,
    parent: 'dl',
    analogy: "GAN: a forger and a detective competing â€” the forger tries to fool the detective into accepting fake samples as real. VAE: encode data into a compressed latent space, then decode back, keeping the latent space well-behaved.",
    definition: 'Generative model families that preceded diffusion. GANs are hard to train but sharp; VAEs are easy to train but historically blurry, and still ubiquitous as components.',
    examples: [
      { name: 'StyleGAN, StyleGAN3', desc: 'High-quality face generation (this person does not exist).' },
      { name: 'VAE inside Stable Diffusion', desc: 'Latent diffusion uses a VAE encoder/decoder to compress images before diffusing the latents.' },
    ],
  },
  rl: {
    id: 'rl',
    label: 'Reinforcement Learning',
    shortLabel: 'RL',
    tagline: 'Field Detectives',
    eyebrow: 'Interaction Paradigm',
    color: 'amber',
    icon: GitBranch,
    parent: 'ml',
    analogy: "Sent into the field. Try an action, observe what happens, receive a reward or punishment, update strategy. No pre-collected dataset â€” you generate your own as you go. This is how AlphaGo learned, how AlphaZero taught itself chess, and how modern LLMs get aligned.",
    definition: 'Learning from interaction. Spans tabular RL (Q-learning â€” classical) and deep RL (DQN, PPO, GRPO â€” neural). Cuts diagonally across the classical-vs-deep split.',
    examples: [
      { name: 'Q-learning & SARSA (classical)', desc: 'Tabular methods for small state spaces.' },
      { name: 'AlphaGo & AlphaZero', desc: 'Monte Carlo Tree Search + deep RL. Defeated Lee Sedol in 2016.' },
      { name: 'RLHF, DPO & GRPO', desc: 'Post-training for LLMs. GRPO (DeepSeek) powers R1-style reasoning. Phase 5 cornerstone.' },
    ],
  },
  'other-ai': {
    id: 'other-ai',
    label: 'Other AI Paradigms',
    shortLabel: 'Other AI',
    tagline: 'Non-Detective Approaches',
    eyebrow: 'Search & Logic',
    color: 'stone',
    icon: Workflow,
    parent: 'ai',
    analogy: "Not every part of the agency is a detective. Some teams just run systematic searches through filing cabinets. Some draw probabilistic graphs of how facts depend on each other. These approaches are not 'ML' but live next door and often pair with it.",
    definition: 'Important non-learning approaches in AI that often complement ML: pathfinding search, planning, SAT solvers, and probabilistic graphical models.',
    examples: [
      { name: 'Search (A*, BFS)', desc: 'Pathfinding, classical game-playing, route planning.' },
      { name: 'MCTS (Monte Carlo Tree Search)', desc: 'Powers AlphaGo and modern test-time-search reasoning systems.' },
      { name: 'SAT / SMT solvers (Z3)', desc: 'Hardware verification, security analysis, program synthesis.' },
    ],
  },
  // â”€â”€ Symbolic AI children â”€â”€
  'expert-systems': { id: 'expert-systems', label: 'Expert Systems', shortLabel: 'Expert Sys.', tagline: 'Rule engines', eyebrow: 'Symbolic', color: 'amber', icon: BookOpen, parent: 'symbolic', analogy: 'A doctor made of if-then rules. MYCIN diagnosed infections from 600 handcrafted rules.', definition: 'Systems encoding domain expertise as production rules. Interpretable but brittle.', examples: [{ name: 'MYCIN (1972)', desc: 'Bacterial infection diagnosis.' }, { name: 'Drools, CLIPS', desc: 'Modern rule engines in enterprise.' }] },
  'planning-ai': { id: 'planning-ai', label: 'Planning & Scheduling', shortLabel: 'Planning', tagline: 'Action sequencing', eyebrow: 'Symbolic', color: 'amber', icon: Route, parent: 'symbolic', analogy: 'Figures out what steps to take and in what order to reach a goal state.', definition: 'STRIPS, PDDL â€” compute action sequences from initial state to goal.', examples: [{ name: 'STRIPS / PDDL', desc: 'Classical AI planning languages.' }, { name: 'Robotics task planning', desc: 'Warehouse automation sequences.' }] },
  'logic-prog': { id: 'logic-prog', label: 'Logic Programming', shortLabel: 'Logic Prog.', tagline: 'Declarative reasoning', eyebrow: 'Symbolic', color: 'amber', icon: Code2, parent: 'symbolic', analogy: 'Declare facts and rules. The engine finds the answers by searching the logic space.', definition: 'Prolog, Datalog â€” programming via logical inference rather than imperative steps.', examples: [{ name: 'Prolog', desc: 'The classic logic language.' }, { name: 'Datalog', desc: 'Used in program analysis and databases.' }] },
  'sat-smt': { id: 'sat-smt', label: 'SAT / SMT Solvers', shortLabel: 'SAT/SMT', tagline: 'Constraint solving', eyebrow: 'Symbolic', color: 'amber', icon: Shield, parent: 'symbolic', analogy: 'Can this combination of constraints be satisfied? The solver exhaustively searches for a solution.', definition: 'Boolean satisfiability and satisfiability modulo theories. Powers hardware verification and security analysis.', examples: [{ name: 'Z3 (Microsoft)', desc: 'Industry-standard SMT solver.' }, { name: 'Hardware verification', desc: 'Chip design correctness proofs.' }] },
  'theorem-provers': { id: 'theorem-provers', label: 'Theorem Provers', shortLabel: 'Provers', tagline: 'Formal math', eyebrow: 'Symbolic', color: 'amber', icon: GraduationCap, parent: 'symbolic', analogy: 'Mechanized mathematical proof. Every step verified by machine.', definition: 'Lean, Coq, Isabelle â€” interactive proof assistants powering 2026 math-AI research.', examples: [{ name: 'Lean 4', desc: 'Rising star in formalized mathematics.' }, { name: 'Coq / Isabelle', desc: 'Established proof assistants.' }] },
  // â”€â”€ RL children â”€â”€
  'tabular-rl': { id: 'tabular-rl', label: 'Tabular RL', shortLabel: 'Tabular RL', tagline: 'Q-tables', eyebrow: 'RL Methods', color: 'amber', icon: BarChart3, parent: 'rl', analogy: 'A lookup table of state-action values, updated after each experience.', definition: 'Q-learning, SARSA â€” classical RL for small, discrete state spaces.', examples: [{ name: 'Q-learning', desc: 'Off-policy value iteration.' }, { name: 'SARSA', desc: 'On-policy TD learning.' }] },
  'deep-rl': { id: 'deep-rl', label: 'Deep RL', shortLabel: 'Deep RL', tagline: 'Neural policies', eyebrow: 'RL Methods', color: 'amber', icon: Layers, parent: 'rl', analogy: 'Replace the Q-table with a neural network. Scale RL to high-dimensional state spaces.', definition: 'DQN, PPO, SAC â€” deep neural networks as function approximators for RL.', examples: [{ name: 'DQN (Atari)', desc: 'DeepMind\'s Atari breakthrough.' }, { name: 'PPO', desc: 'Workhorse policy gradient method.' }] },
  'game-rl': { id: 'game-rl', label: 'Game AI', shortLabel: 'Game AI', tagline: 'Superhuman play', eyebrow: 'RL Methods', color: 'amber', icon: Gamepad2, parent: 'rl', analogy: 'Self-play + search + deep RL = superhuman performance in complex games.', definition: 'AlphaGo, AlphaZero, MuZero â€” MCTS combined with deep policy/value networks.', examples: [{ name: 'AlphaGo / AlphaZero', desc: 'Defeated world champions at Go and chess.' }, { name: 'MuZero', desc: 'Learned the game rules from scratch.' }] },
  'rlhf-align': { id: 'rlhf-align', label: 'RLHF & Alignment', shortLabel: 'RLHF', tagline: 'LLM training', eyebrow: 'RL Methods', color: 'amber', icon: Bot, parent: 'rl', analogy: 'Human preferences become the reward signal. Align language models to be helpful and safe.', definition: 'RLHF, DPO, GRPO â€” post-training alignment for LLMs. GRPO powers DeepSeek R1.', examples: [{ name: 'RLHF (InstructGPT)', desc: 'The technique that made ChatGPT useful.' }, { name: 'GRPO (DeepSeek)', desc: 'Group relative policy optimization for reasoning.' }] },
  // â”€â”€ Other AI children â”€â”€
  'search-ai': { id: 'search-ai', label: 'Search Algorithms', shortLabel: 'Search', tagline: 'Pathfinding', eyebrow: 'Other AI', color: 'stone', icon: Search, parent: 'other-ai', analogy: 'Systematically explore possibilities. A* finds the shortest path; BFS explores breadth-first.', definition: 'Graph search algorithms â€” A*, BFS, DFS, beam search. Foundation of classical AI.', examples: [{ name: 'A* pathfinding', desc: 'GPS navigation, game AI.' }, { name: 'Beam search', desc: 'Used in LLM decoding strategies.' }] },
  'mcts-ai': { id: 'mcts-ai', label: 'Monte Carlo Tree Search', shortLabel: 'MCTS', tagline: 'Guided search', eyebrow: 'Other AI', color: 'stone', icon: Dice5, parent: 'other-ai', analogy: 'Random simulations guide tree expansion. Balances exploration and exploitation.', definition: 'Stochastic tree search used in game AI and increasingly in LLM test-time compute.', examples: [{ name: 'AlphaGo backbone', desc: 'MCTS + neural network evaluation.' }, { name: 'Test-time search (2025)', desc: 'Scaling inference compute for reasoning.' }] },
  'constraint-ai': { id: 'constraint-ai', label: 'Constraint Satisfaction', shortLabel: 'CSP', tagline: 'Feasibility solving', eyebrow: 'Other AI', color: 'stone', icon: Puzzle, parent: 'other-ai', analogy: 'Given constraints, find an assignment that satisfies all of them simultaneously.', definition: 'CSP solvers for scheduling, configuration, and combinatorial optimization.', examples: [{ name: 'Sudoku solvers', desc: 'Classic CSP example.' }, { name: 'Airline scheduling', desc: 'Crew and fleet assignment.' }] },
  // â”€â”€ Classical ML children â”€â”€
  'lin-reg': { id: 'lin-reg', label: 'Linear & Logistic Regression', shortLabel: 'Lin/Log Reg', tagline: 'The baseline', eyebrow: 'Classical ML', color: 'teal', icon: TrendingUp, parent: 'classical-ml', analogy: 'Fit a line (or hyperplane) through the data. The universal first model to try.', definition: 'Weighted sum of features â†’ prediction. Logistic adds a sigmoid for classification.', examples: [{ name: 'Credit scoring', desc: 'Probability of default.' }, { name: 'A/B test analysis', desc: 'Regression on experiment outcomes.' }] },
  'decision-trees': { id: 'decision-trees', label: 'Decision Trees', shortLabel: 'Dec. Trees', tagline: 'Flowchart logic', eyebrow: 'Classical ML', color: 'teal', icon: TreeDeciduous, parent: 'classical-ml', analogy: 'A flowchart of yes/no questions that splits data into groups.', definition: 'CART, C4.5 â€” recursive partitioning. Interpretable but prone to overfitting.', examples: [{ name: 'Medical triage', desc: 'Interpretable clinical decision support.' }, { name: 'Business rules', desc: 'Automated policy decisions.' }] },
  'random-forest': { id: 'random-forest', label: 'Random Forest', shortLabel: 'Rand. Forest', tagline: 'Ensemble voting', eyebrow: 'Classical ML', color: 'teal', icon: Trees, parent: 'classical-ml', analogy: 'Many trees vote together. Averaging reduces variance and overfitting.', definition: 'Bagging ensemble of decision trees with random feature subsets.', examples: [{ name: 'Tabular ML baseline', desc: 'Reliable general-purpose classifier.' }, { name: 'Feature importance', desc: 'Rank which features matter most.' }] },
  'gradient-boosting': { id: 'gradient-boosting', label: 'Gradient Boosting', shortLabel: 'XGBoost', tagline: 'Sequential correction', eyebrow: 'Classical ML', color: 'teal', icon: Zap, parent: 'classical-ml', analogy: 'Each new tree fixes the mistakes of the previous ones. The Kaggle champion.', definition: 'XGBoost, LightGBM, CatBoost â€” sequential boosted trees. Dominates tabular ML.', examples: [{ name: 'Kaggle competitions', desc: 'Most tabular winners use boosting.' }, { name: 'Ad CTR prediction', desc: 'Click-through rate at scale.' }] },
  'svm': { id: 'svm', label: 'Support Vector Machines', shortLabel: 'SVM', tagline: 'Max-margin', eyebrow: 'Classical ML', color: 'teal', icon: Target, parent: 'classical-ml', analogy: 'Find the widest possible boundary between classes. Kernel trick for nonlinearity.', definition: 'Maximum-margin classifier with kernel functions for nonlinear boundaries.', examples: [{ name: 'Pre-BERT text classification', desc: 'Was state of the art for NLP tasks.' }, { name: 'Gene expression', desc: 'Biological classification tasks.' }] },
  'knn': { id: 'knn', label: 'k-Nearest Neighbors', shortLabel: 'k-NN', tagline: 'Similarity match', eyebrow: 'Classical ML', color: 'teal', icon: Users, parent: 'classical-ml', analogy: 'Classify a new point by looking at its k closest neighbors in the training data.', definition: 'Instance-based lazy learning. No training phase â€” all computation at inference.', examples: [{ name: 'Recommender baselines', desc: 'Find similar users or items.' }, { name: 'Anomaly detection', desc: 'Points far from all neighbors are anomalies.' }] },
  'naive-bayes': { id: 'naive-bayes', label: 'Naive Bayes', shortLabel: 'Naive Bayes', tagline: 'Probabilistic', eyebrow: 'Classical ML', color: 'teal', icon: Mail, parent: 'classical-ml', analogy: 'Assume features are independent, apply Bayes theorem. Surprisingly effective.', definition: 'Probabilistic classifier assuming conditional independence. Very fast to train.', examples: [{ name: 'Spam filtering', desc: 'The original spam classifier.' }, { name: 'Document classification', desc: 'Fast text categorization.' }] },
  'clustering': { id: 'clustering', label: 'Clustering', shortLabel: 'Clustering', tagline: 'Unsupervised groups', eyebrow: 'Classical ML', color: 'teal', icon: ScatterChart, parent: 'classical-ml', analogy: 'Find natural groups in unlabeled data. No one tells the algorithm what the groups are.', definition: 'k-means, DBSCAN, hierarchical â€” unsupervised grouping by similarity.', examples: [{ name: 'Customer segmentation', desc: 'Group users by behavior.' }, { name: 'Document clustering', desc: 'Organize text corpora.' }] },
  'dim-reduction': { id: 'dim-reduction', label: 'Dimensionality Reduction', shortLabel: 'PCA/UMAP', tagline: 'Compress features', eyebrow: 'Classical ML', color: 'teal', icon: Minimize2, parent: 'classical-ml', analogy: 'Project high-dimensional data to fewer dimensions while preserving structure.', definition: 'PCA, t-SNE, UMAP â€” reduce dimensions for visualization or preprocessing.', examples: [{ name: 'Embedding visualization', desc: 'Visualize transformer embeddings in 2D.' }, { name: 'Feature preprocessing', desc: 'Reduce noise before classification.' }] },
  'gaussian-proc': { id: 'gaussian-proc', label: 'Gaussian Processes', shortLabel: 'GP', tagline: 'Bayesian regression', eyebrow: 'Classical ML', color: 'teal', icon: Sigma, parent: 'classical-ml', analogy: 'Regression with built-in uncertainty. Tells you not just the prediction but how confident it is.', definition: 'Non-parametric Bayesian regression. Expensive but gives calibrated uncertainty.', examples: [{ name: 'Hyperparameter tuning', desc: 'Bayesian optimization (BoTorch).' }, { name: 'Small-data science', desc: 'When you have <100 samples.' }] },
};


// CSS Animation Styles
const CUSTOM_CSS = `
  @keyframes flowLine { to { stroke-dashoffset: -20; } }
  .svg-active-flow { stroke-dasharray: 6, 4; animation: flowLine 0.7s infinite linear; }
  @keyframes cardBreathe {
    0%, 100% { transform: scale(1.03) translateY(-2px); box-shadow: 0 4px 20px -2px var(--glow), inset 0 0 10px -2px var(--glow); border-color: var(--active-border) !important; }
    50% { transform: scale(1.06) translateY(-4px); box-shadow: 0 8px 30px 2px var(--glow), inset 0 0 18px 2px var(--glow); border-color: var(--active-border) !important; }
  }
  .card-breathe { animation: cardBreathe 3s infinite ease-in-out; }
  .path-highlight { border-color: var(--active-border) !important; background: var(--active-bg) !important; color: var(--active-text) !important; box-shadow: 0 0 10px -2px var(--glow); }
`;

// Main Component
export default function AITaxonomy() {
  const [selectedId, setSelectedId] = useState<string>('ai');

  const selectedNode = useMemo(() => taxonomyData[selectedId] ?? taxonomyData.ai, [selectedId]);
  const pStyle = useMemo(() => colorStyles[selectedNode.color] || colorStyles.stone, [selectedNode]);

  const path = useMemo(() => {
    const arr: TaxonomyNode[] = [];
    let curr: TaxonomyNode | undefined = selectedNode;
    while (curr) { arr.unshift(curr); curr = curr.parent ? taxonomyData[curr.parent] : undefined; }
    return arr;
  }, [selectedNode]);

  const isOnActiveBranch = (nodeId: string) => path.some((n) => n.id === nodeId);
  const isActivePath = (p: string, c: string) => isOnActiveBranch(p) && isOnActiveBranch(c);

  const getLineClass = (p: string, c: string) => isActivePath(p, c) ? "svg-active-flow" : "";
  const getLineStyle = (p: string, c: string) => {
    if (!isActivePath(p, c)) return { stroke: "var(--rule)", strokeWidth: 1.2, strokeDasharray: "4 4", opacity: 0.35 };
    const t = colorStyles[taxonomyData[c]?.color || 'stone'];
    return { stroke: t.accent, strokeWidth: 2.5, opacity: 0.95, filter: `drop-shadow(0 0 4px ${t.accent})` };
  };

  // Dynamic tree levels
  const getChildren = (pid: string) => Object.values(taxonomyData).filter((n) => n.parent === pid);
  const level2 = useMemo(() => getChildren('ai'), []);
  const activeL2 = level2.find((n) => isOnActiveBranch(n.id));
  const level3 = activeL2 ? getChildren(activeL2.id) : [];
  const activeL3 = level3.find((n) => isOnActiveBranch(n.id));
  const level4 = activeL3 ? getChildren(activeL3.id) : [];

  const numRows = 2 + (level3.length > 0 ? 1 : 0) + (level4.length > 0 ? 1 : 0);
  // Each row is 38px tall, with 52px gap between rows. 24px padding top/bottom.
  const ROW_H = 38;
  const ROW_GAP = 52;
  const PAD = 24;
  const rowY = (r: number) => PAD + r * (ROW_H + ROW_GAP);
  const containerH = rowY(numRows - 1) + ROW_H + PAD;
  const xNum = (idx: number, total: number) => ((idx + 0.5) / total) * 1000;
  // SVG viewBox matches container exactly so coords are 1:1 with pixels
  const svgCurve = (px: number, py: number, cx: number, cy: number) => {
    const dy = (cy - py) * 0.5;
    return `M ${px} ${py} C ${px} ${py + dy}, ${cx} ${cy - dy}, ${cx} ${cy}`;
  };
  // SVG endpoints: bottom of parent row + 6px margin, top of child row - 6px margin
  const rowBot = (r: number) => rowY(r) + ROW_H + 6;
  const rowTop = (r: number) => rowY(r) - 6;

  const renderBtn = (node: TaxonomyNode, small?: boolean) => {
    const active = selectedId === node.id;
    const onP = isOnActiveBranch(node.id);
    const t = colorStyles[node.color];
    const Icon = node.icon;
    const ic = node.color === 'indigo' ? 'text-indigo-400' : node.color === 'teal' ? 'text-teal-400' : node.color === 'rose' ? 'text-rose-400' : node.color === 'amber' ? 'text-amber-400' : 'text-stone-300';
    return (
      <button key={node.id} onClick={() => setSelectedId(node.id)}
        className={`w-full px-2 py-2 rounded-xl border flex ${small ? 'flex-col' : ''} items-center justify-center gap-1.5 transition-all duration-300 group cursor-pointer ${active ? 'card-breathe' : onP ? 'path-highlight font-semibold' : 'bg-[var(--bg-elev)] border-[var(--rule)] text-[var(--ink-2)] hover:scale-[1.02]'}`}
        style={{ '--glow': t.glowColor, '--active-border': t.activeBorder, '--active-bg': t.activeBg, '--active-text': t.text } as React.CSSProperties}>
        <Icon size={small ? 11 : 13} className={onP ? ic : 'text-[var(--ink-3)]'} />
        <span className={`${small ? 'text-[8px]' : 'text-[10px] md:text-xs'} uppercase tracking-wider font-semibold text-center leading-tight`}>{node.shortLabel || node.label}</span>
      </button>
    );
  };

  return (
    <div className="w-full text-[var(--ink)] max-w-4xl mx-auto">
      <style>{CUSTOM_CSS}</style>
      <section id="ai-taxonomy" className="scroll-mt-24 py-8 border-b border-[var(--rule)] mb-8">
        <div className="mb-6">
          <div className="p1-eyebrow mb-4">1.1 &middot; The AI Family Tree</div>
          <h2 className="p1-h2 text-3xl md:text-4xl mb-4" style={{ color: "var(--ink)" }}>AI, ML, and deep learning</h2>
          <p className="p1-body max-w-3xl" style={{ fontFamily: "var(--serif)", fontSize: "17px", lineHeight: 1.55 }}>
            One extended analogy runs through this guide: imagine AI as a sprawling <em>investigation agency</em>.
            Below is the interactive family tree. <strong className="text-indigo-400 font-medium">Click any node</strong> to explore its branch &mdash; the tree reshapes to show children dynamically.
          </p>
        </div>

        {/* Dynamic Tree Map */}
        <div className="p1-card p-6 mb-8 bg-gradient-to-b from-[var(--bg-elev)] to-[var(--bg-sunken)] border border-[var(--rule)] rounded-2xl relative overflow-hidden flex flex-col transition-all duration-500" style={{ height: containerH, gap: ROW_GAP }}>
          <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox={`0 0 1000 ${containerH}`} preserveAspectRatio="none" style={{ zIndex: 0 }}>
            {level2.map((ch, i) => <path key={`s1-${ch.id}`} d={svgCurve(500, rowBot(0), xNum(i, level2.length), rowTop(1))} fill="none" className={getLineClass('ai', ch.id)} style={getLineStyle('ai', ch.id)} />)}
            {activeL2 && level3.map((ch, i) => { const pi = level2.findIndex(n => n.id === activeL2.id); return <path key={`s2-${ch.id}`} d={svgCurve(xNum(pi, level2.length), rowBot(1), xNum(i, level3.length), rowTop(2))} fill="none" className={getLineClass(activeL2.id, ch.id)} style={getLineStyle(activeL2.id, ch.id)} />; })}
            {activeL3 && level4.map((ch, i) => { const pi = level3.findIndex(n => n.id === activeL3.id); return <path key={`s3-${ch.id}`} d={svgCurve(xNum(pi, level3.length), rowBot(2), xNum(i, level4.length), rowTop(3))} fill="none" className={getLineClass(activeL3.id, ch.id)} style={getLineStyle(activeL3.id, ch.id)} />; })}
          </svg>
          <div className="flex justify-center relative z-10" style={{ height: ROW_H }}><div style={{ width: 220 }}>{renderBtn(taxonomyData.ai)}</div></div>
          <div className="relative z-10" style={{ height: ROW_H, display: 'grid', gridTemplateColumns: `repeat(${level2.length}, 1fr)`, gap: 8 }}>{level2.map(n => renderBtn(n))}</div>
          {level3.length > 0 && <div className="relative z-10" style={{ height: ROW_H, display: 'grid', gridTemplateColumns: `repeat(${level3.length}, 1fr)`, gap: 8 }}>{level3.map(n => renderBtn(n))}</div>}
          {level4.length > 0 && <div className="relative z-10" style={{ height: ROW_H, display: 'grid', gridTemplateColumns: `repeat(${level4.length}, 1fr)`, gap: 8 }}>{level4.map(n => renderBtn(n, true))}</div>}
        </div>

        {/* Inspector Panel */}
        <div className="p1-card bg-[var(--bg-elev)] rounded-2xl overflow-hidden transition-all duration-300 border shadow-2xl relative" style={{ borderColor: pStyle.border, boxShadow: `0 10px 40px -5px ${pStyle.glow}` }}>
          <div className="px-6 py-3 text-[10px] uppercase tracking-wider font-semibold border-b flex items-center gap-1.5" style={{ borderColor: pStyle.border, background: 'var(--bg-sunken)' }}>
            <Compass size={12} className="text-[var(--ink-3)]" />
            <span className="text-[var(--ink-3)]">Path:</span>
            {path.map((n, i) => (
              <React.Fragment key={n.id}>
                {i > 0 && <ChevronRight size={10} className="text-[var(--ink-3)]" />}
                <button onClick={() => setSelectedId(n.id)} className={`hover:underline font-mono ${i === path.length - 1 ? 'text-[var(--ink)] font-bold' : 'text-[var(--ink-3)]'}`}>{n.shortLabel || n.label}</button>
              </React.Fragment>
            ))}
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--rule)] pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ backgroundColor: pStyle.bg, borderColor: pStyle.border, color: pStyle.accent }}>{React.createElement(selectedNode.icon, { size: 24 })}</div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: pStyle.accent }}>{selectedNode.eyebrow}</div>
                  <h3 className="font-serif text-2xl md:text-3xl text-[var(--ink)] leading-none font-bold">{selectedNode.label}</h3>
                </div>
              </div>
              <div className="px-4 py-1.5 rounded-full border text-[11px] font-mono tracking-wider uppercase inline-flex items-center gap-2" style={{ backgroundColor: pStyle.bg, borderColor: pStyle.border, color: pStyle.accent }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />{selectedNode.tagline}
              </div>
            </div>
            <div className="p-5 rounded-xl border relative overflow-hidden" style={{ backgroundColor: 'var(--bg-sunken)', borderColor: pStyle.border }}>
              <div className="absolute top-0 right-0 p-3 opacity-[0.03] pointer-events-none"><HelpCircle size={100} /></div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--ink-3)] mb-2 flex items-center gap-1.5"><Info size={11} style={{ color: pStyle.accent }} /> Detective Metaphor Analogy</div>
              <p className="p1-body italic leading-relaxed text-[var(--ink-2)] text-sm md:text-base">&ldquo;{selectedNode.analogy}&rdquo;</p>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--ink-3)]">Technical Briefing</div>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">{selectedNode.definition}</p>
            </div>
            <div className="space-y-4 pt-4 border-t border-[var(--rule)]">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--ink-3)] mb-3">Examples in Production / Wild</div>
              <div className="grid gap-3.5 md:grid-cols-2">
                {selectedNode.examples.map((ex, i) => (
                  <div key={i} className="p-4 rounded-xl border bg-[var(--bg-elev)] hover:border-[var(--indigo)] hover:scale-[1.01] transition-all duration-200 group" style={{ borderColor: 'var(--rule)' }}>
                    <div className="text-sm font-bold text-[var(--ink)] group-hover:text-amber-400 transition duration-150">{ex.name}</div>
                    <div className="text-xs text-[var(--ink-2)] mt-1.5 leading-relaxed">{ex.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-8 text-[12px] text-[var(--ink-3)] leading-relaxed italic border-b border-[var(--rule)]">
        <p>The lines between these boxes are crisp on paper and porous in practice. AlphaGo uses both MCTS (search) and deep RL. RAG systems combine retrieval (classical) with transformer generation. The taxonomy is a map of the territory &mdash; bring it when you travel; don&apos;t mistake it for the land.</p>
      </footer>
    </div>
  );
}
