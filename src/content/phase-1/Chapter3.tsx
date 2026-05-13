import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ReferenceLine, ResponsiveContainer, Tooltip
} from 'recharts';
import { Play, RotateCcw, Activity } from 'lucide-react';
import { ChapterDivider } from "@/components/book/ChapterDivider";

const COLORS = {
  blue: '#378ADD',
  green: '#1D9E75',
  coral: '#D85A30',
  amber: '#EF9F27',
  purple: '#7F77DD',
  gray: '#B4B2A9',
  darkGray: '#5F5E5A',
  text: 'var(--ink)',
  muted: 'var(--ink-3)',
  surface: 'var(--bg-sunken)',
  border: 'var(--rule)',
  accent: 'var(--amber)',
};

function Section({ id, title, kicker, children }: any) {
  return (
    <section id={id} className="py-12 border-t border-[var(--rule)] first:border-t-0 scroll-mt-24">
      <div className="mb-6">
        {kicker && (
          <div className="text-xs uppercase tracking-widest text-[var(--amber)] font-medium mb-2">
            {kicker}
          </div>
        )}
        <h2 className="text-3xl p1-serif text-[var(--ink)] tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function VizFrame({ children, caption }: any) {
  return (
    <div className="my-8">
      <div className="bg-[var(--bg-sunken)] border border-[var(--rule)] rounded-lg p-5">
        {children}
      </div>
      {caption && (
        <p className="text-sm text-[var(--ink-3)] mt-3 italic px-1">{caption}</p>
      )}
    </div>
  );
}

function Button({ onClick, active, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 text-sm rounded-md border transition-colors ${
        active
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
          : 'bg-[var(--bg-elev)] border-[var(--rule)] text-[var(--ink-2)] hover:bg-[var(--bg-sunken)]'
      }`}
    >
      {children}
    </button>
  );
}

function Legend({ items }: any) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {items.map((it: any) => (
        <span key={it.label} className="flex items-center gap-2 text-sm text-[var(--ink-2)]">
          <span
            className="inline-block rounded-sm"
            style={{
              width: 18,
              height: 3,
              background: it.color,
              backgroundImage: it.dash
                ? `repeating-linear-gradient(90deg, ${it.color} 0 ${it.dash[0]}px, transparent ${it.dash[0]}px ${it.dash[0] + it.dash[1]}px)`
                : undefined,
            }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}

function ArchitectureViz() {
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const mlpLayers = useMemo(() => [
    { x: 120, ys: [70, 100, 130] },
    { x: 300, ys: [55, 80, 105, 130] },
    { x: 480, ys: [55, 80, 105, 130] },
    { x: 640, ys: [80, 115] },
  ], []);

  useEffect(() => {
    if (!running) return;
    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 1;
      setTick(step);
      if (step > 25) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
        setTimeout(() => setTick(0), 600);
      }
    }, 220);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const mlpActiveLayer = tick > 0 && tick <= 8 ? Math.min(Math.floor((tick - 1) / 2), 3) : -1;

  const cnnStep = tick >= 9 && tick <= 24 ? tick - 9 : -1;
  const cnnRow = cnnStep >= 0 ? Math.floor(cnnStep / 4) : -1;
  const cnnCol = cnnStep >= 0 ? cnnStep % 4 : -1;

  const rnnStep = tick >= 1 && tick <= 8 ? Math.min(Math.floor((tick - 1) / 2), 3) : -1;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => !running && setRunning(true)}
          disabled={running}
          className="flex items-center gap-2 px-3.5 py-1.5 text-sm rounded-md border border-[var(--rule)] bg-[var(--bg-elev)] hover:bg-[var(--bg-sunken)] disabled:opacity-50"
        >
          <Play size={14} /> Play forward pass
        </button>
        <span className="text-xs text-[var(--ink-3)]">Watch how signal propagates in each architecture</span>
      </div>

      <div className="border-t border-[var(--rule)] pt-4">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-y-hidden pb-4 -mb-4"><svg viewBox="0 0 680 170" className="block w-full min-w-[680px]">
          <text x="20" y="22" fontSize="13" fontWeight="500" fill={COLORS.muted}>MLP</text>
          <text x="20" y="40" fontSize="12" fill="var(--ink-3)">fully connected</text>
          {mlpLayers.slice(0, -1).map((A, li) =>
            A.ys.map((ay, ai) =>
              mlpLayers[li + 1].ys.map((by, bi) => {
                const on = li < mlpActiveLayer;
                return (
                  <line
                    key={`e-${li}-${ai}-${bi}`}
                    x1={A.x + 7} y1={ay}
                    x2={mlpLayers[li + 1].x - 7} y2={by}
                    stroke={on ? COLORS.amber : COLORS.border}
                    strokeWidth={on ? 1.3 : 0.7}
                    opacity={on ? 0.85 : 0.4}
                    style={{ transition: 'all 0.4s ease' }}
                  />
                );
              })
            )
          )}
          {mlpLayers.map((L, li) =>
            L.ys.map((y, i) => (
              <circle
                key={`n-${li}-${i}`}
                cx={L.x} cy={y} r={7}
                fill={li <= mlpActiveLayer ? COLORS.amber : COLORS.gray}
                style={{ transition: 'fill 0.4s ease' }}
              />
            ))
          )}
          {['input', 'hidden', 'hidden', 'output'].map((lbl, i) => (
            <text key={lbl + i} x={mlpLayers[i].x} y={160} fontSize="12" fill={COLORS.muted} textAnchor="middle">{lbl}</text>
          ))}
        </svg></div>
      </div>

      <div className="border-t border-[var(--rule)] pt-4">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-y-hidden pb-4 -mb-4"><svg viewBox="0 0 680 250" className="block w-full min-w-[680px]">
          <text x="20" y="22" fontSize="13" fontWeight="500" fill={COLORS.muted}>CNN</text>
          <text x="20" y="40" fontSize="12" fill="var(--ink-3)">shared filter</text>
          {Array.from({ length: 36 }).map((_, idx) => {
            const r = Math.floor(idx / 6), c = idx % 6;
            const cs = 28, ix0 = 160, iy0 = 55;
            const active = cnnRow >= 0 && r >= cnnRow && r < cnnRow + 3 && c >= cnnCol && c < cnnCol + 3;
            return (
              <rect
                key={`in-${idx}`}
                x={ix0 + c * cs + 1} y={iy0 + r * cs + 1}
                width={cs - 2} height={cs - 2} rx={2}
                fill={active ? COLORS.accent : COLORS.surface}
                stroke={COLORS.gray} strokeWidth={0.5}
                style={{ transition: 'fill 0.2s ease' }}
              />
            );
          })}
          {cnnRow >= 0 && (
            <rect
              x={160 + cnnCol * 28} y={55 + cnnRow * 28}
              width={82} height={82} rx={3}
              fill="none" stroke={COLORS.coral} strokeWidth={2.2}
              style={{ transition: 'all 0.18s ease-out' }}
            />
          )}
          {Array.from({ length: 16 }).map((_, idx) => {
            const r = Math.floor(idx / 4), c = idx % 4;
            const cs = 28, ox0 = 440, oy0 = 83;
            const computed = cnnRow >= 0 && (r < cnnRow || (r === cnnRow && c <= cnnCol));
            return (
              <rect
                key={`out-${idx}`}
                x={ox0 + c * cs + 1} y={oy0 + r * cs + 1}
                width={cs - 2} height={cs - 2} rx={2}
                fill={computed ? COLORS.amber : COLORS.surface}
                stroke={COLORS.gray} strokeWidth={0.5}
                style={{ transition: 'fill 0.3s ease' }}
              />
            );
          })}
          <text x="244" y="240" fontSize="12" fill={COLORS.muted} textAnchor="middle">6×6 input</text>
          <text x="520" y="240" fontSize="12" fill={COLORS.muted} textAnchor="middle">4×4 output map</text>
        </svg></div>
      </div>

      <div className="border-t border-[var(--rule)] pt-4">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-y-hidden pb-4 -mb-4"><svg viewBox="0 0 680 170" className="block w-full min-w-[680px]">
          <defs>
            <marker id="arr-rnn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke={COLORS.darkGray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          <text x="20" y="22" fontSize="13" fontWeight="500" fill={COLORS.muted}>RNN</text>
          <text x="20" y="40" fontSize="12" fill="var(--ink-3)">sequential, shared weights</text>
          {[0, 1, 2, 3].map((t) => {
            const x = 110 + t * 150;
            const inActive = t === rnnStep;
            const hActive = t <= rnnStep;
            const recActive = t < rnnStep;
            return (
              <g key={`rnn-${t}`}>
                <rect x={x - 18} y={118} width={36} height={26} rx={4}
                  fill={inActive ? COLORS.accent : COLORS.surface}
                  stroke={COLORS.gray} strokeWidth={0.5}
                  style={{ transition: 'fill 0.3s' }} />
                <text x={x} y={131} fontSize="12" fill={COLORS.muted} textAnchor="middle" dominantBaseline="central">
                  x<tspan dy="3" fontSize="9">{t + 1}</tspan>
                </text>
                <line x1={x} y1={118} x2={x} y2={94}
                  stroke={COLORS.darkGray} strokeWidth="1" markerEnd="url(#arr-rnn)" />
                <rect x={x - 24} y={66} width={48} height={28} rx={4}
                  fill={hActive ? COLORS.accent : COLORS.surface}
                  stroke={COLORS.gray} strokeWidth={0.5}
                  style={{ transition: 'fill 0.3s' }} />
                <text x={x} y={80} fontSize="12" fill={COLORS.muted} textAnchor="middle" dominantBaseline="central">
                  h<tspan dy="3" fontSize="9">{t + 1}</tspan>
                </text>
                {t < 3 && (
                  <line x1={x + 24} y1={80} x2={x + 150 - 24} y2={80}
                    stroke={COLORS.purple} strokeWidth={recActive ? 2 : 1.4}
                    opacity={recActive ? 1 : 0.35}
                    markerEnd="url(#arr-rnn)"
                    style={{ transition: 'all 0.4s' }} />
                )}
              </g>
            );
          })}
          <text x="340" y="158" fontSize="12" fill={COLORS.muted} textAnchor="middle">hidden state passes through time →</text>
        </svg></div>
      </div>
    </div>
  );
}

function ActivationViz() {
  const [x, setX] = useState(0.8);

  const data = useMemo(() => {
    const arr = [];
    for (let i = -4; i <= 4.0001; i += 0.05) {
      const v = Math.round(i * 100) / 100;
      const relu = Math.max(0, v);
      const gelu = 0.5 * v * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (v + 0.044715 * v ** 3)));
      const swish = v * (1 / (1 + Math.exp(-v)));
      arr.push({ x: v, relu, gelu, swish });
    }
    return arr;
  }, []);

  const relu = Math.max(0, x);
  const gelu = 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));
  const swish = x * (1 / (1 + Math.exp(-x)));

  return (
    <div className="space-y-4">
      <Legend items={[
        { label: 'ReLU', color: COLORS.blue },
        { label: 'GELU', color: COLORS.green, dash: [5, 4] },
        { label: 'Swish (SwiGLU inner)', color: COLORS.coral, dash: [2, 3] },
      ]} />

      <div className="flex items-center gap-3">
        <label className="text-sm text-[var(--ink-2)] min-w-[54px]">input x</label>
        <input
          type="range" min={-4} max={4} step={0.05} value={x}
          onChange={(e) => setX(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm font-medium tabular-nums min-w-[54px] text-right">{x.toFixed(2)}</span>
      </div>

      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 -mb-4"><div style={{ width: '100%', minWidth: '500px', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.07)" />
            <XAxis dataKey="x" type="number" domain={[-4, 4]} tick={{ fontSize: 11, fill: COLORS.muted }} />
            <YAxis domain={[-1.5, 4.5]} tick={{ fontSize: 11, fill: COLORS.muted }} />
            <ReferenceLine y={0} stroke="rgba(0,0,0,0.3)" />
            <ReferenceLine x={x} stroke="rgba(120,120,120,0.55)" strokeDasharray="4 3" />
            <Line type="monotone" dataKey="relu" stroke={COLORS.blue} strokeWidth={2.2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="gelu" stroke={COLORS.green} strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="swish" stroke={COLORS.coral} strokeWidth={2} strokeDasharray="2 3" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md p-3">
          <div className="text-xs text-[var(--ink-3)] mb-1">ReLU(x)</div>
          <div className="text-xl font-medium tabular-nums">{relu.toFixed(2)}</div>
          <div className="text-xs text-[var(--ink-3)] mt-1">max(0, x)</div>
        </div>
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md p-3">
          <div className="text-xs text-[var(--ink-3)] mb-1">GELU(x)</div>
          <div className="text-xl font-medium tabular-nums">{gelu.toFixed(2)}</div>
          <div className="text-xs text-[var(--ink-3)] mt-1">x · Φ(x)</div>
        </div>
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md p-3">
          <div className="text-xs text-[var(--ink-3)] mb-1">Swish(x)</div>
          <div className="text-xl font-medium tabular-nums">{swish.toFixed(2)}</div>
          <div className="text-xs text-[var(--ink-3)] mt-1">x · σ(x)</div>
        </div>
      </div>
    </div>
  );
}

function NormalizationViz() {
  const original = useMemo(() => [
    [2.1, -0.8, 4.2, 1.3, -1.5, 3.0],
    [0.4, 1.9, -2.3, 2.8, 0.7, -0.5],
    [3.5, -1.2, 1.8, -0.4, 2.4, 1.1],
    [-0.9, 2.6, 0.5, 3.7, -0.3, 2.2],
  ], []);

  const [mode, setMode] = useState('batch');
  const [applied, setApplied] = useState(false);

  const colorFor = (v: any) => {
    const t = Math.max(0, Math.min(1, (v + 3) / 7));
    let r, g, b;
    if (t < 0.5) {
      const k = t / 0.5;
      r = Math.round(230 + (255 - 230) * k);
      g = Math.round(241 + (255 - 241) * k);
      b = Math.round(251 + (255 - 251) * k);
    } else {
      const k = (t - 0.5) / 0.5;
      r = Math.round(250 + (239 - 250) * k);
      g = Math.round(199 + (159 - 199) * k);
      b = Math.round(117 + (39 - 117) * k);
    }
    return `rgb(${r},${g},${b})`;
  };

  const normalized = useMemo(() => {
    const out = original.map((r) => r.slice());
    const eps = 1e-5;
    if (mode === 'batch') {
      for (let c = 0; c < 6; c++) {
        const col = original.map((r) => r[c]);
        const mean = col.reduce((a, b) => a + b, 0) / 4;
        const v = col.reduce((a, b) => a + (b - mean) ** 2, 0) / 4;
        const s = Math.sqrt(v + eps);
        for (let r = 0; r < 4; r++) out[r][c] = (original[r][c] - mean) / s;
      }
    } else if (mode === 'layer') {
      for (let r = 0; r < 4; r++) {
        const row = original[r];
        const mean = row.reduce((a, b) => a + b, 0) / 6;
        const v = row.reduce((a, b) => a + (b - mean) ** 2, 0) / 6;
        const s = Math.sqrt(v + eps);
        for (let c = 0; c < 6; c++) out[r][c] = (original[r][c] - mean) / s;
      }
    } else {
      for (let r = 0; r < 4; r++) {
        const row = original[r];
        const rms = Math.sqrt(row.reduce((a, b) => a + b * b, 0) / 6 + eps);
        for (let c = 0; c < 6; c++) out[r][c] = original[r][c] / rms;
      }
    }
    return out;
  }, [mode, original]);

  const display = applied ? normalized : original;

  const stats = useMemo(() => {
    if (mode === 'batch') {
      const col = original.map((r) => r[0]);
      const mean = col.reduce((a, b) => a + b, 0) / 4;
      const v = col.reduce((a, b) => a + (b - mean) ** 2, 0) / 4;
      return [
        { label: 'f1 column', value: `μ = ${mean.toFixed(2)}` },
        { label: '', value: `σ = ${Math.sqrt(v).toFixed(2)}` },
        { label: '', value: 'recomputed every batch' },
      ];
    } else if (mode === 'layer') {
      const row = original[0];
      const mean = row.reduce((a, b) => a + b, 0) / 6;
      const v = row.reduce((a, b) => a + (b - mean) ** 2, 0) / 6;
      return [
        { label: 'sample 1 row', value: `μ = ${mean.toFixed(2)}` },
        { label: '', value: `σ = ${Math.sqrt(v).toFixed(2)}` },
        { label: '', value: 'per-sample, no batch dependency' },
      ];
    } else {
      const row = original[0];
      const rms = Math.sqrt(row.reduce((a, b) => a + b * b, 0) / 6);
      return [
        { label: 'sample 1 row', value: `RMS = ${rms.toFixed(2)}` },
        { label: '', value: 'no mean subtraction' },
        { label: '', value: 'slightly cheaper than LayerNorm' },
      ];
    }
  }, [mode, original]);

  const info: Record<string, string> = {
    batch: 'BatchNorm: normalize each feature (column) across the batch. Stats depend on batch size and composition.',
    layer: 'LayerNorm: normalize each sample (row) across its feature dimension. No batch dependency.',
    rms: 'RMSNorm: like LayerNorm but skip mean subtraction — just divide by root-mean-square. Slightly cheaper.',
  };

  const highlightStroke = mode === 'batch' ? '#185FA5' : mode === 'layer' ? '#0F6E56' : '#854F0B';
  const cw = 78, ch = 42, x0 = 110, y0 = 50;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={() => { setMode('batch'); setApplied(false); }} active={mode === 'batch'}>BatchNorm</Button>
        <Button onClick={() => { setMode('layer'); setApplied(false); }} active={mode === 'layer'}>LayerNorm</Button>
        <Button onClick={() => { setMode('rms'); setApplied(false); }} active={mode === 'rms'}>RMSNorm</Button>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setApplied(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-[var(--rule)] bg-[var(--bg-sunken)] hover:bg-[var(--rule)]"
          >
            <Play size={12} /> Apply
          </button>
          <button
            onClick={() => setApplied(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-[var(--rule)] bg-[var(--bg-elev)] hover:bg-[var(--bg-sunken)]"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      <p className="text-sm text-[var(--ink-2)] min-h-[40px] leading-relaxed">{info[mode]}</p>

      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-y-hidden pb-4 -mb-4"><svg viewBox="0 0 680 280" className="block w-full min-w-[680px]">
        <text x={x0 + 6 * cw / 2} y={y0 - 32} fontSize="12" fill="var(--ink-3)" textAnchor="middle">← feature dimension →</text>
        <text x={40} y={y0 + 4 * ch / 2} fontSize="12" fill="var(--ink-3)" textAnchor="middle" dominantBaseline="central"
          transform={`rotate(-90, 40, ${y0 + 4 * ch / 2})`}>← batch →</text>
        {Array.from({ length: 4 }).map((_, r) => (
          <text key={`rl-${r}`} x={x0 - 12} y={y0 + r * ch + ch / 2}
            fontSize="12" fill={COLORS.muted} textAnchor="end" dominantBaseline="central">sample {r + 1}</text>
        ))}
        {Array.from({ length: 6 }).map((_, c) => (
          <text key={`cl-${c}`} x={x0 + c * cw + cw / 2} y={y0 - 12}
            fontSize="12" fill={COLORS.muted} textAnchor="middle">f{c + 1}</text>
        ))}
        {display.map((row, r) =>
          row.map((v, c) => {
            let highlighted = false;
            if (mode === 'batch' && c === 0) highlighted = true;
            if ((mode === 'layer' || mode === 'rms') && r === 0) highlighted = true;
            const fillVal = applied ? v * 1.5 : v;
            return (
              <g key={`c-${r}-${c}`}>
                <rect
                  x={x0 + c * cw + 3} y={y0 + r * ch + 3}
                  width={cw - 6} height={ch - 6} rx={4}
                  fill={colorFor(fillVal)}
                  stroke={highlighted ? highlightStroke : 'rgba(0,0,0,0.12)'}
                  strokeWidth={highlighted ? 2.4 : 0.5}
                  style={{ transition: 'fill 0.45s, stroke 0.35s, stroke-width 0.35s' }}
                />
                <text x={x0 + c * cw + cw / 2} y={y0 + r * ch + ch / 2}
                  fontSize="12" fontWeight="500" fill={COLORS.text}
                  textAnchor="middle" dominantBaseline="central">
                  {applied ? v.toFixed(2) : v.toFixed(1)}
                </text>
              </g>
            );
          })
        )}
      </svg></div>

      <div className="flex gap-2 flex-wrap">
        {stats.map((s, i) => (
          <div key={i} className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md px-3 py-2 text-xs text-[var(--ink-2)]">
            {s.label && <span className="text-[var(--ink-3)]">{s.label} </span>}
            <span className="text-[var(--ink)] font-medium">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DropoutViz() {
  const [rate, setRate] = useState(0.3);
  const [dropped, setDropped] = useState<Set<string>>(new Set());
  const [version, setVersion] = useState(0);

  const layers = useMemo(() => [
    { x: 90, count: 3, droppable: false },
    { x: 270, count: 8, droppable: true },
    { x: 450, count: 8, droppable: true },
    { x: 610, count: 1, droppable: false },
  ], []);

  const totalDroppable = layers.reduce((s, L) => s + (L.droppable ? L.count : 0), 0);
  const totalNodes = layers.reduce((s, L) => s + L.count, 0);

  const ys = useMemo(() => {
    const topY = 40, totalH = 200;
    return layers.map((L) => {
      const arr = [];
      for (let i = 0; i < L.count; i++) {
        arr.push(L.count === 1 ? topY + totalH / 2 : topY + i * (totalH / (L.count - 1)));
      }
      return arr;
    });
  }, [layers]);

  const resample = () => {
    const s = new Set<string>();
    layers.forEach((L, li) => {
      if (!L.droppable) return;
      for (let i = 0; i < L.count; i++) {
        if (Math.random() < rate) s.add(`${li}-${i}`);
      }
    });
    setDropped(s);
    setVersion((v) => v + 1);
  };

  useEffect(() => { resample(); }, [rate]);

  const possible = Math.pow(2, totalDroppable);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm text-[var(--ink-2)] min-w-[90px]">dropout rate</label>
        <input type="range" min={0} max={0.7} step={0.05} value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="flex-1 max-w-[300px]" />
        <span className="text-sm font-medium tabular-nums min-w-[48px] text-right">{rate.toFixed(2)}</span>
        <button onClick={resample}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-[var(--rule)] bg-[var(--bg-elev)] hover:bg-[var(--bg-sunken)]">
          <RotateCcw size={12} /> Resample mask
        </button>
      </div>

      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-y-hidden pb-4 -mb-4"><svg key={version} viewBox="0 0 680 290" className="block w-full min-w-[680px]">
        {layers.slice(0, -1).map((A, li) =>
          ys[li] && ys[li].map((ay, ai) =>
            ys[li + 1].map((by, bi) => {
              const aDown = dropped.has(`${li}-${ai}`);
              const bDown = dropped.has(`${li + 1}-${bi}`);
              const muted = aDown || bDown;
              return (
                <line
                  key={`de-${li}-${ai}-${bi}`}
                  x1={A.x + 11} y1={ay}
                  x2={layers[li + 1].x - 11} y2={by}
                  stroke={COLORS.gray}
                  strokeWidth={0.6}
                  opacity={muted ? 0.06 : 0.5}
                  style={{ transition: 'opacity 0.4s' }}
                />
              );
            })
          )
        )}
        {layers.map((L, li) =>
          ys[li].map((y, i) => (
            <circle
              key={`dn-${li}-${i}`}
              cx={L.x} cy={y} r={11}
              fill={L.droppable ? COLORS.purple : COLORS.darkGray}
              opacity={dropped.has(`${li}-${i}`) ? 0.15 : 1}
              style={{ transition: 'opacity 0.4s' }}
            />
          ))
        )}
        {['input', 'hidden 1', 'hidden 2', 'output'].map((lbl, i) => (
          <text key={lbl} x={layers[i].x} y={280} fontSize="12" fill={COLORS.muted} textAnchor="middle">{lbl}</text>
        ))}
      </svg></div>

      <div className="flex gap-2 flex-wrap">
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md px-3 py-2 text-xs text-[var(--ink-2)]">
          active neurons<div className="text-base font-medium text-[var(--ink)] tabular-nums">{totalNodes - dropped.size}</div>
        </div>
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md px-3 py-2 text-xs text-[var(--ink-2)]">
          dropped<div className="text-base font-medium text-[var(--ink)] tabular-nums">{dropped.size}</div>
        </div>
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md px-3 py-2 text-xs text-[var(--ink-2)]">
          possible subnetworks<div className="text-base font-medium text-[var(--ink)] tabular-nums">{possible.toLocaleString()}</div>
        </div>
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md px-3 py-2 text-xs text-[var(--ink-2)]">
          each pass samples one<div className="text-sm text-[var(--ink-2)]">approximate ensemble</div>
        </div>
      </div>
    </div>
  );
}

function OptimizerViz() {
  const [lr, setLr] = useState(0.12);
  const [narrow, setNarrow] = useState(8);
  const [paths, setPaths] = useState<{ sgd: any[], mom: any[], adam: any[] }>({ sgd: [], mom: [], adam: [] });
  const [losses, setLosses] = useState<{ sgd: number | null, mom: number | null, adam: number | null }>({ sgd: null, mom: null, adam: null });
  const [running, setRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef<any>(null);

  const start = { x: 70, y: 80 };
  const cx = 440, cy = 190, sx = 80, sy = 80;

  const loss = (x: number, y: number) => {
    const dx = (x - cx) / sx, dy = (y - cy) / sy;
    return 0.5 * (dx * dx + narrow * dy * dy);
  };
  const grad = (x: number, y: number) => ({
    gx: (x - cx) / sx / sx,
    gy: narrow * (y - cy) / sy / sy,
  });

  const initRun = () => {
    stateRef.current = {
      sgd: { x: start.x, y: start.y },
      mom: { x: start.x, y: start.y, vx: 0, vy: 0 },
      adam: { x: start.x, y: start.y, mx: 0, my: 0, vx: 0, vy: 0, t: 0 },
    };
    setPaths({ sgd: [{ ...start }], mom: [{ ...start }], adam: [{ ...start }] });
    setLosses({ sgd: null, mom: null, adam: null });
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
  };

  const reset = () => { stop(); initRun(); };

  const run = () => {
    if (running) return;
    if (!stateRef.current || stateRef.current.sgd.x !== start.x) initRun();
    setRunning(true);
    let i = 0;
    const lr_px = lr * 600;
    timerRef.current = setInterval(() => {
      const s = stateRef.current;
      let g = grad(s.sgd.x, s.sgd.y);
      s.sgd.x -= lr_px * g.gx;
      s.sgd.y -= lr_px * g.gy;

      g = grad(s.mom.x, s.mom.y);
      s.mom.vx = 0.9 * s.mom.vx + g.gx;
      s.mom.vy = 0.9 * s.mom.vy + g.gy;
      s.mom.x -= lr_px * s.mom.vx;
      s.mom.y -= lr_px * s.mom.vy;

      g = grad(s.adam.x, s.adam.y);
      s.adam.t += 1;
      const b1 = 0.9, b2 = 0.999, eps = 1e-6;
      s.adam.mx = b1 * s.adam.mx + (1 - b1) * g.gx;
      s.adam.my = b1 * s.adam.my + (1 - b1) * g.gy;
      s.adam.vx = b2 * s.adam.vx + (1 - b2) * g.gx * g.gx;
      s.adam.vy = b2 * s.adam.vy + (1 - b2) * g.gy * g.gy;
      const mhx = s.adam.mx / (1 - Math.pow(b1, s.adam.t));
      const mhy = s.adam.my / (1 - Math.pow(b1, s.adam.t));
      const vhx = s.adam.vx / (1 - Math.pow(b2, s.adam.t));
      const vhy = s.adam.vy / (1 - Math.pow(b2, s.adam.t));
      s.adam.x -= lr_px * mhx / (Math.sqrt(vhx) + eps);
      s.adam.y -= lr_px * mhy / (Math.sqrt(vhy) + eps);

      setPaths((p) => ({
        sgd: [...p.sgd, { x: s.sgd.x, y: s.sgd.y }],
        mom: [...p.mom, { x: s.mom.x, y: s.mom.y }],
        adam: [...p.adam, { x: s.adam.x, y: s.adam.y }],
      }));
      setLosses({
        sgd: loss(s.sgd.x, s.sgd.y),
        mom: loss(s.mom.x, s.mom.y),
        adam: loss(s.adam.x, s.adam.y),
      });
      i++;
      if (i >= 80) stop();
    }, 70);
  };

  useEffect(() => { initRun(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [narrow, lr]);

  const levels = [0.05, 0.2, 0.5, 1.0, 1.8, 3.0, 4.5];
  const pathStr = (pts: any[]) => pts.length < 2 ? '' : 'M ' + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={run} disabled={running}
          className="flex items-center gap-2 px-3.5 py-1.5 text-sm rounded-md border border-[var(--rule)] bg-[var(--bg-elev)] hover:bg-[var(--bg-sunken)] disabled:opacity-50">
          <Play size={14} /> Run
        </button>
        <button onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-[var(--rule)] bg-[var(--bg-elev)] hover:bg-[var(--bg-sunken)]">
          <RotateCcw size={12} /> Reset
        </button>
        <Legend items={[
          { label: 'SGD', color: COLORS.blue },
          { label: 'Momentum', color: COLORS.green },
          { label: 'Adam', color: COLORS.coral },
        ]} />
      </div>

      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-y-hidden pb-4 -mb-4"><svg viewBox="0 0 680 380" className="block w-full min-w-[680px]">
        {levels.map((L, idx) => {
          const a = Math.sqrt(2 * L) * sx;
          const b = Math.sqrt(2 * L / narrow) * sy;
          return (
            <ellipse key={idx} cx={cx} cy={cy} rx={a} ry={b}
              fill="none" stroke={idx < 3 ? COLORS.accent : COLORS.border}
              strokeWidth={0.7} opacity={0.6} />
          );
        })}
        <circle cx={cx} cy={cy} r={4} fill="var(--amber)" />
        <text x={cx + 8} y={cy + 4} fontSize="12" fill={COLORS.muted} dominantBaseline="central">minimum</text>
        {paths.sgd.length > 1 && <path d={pathStr(paths.sgd)} fill="none" stroke={COLORS.blue} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />}
        {paths.mom.length > 1 && <path d={pathStr(paths.mom)} fill="none" stroke={COLORS.green} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />}
        {paths.adam.length > 1 && <path d={pathStr(paths.adam)} fill="none" stroke={COLORS.coral} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />}
        {paths.sgd.length > 0 && <circle cx={paths.sgd.at(-1).x} cy={paths.sgd.at(-1).y} r={4.5} fill={COLORS.blue} />}
        {paths.mom.length > 0 && <circle cx={paths.mom.at(-1).x} cy={paths.mom.at(-1).y} r={4.5} fill={COLORS.green} />}
        {paths.adam.length > 0 && <circle cx={paths.adam.at(-1).x} cy={paths.adam.at(-1).y} r={4.5} fill={COLORS.coral} />}
        <circle cx={start.x} cy={start.y} r={4} fill="none" stroke={COLORS.darkGray} strokeWidth={1} />
        <text x={start.x + 8} y={start.y - 6} fontSize="12" fill={COLORS.muted}>start</text>
      </svg></div>

      <div className="flex gap-4 flex-wrap text-xs text-[var(--ink-2)]">
        <label className="flex items-center gap-2">learning rate
          <input type="range" min={0.02} max={0.3} step={0.01} value={lr}
            onChange={(e) => setLr(parseFloat(e.target.value))} className="w-28" />
          <span className="tabular-nums min-w-[32px]">{lr.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-2">valley narrowness
          <input type="range" min={3} max={14} step={1} value={narrow}
            onChange={(e) => setNarrow(parseInt(e.target.value))} className="w-28" />
          <span className="tabular-nums min-w-[24px]">{narrow}</span>
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { c: COLORS.blue, l: 'SGD loss', v: losses.sgd },
          { c: COLORS.green, l: 'Momentum loss', v: losses.mom },
          { c: COLORS.coral, l: 'Adam loss', v: losses.adam },
        ].map((it) => (
          <div key={it.l} className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md p-3">
            <div className="text-xs text-[var(--ink-3)] mb-1 flex items-center gap-2">
              <span style={{ display: 'inline-block', width: 18, height: 3, background: it.c, borderRadius: 1 }} />
              {it.l}
            </div>
            <div className="text-lg font-medium tabular-nums">{it.v === null ? '—' : it.v.toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleViz() {
  const [peak, setPeak] = useState(0.003);
  const [warmup, setWarmup] = useState(100);
  const total = 1000;

  const data = useMemo(() => {
    const arr = [];
    for (let t = 0; t <= total; t += 10) {
      let c, s;
      if (t < warmup) {
        c = peak * t / Math.max(1, warmup);
        s = c;
      } else {
        const tt = (t - warmup) / (total - warmup);
        c = peak * 0.1 + 0.5 * (peak - peak * 0.1) * (1 + Math.cos(Math.PI * tt));
        if (t < 500) s = peak;
        else if (t < 800) s = peak * 0.1;
        else s = peak * 0.01;
      }
      arr.push({ step: t, cosine: c, step_decay: s, constant: peak });
    }
    return arr;
  }, [peak, warmup]);

  return (
    <div className="space-y-4">
      <Legend items={[
        { label: 'warmup + cosine', color: COLORS.purple },
        { label: 'warmup + step', color: COLORS.green, dash: [6, 4] },
        { label: 'constant', color: COLORS.darkGray, dash: [2, 3] },
      ]} />

      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 -mb-4"><div style={{ width: '100%', minWidth: '500px', height: 290 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.07)" />
            <XAxis dataKey="step" type="number" domain={[0, total]} tick={{ fontSize: 11, fill: COLORS.muted }}
              label={{ value: 'training step', position: 'insideBottom', offset: -5, fontSize: 12, fill: COLORS.muted }} />
            <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} tickFormatter={(v) => v.toExponential(1)} />
            <Line type="monotone" dataKey="cosine" stroke={COLORS.purple} strokeWidth={2.2} dot={false} isAnimationActive={false} />
            <Line type="stepBefore" dataKey="step_decay" stroke={COLORS.green} strokeWidth={2} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="constant" stroke={COLORS.darkGray} strokeWidth={1.6} strokeDasharray="2 3" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>

      <div className="flex gap-4 flex-wrap text-xs text-[var(--ink-2)]">
        <label className="flex items-center gap-2">peak LR
          <input type="range" min={0.0005} max={0.005} step={0.0001} value={peak}
            onChange={(e) => setPeak(parseFloat(e.target.value))} className="w-32" />
          <span className="tabular-nums min-w-[54px]">{peak.toExponential(1)}</span>
        </label>
        <label className="flex items-center gap-2">warmup steps
          <input type="range" min={0} max={200} step={10} value={warmup}
            onChange={(e) => setWarmup(parseInt(e.target.value))} className="w-32" />
          <span className="tabular-nums min-w-[30px]">{warmup}</span>
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md p-3 text-xs text-[var(--ink-2)]">
          warmup phase<div className="text-base font-medium text-[var(--ink)] tabular-nums">steps 0–{warmup}</div>
        </div>
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md p-3 text-xs text-[var(--ink-2)]">
          cosine min<div className="text-base font-medium text-[var(--ink)] tabular-nums">{(peak * 0.1).toExponential(1)}</div>
        </div>
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md p-3 text-xs text-[var(--ink-2)]">
          step drops at<div className="text-base font-medium text-[var(--ink)] tabular-nums">step 500, 800</div>
        </div>
      </div>
    </div>
  );
}

function InitViz() {
  const [mode, setMode] = useState('he');
  const [version, setVersion] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const variances = useMemo(() => {
    if (!mounted) return [];
    void version;
    const n = 256, nLayers = 10;
    const randn = () => {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    let h = new Float64Array(n);
    for (let i = 0; i < n; i++) h[i] = randn();
    const out = [];
    let sigma: number;
    if (mode === 'small') sigma = 0.05;
    else if (mode === 'big') sigma = 0.5;
    else sigma = Math.sqrt(2 / n);

    for (let L = 0; L < nLayers; L++) {
      const newH = new Float64Array(n);
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let i = 0; i < n; i++) sum += h[i] * sigma * randn();
        newH[j] = Math.max(0, sum);
      }
      h = newH;
      let m = 0;
      for (let i = 0; i < n; i++) m += h[i];
      m /= n;
      let v = 0;
      for (let i = 0; i < n; i++) v += (h[i] - m) * (h[i] - m);
      v /= n;
      out.push({ layer: 'L' + (L + 1), variance: v });
    }
    return out;
  }, [mode, version]);

  const colorByMode: Record<string, string> = { small: COLORS.blue, he: COLORS.green, big: '#E24B4A' };

  const info: Record<string, string> = {
    small: 'Too small (σ=0.05): activations shrink toward zero as they pass through layers. Gradients vanish. Network cannot learn.',
    he: 'He init: weights drawn from N(0, 2/n_in). Activation variance stays roughly constant across layers — gradients flow.',
    big: 'Too large (σ=0.5): activations grow exponentially through layers. Numerical overflow. Training diverges.',
  };

  const v1 = variances[0]?.variance ?? 0;
  const v10 = variances[variances.length - 1]?.variance ?? 0;
  const ratio = v1 > 0 ? v10 / v1 : 0;
  const fmt = (x: number) => x === 0 ? '0' : (x < 1e-3 || x > 1e3 ? x.toExponential(2) : x.toFixed(3));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={() => setMode('small')} active={mode === 'small'}>Too small (σ=0.05)</Button>
        <Button onClick={() => setMode('he')} active={mode === 'he'}>He init</Button>
        <Button onClick={() => setMode('big')} active={mode === 'big'}>Too large (σ=0.5)</Button>
        <button onClick={() => setVersion((v) => v + 1)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-[var(--rule)] bg-[var(--bg-elev)] hover:bg-[var(--bg-sunken)]">
          <RotateCcw size={12} /> Resample
        </button>
      </div>

      <p className="text-sm text-[var(--ink-2)] min-h-[40px] leading-relaxed">{info[mode]}</p>

      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 -mb-4"><div style={{ width: '100%', minWidth: '500px', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={variances} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.07)" vertical={false} />
            <XAxis dataKey="layer" tick={{ fontSize: 11, fill: COLORS.muted }} />
            <YAxis scale="log" domain={['auto', 'auto']} tick={{ fontSize: 11, fill: COLORS.muted }}
              tickFormatter={(v: any) => v.toExponential(0)}
              label={{ value: 'activation variance (log)', angle: -90, position: 'insideLeft', fontSize: 12, fill: COLORS.muted }} />
            <Bar dataKey="variance" fill={colorByMode[mode]} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md p-3 text-xs text-[var(--ink-2)]">
          layer 1 variance<div className="text-base font-medium text-[var(--ink)] tabular-nums">{fmt(v1)}</div>
        </div>
        <div className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md p-3 text-xs text-[var(--ink-2)]">
          layer 10 variance<div className="text-base font-medium text-[var(--ink)] tabular-nums">{fmt(v10)}</div>
        </div>
        <div className={`bg-[var(--bg-elev)] border rounded-md p-3 text-xs text-[var(--ink-2)] ${
          mode === 'he' ? 'border-emerald-200' : 'border-rose-200'
        }`}>
          L10 / L1 ratio<div className={`text-base font-medium tabular-nums ${
            mode === 'he' ? 'text-emerald-700' : 'text-rose-700'
          }`}>{fmt(ratio)}</div>
        </div>
      </div>
    </div>
  );
}

export default function NeuralNetworkComponents() {
  return (
    <>
      <ChapterDivider number="3" title="Neural Network Components" accentVar="--accent-p1" />

      <div className="text-[var(--ink)]" style={{ fontFamily: 'var(--sans)' }}>
        <div className="py-12">
          <section className="mb-12">
            <h2 className="text-2xl p1-serif text-[var(--ink)] mb-4">The unified picture</h2>
            <p className="text-[var(--ink-2)] leading-relaxed mb-6">
              Training a neural network is one loop: forward pass → compute loss →
              backward pass → update weights → repeat. The seven components below answer
              different questions about how that loop runs.
            </p>
            <div className="border border-[var(--rule)] rounded-lg overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--bg-sunken)] text-[var(--ink-2)]">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Component</th>
                    <th className="text-left px-4 py-3 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--ink-2)]">
                  {[
                    ['Architecture', 'Defines how data flows; encodes assumptions about the data'],
                    ['Activation', 'Adds nonlinearity between layers — without it, depth is pointless'],
                    ['Normalization', 'Rescales activations during training to keep gradients stable'],
                    ['Regularization', 'Prevents memorization, improves generalization'],
                    ['Optimizer', 'Turns gradients into smart weight updates'],
                    ['LR schedule', 'Sizes each update appropriately over training'],
                    ['Initialization', 'Sets the starting weights so signals propagate cleanly'],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-t border-[var(--rule)]">
                      <td className="px-4 py-3 font-medium text-[var(--ink)]">{k}</td>
                      <td className="px-4 py-3">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Section id="architecture" title="Architectures: MLP, CNN, RNN" kicker="3.1 · Information flow">
            <div className="prose-content space-y-5 text-[var(--ink-2)] leading-relaxed">
              <p>
                Three families, distinguished by how data flows. The deeper framing is that
                each one encodes a different <em>assumption about the data</em>:
              </p>
              <ul className="space-y-2 list-none ml-0">
                <li><span className="font-medium text-[var(--ink)]">MLP</span> — "I assume nothing about structure — every input could matter to every output."</li>
                <li><span className="font-medium text-[var(--ink)]">CNN</span> — "I assume nearby things are related, and the same pattern can appear anywhere" (locality + translation invariance).</li>
                <li><span className="font-medium text-[var(--ink)]">RNN</span> — "I assume order matters and earlier inputs affect later ones."</li>
              </ul>
              <p>
                The flow pattern is the <em>consequence</em> of the assumption, not the
                defining trait. That tells you which architecture to reach for: structured
                grid data (images, audio spectrograms) → CNN; ordered sequences → RNN (or
                transformer); unstructured features → MLP.
              </p>
            </div>

            <VizFrame caption="MLP fires layer by layer with full connectivity. CNN slides a shared 3×3 filter across the input. RNN walks through time, hidden state carrying forward.">
              <ArchitectureViz />
            </VizFrame>

            <h3 className="text-lg p1-serif text-[var(--ink)] mt-8 mb-3">Architectural lineage</h3>
            <p className="text-[var(--ink-2)] leading-relaxed mb-3">
              CNNs evolved through LeNet → AlexNet → VGG → ResNet (the skip-connection
              breakthrough that made 100-layer networks trainable) → ConvNeXt. RNNs gained
              LSTMs to fight vanishing gradients (the forget gate is the key). Transformers
              then displaced RNNs by parallelizing across the sequence dimension. State
              Space Models (Mamba, Mamba-2) are bringing recurrent ideas back with
              linear-time inference.
            </p>
          </Section>

          <Section id="activations" title="Activations" kicker="3.2 · Nonlinearity">
            <div className="text-[var(--ink-2)] leading-relaxed space-y-4">
              <p>
                The real reason activations exist:{' '}
                <strong className="text-[var(--ink)]">without them, a deep network collapses to a single linear layer.</strong>
              </p>
              <p>
                Stack two linear layers: y = W₂(W₁x) = (W₂W₁)x. Two matrices multiplied is
                just one matrix. Stack a hundred — still one matrix. A 100-layer network
                with no activation has exactly the same expressive power as 1-layer linear
                regression. Activations insert a nonlinear step between layers, breaking
                that collapse. <strong className="text-[var(--ink)]">They enable depth to actually mean something.</strong>
              </p>
            </div>

            <div className="my-6 grid gap-3">
              {[
                { name: 'ReLU', f: 'max(0, x)', note: 'Fast, simple, the CV default since 2012. Failure mode: "dying ReLU" — if a neuron is always negative its gradient is exactly zero forever.' },
                { name: 'GELU', f: 'x · Φ(x)', note: 'Smooth, non-monotonic. Used in BERT, GPT-2, GPT-3. Lets small negatives through with reduced magnitude.' },
                { name: 'SwiGLU', f: '(Swish(xW₁) ⊙ xW₃) W₂', note: 'Gated activation. Modern LLM standard — LLaMA, Mistral, Qwen, DeepSeek. The inner Swish curve is what you see plotted; the gating multiplication is what really earns its keep.' },
              ].map((a) => (
                <div key={a.name} className="bg-[var(--bg-elev)] border border-[var(--rule)] rounded-md p-4">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-medium text-[var(--ink)]">{a.name}</span>
                    <code className="text-sm text-[var(--amber)] bg-amber-50 px-2 py-0.5 rounded">{a.f}</code>
                  </div>
                  <p className="text-sm text-[var(--ink-2)] leading-relaxed">{a.note}</p>
                </div>
              ))}
            </div>

            <VizFrame caption="Drag the slider into the negative region: ReLU clips to exactly zero (gradient also zero, the source of dying ReLU). GELU and Swish stay smooth and let a small negative signal through. Around x ≈ −0.5, Swish dips most negative — that's the non-monotonic property.">
              <ActivationViz />
            </VizFrame>
          </Section>

          <Section id="normalization" title="Normalization" kicker="3.3 · Training stability">
            <div className="text-[var(--ink-2)] leading-relaxed space-y-4">
              <p>
                Normalization isn't making values "more meaningful" — they were already the
                model's actual computations. The real reason:
                <strong className="text-[var(--ink)]"> during training, activations can drift to wildly different scales across layers, which makes gradient descent unstable.</strong>
                One layer's outputs might have variance 0.01, the next layer's 1000.
                Gradients flowing back through that hit underflow or explosion. Optimization
                stalls or diverges.
              </p>
              <p>
                Normalization keeps activations in a controlled scale (roughly zero mean,
                unit variance) regardless of what upstream layers do. That lets you use
                higher learning rates, makes the network less sensitive to weight
                initialization, and smooths the loss landscape.
              </p>
              <p>
                The differentiator between BatchNorm, LayerNorm, and RMSNorm is which slice
                of the activation tensor you normalize across.
              </p>
            </div>

            <VizFrame caption="BatchNorm's blue slice goes vertical — across the batch — which is why small batch sizes break it. LayerNorm's green slice goes horizontal, entirely within one sample. RMSNorm operates on the same horizontal slice but uses RMS instead of mean and std.">
              <NormalizationViz />
            </VizFrame>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-6">
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                <span className="font-medium text-[var(--ink)]">Pre-LN vs post-LN matters too.</span>{' '}
                The original Transformer used post-LN (normalize after the residual) and was
                hard to train at depth. Modern transformers use pre-LN — normalize first,
                then sublayer, then residual — which is much more stable for deep models.
              </p>
            </div>
          </Section>

          <Section id="regularization" title="Regularization" kicker="3.4 · Anti-memorization">
            <div className="text-[var(--ink-2)] leading-relaxed space-y-4">
              <p>
                A network with enough capacity will perfectly fit training examples while
                failing on new ones. <strong className="text-[var(--ink)]">Regularization deliberately handicaps training</strong>{' '}
                so the model is forced to learn patterns that generalize.
              </p>
              <p>
                The three main tools: <span className="font-medium text-[var(--ink)]">dropout</span> (randomly zero
                activations during training — approximates an ensemble of subnetworks),{' '}
                <span className="font-medium text-[var(--ink)]">weight decay</span> (penalize large weights — pull
                all weights toward zero), and{' '}
                <span className="font-medium text-[var(--ink)]">data augmentation</span> (increase effective dataset
                size with label-preserving transformations).
              </p>
              <p>
                Modern LLM pretraining often uses zero dropout because data is abundant —
                overfitting isn't the problem, it's an underfitting regime. Fine-tuning on
                small datasets reintroduces dropout. AdamW (the standard transformer
                optimizer) decouples weight decay from the gradient update; the difference
                between Adam-with-L2 and AdamW is real and measurable.
              </p>
            </div>

            <VizFrame caption="Each Resample is one training step's forward pass. The network must learn weights that work despite any of these subnetworks being sampled — that's why dropout fights co-adaptation.">
              <DropoutViz />
            </VizFrame>
          </Section>

          <Section id="optimizers" title="Optimizers" kicker="3.5 · Navigation strategy">
            <div className="text-[var(--ink-2)] leading-relaxed space-y-4">
              <p>
                Imagine the loss as a landscape with valleys and ridges. Your weights are a
                point on it. The gradient tells you which direction is steepest uphill. An
                optimizer is the rule that says <em>given that gradient, how do I move?</em>
              </p>
              <ul className="space-y-3 list-none ml-0">
                <li>
                  <span className="font-medium text-[var(--ink)]">SGD</span> — "Just step opposite the gradient."
                  Simple, but in long narrow valleys you bounce across the walls.
                </li>
                <li>
                  <span className="font-medium text-[var(--ink)]">SGD + Momentum</span> — "Remember which way I was going."
                  Like a ball rolling downhill: accumulates speed in consistent directions, kills bouncing.
                </li>
                <li>
                  <span className="font-medium text-[var(--ink)]">Adam</span> — "Use a different learning rate per parameter,
                  based on each one's gradient history." Per-parameter adaptive learning rates. Memory cost: 2× parameters extra.
                </li>
                <li>
                  <span className="font-medium text-[var(--ink)]">AdamW</span> — Adam with decoupled weight decay.
                  Standard for transformers and LLMs.
                </li>
              </ul>
              <p>
                The interview-level insight: <strong className="text-[var(--ink)]">SGD+momentum often generalizes better on vision</strong>{' '}
                (sharper inductive bias matches the data); <strong className="text-[var(--ink)]">Adam-family dominates everywhere else</strong>{' '}
                (faster, more forgiving of hyperparameters). Neither is universally better.
              </p>
            </div>

            <VizFrame caption="The contours form an elongated valley. SGD bounces across the narrow axis. Momentum smooths the oscillation. Adam adapts per-axis and treats both directions sensibly. Crank up valley narrowness to see SGD struggle.">
              <OptimizerViz />
            </VizFrame>
          </Section>

          <Section id="lr-schedules" title="Learning rate schedules" kicker="3.6 · Step sizing over time">
            <div className="text-[var(--ink-2)] leading-relaxed space-y-4">
              <p>
                The learning rate sets how far each update moves. Too small: training crawls
                and may never reach a good minimum. Too large: updates overshoot, weights
                oscillate or diverge. The catch is that the <em>right</em> learning rate
                changes over training.
              </p>
              <ul className="space-y-2 list-none ml-0">
                <li><span className="font-medium text-[var(--ink)]">Early</span>: random weights, huge noisy gradients. A large step risks blowing things up.</li>
                <li><span className="font-medium text-[var(--ink)]">Middle</span>: real progress, move fast.</li>
                <li><span className="font-medium text-[var(--ink)]">Late</span>: near a minimum, small precise steps to settle in.</li>
              </ul>
              <p>The three patterns to know:</p>
              <ul className="space-y-2 list-none ml-0">
                <li><span className="font-medium text-[var(--ink)]">Warmup</span> — ramp from ~zero up to peak over the first N steps. Critical for transformers; without it, large LLMs routinely diverge in the first hundred steps.</li>
                <li><span className="font-medium text-[var(--ink)]">Cosine decay</span> — smoothly decay from peak to a small value following a cosine curve. The modern default.</li>
                <li><span className="font-medium text-[var(--ink)]">Step decay</span> — drop LR by a fixed factor (typically 10×) at preset milestones. The classic CV approach.</li>
              </ul>
            </div>

            <VizFrame caption="Set warmup steps to 0 — that's what an unwarmuped training run looks like: an immediate full-LR step at the most fragile moment. For LLMs this routinely diverges. Slide it back up and the curve eases in.">
              <ScheduleViz />
            </VizFrame>
          </Section>

          <Section id="initialization" title="Initialization" kicker="3.7 · Starting point">
            <div className="text-[var(--ink-2)] leading-relaxed space-y-4">
              <p>
                The most underrated piece. Before training begins, every weight needs a
                value. Set them all to zero? Every neuron computes the same thing, every
                gradient is identical, the network never learns. Set them too large?
                Activations explode through the layers. Too small? Activations vanish.
              </p>
              <p>
                The goal: <strong className="text-[var(--ink)]">keep the variance of activations and gradients roughly constant as signals pass through layers</strong>.
                If each layer multiplies variance by ρ, after L layers it's ρ^L — exponential in depth.
              </p>
              <ul className="space-y-2 list-none ml-0">
                <li><span className="font-medium text-[var(--ink)]">Xavier (Glorot)</span> — variance ≈ 1/n_in. Derived for linear/tanh activations.</li>
                <li><span className="font-medium text-[var(--ink)]">He (Kaiming)</span> — variance ≈ 2/n_in. Compensates for ReLU zeroing half its inputs.</li>
              </ul>
              <p>
                In modern transformers, init alone isn't enough — LayerNorm + residual
                connections + small init values (σ ≈ 0.02) is the stack that actually makes
                100-layer networks trainable.
              </p>
            </div>

            <VizFrame caption="The y-axis is logarithmic, so a flat bar chart means variance is constant across depth — what you want. Too-small init cliffs downward; too-large marches upward by orders of magnitude. He init sits in the goldilocks zone.">
              <InitViz />
            </VizFrame>
          </Section>

          <section className="py-12 border-t border-[var(--rule)]">
            <div className="text-xs uppercase tracking-widest text-[var(--amber)] font-medium mb-3">
              All together now
            </div>
            <h2 className="text-3xl p1-serif text-[var(--ink)] tracking-tight mb-6">
              How these stack in practice
            </h2>

            <div className="bg-[var(--bg-elev)] text-[var(--ink)] border border-[var(--rule)] rounded-lg p-6 mb-6 font-mono text-sm leading-relaxed">
              <div className="text-amber-300 mb-2"># Modern LLM (LLaMA-style)</div>
              <div>AdamW (β₂ = 0.95, weight decay 0.1)</div>
              <div>+ linear warmup (1k–10k steps)</div>
              <div>+ cosine decay to 10% of peak</div>
              <div>+ small init (σ = 0.02)</div>
              <div>+ RMSNorm (pre-norm)</div>
              <div>+ SwiGLU FFN</div>
              <div>+ residual connections</div>
              <div>+ dropout typically zero</div>
            </div>

            <div className="bg-[var(--bg-elev)] text-[var(--ink)] border border-[var(--rule)] rounded-lg p-6 mb-6 font-mono text-sm leading-relaxed">
              <div className="text-amber-300 mb-2"># Modern ResNet (CV)</div>
              <div>SGD + momentum (β = 0.9)</div>
              <div>+ step decay (10× drops)</div>
              <div>+ He init</div>
              <div>+ BatchNorm</div>
              <div>+ ReLU</div>
              <div>+ weight decay 1e-4</div>
              <div>+ augmentation (RandAugment, Mixup)</div>
              <div>+ label smoothing</div>
            </div>

            <p className="text-[var(--ink-2)] leading-relaxed">
              The convergence is striking: <strong className="text-[var(--ink)]">almost everything modern is gated, residual-connected, normalized at the input of each block, and trained with adaptive optimizers and warmup-then-decay LR schedules.</strong>{' '}
              The remaining differences (BN vs LN, ReLU vs SwiGLU, SGD+M vs AdamW) come down to data regime and hardware, not principle.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
