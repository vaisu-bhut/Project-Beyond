"use client";
import React from 'react';

/**
 * §1.1 — The Transformer at a Glance
 * Attention equation hero + Q/K/V projections
 */

const S = {
  ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)',
  bg: 'var(--bg-elev)', bgSunk: 'var(--bg-sunken)', rule: 'var(--rule)',
  teal: 'var(--accent-p4)', violet: 'var(--accent-p1)', rose: 'var(--accent-p6)',
  blue: 'var(--accent-p2)', amber: 'var(--accent-p5)',
  tealSoft: 'rgba(52, 211, 153, 0.12)', violetSoft: 'rgba(167, 139, 250, 0.12)',
  roseSoft: 'rgba(251, 113, 133, 0.12)', blueSoft: 'rgba(96, 165, 250, 0.12)',
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

function Sub({ title, children }: any) {
  return (
    <div style={{ marginTop: 40, marginBottom: 8 }}>
      <h3 className="tracking-tight" style={{ fontSize: 22, fontWeight: 600, color: S.ink, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
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

function VisualCard({ children, caption }: any) {
  return (
    <div style={{ margin: '28px 0' }}>
      <div className="p2-glass p2-visual-card" style={{ borderRadius: 16, padding: '28px 24px' }}>{children}</div>
      {caption && <div style={{ fontSize: 12, color: S.ink3, fontStyle: 'italic', marginTop: 10, textAlign: 'center', maxWidth: 720, margin: '10px auto 0', lineHeight: 1.6, padding: '0 16px' }}>{caption}</div>}
    </div>
  );
}

function Mono({ children, color }: any) {
  return <span style={{ fontFamily: 'var(--mono)', color: color || S.ink, fontSize: '0.92em' }}>{children}</span>;
}

// ── Attention Equation Hero ──
function AttentionEquationHero() {
  return (
    <VisualCard caption="The whole equation. Multi-head attention, positional encodings, masking, and the entire decoder are wrappers around this single line of math.">
      <div className="p2-equation-hero" style={{
        background: '#0E0B08', borderRadius: 8,
        padding: '56px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        color: 'var(--foreground)'
      }}>
        <div className="p2-equation-glow" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(212, 155, 58, 0.13) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.72rem', letterSpacing: '0.24em',
          color: '#D49B3A', marginBottom: 24, position: 'relative',
          textTransform: 'uppercase', fontWeight: 600,
        }}>
          THE WHOLE EQUATION
        </div>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 'clamp(1.6rem, 4.5vw, 3rem)',
          fontStyle: 'italic', lineHeight: 1.2, position: 'relative',
          color: 'var(--foreground)', fontWeight: 500,
        }}>
          Attention<span style={{ color: 'var(--foreground-muted)' }}>(</span>
          <span style={{ color: '#3B8C8C' }}>Q</span>,&thinsp;
          <span style={{ color: '#7C5BA8' }}>K</span>,&thinsp;
          <span style={{ color: '#C26A47' }}>V</span>
          <span style={{ color: 'var(--foreground-muted)' }}>) = </span>
          softmax<span style={{ color: 'var(--foreground-muted)' }}>(</span>
          <span style={{ color: '#3B8C8C' }}>Q</span>
          <span style={{ color: '#7C5BA8' }}>Kᵀ</span>
          <span style={{ color: 'var(--foreground-muted)' }}> / </span>
          √d<sub>k</sub>
          <span style={{ color: 'var(--foreground-muted)' }}>)</span>
          &thinsp;<span style={{ color: '#C26A47' }}>V</span>
        </div>
        <div style={{
          marginTop: 28, display: 'flex', justifyContent: 'center', gap: 28,
          flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: '0.78rem',
          color: 'var(--foreground-muted)',
        }}>
          <span><span style={{ color: '#3B8C8C' }}>■</span> Query — what am I looking for?</span>
          <span><span style={{ color: '#7C5BA8' }}>■</span> Key — what do I offer?</span>
          <span><span style={{ color: '#C26A47' }}>■</span> Value — what do I actually carry?</span>
        </div>
      </div>
    </VisualCard>
  );
}

