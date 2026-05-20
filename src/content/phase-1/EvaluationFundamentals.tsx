"use client";

import React, { useState, useMemo } from 'react';

// ============================================================================
// Phase 1 — Evaluation Fundamentals
// A deep, visual walkthrough of train/val/test, k-fold CV and its variants,
// the confusion matrix, why accuracy lies under imbalance, ROC vs PR curves,
// calibration, and reliability diagrams.
//
// Single-file JSX artifact. Tailwind for layout. SVG + Recharts for visuals.
// ============================================================================

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend, AreaChart, Area
} from 'recharts';

// ---------------------------------------------------------------------------
// Design tokens (Mapped to Phase 1 / Global dark theme)
// ---------------------------------------------------------------------------
const INK = 'var(--ink)';
const INK_2 = 'var(--ink-2)';
const PAPER = 'transparent';
const PAPER_DEEP = 'var(--bg-sunken)';
const RULE = 'var(--rule)';
const MUTED = 'var(--ink-3)';
const TEAL = 'var(--teal)';
const TEAL_LIGHT = 'var(--teal-soft)';
const AMBER = 'var(--amber)';
const AMBER_LIGHT = 'var(--amber-soft)';
const CORAL = 'var(--crimson)';
const CORAL_LIGHT = 'var(--crimson-soft)';
const BLUE = 'var(--indigo)';
const BLUE_LIGHT = 'var(--indigo-soft)';
const RED = 'var(--crimson)';
const PURPLE = 'var(--indigo)';

// ---------------------------------------------------------------------------
// Layout primitives
// ---------------------------------------------------------------------------
const Section = ({ id, eyebrow, title, children }: any) => (
  <section id={id} className="mb-24 scroll-mt-8">
    <div className="mb-8">
      <div
        className="text-[11px] tracking-[0.3em] uppercase mb-3"
        style={{ color: AMBER, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
      >
        {eyebrow}
      </div>
      <h2
        className="text-4xl md:text-5xl leading-[1.05] font-normal"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: INK, letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
      <div className="mt-6 h-px w-full" style={{ background: RULE }} />
    </div>
    {children}
  </section>
);

const Prose = ({ children }: any) => (
  <div
    className="text-[17px] leading-[1.75] space-y-5"
    style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: INK }}
  >
    {children}
  </div>
);

const Aside = ({ label, children }: any) => (
  <div
    className="my-10 px-6 py-5"
    style={{
      borderLeft: `3px solid ${AMBER}`,
      background: PAPER_DEEP,
      fontFamily: 'Georgia, serif'
    }}
  >
    <div
      className="text-[10px] tracking-[0.3em] uppercase mb-2"
      style={{ color: AMBER, fontStyle: 'italic' }}
    >
      {label}
    </div>
    <div className="text-[15px] leading-[1.7]" style={{ color: INK }}>
      {children}
    </div>
  </div>
);

const VizFrame = ({ caption, children }: any) => (
  <figure
    className="my-12 p-6 md:p-8"
    style={{
      background: 'transparent',
      border: `1px solid ${RULE}`,
      boxShadow: `4px 4px 0 0 ${RULE}`
    }}
  >
    <div>{children}</div>
    {caption && (
      <figcaption
        className="mt-5 pt-4 text-[13px] leading-[1.6]"
        style={{
          borderTop: `1px solid ${RULE}`,
          color: MUTED,
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic'
        }}
      >
        <span style={{ color: AMBER, fontWeight: 500, marginRight: 8 }}>Fig.</span>
        {caption}
      </figcaption>
    )}
  </figure>
);

const Code = ({ children }: any) => (
  <code
    className="px-1.5 py-0.5 text-[0.92em]"
    style={{
      fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
      background: PAPER_DEEP,
      color: INK,
      borderRadius: 2
    }}
  >
    {children}
  </code>
);

const MathSpan = ({ children }: any) => (
  <span
    style={{
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontStyle: 'italic',
      letterSpacing: '0.01em'
    }}
  >
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// VISUAL 1 — Train / Val / Test split
// ---------------------------------------------------------------------------
const SplitVisual = () => (
  <svg viewBox="0 0 680 340" width="100%" role="img" aria-label="Train, validation, and test splits with their roles">
    <defs>
      <marker id="arr1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
    </defs>

    <text x="40" y="38" style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontStyle: 'italic', fill: MUTED }}>
      Full labeled dataset, partitioned once
    </text>

    {/* Train */}
    <rect x="40" y="60" width="420" height="60" rx="4" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="0.75" />
    <text x="250" y="84" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 16, fill: 'var(--teal)' }}>Train · 70%</text>
    <text x="250" y="104" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 12, fontStyle: 'italic', fill: 'var(--teal)' }}>the optimizer learns here</text>

    {/* Val */}
    <rect x="470" y="60" width="90" height="60" rx="4" fill={AMBER_LIGHT} stroke={AMBER} strokeWidth="0.75" />
    <text x="515" y="84" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 14, fill: 'var(--amber)' }}>Val · 15%</text>
    <text x="515" y="104" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: 'var(--amber)' }}>tune HPs</text>

    {/* Test */}
    <rect x="570" y="60" width="90" height="60" rx="4" fill={CORAL_LIGHT} stroke={CORAL} strokeWidth="0.75" />
    <text x="615" y="84" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 14, fill: 'var(--crimson)' }}>Test · 15%</text>
    <text x="615" y="104" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: 'var(--crimson)' }}>locked away</text>

    {/* Connectors */}
    <line x1="250" y1="125" x2="250" y2="165" stroke={TEAL} strokeWidth="1.5" markerEnd="url(#arr1)" />
    <line x1="515" y1="125" x2="515" y2="165" stroke={AMBER} strokeWidth="1.5" markerEnd="url(#arr1)" />
    <line x1="615" y1="125" x2="615" y2="165" stroke={CORAL} strokeWidth="1.5" markerEnd="url(#arr1)" />

    {/* Role descriptions */}
    <rect x="100" y="170" width="300" height="58" rx="4" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="0.5" opacity="0.6" />
    <text x="250" y="190" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 12, fill: 'var(--teal)' }}>Backprop, weight updates, gradient flow.</text>
    <text x="250" y="210" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 12, fontStyle: 'italic', fill: 'var(--teal)' }}>The model literally sees these labels.</text>

    <rect x="430" y="170" width="170" height="58" rx="4" fill={AMBER_LIGHT} stroke={AMBER} strokeWidth="0.5" opacity="0.6" />
    <text x="515" y="190" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fill: 'var(--amber)' }}>You see scores here.</text>
    <text x="515" y="210" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: 'var(--amber)' }}>Pick LR, early-stop, swap heads.</text>

    <line x1="615" y1="235" x2="615" y2="258" stroke={CORAL} strokeWidth="1.5" markerEnd="url(#arr1)" />
    <rect x="500" y="265" width="160" height="60" rx="4" fill={CORAL_LIGHT} stroke={CORAL} strokeWidth="0.5" opacity="0.6" />
    <text x="580" y="284" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fill: 'var(--crimson)' }}>Untouched until the</text>
    <text x="580" y="300" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fill: 'var(--crimson)' }}>final number is reported.</text>
    <text x="580" y="316" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: 'var(--crimson)' }}>Peek once → burned forever.</text>
  </svg>
);

