"use client";
import React, { useState } from 'react';

const S = {
  ink: 'var(--ink)',
  ink2: 'var(--ink-2)',
  ink3: 'var(--ink-3)',
  bg: 'var(--bg-elev)',
  bgSunk: 'var(--bg-sunken)',
  rule: 'var(--rule)',
  blue: 'var(--accent-p2)',
  blueSoft: 'rgba(96, 165, 250, 0.12)',
  violet: 'var(--accent-p1)',
  violetSoft: 'rgba(167, 139, 250, 0.12)',
  rose: 'var(--accent-p6)',
  roseSoft: 'rgba(251, 113, 133, 0.12)',
  teal: 'var(--accent-p4)',
  tealSoft: 'rgba(52, 211, 153, 0.12)',
  amber: 'var(--accent-p5)',
  amberSoft: 'rgba(251, 191, 36, 0.12)',
};

function Section({ id, eyebrow, title, kicker, borderColor, eyebrowColor, children }: any) {
  return (
    <section id={id} className="scroll-mt-24 py-12" style={{ borderTop: `2px solid ${borderColor}` }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600, color: eyebrowColor, marginBottom: 8, fontFamily: 'var(--mono)' }}>{eyebrow}</div>
      <h2 className="tracking-tight" style={{ fontSize: 32, fontWeight: 600, color: S.ink, lineHeight: 1.1, marginBottom: 12 }}>{title}</h2>
      {kicker && <p style={{ fontSize: 15, color: S.ink2, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 24 }}>{kicker}</p>}
      {children}
    </section>
  );
}

function Para({ children }: any) {
  return <p style={{ fontSize: 15.5, color: S.ink2, lineHeight: 1.7, marginBottom: 16 }}>{children}</p>;
}

