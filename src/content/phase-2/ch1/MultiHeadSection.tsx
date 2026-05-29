"use client";
import React from 'react';

/**
 * §1.3 — Multi-Head Attention & the KV Cache
 * Multi-head SVG + MHA/MQA/GQA comparison cards
 */

const S = {
  ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)',
  bg: 'var(--bg-elev)', bgSunk: 'var(--bg-sunken)', rule: 'var(--rule)',
  teal: 'var(--accent-p4)', violet: 'var(--accent-p1)', rose: 'var(--accent-p6)',
  blue: 'var(--accent-p2)', amber: 'var(--accent-p5)',
  tealSoft: 'rgba(52, 211, 153, 0.12)', violetSoft: 'rgba(167, 139, 250, 0.12)',
  roseSoft: 'rgba(251, 113, 133, 0.12)', blueSoft: 'rgba(96, 165, 250, 0.12)',
  amberSoft: 'rgba(251, 191, 36, 0.12)',
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

// ── Multi-Head Attention ──
function MultiHead() {
  const headColors = [S.teal, S.violet, S.rose, S.amber, '#5b8e7d', '#a366c4', '#c4923a', '#5a8fd6'];
  return (
    <VisualCard caption="Each head learns a different relation: syntax, coreference, topical, positional. Mechanistic interpretability (Phase 6) reads them directly.">
      <svg viewBox="0 0 720 340" className="w-full h-auto">
        <defs>
          <marker id="arr-mh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M2 1L8 5L2 9" fill="none" stroke="var(--foreground-muted)" strokeWidth="1.5" strokeLinecap="round" />
          </marker>
        </defs>

        <rect x="40" y="140" width="80" height="50" rx="8" fill="rgba(96, 165, 250, 0.04)" stroke="var(--border)" strokeWidth="1.5" />
        <text x="80" y="170" textAnchor="middle" fontFamily="var(--sans)" fontStyle="italic" fontSize="18" fontWeight="600" fill="var(--foreground)">X</text>
        <text x="80" y="210" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--foreground-muted)">n × d_model</text>

        <path d="M 120 165 L 180 165" stroke="var(--foreground-muted)" strokeWidth="1" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(h => {
          const y = 40 + h * 32;
          return (
            <g key={h}>
              <path d={`M 180 165 Q 220 ${y + 12}, 260 ${y + 12}`} stroke={headColors[h]} strokeWidth="1" fill="none" opacity="0.6" />
              <rect x="260" y={y} width="100" height="24" rx="6" fill={`${headColors[h]}18`} stroke={headColors[h]} strokeWidth="1" />
              <text x="310" y={y + 16} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill={headColors[h]}>head {h + 1}</text>
              <path d={`M 360 ${y + 12} Q 410 ${y + 12}, 440 165`} stroke={headColors[h]} strokeWidth="1" fill="none" opacity="0.6" />
            </g>
          );
        })}

        <rect x="440" y="140" width="90" height="50" rx="8" fill={S.amberSoft} stroke={S.amber} strokeWidth="1.5" />
        <text x="485" y="160" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fontWeight="600" fill={S.amber}>concat</text>
        <text x="485" y="178" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill={S.amber}>h × d_head</text>

        <path d="M 530 165 L 580 165" stroke="var(--foreground-muted)" strokeWidth="1" markerEnd="url(#arr-mh)" />

        <rect x="580" y="140" width="90" height="50" rx="8" fill="rgba(255,255,255,0.02)" stroke="var(--border)" strokeWidth="1.5" />
        <text x="625" y="168" textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fontWeight="600" fill="var(--foreground)">W_O</text>
        <text x="625" y="210" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--foreground-muted)">output proj.</text>

        <text x="360" y="20" textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--foreground-muted)" fontWeight="600" letterSpacing="0.06em">
          h PARALLEL HEADS — DIFFERENT QUESTIONS ASKED SIMULTANEOUSLY
        </text>
      </svg>
    </VisualCard>
  );
}