// ---------------------------------------------------------------------------
// VISUAL 2 — k-fold CV (interactive: hover/click a fold)
// ---------------------------------------------------------------------------
const KFoldVisual = () => {
  const [activeFold, setActiveFold] = useState<number | null>(0);
  const scores = [0.81, 0.79, 0.84, 0.78, 0.82];
  const mean = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(3);
  const variance = scores.reduce((s, x) => s + (x - parseFloat(mean)) ** 2, 0) / scores.length;
  const std = Math.sqrt(variance).toFixed(3);

  return (
    <div>
      <svg viewBox="0 0 680 320" width="100%" role="img" aria-label="5-fold cross-validation, interactive">
        <text x="40" y="32" style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontStyle: 'italic', fill: MUTED }}>
          Each row is one training run. The amber tile is held out as validation.
        </text>

        {[0, 1, 2, 3, 4].map((row) => (
          <g key={row}>
            {[4, 3, 2, 1, 0].map((col) => {
              const isVal = col === row;
              const x = 40 + col * 104;
              const y = 60 + row * 40;
              const focused = row === activeFold;
              return (
                <rect
                  key={col}
                  x={x}
                  y={y}
                  width="100"
                  height="32"
                  rx="3"
                  fill={isVal ? AMBER_LIGHT : TEAL_LIGHT}
                  stroke={isVal ? AMBER : TEAL}
                  strokeWidth={focused ? 1.5 : 0.5}
                  opacity={focused || activeFold === null ? 1 : 0.4}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={() => setActiveFold(row)}
                />
              );
            })}
            <text
              x="608"
              y={80 + row * 40}
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 12,
                fontStyle: row === activeFold ? 'normal' : 'italic',
                fontWeight: row === activeFold ? 600 : 400,
                fill: row === activeFold ? INK : MUTED
              }}
            >
              run {row + 1}: {scores[row].toFixed(2)}
            </text>
          </g>
        ))}

        <line x1="40" y1="270" x2="600" y2="270" stroke={RULE} strokeWidth="0.5" />

        <text x="40" y="295" style={{ fontFamily: 'Georgia, serif', fontSize: 14, fill: INK }}>
          Reported: <tspan fontWeight="600">mean {mean}</tspan>, <tspan fontWeight="600">std {std}</tspan>
        </text>
        <text x="40" y="313" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: MUTED }}>
          A single split could have landed anywhere on the spread.
        </text>
      </svg>

      <div className="mt-3 flex gap-4 text-[12px]" style={{ fontFamily: 'Georgia, serif', color: MUTED }}>
        <span className="flex items-center gap-2">
          <span style={{ width: 12, height: 12, background: TEAL_LIGHT, border: `0.5px solid ${TEAL}`, display: 'inline-block' }} />
          training fold
        </span>
        <span className="flex items-center gap-2">
          <span style={{ width: 12, height: 12, background: AMBER_LIGHT, border: `0.5px solid ${AMBER}`, display: 'inline-block' }} />
          validation fold
        </span>
        <span style={{ fontStyle: 'italic' }}>(hover a row)</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// VISUAL 3 — CV variants: stratified / time-series / group
// ---------------------------------------------------------------------------
const CVVariantsVisual = () => (
  <svg viewBox="0 0 680 580" width="100%" role="img" aria-label="Three CV variants compared">
    {/* STRATIFIED */}
    <text x="40" y="32" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fill: INK }}>Stratified k-fold</text>
    <text x="40" y="52" style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontStyle: 'italic', fill: MUTED }}>
      Preserves class proportion in every fold. Random splits don't.
    </text>

    <text x="40" y="80" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fill: MUTED }}>Random k-fold (base rate 5% positive):</text>
    {[
      { label: '2% pos', x: 40 },
      { label: '8% pos', x: 164 },
      { label: '3% pos', x: 288 },
      { label: '7% pos', x: 412 },
      { label: '5% pos', x: 536 }
    ].map((f, i) => (
      <g key={i}>
        <rect x={f.x} y="90" width="120" height="26" rx="3" fill={BLUE_LIGHT} stroke={BLUE} strokeWidth="0.5" />
        <text x={f.x + 60} y="107" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fill: 'var(--indigo)' }}>{f.label}</text>
      </g>
    ))}
    <text x="668" y="107" textAnchor="end" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: CORAL }}>±3pp drift</text>

    <text x="40" y="140" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fill: MUTED }}>Stratified:</text>
    {[40, 164, 288, 412, 536].map((x, i) => (
      <g key={i}>
        <rect x={x} y="150" width="120" height="26" rx="3" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="0.5" />
        <text x={x + 60} y="167" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fill: 'var(--teal)' }}>5% pos</text>
      </g>
    ))}
    <text x="668" y="167" textAnchor="end" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: TEAL }}>locked</text>

    <line x1="40" y1="200" x2="640" y2="200" stroke={RULE} strokeWidth="0.3" />

    {/* TIME SERIES */}
    <text x="40" y="225" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fill: INK }}>Time-series split</text>
    <text x="40" y="245" style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontStyle: 'italic', fill: MUTED }}>
      Train on past, validate on the next slice. The future is never used.
    </text>

    {[
      { train: 60, val: 60, future: 480, y: 260 },
      { train: 124, val: 60, future: 416, y: 290 },
      { train: 188, val: 60, future: 352, y: 320 },
      { train: 252, val: 60, future: 288, y: 350 }
    ].map((f, i) => (
      <g key={i}>
        <rect x="40" y={f.y} width={f.train} height="22" rx="2" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="0.5" />
        <rect x={40 + f.train + 4} y={f.y} width={f.val} height="22" rx="2" fill={AMBER_LIGHT} stroke={AMBER} strokeWidth="0.5" />
        <rect x={40 + f.train + f.val + 8} y={f.y} width={f.future - 8} height="22" rx="2" fill="none" stroke={MUTED} strokeWidth="0.5" strokeDasharray="3 3" />
        <text x={40 + f.train + f.val + 8 + (f.future - 8) / 2} y={f.y + 15} textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 10, fontStyle: 'italic', fill: MUTED }}>
          {i === 0 ? 'future (not used)' : ''}
        </text>
      </g>
    ))}

    <text x="40" y="395" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: MUTED }}>
      time →
    </text>

    <line x1="40" y1="415" x2="640" y2="415" stroke={RULE} strokeWidth="0.3" />

    {/* GROUP K-FOLD */}
    <text x="40" y="440" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fill: INK }}>Group k-fold</text>
    <text x="40" y="460" style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontStyle: 'italic', fill: MUTED }}>
      All rows from one entity (patient, user, molecule scaffold) stay in one fold.
    </text>

    {[
      { name: 'patient A', x: 40, rows: '12 rows', val: false },
      { name: 'patient B', x: 124, rows: '8 rows', val: false },
      { name: 'patient C', x: 208, rows: '15 rows', val: false },
      { name: 'patient D', x: 292, rows: 'held out', val: true },
      { name: 'patient E', x: 376, rows: 'held out', val: true },
      { name: 'patient F', x: 460, rows: '9 rows', val: false },
      { name: 'patient G', x: 544, rows: '11 rows', val: false }
    ].map((p, i) => (
      <g key={i}>
        <rect
          x={p.x}
          y="478"
          width="80"
          height="40"
          rx="3"
          fill={p.val ? AMBER_LIGHT : 'var(--indigo-soft)'}
          stroke={p.val ? AMBER : PURPLE}
          strokeWidth="0.5"
        />
        <text x={p.x + 40} y="496" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 10, fill: p.val ? 'var(--amber)' : 'var(--indigo)' }}>{p.name}</text>
        <text x={p.x + 40} y="510" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 9, fontStyle: 'italic', fill: p.val ? 'var(--amber)' : 'var(--indigo)' }}>{p.rows}</text>
      </g>
    ))}

    <text x="40" y="548" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: MUTED }}>
      No patient appears in both train and val. The model cannot memorise the entity.
    </text>
  </svg>
);