function Callout({ borderColor, labelColor, label, children }: any) {
  return (
    <div className="p2-glass" style={{ borderLeft: `3px solid ${borderColor}`, padding: '16px 20px', margin: '24px 0', borderRadius: '0 12px 12px 0' }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: labelColor, marginBottom: 6, fontFamily: 'var(--mono)' }}>{label}</div>
      <div style={{ fontSize: 14.5, color: S.ink2, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function VisualCard({ children, caption }: any) {
  return (
    <div style={{ margin: '28px 0' }}>
      <div className="p2-glass" style={{ borderRadius: 16, padding: '28px 24px' }}>{children}</div>
      {caption && <div style={{ fontSize: 12, color: S.ink3, fontStyle: 'italic', marginTop: 10, textAlign: 'center', maxWidth: 720, margin: '10px auto 0', lineHeight: 1.6, padding: '0 16px' }}>{caption}</div>}
    </div>
  );
}

const STEPS = [
  {
    num: 1,
    title: "Token Embeddings",
    subtitle: "ID Lookup & Dense Vectors",
    color: S.violet,
    math: "x = W_e[t]",
    description: "The discrete token ID looks up a dense vector representing initial semantic meaning.",
    mathDetail: "Let t be the index of the token in the vocabulary. The embedding matrix W_e has size [V × d_model] where V is the vocabulary size (e.g., 32,000) and d_model is the model width (e.g., 4096). The embedding lookup pulls the t-th row from W_e to yield the initial vector x_0 ∈ ℝ^d_model.",
    trace: "The token \"water\" has token ID 4920. We index row 4920 of the massive Embedding matrix. This returns a dense 4096-dimensional floating-point vector [0.15, -0.42, 0.89, ..., 0.03] that represents 'water' in semantic vector space."
  },
  {
    num: 2,
    title: "Rotary Embeddings (RoPE)",
    subtitle: "Relative Positional Encoding",
    color: S.rose,
    math: "x_rot = R_{Θ, m} x",
    description: "Rotates vector dimensions in pairs to encode position without losing magnitude information.",
    mathDetail: "RoPE groups the d_model activations into pairs. At position m, the pair (x_2i, x_2i+1) is rotated in 2D space by angle m·θ_i, where θ_i = 10000^(-2i/d). Formally: [x_2i*cos(mθ) - x_2i+1*sin(mθ), x_2i*sin(mθ) + x_2i+1*cos(mθ)]. This encodes relative distance via dot products.",
    trace: "The token \"water\" is at position index m = 2 (in \"The [0] river [1] water [2]\"). We group its 4096-d vector into 2048 pairs. Each pair is rotated in a 2D plane by angle 2·θ_i. This encodes its exact relative distance to other tokens."
  },
  {
    num: 3,
    title: "Pre-RMSNorm",
    subtitle: "Root-Mean-Square Scaling",
    color: S.teal,
    math: "bar{x} = (x / RMS(x)) * γ",
    description: "Normalizes vector activations before the sublayer to stabilize deep signal highways.",
    mathDetail: "To prevent gradients and values from exploding inside deep stacks, pre-layer normalization scales activations. RMSNorm is computationally efficient: it calculates RMS(x) = sqrt((1/d) ∑ x_i^2 + ε), divides x by RMS(x), and performs element-wise multiplication by a learnable weight vector γ.",
    trace: "Before entering attention, we measure the raw magnitude of \"water\"'s 4096 activations. RMS(x) is 1.45. We divide every element by 1.45 to normalize the variance, then scale element-wise by γ. This readies the vector for projections."
  },
  {
    num: 4,
    title: "Self-Attention (Q, K, V)",
    subtitle: "Contextual Information Mixing",
    color: S.blue,
    math: "Attn = Softmax(Q K^T / sqrt(d_k)) V",
    description: "Queries match historical Keys to weight Values via dot-product attention scores.",
    mathDetail: "The normalized vector bar{x} is projected into Queries (Q = bar{x} W_q), Keys (K = bar{x} W_k), and Values (V = bar{x} W_v). We use Grouped-Query Attention (GQA): 8 K/V heads shared across 32 Q heads to save memory. Keys and Values are saved in a KV Cache to avoid recomputing past tokens.",
    trace: "Our token \"water\" acts as a Query (Q) looking for context. It computes dot products with the Keys (K) of all past tokens in its cache: \"The\", \"river\", \"water\". The dot product is highest with \"river\" (score = 12.8). Softmax assigns 68% attention weight to \"river\", mixing their Values."
  },
  {
    num: 5,
    title: "Attention Out-Projection",
    subtitle: "Residual Streams & Additions",
    color: S.violet,
    math: "x = x + Attn * W_o",
    description: "Projects mixed attention heads back to d_model and adds them to the residual highway.",
    mathDetail: "The context-mixed vectors from all attention heads are concatenated and projected back to the main dimension d_model using the output projection matrix W_o. Crucially, the result is added directly back to the original input vector x (a residual connection), bypassing the normalization layer.",
    trace: "The attention head yields a mixed vector representing 'water in the context of a river'. We multiply it by W_o to map it to 4096 dimensions, then add it back to the original raw embedding of \"water\". The residual stream now carries both the raw identity and the context."
  },
  {
    num: 6,
    title: "Gated MLP (SwiGLU)",
    subtitle: "Feed-Forward Up/Down Routing",
    color: S.amber,
    math: "FFN = (SiLU(x W_g) * x W_u) W_d",
    description: "A two-way gated projection that performs non-linear mapping and routing.",
    mathDetail: "The vector is normalized via another RMSNorm, then projected by two parallel matrices: the Gate matrix W_gate and the Up matrix W_up. We apply the SiLU activation, silu(z) = z * sigmoid(z), to the Gate output and multiply it element-wise with the Up projection. Finally, W_down projects it back to d_model.",
    trace: "The context-aware vector is normalized and projected to an 11,008-dimensional hidden space. The gated SiLU path acts as a soft routing switch: it triggers factual associations for 'river water', activating neural nodes representing flowing, liquid, and nature, then projects back to 4096."
  },
  {
    num: 7,
    title: "LM Head & Sampling",
    subtitle: "Unembedding, Temperature & Top-P",
    color: S.teal,
    math: "P = Softmax(RMS(x) W_u / T)",
    description: "Projects the final vector to vocabulary logits, scales by Temperature, and samples.",
    mathDetail: "The final residual vector at position 2 is normalized and multiplied by the Unembedding matrix W_u ∈ ℝ^(d_model × V) to compute a score (logit) for every word in the vocabulary. We divide logits by Temperature T, zero out items outside Top-P or Top-K thresholds, and apply Softmax to get probabilities.",
    trace: "The final vector is unembedded into 32,000 logits. The word \"flows\" gets the highest logit of 14.8. At Temperature T = 0.7 and Top-P = 0.9, we filter out low-scoring candidates. Softmax assigns an 86% probability to \"flows\". We sample and output \"flows\"!"
  }
];

function TransformerLayersVisual() {
  const [activeStep, setActiveStep] = useState(0);

  const step = STEPS[activeStep];

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div style={{ margin: '28px 0' }}>
      {/* Step Tabs Selector */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        overflowX: 'auto', 
        paddingBottom: 8, 
        marginBottom: 20,
        scrollbarWidth: 'thin',
        msOverflowStyle: 'none'
      }}>
        {STEPS.map((s, idx) => {
          const isActive = idx === activeStep;
          return (
            <button
              key={s.num}
              onClick={() => setActiveStep(idx)}
              className={isActive ? "p2-btn-pill p2-btn-pill-active" : "p2-btn-pill"}
              style={{
                whiteSpace: 'nowrap',
                flexShrink: 0,
                ...(isActive ? { borderColor: s.color } : {})
              }}
            >
              {s.num}. {s.title}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Board */}
      <div className="p2-glass" style={{ borderRadius: 16, padding: '24px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', alignItems: 'start' }} className="lg:grid-cols-[1.2fr_1fr]">
          
          {/* Left Panel: SVG Graphics Visualizer */}
          <div style={{ 
            background: 'var(--bg-sunken)', 
            borderRadius: 12, 
            border: '1px solid var(--border)', 
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 340
          }}>
            {/* SVG 1: Token Embeddings */}
            {activeStep === 0 && (
              <svg viewBox="0 0 500 320" className="w-full h-auto">
                <defs>
                  <linearGradient id="embGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={S.violet} />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <text x="250" y="30" textAnchor="middle" fontSize="11" fontWeight="600" fill={S.ink3} fontFamily="var(--mono)" letterSpacing="0.08em">VOCAB ID LOOKUP</text>
                
                {/* Input word block */}
                <g transform="translate(40, 130)">
                  <rect width="80" height="40" rx="8" fill="rgba(167, 139, 250, 0.08)" stroke={S.violet} strokeWidth="1.5" />
                  <text x="40" y="24" textAnchor="middle" fontSize="14" fontWeight="700" fill={S.violet} fontFamily="var(--sans)">"water"</text>
                </g>
                <path d="M 120 150 L 172 150" fill="none" stroke={S.ink3} strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrViolet)" />

                {/* Token ID mapping */}
                <g transform="translate(180, 135)">
                  <rect width="60" height="30" rx="6" fill={S.bg} stroke="var(--border)" strokeWidth="1" />
                  <text x="30" y="19" textAnchor="middle" fontSize="12" fontWeight="600" fill={S.ink} fontFamily="var(--mono)">ID 4920</text>
                </g>
                <path d="M 240 150 L 285 150" fill="none" stroke={S.ink3} strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrViolet)" />

                {/* Embedding weight matrix W_e */}
                <g transform="translate(300, 50)">
                  <rect width="140" height="200" rx="10" fill="rgba(255, 255, 255, 0.02)" stroke="var(--border)" strokeWidth="1.2" />
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fill={S.ink3} fontFamily="var(--mono)">Matrix W_e [V x d_model]</text>
                  
                  {/* Grid matrix lines */}
                  <line x1="10" y1="40" x2="130" y2="40" stroke="var(--border)" strokeWidth="0.6" opacity="0.3" />
                  <line x1="10" y1="70" x2="130" y2="70" stroke="var(--border)" strokeWidth="0.6" opacity="0.3" />
                  
                  {/* Highlighted selected row */}
                  <rect x="5" y="95" width="130" height="24" rx="4" fill="rgba(167, 139, 250, 0.15)" stroke={S.violet} strokeWidth="1.2" />
                  <text x="70" y="111" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={S.violet} fontFamily="var(--mono)">Row 4920 (water)</text>
                  
                  <line x1="10" y1="140" x2="130" y2="140" stroke="var(--border)" strokeWidth="0.6" opacity="0.3" />
                  <line x1="10" y1="170" x2="130" y2="170" stroke="var(--border)" strokeWidth="0.6" opacity="0.3" />
                </g>

                {/* Dense vector path */}
                <path d="M 435 107 C 460 107, 440 250, 290 250" fill="none" stroke="url(#embGrad)" strokeWidth="2.5" markerEnd="url(#arrViolet)" />
                <g transform="translate(120, 235)">
                  <rect width="160" height="30" rx="6" fill="rgba(167, 139, 250, 0.05)" stroke={S.violet} strokeWidth="1" />
                  <text x="80" y="19" textAnchor="middle" fontSize="10.5" fontWeight="600" fill={S.violet} fontFamily="var(--mono)">x_0 ∈ ℝ^4096</text>
                </g>
                
                <defs>
                  <marker id="arrViolet" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke={S.violet} strokeWidth="1.8" strokeLinecap="round"/>
                  </marker>
                </defs>
              </svg>
            )}

            {/* SVG 2: Rotary Positional Embeddings */}
            {activeStep === 1 && (
              <svg viewBox="0 0 500 320" className="w-full h-auto">
                <text x="250" y="25" textAnchor="middle" fontSize="11" fontWeight="600" fill={S.ink3} fontFamily="var(--mono)" letterSpacing="0.08em">VECTOR ROTATION PLANES</text>
                
                {/* Original elements */}
                <g transform="translate(30, 80)">
                  <rect width="110" height="150" rx="8" fill="rgba(251, 113, 133, 0.04)" stroke="var(--border)" strokeWidth="1" />
                  <text x="55" y="24" textAnchor="middle" fontSize="11" fontWeight="600" fill={S.ink3} fontFamily="var(--mono)">Input x_0</text>
                  
                  {/* Pairs of dimension elements */}
                  <rect x="15" y="42" width="80" height="24" rx="4" fill={S.bg} stroke="var(--border)" strokeWidth="1" />
                  <text x="55" y="58" textAnchor="middle" fontSize="10" fill={S.ink} fontFamily="var(--mono)">(x_0, x_1)</text>

                  <rect x="15" y="78" width="80" height="24" rx="4" fill={S.bg} stroke="var(--border)" strokeWidth="1" />
                  <text x="55" y="94" textAnchor="middle" fontSize="10" fill={S.ink} fontFamily="var(--mono)">(x_2, x_3)</text>
                  
                  <text x="55" y="132" textAnchor="middle" fontSize="16" fill={S.ink3}>⋮</text>
                </g>

                {/* Connection lines */}
                <path d="M 140 104 L 212 104" fill="none" stroke={S.rose} strokeWidth="1.2" strokeDasharray="3 3" />
                <path d="M 140 140 L 212 140" fill="none" stroke={S.rose} strokeWidth="1.2" strokeDasharray="3 3" />

                {/* Rotary rotation circle unit */}
                <g transform="translate(260, 150)">
                  <circle cx="0" cy="0" r="55" fill="none" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="-70" y1="0" x2="70" y2="0" stroke="var(--border)" strokeWidth="0.6" />
                  <line x1="0" y1="-70" x2="0" y2="70" stroke="var(--border)" strokeWidth="0.6" />
                  
                  {/* Rotating arrow vector */}
                  <line x1="0" y1="0" x2="38" y2="-28" stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#arrGray)" />
                  <text x="44" y="-34" fontSize="9" fill={S.ink3} fontFamily="var(--mono)">x_init</text>

                  <line x1="0" y1="0" x2="10" y2="-48" stroke={S.rose} strokeWidth="2.2" markerEnd="url(#arrRose)" className="pulse-stream" />
                  <text x="14" y="-55" fontSize="10.5" fontWeight="600" fill={S.rose} fontFamily="var(--mono)">x_rot</text>

                  {/* Rot angle indicator */}
                  <path d="M 23 -17 A 30 30 0 0 0 6 -28" fill="none" stroke={S.rose} strokeWidth="1.5" />
                  <text x="18" y="-34" fontSize="9.5" fontWeight="600" fill={S.rose} fontFamily="var(--sans)">mθ</text>
                  
                  <text x="0" y="85" textAnchor="middle" fontSize="10" fill={S.ink3} fontStyle="italic" fontFamily="var(--sans)">Dimension Pair rotated by m·θ_i</text>
                </g>

                {/* Final state box */}
                <g transform="translate(370, 80)">
                  <rect width="100" height="150" rx="8" fill="rgba(251, 113, 133, 0.06)" stroke={S.rose} strokeWidth="1.2" />
                  <text x="50" y="24" textAnchor="middle" fontSize="11" fontWeight="600" fill={S.rose} fontFamily="var(--mono)">Rotated x_rot</text>
                  
                  <rect x="15" y="42" width="70" height="24" rx="4" fill="rgba(251, 113, 133, 0.12)" stroke={S.rose} strokeWidth="0.8" />
                  <text x="50" y="58" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={S.rose} fontFamily="var(--mono)">(x'_0, x'_1)</text>

                  <rect x="15" y="78" width="70" height="24" rx="4" fill="rgba(251, 113, 133, 0.12)" stroke={S.rose} strokeWidth="0.8" />
                  <text x="50" y="94" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={S.rose} fontFamily="var(--mono)">(x'_2, x'_3)</text>

                  <text x="50" y="132" textAnchor="middle" fontSize="16" fill={S.rose}>⋮</text>
                </g>
                
                <defs>
                  <marker id="arrRose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke={S.rose} strokeWidth="1.8" strokeLinecap="round"/>
                  </marker>
                  <marker id="arrGray" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke={S.ink3} strokeWidth="1.8" strokeLinecap="round"/>
                  </marker>
                </defs>
              </svg>
            )}

            {/* SVG 3: Pre-RMSNorm */}
            {activeStep === 2 && (
              <svg viewBox="0 0 500 320" className="w-full h-auto">
                <text x="250" y="30" textAnchor="middle" fontSize="11" fontWeight="600" fill={S.ink3} fontFamily="var(--mono)" letterSpacing="0.08em">RMS STANDARD NORMALIZATION</text>
                
                {/* Input wide vector */}
                <g transform="translate(30, 130)">
                  <rect width="110" height="50" rx="6" fill={S.bg} stroke="var(--border)" strokeWidth="1.2" />
                  <text x="55" y="24" textAnchor="middle" fontSize="11" fontWeight="600" fill={S.ink} fontFamily="var(--mono)">Input vector x</text>
                  <text x="55" y="39" textAnchor="middle" fontSize="9.5" fill={S.ink3} fontStyle="italic" fontFamily="var(--mono)">[0.48, -1.95, 2.12, ...]</text>
                </g>
                <path d="M 140 155 L 182 155" fill="none" stroke={S.ink3} strokeWidth="1.5" markerEnd="url(#arrTeal)" />

                {/* Compute block */}
                <g transform="translate(190, 80)">
                  <rect width="140" height="150" rx="10" fill="rgba(52, 211, 153, 0.05)" stroke={S.teal} strokeWidth="1.5" />
                  
                  {/* Step A: squared mean sum */}
                  <rect x="10" y="16" width="120" height="34" rx="6" fill={S.bg} stroke={S.teal} strokeWidth="0.8" />
                  <text x="70" y="31" textAnchor="middle" fontSize="9" fontWeight="600" fill={S.teal} fontFamily="var(--mono)">Sum of Squares / d</text>
                  <path d="M 70 50 L 70 66" fill="none" stroke={S.teal} strokeWidth="1" markerEnd="url(#arrTeal)" />

                  {/* Step B: reciprocal root */}
                  <rect x="10" y="70" width="120" height="34" rx="6" fill={S.bg} stroke={S.teal} strokeWidth="0.8" />
                  <text x="70" y="85" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={S.teal} fontFamily="var(--mono)">RMS = sqrt(mean + ε)</text>
                  <path d="M 70 104 L 70 120" fill="none" stroke={S.teal} strokeWidth="1" markerEnd="url(#arrTeal)" />

                  {/* Step C: divide & multiply gamma */}
                  <text x="70" y="137" textAnchor="middle" fontSize="9" fill={S.ink3} fontFamily="var(--sans)">scale by vector γ</text>
                </g>
                <path d="M 330 155 L 372 155" fill="none" stroke={S.ink3} strokeWidth="1.5" markerEnd="url(#arrTeal)" />

                {/* Normalized output */}
                <g transform="translate(380, 130)">
                  <rect width="100" height="50" rx="6" fill="rgba(52, 211, 153, 0.08)" stroke={S.teal} strokeWidth="1.2" />
                  <text x="50" y="24" textAnchor="middle" fontSize="11" fontWeight="600" fill={S.teal} fontFamily="var(--mono)">{"Normalized bar{x}"}</text>
                  <text x="50" y="39" textAnchor="middle" fontSize="9.5" fill={S.ink3} fontStyle="italic" fontFamily="var(--mono)">[0.12, -0.51, 0.62, ...]</text>
                </g>
                
                <defs>
                  <marker id="arrTeal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke={S.teal} strokeWidth="1.8" strokeLinecap="round"/>
                  </marker>
                </defs>
              </svg>
            )}

            {/* SVG 4: Multi-Head Self-Attention */}
            {activeStep === 3 && (
              <svg viewBox="0 0 500 320" className="w-full h-auto">
                <text x="250" y="20" textAnchor="middle" fontSize="11" fontWeight="600" fill={S.ink3} fontFamily="var(--mono)" letterSpacing="0.08em">GROUPED-QUERY ATTENTION (GQA)</text>
                
                {/* Input vector */}
                <rect x="20" y="135" width="55" height="30" rx="4" fill="rgba(96, 165, 250, 0.05)" stroke="var(--border)" strokeWidth="1" />
                <text x="47" y="153" textAnchor="middle" fontSize="10.5" fontWeight="600" fill={S.blue} fontFamily="var(--mono)">{"bar{x}"}</text>
                
                {/* Projection pathways */}
                <path d="M 75 145 C 100 120, 110 70, 155 70" fill="none" stroke={S.blue} strokeWidth="1.2" markerEnd="url(#arrBlue)" />
                <path d="M 75 150 L 148 150" fill="none" stroke={S.blue} strokeWidth="1.2" markerEnd="url(#arrBlue)" />
                <path d="M 75 155 C 100 180, 110 230, 155 230" fill="none" stroke={S.blue} strokeWidth="1.2" markerEnd="url(#arrBlue)" />
                
                {/* Q, K, V boxes */}
                {/* Query Heads */}
                <g transform="translate(160, 45)">
                  <rect width="80" height="50" rx="6" fill={S.bg} stroke={S.blue} strokeWidth="1.2" />
                  <text x="40" y="20" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={S.blue} fontFamily="var(--sans)">Q Queries</text>
                  <text x="40" y="34" textAnchor="middle" fontSize="8.5" fill={S.ink3} fontFamily="var(--mono)">32 Heads</text>
                </g>
                
                {/* Shared Key Heads (GQA) */}
                <g transform="translate(160, 125)">
                  <rect width="80" height="50" rx="6" fill={S.bg} stroke={S.blue} strokeWidth="1.2" />
                  <text x="40" y="20" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={S.blue} fontFamily="var(--sans)">K Keys</text>
                  <text x="40" y="34" textAnchor="middle" fontSize="8.5" fill={S.ink3} fontFamily="var(--mono)">8 Heads (Shared)</text>
                </g>
                
                {/* Shared Value Heads (GQA) */}
                <g transform="translate(160, 205)">
                  <rect width="80" height="50" rx="6" fill={S.bg} stroke={S.blue} strokeWidth="1.2" />
                  <text x="40" y="20" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={S.blue} fontFamily="var(--sans)">V Values</text>
                  <text x="40" y="34" textAnchor="middle" fontSize="8.5" fill={S.ink3} fontFamily="var(--mono)">8 Heads (Shared)</text>
                </g>

                {/* Attention Matrix Map */}
                <g transform="translate(290, 80)">
                  <rect width="80" height="80" rx="8" fill="rgba(255, 255, 255, 0.02)" stroke="var(--border)" strokeWidth="1.2" />
                  <text x="40" y="16" textAnchor="middle" fontSize="8.5" fill={S.ink3} fontFamily="var(--mono)">Attention Map</text>
                  
                  {/* Grid cells */}
                  <rect x="10" y="24" width="18" height="18" rx="2" fill="rgba(96, 165, 250, 0.05)" />
                  <rect x="31" y="24" width="18" height="18" rx="2" fill="rgba(96, 165, 250, 0.1)" />
                  <rect x="52" y="24" width="18" height="18" rx="2" fill="rgba(96, 165, 250, 0.15)" />
                  
                  <rect x="10" y="45" width="18" height="18" rx="2" fill="rgba(96, 165, 250, 0.2)" />
                  <rect x="31" y="45" width="18" height="18" rx="2" fill="rgba(96, 165, 250, 0.8)" className="pulse-stream" /> {/* water queries river */}
                  <rect x="52" y="45" width="18" height="18" rx="2" fill="rgba(96, 165, 250, 0.3)" />
                  
                  <text x="41" y="75" textAnchor="middle" fontSize="7" fill={S.blue} fontWeight="700">water x river</text>
                </g>

                {/* KV Cache storage indication */}
                <g transform="translate(280, 205)">
                  <rect width="100" height="40" rx="6" fill="rgba(96, 165, 250, 0.08)" stroke={S.blue} strokeWidth="1" strokeDasharray="3 3" />
                  <text x="50" y="18" textAnchor="middle" fontSize="9" fontWeight="600" fill={S.blue} fontFamily="var(--sans)">KV Cache memory</text>
                  <text x="50" y="30" textAnchor="middle" fontSize="8" fill={S.ink3} fontFamily="var(--mono)">stores: "The", "river"</text>
                </g>

                {/* Connections to Attention map */}
                <path d="M 240 70 C 275 70, 260 120, 285 120" fill="none" stroke={S.blue} strokeWidth="1" />
                <path d="M 240 150 C 275 150, 260 130, 285 130" fill="none" stroke={S.blue} strokeWidth="1" />
                
                {/* Mixed Out */}
                <path d="M 370 120 C 400 120, 390 160, 422 160" fill="none" stroke={S.blue} strokeWidth="1.5" markerEnd="url(#arrBlue)" />
                <path d="M 240 230 C 370 230, 370 170, 422 170" fill="none" stroke={S.blue} strokeWidth="1.5" markerEnd="url(#arrBlue)" />
                
                <g transform="translate(425, 140)">
                  <rect width="60" height="40" rx="4" fill="rgba(96, 165, 250, 0.12)" stroke={S.blue} strokeWidth="1" />
                  <text x="30" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={S.blue} fontFamily="var(--sans)">Contextual</text>
                  <text x="30" y="34" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={S.ink} fontFamily="var(--mono)">Mix</text>
                </g>

                <defs>
                  <marker id="arrBlue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke={S.blue} strokeWidth="1.8" strokeLinecap="round"/>
                  </marker>
                </defs>
              </svg>
            )}

            {/* SVG 5: Attention Output Projection & Residual Stream */}
            {activeStep === 4 && (
              <svg viewBox="0 0 500 320" className="w-full h-auto">
                <defs>
                  <linearGradient id="resGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={S.blue} />
                    <stop offset="100%" stopColor={S.violet} />
                  </linearGradient>
                </defs>
                <text x="250" y="25" textAnchor="middle" fontSize="11" fontWeight="600" fill={S.ink3} fontFamily="var(--mono)" letterSpacing="0.08em">RESIDUAL HIGHWAY & PROJECTION</text>
                
                {/* Thick Residual stream line */}
                <line x1="30" y1="230" x2="470" y2="230" stroke="url(#resGrad)" strokeWidth="6" strokeLinecap="round" className="pulse-stream" />
                <text x="75" y="248" fontSize="10.5" fontWeight="700" fill={S.blue} fontFamily="var(--mono)">Residual Stream (x_input)</text>

                {/* Sublayer attention box */}
                <g transform="translate(60, 50)">
                  <rect width="130" height="90" rx="8" fill="rgba(255, 255, 255, 0.02)" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="65" y="20" textAnchor="middle" fontSize="9" fill={S.ink3} fontFamily="var(--mono)">Attention Sublayer</text>
                  
                  <rect x="15" y="32" width="100" height="42" rx="6" fill="rgba(96, 165, 250, 0.08)" stroke={S.blue} strokeWidth="1" />
                  <text x="65" y="50" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={S.blue} fontFamily="var(--sans)">32 Heads</text>
                  <text x="65" y="64" textAnchor="middle" fontSize="9.5" fill={S.ink2} fontFamily="var(--mono)">Concat [H_1...H_32]</text>
                </g>

                {/* Tap from residual stream to Attention */}
                <path d="M 50 230 C 50 100, 52 95, 60 95" fill="none" stroke={S.blue} strokeWidth="1.8" markerEnd="url(#arrViolet5)" />

                {/* Projection Matrix */}
                <path d="M 190 95 L 222 95" fill="none" stroke={S.ink3} strokeWidth="1.5" markerEnd="url(#arrViolet5)" />
                
                <g transform="translate(230, 70)">
                  <rect width="90" height="50" rx="6" fill={S.bg} stroke={S.violet} strokeWidth="1.5" />
                  <text x="45" y="22" textAnchor="middle" fontSize="10" fontWeight="600" fill={S.violet} fontFamily="var(--sans)">Out Projection</text>
                  <text x="45" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill={S.violet} fontFamily="var(--mono)">Matrix W_o</text>
                </g>

                {/* Addition node */}
                <path d="M 320 95 C 370 95, 360 210, 360 212" fill="none" stroke={S.violet} strokeWidth="2.2" markerEnd="url(#arrViolet5)" />
                
                <g transform="translate(345, 215)">
                  <circle cx="15" cy="15" r="14" fill={S.bg} stroke={S.violet} strokeWidth="2" />
                  <text x="15" y="21" textAnchor="middle" fontSize="18" fontWeight="bold" fill={S.violet}>+</text>
                  <text x="15" y="-6" textAnchor="middle" fontSize="9" fill={S.ink3} fontFamily="var(--sans)">add</text>
                </g>

                <defs>
                  <marker id="arrViolet5" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke={S.violet} strokeWidth="1.8" strokeLinecap="round"/>
                  </marker>
                </defs>
              </svg>
            )}

            {/* SVG 6: Gated MLP (SwiGLU) */}
            {activeStep === 5 && (
              <svg viewBox="0 0 500 320" className="w-full h-auto">
                <text x="250" y="25" textAnchor="middle" fontSize="11" fontWeight="600" fill={S.ink3} fontFamily="var(--mono)" letterSpacing="0.08em">SWIGLU GATED DUAL-HIGHWAY</text>
                
                {/* Input vector */}
                <rect x="20" y="135" width="50" height="30" rx="4" fill="rgba(251, 191, 36, 0.05)" stroke="var(--border)" strokeWidth="1" />
                <text x="45" y="153" textAnchor="middle" fontSize="10.5" fontWeight="600" fill={S.amber} fontFamily="var(--mono)">x_norm</text>

                {/* Path 1: Gate matrix W_gate */}
                <path d="M 70 145 C 90 110, 110 80, 140 80" fill="none" stroke={S.amber} strokeWidth="1.2" markerEnd="url(#arrAmber)" />
                <g transform="translate(145, 55)">
                  <rect width="80" height="46" rx="6" fill={S.bg} stroke={S.amber} strokeWidth="1.2" />
                  <text x="40" y="18" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={S.amber} fontFamily="var(--sans)">Gate Matrix</text>
                  <text x="40" y="34" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={S.amber} fontFamily="var(--mono)">W_gate</text>
                </g>
                
                {/* SiLU Activation node */}
                <path d="M 225 80 L 252 80" fill="none" stroke={S.amber} strokeWidth="1.2" markerEnd="url(#arrAmber)" />
                <g transform="translate(258, 60)">
                  <rect width="50" height="36" rx="6" fill="rgba(251, 113, 133, 0.08)" stroke={S.rose} strokeWidth="1.2" />
                  <text x="25" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill={S.rose} fontFamily="var(--mono)">SiLU</text>
                </g>

                {/* Path 2: Up matrix W_up */}
                <path d="M 70 155 C 90 190, 110 220, 140 220" fill="none" stroke={S.amber} strokeWidth="1.2" markerEnd="url(#arrAmber)" />
                <g transform="translate(145, 195)">
                  <rect width="80" height="46" rx="6" fill={S.bg} stroke={S.amber} strokeWidth="1.2" />
                  <text x="40" y="18" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={S.amber} fontFamily="var(--sans)">Up Matrix</text>
                  <text x="40" y="34" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={S.amber} fontFamily="var(--mono)">W_up</text>
                </g>

                {/* Element-wise multiplication node (gating multiplication) */}
                <path d="M 308 80 C 340 80, 340 120, 340 132" fill="none" stroke={S.rose} strokeWidth="1.5" />
                <path d="M 225 220 C 340 220, 340 180, 340 168" fill="none" stroke={S.amber} strokeWidth="1.5" />
                
                <g transform="translate(325, 135)">
                  <circle cx="15" cy="15" r="14" fill={S.bg} stroke={S.amber} strokeWidth="1.8" />
                  <text x="15" y="21" textAnchor="middle" fontSize="14" fontWeight="bold" fill={S.amber}>⊗</text>
                  <text x="38" y="19" fontSize="8" fill={S.ink3} fontFamily="var(--sans)">multiply</text>
                </g>

                {/* Down matrix W_down */}
                <path d="M 355 150 L 378 150" fill="none" stroke={S.amber} strokeWidth="1.2" markerEnd="url(#arrAmber)" />
                
                <g transform="translate(385, 127)">
                  <rect width="90" height="46" rx="6" fill={S.bg} stroke={S.amber} strokeWidth="1.5" />
                  <text x="45" y="18" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={S.amber} fontFamily="var(--sans)">Down Matrix</text>
                  <text x="45" y="34" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={S.amber} fontFamily="var(--mono)">W_down</text>
                </g>

                <defs>
                  <marker id="arrAmber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke={S.amber} strokeWidth="1.8" strokeLinecap="round"/>
                  </marker>
                </defs>
              </svg>
            )}

            {/* SVG 7: LM Head & Unembeddings */}
            {activeStep === 6 && (
              <svg viewBox="0 0 500 320" className="w-full h-auto">
                <text x="250" y="20" textAnchor="middle" fontSize="11" fontWeight="600" fill={S.ink3} fontFamily="var(--mono)" letterSpacing="0.08em">VOCAB UNEMBEDDING HEAD</text>
                
                {/* Input vector */}
                <g transform="translate(20, 135)">
                  <rect width="65" height="30" rx="4" fill="rgba(52, 211, 153, 0.05)" stroke="var(--border)" strokeWidth="1" />
                  <text x="32.5" y="18.5" textAnchor="middle" fontSize="10" fontWeight="600" fill={S.teal} fontFamily="var(--mono)">x_final</text>
                  <text x="32.5" y="27" textAnchor="middle" fontSize="7" fill={S.ink3} fontFamily="var(--mono)">d_model=4096</text>
                </g>
                <path d="M 85 150 L 132 150" fill="none" stroke={S.teal} strokeWidth="1.5" markerEnd="url(#arrTeal7)" />

                {/* Unembedding matrix */}
                <g transform="translate(140, 50)">
                  <rect width="120" height="200" rx="10" fill="rgba(255, 255, 255, 0.02)" stroke="var(--border)" strokeWidth="1.2" />
                  <text x="60" y="20" textAnchor="middle" fontSize="8.5" fill={S.ink3} fontFamily="var(--mono)">Matrix W_u [d_model x V]</text>
                  
                  {/* Grid columns representing vocab mapping */}
                  <line x1="25" y1="40" x2="25" y2="230" stroke="var(--border)" strokeWidth="0.6" opacity="0.3" />
                  
                  {/* Selected output dot product columns */}
                  <rect x="42" y="35" width="20" height="200" rx="4" fill="rgba(52, 211, 153, 0.15)" stroke={S.teal} strokeWidth="1.2" />
                  <text x="52" y="130" textAnchor="middle" fontSize="8" fontWeight="600" fill={S.teal} fontFamily="var(--mono)" transform="rotate(-90, 52, 130)">word scores</text>
                  
                  <line x1="80" y1="40" x2="80" y2="230" stroke="var(--border)" strokeWidth="0.6" opacity="0.3" />
                  <line x1="100" y1="40" x2="100" y2="230" stroke="var(--border)" strokeWidth="0.6" opacity="0.3" />
                </g>
                <path d="M 260 150 L 292 150" fill="none" stroke={S.teal} strokeWidth="1.5" markerEnd="url(#arrTeal7)" />

                {/* Candidate probabilities */}
                <g transform="translate(305, 50)">
                  <rect width="165" height="200" rx="8" fill={S.bg} stroke="var(--border)" strokeWidth="1" />
                  <text x="82.5" y="20" textAnchor="middle" fontSize="9" fontWeight="600" fill={S.ink3} fontFamily="var(--mono)">Probability Logits</text>
                  
                  {/* Candidate 1: flows */}
                  <g transform="translate(10, 40)">
                    <rect width="145" height="34" rx="4" fill="rgba(52, 211, 153, 0.12)" stroke={S.teal} strokeWidth="1" className="pulse-stream" />
                    <text x="10" y="21" fontSize="11" fontWeight="700" fill={S.teal} fontFamily="var(--sans)">"flows"</text>
                    <text x="135" y="21" textAnchor="end" fontSize="11" fontWeight="700" fill={S.teal} fontFamily="var(--mono)">86.2%</text>
                  </g>
                  
                  {/* Candidate 2: runs */}
                  <g transform="translate(10, 85)">
                    <rect width="145" height="34" rx="4" fill="rgba(255, 255, 255, 0.02)" stroke="var(--border)" strokeWidth="0.8" />
                    <text x="10" y="21" fontSize="10.5" fontWeight="600" fill={S.ink} fontFamily="var(--sans)">"runs"</text>
                    <text x="135" y="21" textAnchor="end" fontSize="10.5" fill={S.ink2} fontFamily="var(--mono)">7.8%</text>
                  </g>
                  
                  {/* Candidate 3: is */}
                  <g transform="translate(10, 130)">
                    <rect width="145" height="34" rx="4" fill="rgba(255, 255, 255, 0.02)" stroke="var(--border)" strokeWidth="0.8" />
                    <text x="10" y="21" fontSize="10.5" fontWeight="600" fill={S.ink} fontFamily="var(--sans)">"is"</text>
                    <text x="135" y="21" textAnchor="end" fontSize="10.5" fill={S.ink2} fontFamily="var(--mono)">2.4%</text>
                  </g>

                  {/* Sampling strategies details */}
                  <text x="82.5" y="185" textAnchor="middle" fontSize="8" fill={S.ink3} fontStyle="italic" fontFamily="var(--sans)">Scaled by Temp = 0.7 & Top-P = 0.9</text>
                </g>
                
                <defs>
                  <marker id="arrTeal7" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke={S.teal} strokeWidth="1.8" strokeLinecap="round"/>
                  </marker>
                </defs>
              </svg>
            )}
          </div>

          {/* Right Panel: Equations, Explanation & Tracer Walk */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Step header */}
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: step.color, fontFamily: 'var(--mono)', marginBottom: 2 }}>
                Step {step.num} of 7 · {step.subtitle}
              </div>
              <h3 className="tracking-tight" style={{ fontSize: 22, fontWeight: 700, color: S.ink, lineHeight: 1.1 }}>
                {step.title}
              </h3>
            </div>

            {/* General description */}
            <div style={{ fontSize: 14, color: S.ink2, lineHeight: 1.5 }}>
              {step.description}
            </div>

            {/* Rigorous Math Formulation Box */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderLeft: `3px solid ${step.color}`, 
              borderRadius: '0 8px 8px 0', 
              padding: '12px 16px',
            }} className="p2-glass">
              <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: step.color, fontFamily: 'var(--mono)', marginBottom: 6 }}>
                Mathematical Formulation
              </div>
              <div style={{ 
                fontFamily: 'var(--mono)', 
                fontSize: 14.5, 
                fontWeight: 700, 
                color: S.ink, 
                background: 'var(--bg-sunken)', 
                padding: '8px 12px', 
                borderRadius: 6,
                marginBottom: 8,
                textAlign: 'center',
                border: '1px solid var(--border)'
              }}>
                {step.math}
              </div>
              <div style={{ fontSize: 12, color: S.ink3, lineHeight: 1.5 }}>
                {step.mathDetail}
              </div>
            </div>

            {/* Concrete Token Trace Walk */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.01)', 
              borderRadius: 8, 
              border: '1px solid var(--border)', 
              padding: 14 
            }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: S.ink2, fontFamily: 'var(--mono)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: S.blue }} />
                Tracing Token: "water"
              </div>
              <div style={{ fontSize: 13, color: S.ink2, lineHeight: 1.5, fontStyle: 'italic' }}>
                {step.trace}
              </div>
            </div>
            
          </div>
        </div>

        {/* Dynamic Navigation Row at the bottom */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: 24, 
          paddingTop: 16, 
          borderTop: '1px solid var(--border)' 
        }}>
          <button 
            onClick={handlePrev} 
            disabled={activeStep === 0} 
            className="p2-btn-pill"
            style={{ opacity: activeStep === 0 ? 0.4 : 1, cursor: activeStep === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← Previous
          </button>
          
          <div style={{ fontSize: 12, color: S.ink3, fontFamily: 'var(--mono)', fontWeight: 600 }}>
            {activeStep + 1} / 7 Layers
          </div>
          
          <button 
            onClick={handleNext} 
            disabled={activeStep === STEPS.length - 1} 
            className="p2-btn-pill"
            style={{ opacity: activeStep === STEPS.length - 1 ? 0.4 : 1, cursor: activeStep === STEPS.length - 1 ? 'not-allowed' : 'pointer' }}
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SectionTransformerLayers() {
  return (
    <Section 
      id="transformer-layers" 
      eyebrow="1.2 · The 7 Layers of a Transformer Block" 
      title="The 7 layers of a transformer block" 
      kicker={"Let's peer inside the heart of the block. We will trace the token \"water\" from the prompt \"The river water...\" step-by-step through all 7 layers of matrix transformations, normalizations, and routing layers until we output a prediction for the next word: \"flows\"."} 
      borderColor={S.violet} 
      eyebrowColor={S.violet}
    >
      <Para>
        A bird's-eye stacked view is helpful, but true mastery comes from tracking a vector as it undergoes projections, rotations, and activations. An LLM performs zero magical thinking. It operates strictly via linear algebra, rotating pairs of elements to remember order, flattening standard deviations to maintain numerical stability, and utilizing gated routing switches to extract factual context.
      </Para>
      
      <TransformerLayersVisual />
      
      <Callout borderColor={S.rose} labelColor={S.rose} label="The Highway Paradigm">
        Notice that the vector <strong>never leaves the residual stream</strong>. Every sublayer (Attention and MLP) acts as a side branch: it takes the current state of the residual stream, calculates a delta vector containing new contextual or factual additions, and adds that delta back to the highway. By keeping the main highway untouched by non-linear activations, gradients can flow back through the stack during backpropagation without dampening.
      </Callout>
    </Section>
  );
}
