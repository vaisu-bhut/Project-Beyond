"use client";
import React from 'react';

/**
 * §1.4 — Positional Encodings
 * Four schemes: Sinusoidal, RoPE, ALiBi, NoPE
 */

const S = {
  ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)',
  bg: 'var(--bg-elev)', bgSunk: 'var(--bg-sunken)', rule: 'var(--rule)',
  teal: 'var(--accent-p4)', violet: 'var(--accent-p1)', rose: 'var(--accent-p6)',
  blue: 'var(--accent-p2)', amber: 'var(--accent-p5)',
};

function Section({ id, eyebrow, title, kicker, children }: any) {
  return (
    <section id={id} className="scroll-mt-24 py-12" style={{ borderTop: `2px solid ${S.blue}` }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600, color: S.blue, marginBottom: 8, fontFamily: 'var(--mono)' }}>{eyebrow}</div>
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
    <div className="p2-glass p2-callout" style={{ borderLeft: `3px solid ${borderColor || S.blue}`, padding: '16px 20px', margin: '24px 0', borderRadius: '0 12px 12px 0' }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: labelColor || S.blue, marginBottom: 6, fontFamily: 'var(--mono)' }}>{label}</div>
      <div style={{ fontSize: 14.5, color: S.ink2, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

// ── Sinusoidal Heatmap ──
function SinusoidalHeatmap() {
  const positions = 24, dims = 16;
  return (
    <svg viewBox="0 0 360 200" className="w-full h-auto">
      <text x="180" y="14" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--foreground-muted)" fontWeight="600">
        SINUSOIDAL PE: ALTERNATING SIN/COS
      </text>
      {[...Array(positions)].map((_, p) =>
        [...Array(dims)].map((_, d) => {
          const freq = 1 / Math.pow(10000, (2 * Math.floor(d / 2)) / dims);
          const val = d % 2 === 0 ? Math.sin(p * freq) : Math.cos(p * freq);
          return (
            <rect key={`${p}-${d}`} x={20 + p * 13} y={28 + d * 9} width="13" height="9" rx="1"
              fill={val > 0 ? S.amber : S.blue} opacity={Math.abs(val) * 0.6 + 0.1} />
          );
        })
      )}
      <text x="20" y="190" fontFamily="var(--mono)" fontSize="9" fill="var(--foreground-muted)">position →</text>
      <text x="10" y="115" fontFamily="var(--mono)" fontSize="9" fill="var(--foreground-muted)" transform="rotate(-90, 10, 115)">dimension →</text>
    </svg>
  );
}

// ── RoPE Rotation ──
function RoPERotation() {
  const colors = [S.teal, S.violet, S.amber, S.rose, S.blue];
  return (
    <svg viewBox="0 0 360 200" className="w-full h-auto">
      <text x="180" y="14" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--foreground-muted)" fontWeight="600">
        ROPE: ROTATE Q,K PAIRS IN 2D
      </text>
      <line x1="180" y1="40" x2="180" y2="180" stroke="var(--border)" strokeWidth="0.5" />
      <line x1="80" y1="110" x2="280" y2="110" stroke="var(--border)" strokeWidth="0.5" />
      {[0, 1, 2, 3, 4].map(i => {
        const angle = i * 0.4;
        const x = 180 + 60 * Math.cos(angle);
        const y = 110 - 60 * Math.sin(angle);
        return (
          <g key={i}>
            <line x1="180" y1="110" x2={x} y2={y} stroke={colors[i]} strokeWidth="2" />
            <circle cx={x} cy={y} r="3" fill={colors[i]} />
            <text x={x + 8} y={y} fontFamily="var(--mono)" fontSize="9" fill={colors[i]} fontWeight="600">pos {i}</text>
          </g>
        );
      })}
      <text x="20" y="192" fontFamily="var(--sans)" fontStyle="italic" fontSize="11" fill="var(--foreground-muted)">
        Llama, Mistral, Qwen, DeepSeek — current standard.
      </text>
    </svg>
  );
}