// ---------------------------------------------------------------------------
// VISUAL 4 — Confusion Matrix
// ---------------------------------------------------------------------------
const ConfusionMatrixVisual = () => {
  const [hover, setHover] = useState<string | null>(null);
  const cells: Record<string, any> = {
    TP: { x: 230, y: 110, color: TEAL_LIGHT, stroke: TEAL, ink: 'var(--teal)', label: 'TP', sub: 'true positive' },
    FN: { x: 395, y: 110, color: CORAL_LIGHT, stroke: CORAL, ink: 'var(--crimson)', label: 'FN', sub: 'missed positive' },
    FP: { x: 230, y: 200, color: CORAL_LIGHT, stroke: CORAL, ink: 'var(--crimson)', label: 'FP', sub: 'false alarm' },
    TN: { x: 395, y: 200, color: TEAL_LIGHT, stroke: TEAL, ink: 'var(--teal)', label: 'TN', sub: 'correct rejection' }
  };

  return (
    <svg viewBox="0 0 680 420" width="100%" role="img" aria-label="Confusion matrix">
      <text x="40" y="32" style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontStyle: 'italic', fill: MUTED }}>
        Hover a cell to see which metric uses it.
      </text>

      <text x="310" y="80" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 12, fill: MUTED }}>predicted positive</text>
      <text x="475" y="80" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 12, fill: MUTED }}>predicted negative</text>

      <text x="220" y="148" textAnchor="end" style={{ fontFamily: 'Georgia, serif', fontSize: 12, fill: MUTED }}>actual</text>
      <text x="220" y="164" textAnchor="end" style={{ fontFamily: 'Georgia, serif', fontSize: 12, fill: MUTED }}>positive</text>
      <text x="220" y="238" textAnchor="end" style={{ fontFamily: 'Georgia, serif', fontSize: 12, fill: MUTED }}>actual</text>
      <text x="220" y="254" textAnchor="end" style={{ fontFamily: 'Georgia, serif', fontSize: 12, fill: MUTED }}>negative</text>

      {Object.entries(cells).map(([key, c]) => {
        const inPrecision = hover === 'precision' && (key === 'TP' || key === 'FP');
        const inRecall = hover === 'recall' && (key === 'TP' || key === 'FN');
        const inAccuracy = hover === 'accuracy' && (key === 'TP' || key === 'TN');
        const lit = inPrecision || inRecall || inAccuracy || hover === key;
        return (
          <g key={key}>
            <rect
              x={c.x}
              y={c.y}
              width="160"
              height="80"
              rx="3"
              fill={c.color}
              stroke={c.stroke}
              strokeWidth={lit ? 2 : 0.5}
              opacity={hover && !lit && hover !== key ? 0.35 : 1}
              style={{ transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={() => setHover(key)}
              onMouseLeave={() => setHover(null)}
            />
            <text x={c.x + 80} y={c.y + 38} textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 600, fill: c.ink }}>
              {c.label}
            </text>
            <text x={c.x + 80} y={c.y + 60} textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: c.ink }}>
              {c.sub}
            </text>
          </g>
        );
      })}

      {/* Metric formulas */}
      {[
        { id: 'precision', x: 40, y: 320, label: 'Precision', formula: 'TP / (TP + FP)', desc: 'of what I flagged, what fraction was right?' },
        { id: 'recall', x: 240, y: 320, label: 'Recall', formula: 'TP / (TP + FN)', desc: 'of all actual positives, how many caught?' },
        { id: 'accuracy', x: 440, y: 320, label: 'Accuracy', formula: '(TP+TN) / total', desc: 'fraction correct (the lying default)' }
      ].map((m) => (
        <g
          key={m.id}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHover(m.id)}
          onMouseLeave={() => setHover(null)}
        >
          <rect
            x={m.x}
            y={m.y}
            width="190"
            height="80"
            rx="3"
            fill={hover === m.id ? PAPER_DEEP : 'var(--bg-sunken)'}
            stroke={hover === m.id ? AMBER : RULE}
            strokeWidth={hover === m.id ? 1.5 : 0.5}
            style={{ transition: 'all 0.2s' }}
          />
          <text x={m.x + 95} y={m.y + 22} textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 600, fill: INK }}>{m.label}</text>
          <text x={m.x + 95} y={m.y + 42} textAnchor="middle" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, fill: INK }}>{m.formula}</text>
          <text x={m.x + 95} y={m.y + 62} textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 10, fontStyle: 'italic', fill: MUTED }}>{m.desc}</text>
        </g>
      ))}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// VISUAL 5 — Accuracy Lies under imbalance
