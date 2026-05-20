"use client";
import React, { useState } from 'react';

/**
 * §1.2 — The Attention Pipeline
 * Interactive 4-step pipeline stepper + causal masking
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
      {caption && <div style={{ fontSize: 12, color: S.ink3, fontStyle: 'italic', marginTop: 10, textAlignment: 'center', maxWidth: 720, margin: '10px auto 0', lineHeight: 1.6, padding: '0 16px' }}>{caption}</div>}
    </div>
  );
}

function Mono({ children, color }: any) {
  return <span style={{ fontFamily: 'var(--mono)', color: color || S.ink, fontSize: '0.92em' }}>{children}</span>;
}

// ── Attention Pipeline (Interactive Stepper) ──
function AttentionPipeline() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "QKᵀ", caption: "Score every query against every key — raw similarity matrix." },
    { label: "÷ √d_k", caption: "Scale to keep softmax temperature stable (otherwise gradients vanish)." },
    { label: "softmax", caption: "Per-row normalisation. Each row is now a probability distribution over keys." },
    { label: "× V", caption: "Weighted sum of values. The output for each token is a blend of value vectors." },
  ];

  const matrixColors = [S.teal, S.violet, S.ink2, S.ink2, S.amber, S.rose];

  return (
    <VisualCard caption="Click through the four moves of the attention computation. The intermediate shapes matter — every interview will ask.">
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`p2-btn-pill ${step === i ? 'p2-btn-pill-active' : ''}`}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 720 280" className="w-full h-auto">
        {[
          { x: 30, label: "Q", color: S.teal, cells: 4 },
          { x: 150, label: "Kᵀ", color: S.violet, cells: 4, wide: true },
          { x: 290, label: step >= 0 ? "QKᵀ" : "·", color: step >= 0 ? "var(--foreground)" : "var(--foreground-muted)" },
          { x: 410, label: step >= 1 ? "scaled" : "·", color: step >= 1 ? "var(--foreground)" : "var(--foreground-muted)" },
          { x: 530, label: step >= 2 ? "softmax" : "·", color: step >= 2 ? S.amber : "var(--foreground-muted)" },
          { x: 650, label: step >= 3 ? "out" : "·", color: step >= 3 ? S.rose : "var(--foreground-muted)" },
        ].map((m, i) => {
          const active = (i === 0) || (i === 1) || (i - 2 <= step);
          return (
            <g key={i} opacity={active ? 1 : 0.2}>
              <rect x={m.x} y="80" width={m.wide ? 100 : 80} height="100" rx="6"
                fill={`${matrixColors[i]}08`} stroke={m.color} strokeWidth="1.5" />
              {[0, 1, 2, 3].map(r =>
                [0, 1, 2, 3].map(c => {
                  const intensity = Math.abs(Math.sin(i * 1.3 + r * 0.8 + c * 0.5));
                  return (
                    <rect key={`${r}-${c}`}
                      x={m.x + 4 + c * (m.wide ? 22 : 18)} y={84 + r * 22}
                      width={m.wide ? 20 : 16} height="18" rx="2"
                      fill={m.color} opacity={i >= 2 + step ? 0 : intensity * 0.5 + 0.08} />
                  );
                })
              )}
              <text x={m.x + (m.wide ? 50 : 40)} y="72" textAnchor="middle"
                fontFamily="var(--sans)" fontStyle="italic" fontSize="16" fontWeight="600" fill={m.color}>
                {m.label}
              </text>
            </g>
          );
        })}

        {[110, 250, 370, 490, 610].map((x, i) => (
          <text key={i} x={x} y="135" textAnchor="middle"
            fontFamily="var(--sans)" fontSize="20" fill="var(--foreground)" opacity={i <= step + 1 ? 0.5 : 0.12}>
            {i === 0 ? "×" : i === 4 ? "×" : i === 2 ? "÷" : "→"}
          </text>
        ))}

        <g opacity={step >= 3 ? 1 : 0.12}>
          <rect x="620" y="200" width="60" height="40" rx="6" fill={S.roseSoft} stroke={S.rose} strokeWidth="1.5" />
          <text x="650" y="225" textAnchor="middle" fontFamily="var(--sans)" fontStyle="italic" fontSize="16" fontWeight="600" fill={S.rose}>V</text>
        </g>

        <text x="360" y="265" textAnchor="middle" fontFamily="var(--sans)" fontSize="14" fontStyle="italic" fill="var(--foreground-muted)">
          {steps[step].caption}
        </text>
      </svg>
    </VisualCard>
  );
}

// ── Causal Mask ──
function CausalMask() {
  const tokens = ["The", "cat", "sat", "on", "the", "mat"];
  return (
    <VisualCard caption="Decoder-only: a token can only attend to itself and earlier tokens. Every entry above the diagonal is set to −∞ before softmax, zeroing it out.">
      <svg viewBox="0 0 460 320" className="w-full h-auto">
        <text x="230" y="20" textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--foreground-muted)" fontWeight="600" letterSpacing="0.08em">
          CAUSAL ATTENTION MASK
        </text>

        {tokens.map((t, c) => (
          <text key={`c-${c}`} x={110 + c * 50 + 25} y="60"
            textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--foreground)">{t}</text>
        ))}
        {tokens.map((t, r) => (
          <text key={`r-${r}`} x="100" y={90 + r * 36 + 22}
            textAnchor="end" fontFamily="var(--mono)" fontSize="11" fill="var(--foreground)">{t}</text>
        ))}

        {tokens.map((_, r) =>
          tokens.map((__, c) => {
            const allowed = c <= r;
            return (
              <g key={`${r}-${c}`}>
                <rect x={110 + c * 50} y={80 + r * 36} width="44" height="30" rx="3"
                  fill={allowed ? S.blueSoft : 'rgba(255, 255, 255, 0.03)'}
                  stroke="var(--border)" strokeWidth="0.5" />
                {!allowed && (
                  <text x={110 + c * 50 + 22} y={80 + r * 36 + 20}
                    textAnchor="middle" fontFamily="var(--mono)" fontSize="14" fill={S.rose}>✕</text>
                )}
              </g>
            );
          })
        )}

        <g transform="translate(110, 300)">
          <rect width="14" height="14" rx="2" fill={S.blueSoft} stroke="var(--border)" strokeWidth="0.5" />
          <text x="20" y="11" fontFamily="var(--mono)" fontSize="10" fill="var(--foreground-muted)">can attend</text>
          <rect x="140" width="14" height="14" rx="2" fill="rgba(255, 255, 255, 0.03)" stroke="var(--border)" strokeWidth="0.5" />
          <text x="160" y="11" fontFamily="var(--mono)" fontSize="10" fill="var(--foreground-muted)">masked (−∞ before softmax)</text>
        </g>
      </svg>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionAttentionPipeline() {
  return (
    <Section
      id="attention-pipeline"
      eyebrow="1.2 · The Attention Pipeline"
      title="From similarity to weighted blend"
      kicker="The attention equation is four moves in sequence. Each intermediate shape matters — this is the whiteboard question."
    >
      <Para>Click through the four moves. The intermediate shapes matter — every interview will ask.</Para>
      <AttentionPipeline />

      <Callout borderColor={S.amber} labelColor={S.amber} label="Why divide by √d_k?">
        Without the scale, the variance of <Mono>QKᵀ</Mono> grows with <Mono>d_k</Mono>. Large
        values push softmax into one-hot regions where gradients vanish. Dividing by{' '}
        <Mono>√d_k</Mono> keeps the pre-softmax distribution well-conditioned. This is a
        micro-fix that shows up in every interview whiteboard.
      </Callout>

      <Callout borderColor={S.rose} labelColor={S.rose} label="Cost: O(n²·d)">
        The <Mono>QKᵀ</Mono> matrix is <Mono>[n × n]</Mono>. Doubling context length quadruples
        attention compute and memory. This single fact drives <em>most</em> of the modern stack:
        FlashAttention (Phase 3), RingAttention, sparse attention, SSMs/Mamba (Phase 5), and
        long-context techniques like YaRN. Recognise this number; it shapes every architecture
        decision after 2022.
      </Callout>

      <Sub title="Causal masking">
        <Para>
          The most consequential one-line change in deep learning history: in a decoder, before
          softmax, set every entry of the score matrix above the diagonal to <Mono>−∞</Mono>.
          Tokens can only see the past.
        </Para>
        <CausalMask />
        <Callout borderColor={S.blue} labelColor={S.blue} label="The architectural payoff">
          Causal masking is what makes the same network usable for training (parallel over the
          full sequence) and generation (one token at a time, with a <strong style={{ color: S.blue }}>KV cache</strong>{' '}
          built up over steps). It's also what enables the model's training signal to be next-token
          prediction — every position in the sequence becomes a supervised example simultaneously.
        </Callout>
      </Sub>
    </Section>
  );
}