// ── Q/K/V Projections ──
function QKVProjections() {
  return (
    <VisualCard caption="Three learned linear projections applied to every token. The same input X is projected into three distinct roles — asking, advertising, and carrying content.">
      <svg viewBox="0 0 720 360" className="w-full h-auto">
        <defs>
          <marker id="arr-qkv" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground-muted)" strokeWidth="1.5" strokeLinecap="round" />
          </marker>
        </defs>

        <g>
          <rect x="40" y="120" width="100" height="120" rx="6" fill="rgba(96, 165, 250, 0.04)" stroke="var(--border)" strokeWidth="1.5" />
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x="44" y={124 + i * 22} width="92" height="18" rx="3" fill="rgba(96, 165, 250, 0.06)" />
          ))}
          <text x="90" y="110" textAnchor="middle" fontFamily="var(--mono)" fontSize="14" fontWeight="600" fill="var(--foreground)">X</text>
          <text x="90" y="262" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--foreground-muted)">[n × d_model]</text>
          <text x="90" y="280" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--foreground-muted)" fontStyle="italic">token embeddings</text>
        </g>

        {[
          { label: "W_Q", color: S.teal, colorRaw: 'rgba(52, 211, 153, 0.15)', y: 50, outLabel: "Q", desc: "Query" },
          { label: "W_K", color: S.violet, colorRaw: 'rgba(167, 139, 250, 0.15)', y: 160, outLabel: "K", desc: "Key" },
          { label: "W_V", color: S.rose, colorRaw: 'rgba(251, 113, 133, 0.15)', y: 270, outLabel: "V", desc: "Value" },
        ].map((p, i) => (
          <g key={i}>
            <path d={`M 140 ${180} Q 220 ${180}, 280 ${p.y + 25}`} fill="none" stroke="var(--foreground-muted)" strokeWidth="1" markerEnd="url(#arr-qkv)" opacity="0.6" />
            <rect x="290" y={p.y} width="80" height="50" rx="6" fill="rgba(255,255,255,0.02)" stroke={p.color} strokeWidth="1.5" />
            <text x="330" y={p.y + 30} textAnchor="middle" fontFamily="var(--mono)" fontSize="13" fontWeight="600" fill={p.color}>{p.label}</text>
            <text x="330" y={p.y + 68} textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--foreground-muted)">[d_model × d_k]</text>
            <path d={`M 370 ${p.y + 25} L 460 ${p.y + 25}`} fill="none" stroke="var(--foreground-muted)" strokeWidth="1" markerEnd="url(#arr-qkv)" opacity="0.6" />
            <rect x="470" y={p.y - 5} width="80" height="60" rx="6" fill={p.colorRaw} stroke={p.color} strokeWidth="1.5" />
            {[0, 1, 2].map(j => (
              <rect key={j} x="474" y={p.y - 1 + j * 19} width="72" height="15" rx="3" fill={p.colorRaw} />
            ))}
            <text x="510" y={p.y - 12} textAnchor="middle" fontFamily="var(--sans)" fontSize="18" fontStyle="italic" fontWeight="600" fill={p.color}>{p.outLabel}</text>
            <text x="510" y={p.y + 73} textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--foreground-muted)">[n × d_k]</text>
            <text x="620" y={p.y + 30} fontFamily="var(--sans)" fontSize="14" fontStyle="italic" fill={p.color}>{p.desc}</text>
          </g>
        ))}

        <text x="200" y="40" fontFamily="var(--mono)" fontSize="11" fill="var(--foreground-muted)">
          Three learned linear projections, applied to every token
        </text>
      </svg>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionTransformer() {
  return (
    <Section
      id="transformer"
      eyebrow="1.1 · Transformers — From First Reading"
      title="Transformers, from first reading"
      kicker="One equation, three matrices, a stack of identical blocks, and a single self-supervised objective. Everything the modern LLM stack rests on lives here."
    >
      <Callout borderColor={S.blue} labelColor={S.blue} label="Where we are">
        <strong style={{ color: S.blue }}>Phase 2</strong> is the LLM-application phase.
        This section is its <em>theory map</em>: become fluent reading transformer architectures
        before implementing one in Phase 3 (nanoGPT). The point right now is to recognise every
        symbol in any 2026 paper and to have <em>feel</em> for the geometry of attention.
        You will not write a transformer block in this section.
      </Callout>

      <Sub title="Attention is a soft lookup">
        <Para>
          A transformer is, in spirit, a stack of soft, differentiable dictionary lookups.
          Each token forms a <Mono color={S.teal}>query</Mono>, every other token offers a{' '}
          <Mono color={S.violet}>key</Mono> and a <Mono color={S.rose}>value</Mono>. The query is
          compared to every key, similarities are turned into weights, and the output is a
          weighted average of values. That comparison-then-blend operation is one line of math:
        </Para>
        <AttentionEquationHero />
        <Para>
          The roadmap calls it "the whole equation" for good reason. Multi-head attention,
          positional encodings, masking, and the entire decoder are wrappers around this. Let's
          unpack the matrices.
        </Para>
      </Sub>

      <Sub title="Q, K, V are learned views of the same X">
        <Para>
          Input <Mono>X</Mono> arrives as a stack of token embeddings — shape{' '}
          <Mono>[n × d_model]</Mono>, where <Mono>n</Mono> is sequence length and{' '}
          <Mono>d_model</Mono> is the hidden size (e.g. 4096 for Llama-3-8B). Three learned weight
          matrices project <Mono>X</Mono> into three roles:
        </Para>
        <QKVProjections />
        <Callout borderColor={S.teal} labelColor={S.teal} label="Why three projections of the same thing?">
          Because the same token plays three roles per attention step:{' '}
          <strong style={{ color: S.teal }}>asking</strong> (Q),{' '}
          <strong style={{ color: S.violet }}>advertising</strong> (K), and{' '}
          <strong style={{ color: S.rose }}>providing content</strong> (V). Learned projections let
          the model decouple them — a token can "ask about" something it doesn't itself "carry."
          Mechanistic interpretability research in Phase 6 reads these projections directly:
          induction heads, name-mover heads, etc.
        </Callout>
      </Sub>
    </Section>
  );
}