// ---------------------------------------------------------------------------
const ImbalanceVisual = () => (
  <svg viewBox="0 0 680 440" width="100%" role="img" aria-label="Why accuracy lies under class imbalance">
    <text x="40" y="32" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fill: INK }}>
      The constant predictor that gets 99% accuracy
    </text>
    <text x="40" y="52" style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontStyle: 'italic', fill: MUTED }}>
      10,000 transactions, 100 are fraud (1%). Model: "always predict 'not fraud'."
    </text>

    <text x="310" y="92" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 12, fill: MUTED }}>predicted positive</text>
    <text x="475" y="92" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 12, fill: MUTED }}>predicted negative</text>

    <text x="220" y="135" textAnchor="end" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fill: MUTED }}>actual fraud</text>
    <text x="220" y="150" textAnchor="end" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fill: MUTED }}>(100)</text>

    <rect x="230" y="110" width="160" height="50" rx="3" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="0.5" />
    <text x="310" y="135" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, fill: 'var(--teal)' }}>TP = 0</text>
    <text x="310" y="152" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 10, fontStyle: 'italic', fill: 'var(--teal)' }}>caught none</text>

    <rect x="395" y="110" width="160" height="50" rx="3" fill="var(--crimson-soft)" stroke={RED} strokeWidth="0.5" />
    <text x="475" y="135" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, fill: 'var(--crimson)' }}>FN = 100</text>
    <text x="475" y="152" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 10, fontStyle: 'italic', fill: 'var(--crimson)' }}>missed every one</text>

    <text x="220" y="270" textAnchor="end" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fill: MUTED }}>actual safe</text>
    <text x="220" y="285" textAnchor="end" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fill: MUTED }}>(9,900)</text>

    <rect x="230" y="170" width="160" height="180" rx="3" fill="var(--crimson-soft)" stroke={RED} strokeWidth="0.5" />
    <text x="310" y="265" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, fill: 'var(--crimson)' }}>FP = 0</text>
    <text x="310" y="285" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 10, fontStyle: 'italic', fill: 'var(--crimson)' }}>no false alarms</text>

    <rect x="395" y="170" width="160" height="180" rx="3" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="0.5" />
    {/* Pattern of dots inside TN cell to convey "huge pile" */}
    {Array.from({ length: 8 }).map((_, r) =>
      Array.from({ length: 12 }).map((_, c) => (
        <circle key={`${r}-${c}`} cx={405 + c * 12.5} cy={180 + r * 20} r="1.6" fill={TEAL} opacity="0.55" />
      ))
    )}
    <rect x="420" y="248" width="110" height="40" rx="2" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="0.5" />
    <text x="475" y="265" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, fill: 'var(--teal)' }}>TN = 9,900</text>
    <text x="475" y="282" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: 10, fontStyle: 'italic', fill: 'var(--teal)' }}>the dominant pile</text>

    <line x1="40" y1="375" x2="640" y2="375" stroke={RULE} strokeWidth="0.5" />

    <text x="80" y="402" style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600, fill: TEAL }}>Accuracy = 99.0%</text>
    <text x="80" y="422" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: MUTED }}>impressive, useless</text>

    <text x="310" y="402" style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600, fill: RED }}>Recall = 0%</text>
    <text x="310" y="422" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: MUTED }}>caught zero fraud</text>

    <text x="520" y="402" style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600, fill: RED }}>F1 = 0</text>
    <text x="520" y="422" style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: MUTED }}>the honest number</text>
  </svg>
);

