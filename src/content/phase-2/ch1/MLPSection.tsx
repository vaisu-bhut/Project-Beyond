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
  indigo: 'var(--accent-p1)',
  indigoSoft: 'rgba(167, 139, 250, 0.12)',
  amber: 'var(--accent-p5)',
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

function Callout({ label, children }: any) {
  return (
    <div className="p2-glass p2-callout" style={{ borderLeft: `3px solid ${S.blue}`, padding: '16px 20px', margin: '24px 0', borderRadius: '0 12px 12px 0' }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: S.blue, marginBottom: 6, fontFamily: 'var(--mono)' }}>{label}</div>
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

function RunButton({ onClick, disabled, label = 'Run' }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className="p2-btn-pill flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
      <span style={{ fontSize: 9 }}>▶</span> {label}
    </button>
  );
}

const MINI_NET = { layers: [{ n: 2, x: 110 }, { n: 3, x: 320 }, { n: 2, x: 530 }], r: 16, cy: 130, gap: 60 };
const yOf = (n: number, i: number) => MINI_NET.cy - ((n - 1) * MINI_NET.gap) / 2 + i * MINI_NET.gap;

// ─── Vector ───
function VectorVisual() {
  const values = [0.21, -0.43, 0.67, 0.12, -0.08, 0.55, -0.31, 0.04, 0.42, -0.19, 0.28, -0.51, 0.15, 0.66, -0.12, 0.37];
  
  const colorFor = (v: number) => {
    const t = Math.min(1, Math.abs(v));
    if (v > 0) return `color-mix(in oklab, var(--accent-p5) ${Math.round((0.15 + t * 0.55) * 100)}%, rgba(251, 191, 36, 0.05))`;
    if (v < 0) return `color-mix(in oklab, var(--accent-p2) ${Math.round((0.15 + t * 0.55) * 100)}%, rgba(96, 165, 250, 0.05))`;
    return 'transparent';
  };
  
  return (
    <VisualCard caption="A vector is a list of numbers. Each position is one 'dimension'. Color encodes value — warm = positive, cool = negative. In LLMs, vectors are typically 4,096 dimensions long.">
      <div style={{ textAlign: 'center', padding: 12 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <span style={{ fontStyle: 'italic', fontSize: 22, color: S.ink, fontWeight: 500 }}>"river"</span>
          <span style={{ color: S.ink3 }}>→</span>
          <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.15em', color: S.blue, fontWeight: 600, fontFamily: 'var(--mono)' }}>embedding vector</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 16, overflowX: 'auto', padding: '4px 8px' }}>
          {values.map((v, i) => (
            <div key={i} style={{ textAlign: 'center', flexShrink: 0 }} className="transition-all hover:scale-105 cursor-default">
              <div style={{ width: 38, height: 38, border: `1px solid ${S.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontFamily: 'var(--mono)', fontWeight: 600, color: S.ink, borderRadius: 6, background: colorFor(v), boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>{v.toFixed(2)}</div>
              <div style={{ fontSize: 9, color: S.ink3, marginTop: 6, fontFamily: 'var(--mono)' }}>{i}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: S.ink3, fontStyle: 'italic', marginTop: 12, maxWidth: 420, margin: '12px auto 0', lineHeight: 1.6 }}>
          Here: 16 dimensions, shown in full.<br/>Llama 3 8B: 4,096 dimensions per vector. Llama 3 405B: 16,384.
        </div>
      </div>
    </VisualCard>
  );
}

// ─── Weights ───
function WeightsVisual() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <VisualCard caption="Each line carries one learnable scalar — a weight. Hover any connection to inspect it. A 2→3→2 network has 12 weights.">
      <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <svg viewBox="0 0 660 260" className="w-full h-auto">
            {MINI_NET.layers.slice(0, -1).map((layer, li) => {
              const next = MINI_NET.layers[li + 1];
              return Array.from({ length: layer.n }).map((_, i) =>
                Array.from({ length: next.n }).map((_, j) => {
                  const id = `${li}-${i}-${j}`;
                  const isH = hover === id;
                  return <line key={id} x1={layer.x + MINI_NET.r} y1={yOf(layer.n, i)} x2={next.x - MINI_NET.r} y2={yOf(next.n, j)} stroke={isH ? S.blue : S.rule} strokeWidth={isH ? 3.5 : 1} opacity={isH ? 1 : 0.45} style={{ cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }} onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)} />;
                })
              );
            })}
            {MINI_NET.layers.map((layer, li) => Array.from({ length: layer.n }).map((_, i) => (
              <circle key={`n-${li}-${i}`} cx={layer.x} cy={yOf(layer.n, i)} r={MINI_NET.r} fill="rgba(96, 165, 250, 0.04)" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
            )))}
            {hover && (() => {
              const [li, i, j] = hover.split('-').map(Number);
              const layer = MINI_NET.layers[li]; const next = MINI_NET.layers[li + 1];
              const mx = (layer.x + MINI_NET.r + next.x - MINI_NET.r) / 2;
              const my = (yOf(layer.n, i) + yOf(next.n, j)) / 2;
              const w = (((li + 1) * (i + 2) * (j + 3)) % 17) / 20 - 0.4;
              return (
                <g style={{ pointerEvents: 'none' }}>
                  <rect x={mx - 38} y={my - 22} width="76" height="26" rx="8" fill="rgba(96, 165, 250, 0.12)" stroke={S.blue} strokeWidth="1" style={{ backdropFilter: 'blur(4px)' }}/>
                  <text x={mx} y={my - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--foreground)" fontFamily="var(--mono)">w = {w.toFixed(2)}</text>
                </g>
              );
            })()}
            {['Input', 'Hidden', 'Output'].map((l, i) => <text key={l} x={MINI_NET.layers[i].x} y="240" textAnchor="middle" fontSize="11" fill={S.ink3} fontFamily="var(--mono)" fontWeight="600" style={{ letterSpacing: '0.05em' }}>{l}</text>)}
          </svg>
        </div>
        <div style={{ width: 240, fontSize: 13, color: S.ink2, borderLeft: `1px solid ${S.rule}`, paddingLeft: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: S.blue, fontWeight: 600, marginBottom: 4, fontFamily: 'var(--mono)' }}>Definition</div>
            <p style={{ lineHeight: 1.6 }}>A weight is the learnable scalar attached to one connection between two neurons.</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: S.blue, fontWeight: 600, marginBottom: 4, fontFamily: 'var(--mono)' }}>Math</div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: S.ink, background: S.bgSunk, padding: '8px 10px', borderRadius: 6, border: `1px solid ${S.rule}` }}>contribution = w · x</p>
          </div>
          <div>
            <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: S.blue, fontWeight: 600, marginBottom: 4, fontFamily: 'var(--mono)' }}>In a layer</div>
            <p style={{ lineHeight: 1.6 }}>Many weights stack into a <em>weight matrix</em> W. One per layer.</p>
          </div>
        </div>
      </div>
    </VisualCard>
  );
}

// ─── Biases ───
function BiasesVisual() {
  return (
    <VisualCard caption="Each non-input neuron has its own learnable bias — a baseline offset added to the weighted sum before activation. In a 2→3→2 network: 3+2 = 5 biases total.">
      <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <svg viewBox="0 0 660 260" className="w-full h-auto">
            {MINI_NET.layers.slice(0, -1).map((layer, li) => {
              const next = MINI_NET.layers[li + 1];
              return Array.from({ length: layer.n }).map((_, i) =>
                Array.from({ length: next.n }).map((_, j) => <line key={`c-${li}-${i}-${j}`} x1={layer.x + MINI_NET.r} y1={yOf(layer.n, i)} x2={next.x - MINI_NET.r} y2={yOf(next.n, j)} stroke={S.rule} strokeWidth="1" opacity="0.4" />)
              );
            })}
            {MINI_NET.layers.map((layer, li) => Array.from({ length: layer.n }).map((_, i) => (
              <circle key={`n-${li}-${i}`} cx={layer.x} cy={yOf(layer.n, i)} r={MINI_NET.r} fill="rgba(96, 165, 250, 0.04)" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
            )))}
            {MINI_NET.layers.slice(1).map((layer, layerIdx) => {
              const li = layerIdx + 1;
              return Array.from({ length: layer.n }).map((_, i) => {
                const cx = layer.x + 20, cy = yOf(layer.n, i) - 20;
                return (
                  <g key={`b-${li}-${i}`}>
                    <circle cx={cx} cy={cy} r="10" fill="rgba(251, 191, 36, 0.12)" stroke={S.amber} strokeWidth="1.2"/>
                    <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize="10" fill={S.amber} fontWeight="bold" fontFamily="var(--mono)">b</text>
                  </g>
                );
              });
            })}
            {['Input', 'Hidden', 'Output'].map((l, i) => <text key={l} x={MINI_NET.layers[i].x} y="240" textAnchor="middle" fontSize="11" fill={S.ink3} fontFamily="var(--mono)" fontWeight="600" style={{ letterSpacing: '0.05em' }}>{l}</text>)}
          </svg>
        </div>
        <div style={{ width: 240, fontSize: 13, color: S.ink2, borderLeft: `1px solid ${S.rule}`, paddingLeft: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: S.amber, fontWeight: 600, marginBottom: 4, fontFamily: 'var(--mono)' }}>Definition</div>
            <p style={{ lineHeight: 1.6 }}>A bias is a learnable scalar added to each neuron's weighted sum before activation.</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: S.amber, fontWeight: 600, marginBottom: 4, fontFamily: 'var(--mono)' }}>Math</div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: S.ink, background: S.bgSunk, padding: '8px 10px', borderRadius: 6, border: `1px solid ${S.rule}`, lineHeight: 1.8 }}>z = (Σ wᵢ xᵢ) + b<br/>a = activation(z)</p>
          </div>
          <div>
            <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: S.amber, fontWeight: 600, marginBottom: 4, fontFamily: 'var(--mono)' }}>Intuition</div>
            <p style={{ lineHeight: 1.6 }}>Lets a neuron fire even when all inputs are zero. Shifts the activation function left or right.</p>
          </div>
        </div>
      </div>
    </VisualCard>
  );
}

// ─── Parameters ───
function ParametersVisual() {
  const [mode, setMode] = useState('total');
  const showW = mode === 'weights' || mode === 'total';
  const showB = mode === 'biases' || mode === 'total';
  const modes = [{ id: 'weights', label: 'Weights', count: 12 }, { id: 'biases', label: 'Biases', count: 5 }, { id: 'total', label: 'All parameters', count: 17 }];

  return (
    <VisualCard caption="A 'parameter' is anything the network learns: every weight plus every bias. Toggle to see them counted separately.">
      <div>
        <svg viewBox="0 0 660 260" className="w-full h-auto">
          {MINI_NET.layers.slice(0, -1).map((layer, li) => {
            const next = MINI_NET.layers[li + 1];
            return Array.from({ length: layer.n }).map((_, i) =>
              Array.from({ length: next.n }).map((_, j) => <line key={`c-${li}-${i}-${j}`} x1={layer.x + MINI_NET.r} y1={yOf(layer.n, i)} x2={next.x - MINI_NET.r} y2={yOf(next.n, j)} stroke={showW ? S.blue : S.rule} strokeWidth={showW ? 1.5 : 0.8} opacity={showW ? 0.75 : 0.3} style={{ transition: 'all 0.4s ease-out' }} />)
            );
          })}
          {MINI_NET.layers.map((layer, li) => Array.from({ length: layer.n }).map((_, i) => (
            <circle key={`n-${li}-${i}`} cx={layer.x} cy={yOf(layer.n, i)} r={MINI_NET.r} fill="rgba(96, 165, 250, 0.04)" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          )))}
          {MINI_NET.layers.slice(1).map((layer, layerIdx) => {
            const li = layerIdx + 1;
            return Array.from({ length: layer.n }).map((_, i) => {
              const cx = layer.x + 20, cy = yOf(layer.n, i) - 20;
              return (
                <g key={`b-${li}-${i}`} style={{ transition: 'opacity 0.4s', opacity: showB ? 1 : 0 }}>
                  <circle cx={cx} cy={cy} r="10" fill="rgba(251, 191, 36, 0.12)" stroke={S.amber} strokeWidth="1.2"/>
                  <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize="10" fill={S.amber} fontWeight="bold" fontFamily="var(--mono)">b</text>
                </g>
              );
            });
          })}
          {['Input', 'Hidden', 'Output'].map((l, i) => <text key={l} x={MINI_NET.layers[i].x} y="240" textAnchor="middle" fontSize="11" fill={S.ink3} fontFamily="var(--mono)" fontWeight="600" style={{ letterSpacing: '0.05em' }}>{l}</text>)}
        </svg>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 20 }}>
          {modes.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)} className={`p2-btn-pill ${mode === m.id ? 'p2-btn-pill-active' : ''}`}>
              {m.label} <span style={{ fontFamily: 'var(--mono)', marginLeft: 4, opacity: 0.85 }}>({m.count})</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 28, maxWidth: 440, margin: '28px auto 0', width: '100%' }}>
          <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: S.ink3, marginBottom: 10, textAlign: 'center', fontFamily: 'var(--mono)', fontWeight: 600 }}>For scale</div>
          <div style={{ border: `1px solid ${S.rule}`, borderRadius: 10, overflow: 'hidden' }}>
            {[{ l: 'This network', v: '17 parameters', hl: true }, { l: 'GPT-2 small (2019)', v: '124M' }, { l: 'Llama 3 8B (2024)', v: '8B' }, { l: 'Llama 3 70B (2024)', v: '70B' }, { l: 'Llama 3 405B (2024)', v: '405B' }, { l: 'DeepSeek-V3 (2024)', v: '671B (MoE)' }].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 18px', fontSize: 13, borderBottom: i < 5 ? `1px solid ${S.rule}` : 'none', background: r.hl ? 'rgba(251, 191, 36, 0.08)' : 'transparent', transition: 'background 0.2s' }}>
                <span style={{ color: S.ink2, fontWeight: r.hl ? 500 : 400 }}>{r.l}</span>
                <span style={{ fontFamily: 'var(--mono)', color: r.hl ? 'var(--accent-p5)' : 'var(--foreground)', fontWeight: 600 }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisualCard>
  );
}

export default function SectionMLP() {
  return (
    <Section id="mlp" eyebrow="1.6 · Inside the MLP" title="Inside the MLP" kicker="The pink block inside every transformer is a multi-layer perceptron. To understand it, you only need four pieces — vectors, weights, biases, and the count of parameters they form together.">
      <Sub title="A vector">
        <Para>Everything that flows through a neural network is a vector — an ordered list of numbers. The input is a vector, every hidden layer's activations are a vector, the output is a vector. The dimensionality (how long the list is) is what people mean when they say "d_model = 4096".</Para>
        <VectorVisual />
      </Sub>
      <Sub title="A weight">
        <Para>Connect two neurons and you create one weight: a learnable scalar multiplied into whatever value the source neuron is producing. A network is mostly weights — billions of them in modern models, each adjusted slightly during training.</Para>
        <WeightsVisual />
      </Sub>
      <Sub title="A bias">
        <Para>Each neuron also gets its own bias — a single scalar added to the weighted sum before the activation function runs. Biases let a neuron fire even when its inputs are silent, and they shift activation functions left or right.</Para>
        <BiasesVisual />
      </Sub>
      <Sub title="Parameters — putting it all together">
        <Para>Together, every weight and every bias is a parameter. Training a neural network means adjusting these numbers — and only these numbers — until the network's outputs match what you want.</Para>
        <ParametersVisual />
        <Callout label="A scale fact worth holding">
          Llama 3 405B has 405,000,000,000 parameters. Pretraining touches each one many times across 15 trillion tokens. Modern training is, in essence, an enormous optimization over a 405-billion-dimensional surface. Backpropagation is the only known method that makes this tractable.
        </Callout>
      </Sub>
    </Section>
  );
}
