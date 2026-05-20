"use client";
import React from 'react';

const S = {
  ink: 'var(--foreground)',
  ink2: 'var(--foreground-muted)',
  blue: 'var(--accent-p2)',
  gold: 'var(--accent-p5)',
  rose: 'var(--accent-p6)',
};

export default function Phase2ExitCriteria() {
  const items = [
    "Sketch the attention equation from memory and label every shape.",
    "Distinguish MHA / MQA / GQA on a whiteboard and name an example model for each.",
    "Explain the trade-off between sinusoidal, RoPE, ALiBi, and NoPE in 60 seconds.",
    "Read a model card — say, \"Llama 3.1 70B Instruct, GQA-8, RoPE-θ=500000, 128k ctx\" — and decode every term without hesitation.",
    "Articulate why decoder-only won (objective generality, not architecture).",
    "Recognise the same transformer block when it shows up wrapped in FSDP, in a vLLM server, or in an SAE study."
  ];

  return (
    <section id="exit" className="scroll-mt-24 py-12" style={{ borderTop: `2px solid ${S.blue}` }}>
      {/* Eyebrow */}
      <div style={{
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.22em',
        fontWeight: 600,
        color: S.blue,
        marginBottom: 12,
        fontFamily: 'var(--font-mono), monospace'
      }}>
        § 2 · EXIT CRITERIA
      </div>

      {/* Main Title */}
      <h2 className="tracking-tight" style={{
        fontFamily: 'var(--font-sans), serif',
        fontStyle: 'italic',
        fontSize: 'clamp(2rem, 5vw, 2.75rem)',
        fontWeight: 700,
        color: S.ink,
        lineHeight: 1.1,
        marginBottom: 32
      }}>
        When this section is done
      </h2>

      {/* List of exit criteria */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 48 }}>
        {items.map((item, idx) => (
          <p key={idx} style={{
            fontSize: '16.5px',
            color: S.ink2,
            lineHeight: 1.7,
            fontFamily: 'var(--font-sans), serif',
            margin: 0
          }}>
            {item}
          </p>
        ))}
      </div>

      {/* NEXT Banner (Popping theme-aware box) */}
      <div style={{
        background: 'var(--background-soft)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '28px 32px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          fontSize: 10,
          fontFamily: 'var(--font-mono), monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          fontWeight: 600,
          color: 'var(--accent-p5)',
          marginBottom: 10
        }}>
          NEXT
        </div>
        <p style={{
          fontSize: '15.5px',
          color: 'var(--foreground)',
          lineHeight: 1.6,
          fontFamily: 'var(--font-sans), serif',
          margin: 0
        }}>
          <strong style={{ color: 'var(--accent-p5)', fontWeight: 700 }}>Phase 2 · §2: Prompting techniques.</strong>{' '}
          Now that you know how the model conditions on its input, the whole vocabulary of prompting — zero-shot,
          few-shot, chain-of-thought, self-consistency, tree-of-thoughts, in-context learning — becomes mechanical
          rather than magical.
        </p>
      </div>
    </section>
  );
}