// ---------------------------------------------------------------------------
// VISUAL 6 — ROC vs PR under imbalance (interactive imbalance slider)
// ---------------------------------------------------------------------------
const ROCvsPRVisual = () => {
  const [posRate, setPosRate] = useState(0.05);

  // Synthetic but principled curves: a "good" classifier with logit shift.
  // We generate ROC and PR curves as a function of decision threshold.
  const { rocData, prData, aucROC, aucPR } = useMemo(() => {
    const N = 5000;
    const numPos = Math.max(10, Math.floor(N * posRate));
    const numNeg = N - numPos;
    // Generate scores: positives ~ N(1.0, 1), negatives ~ N(0, 1)
    const rng = (() => { let s = 42; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; })();
    const gauss = (mu: number, sd: number) => {
      const u1 = Math.max(1e-9, rng());
      const u2 = rng();
      return mu + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    };
    const pos = Array.from({ length: numPos }, () => gauss(1.2, 1));
    const neg = Array.from({ length: numNeg }, () => gauss(0, 1));
    const all = [
      ...pos.map((s) => ({ s, y: 1 })),
      ...neg.map((s) => ({ s, y: 0 }))
    ].sort((a, b) => b.s - a.s);

    let tp = 0, fp = 0;
    const totalP = numPos;
    const totalN = numNeg;
    const roc = [{ fpr: 0, tpr: 0 }];
    const pr: { recall: number; precision: number }[] = [];
    let aucR = 0;
    let aucP = 0;
    let lastRecall = 0;
    let lastPrec = 1;
    let lastFPR = 0;
    let lastTPR = 0;
    all.forEach((d) => {
      if (d.y === 1) tp++; else fp++;
      const tpr = tp / totalP;
      const fpr = fp / totalN;
      const prec = tp / (tp + fp);
      const rec = tpr;
      // trapezoid for ROC
      aucR += ((fpr - lastFPR) * (tpr + lastTPR)) / 2;
      // step for PR
      aucP += (rec - lastRecall) * prec;
      roc.push({ fpr, tpr });
      pr.push({ recall: rec, precision: prec });
      lastFPR = fpr; lastTPR = tpr;
      lastRecall = rec; lastPrec = prec;
    });

    // Subsample for plotting
    const stride = Math.max(1, Math.floor(roc.length / 80));
    const rocS = roc.filter((_, i) => i % stride === 0);
    const prS = pr.filter((_, i) => i % stride === 0);
    return { rocData: rocS, prData: prS, aucROC: aucR.toFixed(3), aucPR: aucP.toFixed(3) };
  }, [posRate]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <label className="text-[13px]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: MUTED }}>
          Positive class rate:
        </label>
        <input
          type="range"
          min="0.01"
          max="0.5"
          step="0.01"
          value={posRate}
          onChange={(e) => setPosRate(parseFloat(e.target.value))}
          style={{ flex: '0 0 220px', accentColor: AMBER }}
        />
        <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 14, color: INK }}>
          {(posRate * 100).toFixed(0)}%
        </span>
        <span className="ml-auto text-[12px]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: MUTED }}>
          AUC-ROC: <span style={{ color: BLUE, fontWeight: 600, fontStyle: 'normal' }}>{aucROC}</span>
          {' · '}
          AUC-PR: <span style={{ color: CORAL, fontWeight: 600, fontStyle: 'normal' }}>{aucPR}</span>
          {' · '}
          PR baseline: <span style={{ color: MUTED }}>{posRate.toFixed(2)}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div style={{ height: 280 }}>
          <div className="text-[11px] tracking-wider mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: MUTED }}>
            ROC — TPR vs FPR
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rocData} margin={{ top: 10, right: 12, bottom: 28, left: 8 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--rule)" />
              <XAxis
                dataKey="fpr"
                type="number"
                domain={[0, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
                tickFormatter={(v) => v.toFixed(2)}
                style={{ fontFamily: 'Georgia, serif', fontSize: 10, fill: MUTED }}
                label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -10, style: { fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: MUTED } } as any}
              />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
                tickFormatter={(v) => v.toFixed(2)}
                style={{ fontFamily: 'Georgia, serif', fontSize: 10, fill: MUTED }}
                label={{ value: 'TPR (Recall)', angle: -90, position: 'insideLeft', style: { fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: MUTED, textAnchor: 'middle' } } as any}
              />
              <ReferenceLine
                segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                stroke={MUTED}
                strokeDasharray="3 3"
                ifOverflow="extendDomain"
              />
              <Line dataKey="tpr" stroke={BLUE} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ height: 280 }}>
          <div className="text-[11px] tracking-wider mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: MUTED }}>
            PR — Precision vs Recall
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prData} margin={{ top: 10, right: 12, bottom: 28, left: 8 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--rule)" />
              <XAxis
                dataKey="recall"
                type="number"
                domain={[0, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
                tickFormatter={(v) => v.toFixed(2)}
                style={{ fontFamily: 'Georgia, serif', fontSize: 10, fill: MUTED }}
                label={{ value: 'Recall', position: 'insideBottom', offset: -10, style: { fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: MUTED } } as any}
              />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
                tickFormatter={(v) => v.toFixed(2)}
                style={{ fontFamily: 'Georgia, serif', fontSize: 10, fill: MUTED }}
                label={{ value: 'Precision', angle: -90, position: 'insideLeft', style: { fontFamily: 'Georgia, serif', fontSize: 11, fontStyle: 'italic', fill: MUTED, textAnchor: 'middle' } } as any}
              />
              <ReferenceLine y={posRate} stroke={MUTED} strokeDasharray="3 3" />
              <Line dataKey="precision" stroke={CORAL} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 text-[12px] leading-[1.6]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: MUTED }}>
        Slide the positive rate down toward 1%. ROC barely flinches — FPR's denominator (TN+FP) absorbs the false positives. PR drops visibly, and the diagonal baseline (the dashed line in the right chart) sinks with it. PR is the honest curve under imbalance.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// VISUAL 7 — Reliability Diagram (interactive temperature scaling)
// ---------------------------------------------------------------------------
const ReliabilityVisual = () => {
  const [temperature, setTemperature] = useState(1.0);

  const data = useMemo(() => {
    // Simulate a typical overconfident neural net. Then apply temperature T.
    // Use 10 bins from 0..1. For each bin center p, define empirical accuracy
    // when T = 1 as monotone-below-diagonal (overconfident).
    const bins = Array.from({ length: 11 }, (_, i) => i / 10);
    return bins.map((p) => {
      // Underlying logit-style behaviour: actual = sigmoid(logit(p)/T)
      const clamped = Math.min(0.999, Math.max(0.001, p));
      const logit = Math.log(clamped / (1 - clamped));
      // Untempered: model is overconfident → effective scale ~ 1.6
      const realLogit = logit / 1.6;
      // Apply user temperature
      const tempered = realLogit / temperature;
      const acc = 1 / (1 + Math.exp(-tempered));
      return {
        confidence: p,
        accuracy: acc,
        perfect: p
      };
    });
  }, [temperature]);

  // Compute approximate ECE
  const ece = useMemo(() => {
    return (data.reduce((s, d) => s + Math.abs(d.confidence - d.accuracy), 0) / data.length).toFixed(3);
  }, [data]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <label className="text-[13px]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: MUTED }}>
          Temperature T:
        </label>
        <input
          type="range"
          min="0.5"
          max="3.0"
          step="0.05"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          style={{ flex: '0 0 220px', accentColor: AMBER }}
        />
        <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 14, color: INK }}>
          T = {temperature.toFixed(2)}
        </span>
        <span className="ml-auto text-[12px]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: MUTED }}>
          ECE ≈ <span style={{ color: temperature > 1.4 && temperature < 1.8 ? TEAL : CORAL, fontWeight: 600, fontStyle: 'normal' }}>{ece}</span>
        </span>
      </div>

      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 30, left: 8 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--rule)" />
            <XAxis
              dataKey="confidence"
              type="number"
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tickFormatter={(v) => v.toFixed(2)}
              style={{ fontFamily: 'Georgia, serif', fontSize: 10, fill: MUTED }}
              label={{ value: 'Predicted probability (confidence)', position: 'insideBottom', offset: -12, style: { fontFamily: 'Georgia, serif', fontSize: 12, fontStyle: 'italic', fill: MUTED } } as any}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tickFormatter={(v) => v.toFixed(2)}
              style={{ fontFamily: 'Georgia, serif', fontSize: 10, fill: MUTED }}
              label={{ value: 'Empirical accuracy', angle: -90, position: 'insideLeft', style: { fontFamily: 'Georgia, serif', fontSize: 12, fontStyle: 'italic', fill: MUTED, textAnchor: 'middle' } } as any}
            />
            <Tooltip
              contentStyle={{ fontFamily: 'Georgia, serif', fontSize: 12, background: 'var(--bg-sunken)', border: `1px solid ${RULE}` }}
              formatter={(v: any) => v.toFixed(3)}
            />
            <Line dataKey="perfect" stroke={MUTED} strokeDasharray="4 4" strokeWidth={1} dot={false} isAnimationActive={false} name="perfect" />
            <Line dataKey="accuracy" stroke={CORAL} strokeWidth={2.5} dot={{ r: 3, fill: CORAL }} isAnimationActive={false} name="model" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-[12px] leading-[1.6]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: MUTED }}>
        At T=1 the model sits below the diagonal — overconfident, the typical neural-net pattern. Raise T toward ~1.6 to soften the logits and watch the curve snap onto the diagonal. ECE bottoms out near there. Pushing T further makes the model underconfident.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main artifact