// ── MHA vs MQA vs GQA ──
function MHA_MQA_GQA() {
  const variants = [
    { name: "MHA", full: "Multi-Head Attention", Q: 8, K: 8, V: 8,
      desc: "Original. h heads, each with its own K, V. Max quality, max KV-cache memory at inference.",
      note: "Vaswani et al., 2017" },
    { name: "MQA", full: "Multi-Query Attention", Q: 8, K: 1, V: 1,
      desc: "All Q heads share ONE K and ONE V. KV cache shrinks by h×. Some quality loss.",
      note: "PaLM, Falcon" },
    { name: "GQA", full: "Grouped-Query Attention", Q: 8, K: 2, V: 2,
      desc: "Compromise: groups of Q heads share K,V. Llama-2, Llama-3, Mistral. The 2026 default.",
      note: "Llama 2/3, Mistral" },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, margin: '24px 0' }}>
      {variants.map(v => (
        <div key={v.name} className="p2-glass p2-card" style={{ borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontFamily: 'var(--sans)', fontStyle: 'italic', fontSize: '1.6rem', fontWeight: 600, color: 'var(--foreground)' }}>{v.name}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--foreground-muted)' }}>{v.note}</div>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: S.blue, marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{v.full}</div>

          <svg viewBox="0 0 200 120" style={{ width: '100%', height: 110 }}>
            {[...Array(v.Q)].map((_, i) => (
              <rect key={`q${i}`} x={10 + i * 22} y="10" width="18" height="22" rx="3" fill={S.teal} opacity="0.6" />
            ))}
            <text x="10" y="50" fontFamily="var(--mono)" fontSize="10" fill={S.teal} fontWeight="600">Q ({v.Q})</text>

            {[...Array(v.K)].map((_, i) => {
              const width = (v.Q / v.K) * 22 - 4;
              return <rect key={`k${i}`} x={10 + i * (width + 4)} y="62" width={width} height="22" rx="3" fill={S.violet} opacity="0.6" />;
            })}
            <text x="10" y="102" fontFamily="var(--mono)" fontSize="10" fill={S.violet} fontWeight="600">K ({v.K})</text>

            {[...Array(v.V)].map((_, i) => {
              const width = (v.Q / v.V) * 22 - 4;
              return <rect key={`v${i}`} x={10 + i * (width + 4)} y="62" width={width} height="22" rx="3"
                fill="none" stroke={S.rose} strokeWidth="2" strokeDasharray="3,2" opacity="0.8" />;
            })}
          </svg>

          <div style={{ fontFamily: 'var(--sans)', fontSize: '0.92rem', lineHeight: 1.5, color: S.ink2, marginTop: 10 }}>{v.desc}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main Export ──
export default function SectionMultiHead() {
  return (
    <Section
      id="multi-head"
      eyebrow="1.3 · Multi-Head Attention & the KV Cache"
      title="Several questions at once"
      kicker="One attention pattern can only express one kind of relation. A real sentence has many. Solution: run h parallel heads, each asking a different question."
    >
      <Para>
        A single attention head can only express one kind of relation. A real sentence has many at
        once: subject↔verb, anaphora, topical, syntactic dependency. Solution: run{' '}
        <Mono>h</Mono> attention operations in parallel, each with its own <Mono>(W_Q, W_K, W_V)</Mono>{' '}
        projecting to a smaller <Mono>d_head = d_model / h</Mono>. Concatenate the outputs,
        mix them with a final projection <Mono>W_O</Mono>.
      </Para>
      <MultiHead />

      <Sub title="The KV-cache crisis & its three solutions">
        <Para>
          At inference, every previous token's K and V get cached. For a 70B model with 64 heads,
          long context, and many concurrent users, this cache eats the GPU. Three flavours of
          attention manage the cost. <strong>You will be asked which Llama-3 uses.</strong>
        </Para>
        <MHA_MQA_GQA />
        <Callout borderColor={S.blue} labelColor={S.blue} label="Forward-link to Phase 4">
          The KV cache is the central object in <strong>vLLM</strong>'s PagedAttention and in
          continuous batching. The whole field of efficient serving is, more or less,
          KV-cache management. You'll touch this in Phase 3 (inference profiling) and operationalise
          it in Phase 4.
        </Callout>
      </Sub>
    </Section>
  );
}
