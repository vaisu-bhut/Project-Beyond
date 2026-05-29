"use client";
import React from 'react';

/**
 * §1.5 — Architectures & Pretraining
 * Encoder/Decoder/Enc-Dec cards + next-token prediction + why decoder-only won
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

function Tag({ children, color }: any) {
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: '0.68rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: color || S.blue,
      border: `1px solid ${color || S.blue}`, padding: '2px 8px', borderRadius: 4,
      display: 'inline-block',
    }}>
      {children}
    </span>
  );
}

// ── Encoder Block ──
function EncoderBlock() {
  return (
    <svg viewBox="0 0 240 180" className="w-full h-auto">
      <text x="120" y="14" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--foreground-muted)" fontWeight="600">Bidirectional · masked-LM</text>
      {["[CLS]", "the", "[MASK]", "sat", "[SEP]"].map((t, i) => (
        <g key={i}>
          <rect x={20 + i * 42} y="30" width="36" height="22" rx="4" fill={S.violetSoft} stroke={S.violet} strokeWidth="1" />
          <text x={20 + i * 42 + 18} y="45" textAnchor="middle" fontFamily="var(--mono)" fontSize="8" fill="var(--foreground)">{t}</text>
        </g>
      ))}
      {[0, 1, 2, 3, 4].map(i =>
        [0, 1, 2, 3, 4].map(j => {
          if (i === j) return null;
          return <line key={`${i}-${j}`} x1={20 + i * 42 + 18} y1="52" x2={20 + j * 42 + 18} y2="90"
            stroke={S.violet} strokeWidth="0.4" opacity="0.4" />;
        })
      )}
      <rect x="20" y="92" width="200" height="22" rx="4" fill={S.violetSoft} stroke={S.violet} strokeWidth="0.8" />
      <text x="120" y="108" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill={S.violet} fontWeight="600">bidirectional self-attention</text>
      <line x1="105" y1="116" x2="105" y2="140" stroke="var(--foreground-muted)" strokeWidth="1" strokeDasharray="2,2" />
      <text x="105" y="158" textAnchor="middle" fontFamily="var(--sans)" fontStyle="italic" fontSize="11" fill={S.rose}>predict "cat"</text>
    </svg>
  );
}

// ── Decoder Block ──
function DecoderBlock() {
  return (
    <svg viewBox="0 0 240 180" className="w-full h-auto">
      <text x="120" y="14" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--foreground-muted)" fontWeight="600">Causal · next-token</text>
      {["The", "cat", "sat", "on", "the"].map((t, i) => (
        <g key={i}>
          <rect x={20 + i * 42} y="30" width="36" height="22" rx="4" fill={S.blueSoft} stroke={S.blue} strokeWidth="1" />
          <text x={20 + i * 42 + 18} y="45" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--foreground)">{t}</text>
        </g>
      ))}
      {[0, 1, 2, 3, 4].map(i =>
        [0, 1, 2, 3, 4].map(j => {
          if (j > i) return null;
          return <line key={`${i}-${j}`} x1={20 + j * 42 + 18} y1="52" x2={20 + i * 42 + 18} y2="90"
            stroke={S.blue} strokeWidth="0.4" opacity="0.4" />;
        })
      )}
      <rect x="20" y="92" width="200" height="22" rx="4" fill={S.blueSoft} stroke={S.blue} strokeWidth="0.8" />
      <text x="120" y="108" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill={S.blue} fontWeight="600">causal self-attention</text>
      <line x1="200" y1="116" x2="200" y2="140" stroke="var(--foreground-muted)" strokeWidth="1" strokeDasharray="2,2" />
      <text x="200" y="158" textAnchor="middle" fontFamily="var(--sans)" fontStyle="italic" fontSize="11" fill={S.rose}>predict "mat"</text>
    </svg>
  );
}

// ── Encoder-Decoder Block ──
function EncDecBlock() {
  return (
    <svg viewBox="0 0 240 180" className="w-full h-auto">
      <text x="120" y="14" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--foreground-muted)" fontWeight="600">Cross-attention · seq2seq</text>
      <rect x="10" y="30" width="100" height="40" rx="6" fill={S.violetSoft} stroke={S.violet} strokeWidth="1" />
      <text x="60" y="55" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fontWeight="600" fill={S.violet}>encoder</text>
      <rect x="130" y="30" width="100" height="40" rx="6" fill={S.blueSoft} stroke={S.blue} strokeWidth="1" />
      <text x="180" y="55" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fontWeight="600" fill={S.blue}>decoder</text>
      <line x1="110" y1="50" x2="130" y2="50" stroke={S.rose} strokeWidth="1.5" />
      <text x="120" y="42" textAnchor="middle" fontFamily="var(--mono)" fontSize="8" fill={S.rose} fontWeight="600">cross</text>
      <text x="60" y="95" textAnchor="middle" fontFamily="var(--sans)" fontStyle="italic" fontSize="10" fill="var(--foreground-muted)">"Le chat"</text>
      <line x1="60" y1="80" x2="60" y2="70" stroke="var(--foreground-muted)" strokeWidth="0.6" />
      <line x1="180" y1="80" x2="180" y2="70" stroke="var(--foreground-muted)" strokeWidth="0.6" />
      <text x="180" y="95" textAnchor="middle" fontFamily="var(--sans)" fontStyle="italic" fontSize="10" fill="var(--foreground-muted)">"The cat"</text>
      <text x="120" y="140" textAnchor="middle" fontFamily="var(--sans)" fontStyle="italic" fontSize="11" fill={S.rose}>translation, summarisation</text>
      <text x="120" y="158" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--foreground-muted)">separate input ↔ output sequences</text>
    </svg>
  );
}

// ── Next-Token Prediction ──
function NextToken() {
  const tokens = ["The", "cat", "sat", "on", "the", "mat", "."];
  return (
    <VisualCard caption="Self-supervised: the label is the next token. No human labels needed. Loss = mean cross-entropy over every next-token prediction in the sequence.">
      <svg viewBox="0 0 720 220" className="w-full h-auto">
        <text x="360" y="20" textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--foreground-muted)" fontWeight="600" letterSpacing="0.08em">
          SELF-SUPERVISED NEXT-TOKEN PREDICTION
        </text>

        <text x="40" y="65" fontFamily="var(--mono)" fontSize="10" fill="var(--foreground-muted)" fontWeight="600">input</text>
        {tokens.slice(0, -1).map((t, i) => (
          <g key={`in-${i}`}>
            <rect x={90 + i * 85} y="45" width="70" height="30" rx="6" fill={S.tealSoft} stroke={S.teal} strokeWidth="1" />
            <text x={90 + i * 85 + 35} y="65" textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fontWeight="600" fill="var(--foreground)">{t}</text>
          </g>
        ))}

        <text x="40" y="135" fontFamily="var(--mono)" fontSize="10" fill="var(--foreground-muted)" fontWeight="600">target</text>
        {tokens.slice(1).map((t, i) => (
          <g key={`out-${i}`}>
            <rect x={90 + i * 85} y="115" width="70" height="30" rx="6" fill={S.roseSoft} stroke={S.rose} strokeWidth="1" />
            <text x={90 + i * 85 + 35} y="135" textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fontWeight="600" fill="var(--foreground)">{t}</text>
            <line x1={90 + i * 85 + 35} y1="78" x2={90 + i * 85 + 35} y2="112"
              stroke="var(--foreground-muted)" strokeWidth="0.8" strokeDasharray="2,2" />
          </g>
        ))}

        <text x="360" y="185" textAnchor="middle" fontFamily="var(--sans)" fontStyle="italic" fontSize="13" fill="var(--foreground-muted)">
          Loss = mean cross-entropy over every next-token prediction in the sequence.
        </text>
        <text x="360" y="207" textAnchor="middle" fontFamily="var(--mono)" fontSize="10.5" fill={S.blue} fontWeight="600">
          That's it. Trillions of tokens. No tricks.
        </text>
      </svg>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionArchitectures() {
  return (
    <Section
      id="architectures"
      eyebrow="1.5 · Architectures & Pretraining"
      title="Encoder, decoder, and why one won"
      kicker="The transformer block is one ingredient. How you stack it and what mask you apply gives you three families. Modern LLMs are exclusively decoder-only — but the reason is subtle."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, margin: '24px 0' }}>
        {/* Encoder-only */}
        <div className="p2-glass p2-card" style={{ borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', lineHeight: 1 }}>Encoder-only</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: S.violet, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4, fontWeight: 600 }}>Bidirectional</div>
            </div>
            <Tag color={S.violet}>BERT</Tag>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--foreground-muted)', marginTop: 4, marginBottom: 14 }}>e.g. BERT, DeBERTa, RoBERTa</div>
          <EncoderBlock />
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.92rem', lineHeight: 1.5, color: S.ink2, marginTop: 12 }}>
            Every token sees every other token — bidirectional. Trained with masked-LM (predict the [MASK]).
            Excellent for classification and NER but cannot generate text autoregressively.
          </p>
        </div>

        {/* Decoder-only */}
        <div className="p2-glass p2-card" style={{ borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', lineHeight: 1 }}>Decoder-only</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: S.blue, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4, fontWeight: 600 }}>Causal</div>
            </div>
            <Tag color={S.blue}>GPT</Tag>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--foreground-muted)', marginTop: 4, marginBottom: 14 }}>e.g. GPT-4, Llama, Mistral, DeepSeek</div>
          <DecoderBlock />
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.92rem', lineHeight: 1.5, color: S.ink2, marginTop: 12 }}>
            Causal mask: each token sees only past tokens. Trained with next-token prediction.
            The universal default for LLMs — can do generation, classification, and NER.
          </p>
        </div>

        {/* Encoder-Decoder */}
        <div className="p2-glass p2-card" style={{ borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', lineHeight: 1 }}>Encoder–Decoder</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: S.rose, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4, fontWeight: 600 }}>Cross-attention</div>
            </div>
            <Tag color={S.rose}>T5</Tag>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--foreground-muted)', marginTop: 4, marginBottom: 14 }}>e.g. T5, BART, Flan-UL2</div>
          <EncDecBlock />
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.92rem', lineHeight: 1.5, color: S.ink2, marginTop: 12 }}>
            Encoder reads the full input bidirectionally; decoder generates autoregressively
            while cross-attending to encoder states. Natural for translation and summarisation.
          </p>
        </div>
      </div>

      {/* Next-token pretraining */}
      <Sub title="Next-token prediction: the universal objective">
        <Para>
          The training signal for every modern LLM. Given the previous tokens, predict the next one.
          The loss is cross-entropy, the labels come for free from the data itself, and because of
          the causal mask every position in the sequence yields a supervised example.
        </Para>
        <NextToken />
      </Sub>

      {/* Why decoder-only won */}
      <Sub title="Why decoder-only won">
        <Para>
          It wasn't architecture that settled the debate. It was <em>objective generality</em>.
          Next-token prediction naturally embeds classification, extraction, translation,
          reasoning, and generation inside a single task — the model just needs to emit the right
          tokens. Masked-LM (encoder-only) can't generate. Sequence-to-sequence (enc-dec) needs
          separate input/output framing. Decoder-only is the simplest framework that subsumes all tasks.
        </Para>
        <Callout borderColor={S.blue} labelColor={S.blue} label="The key insight">
          The decoder-only transformer won not because of superior architecture — encoder-decoder
          models often match or beat it on specific tasks. It won because next-token prediction
          is the simplest self-supervised objective that scales to internet-sized data and subsumes
          every downstream task via prompting. Simplicity × scale × generality.
        </Callout>
        <Callout borderColor={S.amber} labelColor={S.amber} label="Phase links">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <strong style={{ color: S.amber, fontFamily: 'var(--mono)', fontSize: 12, minWidth: 80 }}>← Phase 1</strong>
              <span>Vectors, matrices, and gradient descent. You already know the math under these diagrams.</span>
            </li>
            <li style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <strong style={{ color: S.amber, fontFamily: 'var(--mono)', fontSize: 12, minWidth: 80 }}>→ Phase 3</strong>
              <span>nanoGPT — you'll implement a decoder-only transformer from scratch.</span>
            </li>
            <li style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <strong style={{ color: S.amber, fontFamily: 'var(--mono)', fontSize: 12, minWidth: 80 }}>→ Phase 4</strong>
              <span>Serving: KV-cache management, PagedAttention, continuous batching.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <strong style={{ color: S.amber, fontFamily: 'var(--mono)', fontSize: 12, minWidth: 80 }}>→ Phase 6</strong>
              <span>Mechanistic interpretability — reading individual attention heads.</span>
            </li>
          </ul>
        </Callout>
      </Sub>
    </Section>
  );
}