// ---------------------------------------------------------------------------
export default function EvaluationFundamentals() {
  return (
    <div style={{ background: PAPER, minHeight: '100vh', color: INK }} className="w-full">
      <div className="mx-auto py-16">
        {/* ============ SECTION 1: SPLITS ============ */}
        <Section id="splits" eyebrow="§1 — Foundations" title="The three sets and their three jobs">
          <Prose>
            <p>
              Three sets exist for one reason: <em>every dataset you make decisions on becomes
              contaminated by those decisions.</em> If you tune the learning rate based on test
              performance, your reported test number is no longer an unbiased estimate of
              generalization — it's an estimate of how well the configuration you happened
              to choose works on those specific examples. The fix is structural separation,
              not willpower.
            </p>
            <p>
              The split has a strict hierarchy. <strong style={{ fontWeight: 600 }}>Training data</strong> is
              what the optimizer sees: loss is computed and backpropagated here.
              <strong style={{ fontWeight: 600 }}> Validation data</strong> is what you (the human) see: it
              informs which learning rate to use, when to stop, which architecture to pick,
              whether a regularization trick helped. <strong style={{ fontWeight: 600 }}>Test data</strong> is
              what nobody sees until the final number is reported. Once you've looked at the
              test set and changed anything in response, that test set is burned. It is no
              longer unbiased. There is no recovery short of collecting more data.
            </p>
          </Prose>

          <VizFrame caption="The asymmetry of who sees what is the entire point. Backprop runs on train. You read scores on val. Test sits in a vault.">
            <SplitVisual />
          </VizFrame>

          <Prose>
            <p>
              Common ratios are 70/15/15 or 80/10/10 for medium-sized datasets, and as
              extreme as 98/1/1 on very large datasets — a 1% slice of ten million examples
              is a hundred thousand examples, more than enough validation signal. For tiny
              datasets (under ~10,000 rows), the convention shifts: you typically skip the
              val/test split entirely and use cross-validation, which we'll get to next.
            </p>
          </Prose>

          <Aside label="The failure mode that voids your evaluation">
            <p className="mb-3"><strong>Data leakage</strong> is what happens when information from one set bleeds into another. The forms to watch for:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><em>Target leakage:</em> a feature that wouldn't be available at prediction time. The textbook case — using <Code>account_closed_date</Code> as a feature to predict churn.</li>
              <li><em>Temporal leakage:</em> shuffling time-series data so the model trains on the future and predicts the past. Always feels like cheating once you find it, and you usually find it because your test scores are mysteriously perfect.</li>
              <li><em>Group leakage:</em> the same patient/user/document appearing in both train and test under different rows. The model memorizes the entity, not the pattern.</li>
              <li><em>Preprocessing leakage:</em> fitting the scaler, imputer, or PCA on the full dataset <em>before</em> splitting. The training statistics now contain test information. Always fit on train, then transform val and test using those statistics. <Code>sklearn.pipeline.Pipeline</Code> enforces this for you.</li>
              <li><em>Duplicate leakage:</em> near-duplicate rows across splits. Pervasive in scraped data and recommendation logs.</li>
            </ul>
          </Aside>
        </Section>

        {/* ============ SECTION 2: K-FOLD ============ */}
        <Section id="kfold" eyebrow="§2 — Variance reduction" title="k-fold cross-validation">
          <Prose>
            <p>
              A single train/val split gives you one number. But that number is at the
              mercy of one particular partitioning of your data — an unlucky shuffle can
              swing reported accuracy by several percentage points. Cross-validation
              attacks the variance of the <em>estimate</em>, not the model.
            </p>
            <p>
              The procedure is mechanical. Partition the data into <MathSpan>k</MathSpan> roughly
              equal folds. For each fold <MathSpan>i</MathSpan>, train on the other <MathSpan>k−1</MathSpan>
              folds and evaluate on fold <MathSpan>i</MathSpan>. You end up with <MathSpan>k</MathSpan>
              scores. Report the mean and standard deviation. Every example serves as
              validation exactly once.
            </p>
          </Prose>

          <VizFrame caption="Five training runs, five validation scores. The mean is your point estimate; the spread is your honesty about how much it could have wobbled.">
            <KFoldVisual />
          </VizFrame>

          <Prose>
            <p>
              <strong>Choice of <MathSpan>k</MathSpan>.</strong> Five and ten are the conventional
              picks, and the choice itself involves a bias–variance tradeoff in the
              <em> performance estimate</em> (distinct from the bias–variance of the model).
              Larger <MathSpan>k</MathSpan> means each training fold is closer to the full dataset,
              so the bias of the estimate is lower — but the folds overlap heavily, which
              raises the variance of the estimate. Smaller <MathSpan>k</MathSpan> gives more
              independent folds and lower variance, but each training set is meaningfully
              smaller and the estimate is more biased pessimistically. Leave-one-out CV
              (<MathSpan>k = n</MathSpan>) is the extreme: nearly unbiased, very high variance,
              and computationally brutal.
            </p>
            <p>
              <strong>Why the roadmap says "classical ML only, not for DL at scale."</strong>
              Training a deep model 5 to 10 times to do CV is usually prohibitive — a ResNet
              on ImageNet or a 7B fine-tune costs too much to repeat. Also, large datasets
              give you enough validation signal from a single fixed split that CV's
              variance reduction earns little. CV is still common in deep learning on
              <em> small datasets</em>: medical imaging, scientific applications,
              low-resource NLP. The honest formulation is: CV's cost scales linearly with
              training cost, so use it when training is cheap relative to the variance
              reduction you need.
            </p>
            <p>
              <strong>Nested CV</strong> is the gold standard when sample size is small and
              the temptation to overfit hyperparameters to a single validation set is real.
              An outer loop estimates generalization, and an inner loop tunes
              hyperparameters within each outer fold. Computationally expensive — for
              <MathSpan>k</MathSpan> outer folds and <MathSpan>m</MathSpan> inner folds you train roughly
              <MathSpan> k · m</MathSpan> times — but the only honest way to report generalization
              when hyperparameter choice is itself data-driven.
            </p>
          </Prose>
        </Section>

        {/* ============ SECTION 3: VARIANTS ============ */}
        <Section id="variants" eyebrow="§3 — Variants" title="Stratified, time-series, and group">
          <Prose>
            <p>
              Vanilla k-fold draws folds uniformly at random. That's wrong in three common
              situations. Each variant fixes one specific way naive splitting lies to you.
            </p>
          </Prose>

          <VizFrame caption="Three CV variants, each plugging one leakage pathway: class balance drift, temporal flow, and entity identity.">
            <CVVariantsVisual />
          </VizFrame>

          <Prose>
            <p>
              <strong>Stratified k-fold</strong> is the default for any classification
              problem unless you have a specific reason otherwise. Random folds on
              imbalanced data drift in class proportion — sometimes badly enough that some
              folds can't even learn the minority class. <Code>StratifiedKFold</Code>
              preserves the class ratio in every fold. For regression with a skewed
              target, stratify on binned target values.
            </p>
            <p>
              <strong>Time-series split</strong> is forbidden ground for shuffling. Sort by
              time. Use the earliest segment as train, the next segment as validation,
              then slide forward. <Code>sklearn.model_selection.TimeSeriesSplit</Code> does
              this. The variant choice — <em>expanding window</em> (training set grows each
              step, mimicking how you'd retrain a production model) versus
              <em> rolling window</em> (training set stays a fixed size, mimicking
              distributions that drift) — depends on whether old data helps or hurts.
            </p>
            <p>
              A subtler issue is the <strong>gap/purge</strong> parameter. If your
              prediction horizon is five days and your features include five-day rolling
              statistics, then training data within five days of your validation cutoff
              contains information about the validation period. You need a buffer.
              Marcos López de Prado's <em>purged k-fold with embargo</em> formalizes this
              for financial data, and the same logic applies whenever features integrate
              information over time.
            </p>
            <p>
              <strong>Group k-fold</strong> handles natural groupings — multiple rows per
              patient, multiple sentences per document, multiple measurements per
              experiment. Splitting at the row level lets the model memorize the entity
              rather than learn the pattern. <Code>GroupKFold</Code> ensures every group
              appears in exactly one fold. <Code>StratifiedGroupKFold</Code> combines both
              constraints, though satisfying both perfectly is harder and sklearn
              approximates.
            </p>
            <p>
              This idea recurs in chemistry as <strong>scaffold splits</strong> (Murcko
              scaffolds), which group molecules by their core ring system. Random splits
              over molecules leak heavily because near-identical molecules end up in both
              train and test. Models look much worse under scaffold splits than random
              ones, and the scaffold-split number is the honest one — a fact that becomes
              load-bearing in Phase 7 biopharma work.
            </p>
          </Prose>
        </Section>

        {/* ============ SECTION 4: CONFUSION MATRIX ============ */}
        <Section id="matrix" eyebrow="§4 — Anatomy" title="The confusion matrix">
          <Prose>
            <p>
              Almost every classification metric is a ratio of cells in a 2×2 table.
              Understanding the matrix once buys you precision, recall, specificity, F1,
              all of accuracy's relatives, and the geometry behind ROC and PR curves.
            </p>
          </Prose>

          <VizFrame caption="Hover any cell or metric to see which cells it consumes. Precision lives in the left column; recall lives in the top row.">
            <ConfusionMatrixVisual />
          </VizFrame>

          <Prose>
            <p>
              <strong>The four cells.</strong> True positive (TP) and true negative (TN)
              are correct decisions. False positive (FP) — a "false alarm" — and false
              negative (FN) — a "miss" — are the two ways to be wrong, with usually
              asymmetric costs.
            </p>
            <p>
              <strong>The derived quantities.</strong> Precision asks "of what I flagged,
              what fraction was right?" — its denominator is what you predicted positive.
              Recall (sensitivity, true positive rate) asks "of all actual positives, how
              many did I catch?" — its denominator is what was actually positive.
              Specificity is recall for the negative class. F1 is the harmonic mean of
              precision and recall, which penalizes the lower of the two — useful when
              you need both to be decent. F-beta generalizes this; <MathSpan>β &gt; 1</MathSpan>
              weights recall more, <MathSpan>β &lt; 1</MathSpan> weights precision more, used
              when FN and FP have known asymmetric costs.
            </p>
            <p>
              <strong>Multiclass averaging.</strong> For more than two classes you
              compute per-class metrics and average them. <em>Macro</em> takes a simple
              mean — each class counts equally regardless of size, which gives small
              classes a voice. <em>Micro</em> pools TP/FP/FN across classes before
              computing — dominated by frequent classes, and for single-label multiclass
              classification micro-F1 equals accuracy. <em>Weighted</em> is macro
              weighted by support — a compromise, but it hides poor minority-class
              performance the same way accuracy does. Macro is usually the right default.
            </p>
          </Prose>
        </Section>

        {/* ============ SECTION 5: IMBALANCE ============ */}
        <Section id="imbalance" eyebrow="§5 — The trap" title="Why accuracy lies under imbalance">
          <Prose>
            <p>
              The canonical example: one percent of credit card transactions are fraud.
              A classifier that always predicts "not fraud" gets 99% accuracy and is
              worthless. Accuracy is a weighted average over classes — and the weights
              are the class proportions themselves, so the majority class drags the
              number wherever it wants.
            </p>
          </Prose>

          <VizFrame caption="The huge true-negative pile drowns out the catastrophic false-negative count. Accuracy says 99%; recall says zero; F1 says zero.">
            <ImbalanceVisual />
          </VizFrame>

          <Prose>
            <p>
              The asymmetry of the picture is the lesson. There are roughly a hundred TN
              for every actual positive, so any metric whose denominator pools positives
              and negatives together inherits that imbalance and reports majority-class
              behaviour. The escape is to use metrics whose denominators are <em>per
              class</em>: precision, recall, F1, AUC-PR — or metrics that bake in cost
              asymmetry directly.
            </p>
            <p>
              <strong>What to report instead</strong> depends on the asymmetry of your
              errors:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>F1 (or per-class precision and recall)</strong> when both kinds of error matter and you want a single summary. Be explicit about which class you compute F1 for — in <Code>sklearn</Code> this is the <Code>pos_label</Code> argument.</li>
              <li><strong>F-beta</strong> when FN and FP have known asymmetric costs.</li>
              <li><strong>AUC-PR</strong> when ranking quality on the positive class matters more than raw threshold performance.</li>
              <li><strong>Recall at fixed precision (or vice versa)</strong> when there's an operational constraint: "we can investigate 100 cases per day, what fraction of fraud do we catch?"</li>
            </ul>
          </Prose>

          <Aside label="Training under imbalance (separate from evaluation)">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Class weights</strong> in the loss — <Code>class_weight="balanced"</Code> in sklearn, the <Code>weight</Code> argument in PyTorch losses. Cheapest, often sufficient.</li>
              <li><strong>Oversampling</strong> the minority — random oversampling or SMOTE / ADASYN, which interpolate between minority neighbors. SMOTE is the textbook mention but is fragile with high-dimensional or noisy data.</li>
              <li><strong>Undersampling</strong> the majority — throws information away, works when the majority is highly redundant.</li>
              <li><strong>Threshold tuning</strong> — train normally, move the decision threshold to optimize your operational metric. Often the simplest thing that works.</li>
              <li><strong>Anomaly detection reframing</strong> — when the minority is extremely rare and labels are unreliable, isolation forests, one-class SVMs, or autoencoder reconstruction error can outperform standard classifiers.</li>
              <li><strong>Cost-sensitive learning</strong> — bake FN/FP costs into the loss directly. Cleaner than class weights when costs are explicitly known.</li>
            </ul>
          </Aside>
        </Section>

        {/* ============ SECTION 6: ROC vs PR ============ */}
        <Section id="rocpr" eyebrow="§6 — Threshold-free metrics" title="ROC and PR under imbalance">
          <Prose>
            <p>
              Most classifiers output a continuous score, and a threshold turns that
              score into a class label. Sweeping the threshold from 0 to 1 traces a
              curve. The two curves people draw are ROC (TPR vs FPR) and PR (precision
              vs recall). Both summarise <em>ranking</em> rather than any single
              threshold choice.
            </p>
            <p>
              <strong>AUC-ROC</strong> has a clean probabilistic interpretation: the
              probability that a randomly chosen positive example is scored higher than
              a randomly chosen negative. 0.5 is random; 1.0 is perfect.
              <strong> AUC-PR</strong> (sometimes called average precision) is the area
              under the precision-recall curve.
            </p>
            <p>
              The two often agree, but they diverge dramatically under imbalance — and
              the divergence is the most important thing to internalize from this
              section. Slide the positive rate below:
            </p>
          </Prose>

          <VizFrame caption="Drag the positive rate toward 1%. ROC barely changes — FPR's denominator (TN+FP) absorbs the false alarms. PR collapses, and its baseline (the dashed horizontal line) drops to match the class rate. PR is the honest curve when positives are rare.">
            <ROCvsPRVisual />
          </VizFrame>

          <Prose>
            <p>
              <strong>Why ROC misleads under imbalance.</strong> Look at the x-axis:
              FPR = FP / (FP + TN). When the negative class is huge, the denominator is
              huge, so even a flood of false positives barely moves FPR. You can have a
              model that produces ten times more false positives than true positives and
              still see an AUC-ROC of 0.95 — because there are a million negatives,
              those false positives barely register on the axis.
            </p>
            <p>
              PR doesn't have this masking property. Precision = TP / (TP + FP) is
              directly hurt by every false positive. PR curves are the honest summary
              when positives are scarce. Rule of thumb: if your positive rate is below
              roughly 10%, report AUC-PR alongside or instead of AUC-ROC. The Saito and
              Rehmsmeier (2015) paper is the standard reference making this case.
            </p>
            <p>
              <strong>The baseline matters.</strong> AUC-ROC has a constant baseline of
              0.5 (random). AUC-PR's baseline is the positive class proportion — a 1%
              positive rate means a random classifier scores AUC-PR ≈ 0.01. Always
              report against the appropriate baseline; a 0.4 AUC-PR is poor at 50%
              positives and excellent at 1% positives.
            </p>
          </Prose>
        </Section>

        {/* ============ SECTION 7: CALIBRATION ============ */}
        <Section id="calibration" eyebrow="§7 — A separate property" title="Calibration and reliability">
          <Prose>
            <p>
              A model is <strong>calibrated</strong> if, among examples it predicts with
              probability <MathSpan>p</MathSpan>, the actual fraction of positives is
              approximately <MathSpan>p</MathSpan>. A weather forecaster who says "70% chance of
              rain" is calibrated if it rains on roughly 70% of such days. Calibration is
              <em> separate</em> from accuracy — a model can be very accurate but
              systematically overconfident, and that breaks any downstream system that
              consumes the probability as a probability rather than just a ranking.
            </p>
            <p>
              A <strong>reliability diagram</strong> makes this visible. Bin predictions
              by predicted probability, then for each bin plot mean predicted probability
              on x against empirical accuracy on y. A perfectly calibrated model traces
              the diagonal. Above the diagonal means underconfident; below means
              overconfident.
            </p>
          </Prose>

          <VizFrame caption="Adjust the temperature T. Untreated (T=1) the model is overconfident — when it says 0.9, real accuracy is closer to 0.7. Temperature scaling divides the logits by T; near T≈1.6 the curve snaps onto the diagonal and ECE bottoms out.">
            <ReliabilityVisual />
          </VizFrame>

          <Prose>
            <p>
              <strong>Expected Calibration Error</strong> (ECE) quantifies the gap as a
              weighted average of vertical distances from the diagonal:
              <MathSpan> ECE = Σ<sub>b</sub> (|B<sub>b</sub>|/n) · |acc(B<sub>b</sub>) − conf(B<sub>b</sub>)|</MathSpan>.
              Lower is better, zero is perfect. ECE is binning-sensitive (number of bins
              matters) and ignores accuracy entirely (a constant predictor of the base
              rate is perfectly calibrated but useless), so pair it with a proper scoring
              rule.
            </p>
            <p>
              <strong>Proper scoring rules</strong> are single-number metrics that reward
              calibration and sharpness simultaneously. <strong>Brier score</strong> is
              the mean squared error between predicted probabilities and labels.
              <strong> Log loss</strong> (negative log-likelihood, cross-entropy) is what
              you train on, and it is a perfectly valid evaluation metric. Both are
              minimized only when you report your true predictive distribution honestly —
              that is what "proper" means formally.
            </p>
            <p>
              <strong>Why neural nets are usually miscalibrated.</strong> Modern deep
              networks trained with cross-entropy on large datasets become
              <em> overconfident</em> — they push logits toward extreme values to
              minimize loss on confident examples. Guo et al. (2017), "On Calibration of
              Modern Neural Networks," is the standard reference.
            </p>
            <p>
              <strong>Post-hoc calibration methods</strong>, applied on a held-out
              calibration set:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Temperature scaling</strong> — divide logits by a single scalar T before softmax. T &gt; 1 softens distributions. ~30 lines of code, surprisingly often the only thing you need.</li>
              <li><strong>Platt scaling</strong> — fit a logistic regression on the model's scores. Two parameters (a, b in σ(a · score + b)).</li>
              <li><strong>Isotonic regression</strong> — nonparametric monotonic mapping. More flexible, needs more data, can overfit.</li>
              <li><strong>Beta calibration, histogram binning</strong> — alternatives for specific situations.</li>
            </ul>
            <p>
              Calibration matters whenever a downstream system consumes probabilities as
              decision inputs: setting thresholds for medical screening, sizing financial
              positions, deferring to humans in human-AI teams, abstention in selective
              prediction. In your Phase 7 biopharma work, miscalibrated uncertainty
              ruins Bayesian optimization — BO treats the predicted property
              <em> and</em> its uncertainty as inputs to the acquisition function, and
              wrong uncertainty means BO either over-explores or gets stuck.
            </p>
          </Prose>
        </Section>

        {/* ============ SECTION 8: THE THREAD ============ */}
        <Section id="thread" eyebrow="§8 — Synthesis" title="The unified thread">
          <Prose>
            <p>
              Every visual in this document is a different way of asking the same
              question: <em>is your evaluation telling you the truth?</em> The whole
              evaluation stack is a set of structural countermeasures against specific
              ways the answer can be "no."
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Train/val/test splits</strong> prevent the optimizer from peeking at what it's being graded on.</li>
              <li><strong>Stratified / time-series / group variants</strong> prevent leakage through class proportion, temporal flow, and entity identity respectively.</li>
              <li><strong>Cross-validation</strong> reduces the variance of the estimate by rotating which slice plays the validation role.</li>
              <li><strong>The confusion matrix</strong> breaks accuracy into its load-bearing components, exposing where the model actually fails.</li>
              <li><strong>The imbalance trap</strong> reveals how a single summary statistic can hide catastrophic minority-class failure.</li>
              <li><strong>ROC vs PR</strong> reveals which curve is robust to the class proportion in your data and which is a polite lie.</li>
              <li><strong>Calibration and reliability</strong> reveal whether the probabilities you report mean what they say.</li>
            </ul>
            <p>
              The roadmap's one-liner — <em>"Train / val / test split. Never train on
              test."</em> — collapses all of this into seven words. The seven words are
              true but they're a slogan, not the lesson. The lesson is that evaluation
              is itself a model — a model of how well your model generalizes — and that
              every shortcut in evaluation shows up later as a number you can't trust.
            </p>
          </Prose>

          <div
            className="mt-12 p-8 rounded-lg"
            style={{
              background: 'var(--bg-sunken)',
              color: 'var(--ink)',
              fontFamily: 'Georgia, serif',
              border: `1px solid ${RULE}`
            }}
          >
            <div
              className="text-[11px] tracking-[0.3em] uppercase mb-4"
              style={{ color: AMBER_LIGHT, fontStyle: 'italic' }}
            >
              For your Phase 1 builds
            </div>
            <p className="text-[16px] leading-[1.75]">
              Stratified k-fold on the Kaggle tabular build. F1 and AUC-PR if any class
              imbalance is present. Log-loss as both training signal and reported
              evaluation. A calibration check at the end if probabilities will be
              consumed downstream. For DistilBERT, a single train/val/test split is
              fine — document the split and report macro-F1 on test, not accuracy.
              These choices alone separate evaluation that informs from evaluation that
              flatters.
            </p>
          </div>
        </Section>

        {/* Footer */}
        <footer
          className="mt-32 pt-10 pb-4 flex items-baseline justify-between text-[11px] tracking-wider"
          style={{ borderTop: `2px solid ${RULE}`, fontFamily: 'Georgia, serif', color: MUTED }}
        >
          <span style={{ fontStyle: 'italic' }}>ML &amp; LLM Mastery · Phase 1 supplement</span>
          <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>fin.</span>
        </footer>
      </div>
    </div>
  );
}