// ── ALiBi Bias ──
function ALiBiBias() {
  return (
    <svg viewBox="0 0 360 200" className="w-full h-auto">
      <text x="180" y="14" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--foreground-muted)" fontWeight="600">
        ALIBI: LINEAR PENALTY BY DISTANCE
      </text>
      {[...Array(8)].map((_, r) =>
        [...Array(8)].map((_, c) => {
          const distance = r - c;
          const bias = distance >= 0 ? -distance * 0.3 : null;
          if (bias === null) return null;
          return (
            <g key={`${r}-${c}`}>
              <rect x={50 + c * 32} y={30 + r * 18} width="30" height="16" rx="2"
                fill={S.rose} opacity={Math.abs(bias) * 0.5 + 0.05} />
              <text x={50 + c * 32 + 15} y={30 + r * 18 + 11}
                textAnchor="middle" fontFamily="var(--mono)" fontSize="8" fill="var(--foreground)">
                {bias.toFixed(1)}
              </text>
            </g>
          );
        })
      )}
      <text x="20" y="192" fontFamily="var(--sans)" fontStyle="italic" fontSize="11" fill="var(--foreground-muted)">
        Trains short, extrapolates long. No learned params.
      </text>
    </svg>
  );
}

// ── NoPE Diagram ──
function NoPEDiagram() {
  return (
    <svg viewBox="0 0 360 200" className="w-full h-auto">
      <text x="180" y="14" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--foreground-muted)" fontWeight="600">
        NOPE: NO POSITIONAL SIGNAL
      </text>
      <rect x="40" y="40" width="280" height="100" rx="8" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x="180" y="80" textAnchor="middle" fontFamily="var(--sans)" fontStyle="italic" fontSize="28" fill="var(--foreground)" opacity="0.5">∅</text>
      <text x="180" y="110" textAnchor="middle" fontFamily="var(--sans)" fontStyle="italic" fontSize="12" fill="var(--foreground-muted)">
        Causal mask alone gives the model an asymmetry
      </text>
      <text x="180" y="128" textAnchor="middle" fontFamily="var(--sans)" fontStyle="italic" fontSize="12" fill="var(--foreground-muted)">
        it can use to recover positions.
      </text>
      <text x="20" y="185" fontFamily="var(--sans)" fontStyle="italic" fontSize="11" fill="var(--foreground-muted)">
        Works decently for decoders. Active research area.
      </text>
    </svg>
  );
}

// ── Main Export ──
export default function SectionPositionalEncodings() {
  return (
    <Section
      id="positional-encodings"
      eyebrow="1.4 · Positional Encodings"
      title="Four ways to encode order"
      kicker="Attention is permutation-equivariant — swap two tokens and you get a swap of two outputs. Position information must be injected. Four major schemes."
    >
      <Para>
        Attention as defined is permutation-equivariant — swap two tokens and you get a swap of
        two outputs. That can't be right for language. Position information must be injected.
        Four major schemes have emerged:
      </Para>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '24px 0' }}>
        {[
          { name: "Sinusoidal", year: "2017", desc: "Original. Fixed sin/cos of position. Absolute. The stripe pattern shows how each dimension encodes a unique frequency.", Comp: SinusoidalHeatmap },
          { name: "RoPE", year: "2021", desc: "Rotary Position Embedding. Rotate Q,K pairs in 2D subspaces by an angle proportional to position. Relative position falls out of the dot product. Today's default.", Comp: RoPERotation },
          { name: "ALiBi", year: "2021", desc: "Attention with Linear Biases. No embeddings at all — just subtract a head-specific slope × distance from the score. Extrapolates well to longer sequences.", Comp: ALiBiBias },
          { name: "NoPE", year: "2023", desc: "No positional encoding. Surprisingly works for decoders: the causal mask itself provides asymmetry the model can exploit. Active research.", Comp: NoPEDiagram },
        ].map((p, i) => (
          <div key={i} className="p2-glass p2-card" style={{ borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: 'var(--sans)', fontStyle: 'italic', fontSize: '1.6rem', fontWeight: 600, color: 'var(--foreground)' }}>{p.name}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--foreground-muted)' }}>{p.year}</div>
            </div>
            <p.Comp />
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.92rem', lineHeight: 1.5, marginTop: 6, color: S.ink2 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <Callout borderColor={S.amber} labelColor={S.amber} label="The 2026 picture">
        <strong>RoPE</strong> is the default in Llama, Mistral, Qwen, DeepSeek. Its scaled
        variants (<strong>NTK-aware</strong>, <strong>YaRN</strong>) are what unlocks long
        context windows during fine-tuning. <strong>ALiBi</strong> lives on in some efficiency-focused
        models. <strong>NoPE</strong> is a curiosity worth knowing about because
        long-context researchers keep returning to it.
      </Callout>
    </Section>
  );
}
