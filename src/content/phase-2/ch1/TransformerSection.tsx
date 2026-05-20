"use client";
import React from 'react';

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

function TransformerStackVisual() {
  return (
    <VisualCard caption="The whole architecture in one picture. Tokens enter at the bottom, flow up through N identical blocks, and exit through the LM head as next-token probabilities. A residual stream runs through everything.">
      <svg viewBox="0 0 660 460" className="w-full h-auto">
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-p2)" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-p1)" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="residualGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-p2)" stopOpacity="0.05" />
            <stop offset="50%" stopColor="var(--accent-p2)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-p2)" stopOpacity="0.9" />
          </linearGradient>
          <marker id="arrGray2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={S.ink3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
        </defs>

        {/* Residual Stream */}
        <line x1="330" y1="80" x2="330" y2="400" stroke="url(#residualGrad)" strokeWidth="6" strokeLinecap="round" className="pulse-stream" />

        {/* Token Embedding Block */}
        <g className="transition-svg hover:opacity-95" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <rect x="220" y="380" width="220" height="46" rx="10" fill="rgba(167, 139, 250, 0.06)" stroke="url(#violetGrad)" strokeWidth="1.5"/>
          <text x="330" y="401" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--accent-p1)" fontFamily="var(--sans)">Token embedding</text>
          <text x="330" y="417" textAnchor="middle" fontSize="10.5" fill={S.ink3} fontStyle="italic" fontFamily="var(--mono)">vocab × d_model lookup</text>
        </g>
        <line x1="330" y1="380" x2="330" y2="358" stroke={S.ink3} strokeWidth="1.2" markerEnd="url(#arrGray2)"/>

        {/* Identical stacked Blocks */}
        {[{ y: 290, label: 'Block N' }, { y: 180, label: 'Block 2' }, { y: 100, label: 'Block 1' }].map((b) => (
          <g key={b.label} className="transition-svg group" style={{ cursor: 'pointer' }}>
            <rect x="170" y={b.y} width="320" height="64" rx="12" fill="rgba(96, 165, 250, 0.03)" stroke="url(#blueGrad)" strokeWidth="1" strokeDasharray="5 4" className="transition-svg group-hover:fill-blue-500/[0.08]" />
            <rect x="182" y={b.y + 12} width="60" height="18" rx="4" fill="rgba(96, 165, 250, 0.12)" />
            <text x="212" y={b.y + 24} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--accent-p2)" fontFamily="var(--mono)" style={{ letterSpacing: '0.05em' }}>{b.label}</text>
            
            <g className="transition-svg group-hover:translate-x-1">
              <text x="350" y={b.y + 28} textAnchor="middle" fontSize="13.5" fontWeight="500" fill="var(--foreground)" fontFamily="var(--sans)">norm → attention → +</text>
              <text x="350" y={b.y + 48} textAnchor="middle" fontSize="13.5" fontWeight="500" fill="var(--foreground)" fontFamily="var(--sans)">norm → MLP → +</text>
            </g>
            <line x1="330" y1={b.y} x2="330" y2={b.y - 22} stroke={S.ink3} strokeWidth="1.2" markerEnd="url(#arrGray2)"/>
          </g>
        ))}

        <text x="330" y="254" textAnchor="middle" fontSize="22" fill={S.ink3} fontWeight="bold">⋮</text>

        {/* Final LM Head Block */}
        <g className="transition-svg hover:opacity-95">
          <rect x="220" y="34" width="220" height="42" rx="10" fill="rgba(167, 139, 250, 0.06)" stroke="url(#violetGrad)" strokeWidth="1.5"/>
          <text x="330" y="54" textAnchor="middle" fontSize="13.5" fontWeight="600" fill="var(--accent-p1)" fontFamily="var(--sans)">Final norm → LM head</text>
          <text x="330" y="69" textAnchor="middle" fontSize="10" fill={S.ink3} fontStyle="italic" fontFamily="var(--mono)">d_model → vocab logits → softmax</text>
        </g>

        <text x="455" y="240" fontSize="12" fill="var(--accent-p2)" fontWeight="500" fontStyle="italic" fontFamily="var(--mono)">residual stream</text>
        <line x1="452" y1="234" x2="338" y2="220" stroke="var(--accent-p2)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" className="pulse-stream"/>
      </svg>
    </VisualCard>
  );
}

export default function SectionTransformer() {
  return (
    <Section id="transformer" eyebrow="1.1 · The Transformer at a Glance" title="The transformer at a glance" kicker="The architecture under every modern LLM. N identical blocks stacked vertically, embeddings at the bottom, a language-modeling head at the top, and a residual stream running through everything." borderColor={S.blue} eyebrowColor={S.blue}>
      <Para>
        A transformer is not a complicated object. It is the same block, copied N times. Llama 3 8B uses 32 blocks. The 70B version uses 80. The 405B version uses 126. Inside each block there are two sublayers — an attention mechanism that mixes information across positions, and a multi-layer perceptron that transforms each position independently.
      </Para>
      <TransformerStackVisual />
      <Callout borderColor={S.blue} labelColor={S.blue} label="Where this is going">
        Each blue-dashed block above contains an MLP — the per-position transformation that does most of the per-token computation. Understanding the MLP and how it learns by backpropagation is enough to understand training for the entire model; the algorithm is identical, just over a much larger computational graph.
      </Callout>
    </Section>
  );
}
