"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';

const S = {
  ink: 'var(--ink)',
  ink2: 'var(--ink-2)',
  ink3: 'var(--ink-3)',
  bg: 'var(--bg-elev)',
  bgSunk: 'var(--bg-sunken)',
  rule: 'var(--rule)',
  blue: 'var(--accent-p2)',
  blueSoft: 'rgba(96, 165, 250, 0.12)',
  teal: 'var(--accent-p4)',
  tealSoft: 'rgba(52, 211, 153, 0.12)',
  amber: 'var(--accent-p5)',
  amberSoft: 'rgba(251, 191, 36, 0.12)',
  rose: 'var(--accent-p6)',
  roseSoft: 'rgba(251, 113, 133, 0.12)',
  red: '#ef4444',
  redSoft: 'rgba(239, 68, 68, 0.12)',
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

// ─── Backprop Visual ───
function BackpropVisual() {
  const [phase, setPhase] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [history, setHistory] = useState<{ step: number; pred: number; target: number; loss: number }[]>([]);

  const STEP_DATA = [
    { step: 1, pred: 0.42, target: 1.00, loss: 0.1682 },
    { step: 2, pred: 0.65, target: 1.00, loss: 0.0613 },
    { step: 3, pred: 0.82, target: 1.00, loss: 0.0162 },
    { step: 4, pred: 0.93, target: 1.00, loss: 0.0025 },
    { step: 5, pred: 0.98, target: 1.00, loss: 0.0002 }
  ];

  const run = () => {
    if (phase !== 0) return;
    if (currentStep > 5) {
      resetSim();
      return;
    }

    const stepIdx = currentStep - 1;
    const data = STEP_DATA[stepIdx];

    // Animate through active network phases
    for (let i = 1; i <= 8; i++) {
      setTimeout(() => {
        setPhase(i);
        if (i === 8) {
          // Weights updated! Append to history
          setHistory(prev => {
            if (prev.some(h => h.step === data.step)) return prev;
            return [...prev, data];
          });
        }
      }, i * 750);
    }

    // Wrap up step and increment
    setTimeout(() => {
      setPhase(0);
      setCurrentStep(prev => prev + 1);
    }, 9 * 750);
  };

  const resetSim = () => {
    setPhase(0);
    setCurrentStep(1);
    setHistory([]);
  };

  const layers = [{ n: 2, x: 110 }, { n: 3, x: 270 }, { n: 1, x: 430 }];
  const r = 14, cy = 130, gap = 50;
  const yBP = (n: number, i: number) => cy - ((n - 1) * gap) / 2 + i * gap;
  const fwdLit = (li: number) => { if (phase >= 1 && phase <= 3) return li + 1 <= phase; if (phase >= 4) return true; return false; };
  const fwdConn = (li: number) => phase === li + 2;
  const bwdConn = (li: number) => (phase === 5 && li === 1) || (phase === 6 && li === 0);
  const labels = ['Input', 'Hidden', 'Output'];
  const status = [
    currentStep > 5 ? 'Model converged! Reset simulator to restart.' : `Idle. Ready to run training step #${currentStep}.`,
    'Forward · input vector ingested',
    'Forward · hidden activations computed',
    'Forward · prediction vector produced',
    'Loss calculated at the output node',
    'Backward · output gradients computed',
    'Backward · gradients backpropagated through hidden layer',
    'Backward · gradients calculated at inputs',
    'Weights & biases updated via gradient descent'
  ][phase];

  const activeStepIdx = Math.min(currentStep, 5) - 1;
  const activePred = phase >= 3 ? STEP_DATA[activeStepIdx].pred : (history[history.length - 1]?.pred ?? 0.00);
  const activeLoss = phase >= 4 ? STEP_DATA[activeStepIdx].loss : (history[history.length - 1]?.loss ?? 0.0000);

  return (
    <VisualCard caption="A multi-step slow motion training simulator. Each training step performs a forward pass to predict, a loss calculation to measure error, a backward pass to compute gradients, and an optimizer update to nudge parameters. Notice how predictions get closer to the target 1.00 and loss decreases with each step!">
      <svg viewBox="0 0 660 280" className="w-full h-auto">
        {layers.slice(0, -1).map((layer, li) => {
          const next = layers[li + 1]; const isF = fwdConn(li); const isB = bwdConn(li);
          return Array.from({ length: layer.n }).map((_, i) =>
            Array.from({ length: next.n }).map((_, j) => {
              const color = isB ? 'var(--accent-p6)' : isF ? 'var(--accent-p2)' : S.rule;
              const strokeWidth = (isF || isB) ? 2.2 : 0.6;
              const opacity = (isF || isB) ? 0.95 : 0.25;
              return <line key={`c-${li}-${i}-${j}`} x1={layer.x + r} y1={yBP(layer.n, i)} x2={next.x - r} y2={yBP(next.n, j)} stroke={color} strokeWidth={phase === 8 ? 2 : strokeWidth} opacity={phase === 8 ? 0.9 : opacity} style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />;
            })
          );
        })}
        {layers.map((layer, li) => Array.from({ length: layer.n }).map((_, i) => {
          const isLit = fwdLit(li);
          const isBwdLit = phase >= 5 && phase <= 7 && li === (7 - phase);
          return (
            <circle 
              key={`n-${li}-${i}`} 
              cx={layer.x} 
              cy={yBP(layer.n, i)} 
              r={r} 
              fill={isLit ? "rgba(251, 191, 36, 0.08)" : "rgba(255,255,255,0.02)"} 
              stroke={isLit ? "var(--accent-p5)" : S.ink3} 
              strokeWidth={isLit ? 2 : 1} 
              className={isBwdLit ? "pulse-node-active" : ""}
              style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} 
            />
          );
        }))}
        {labels.map((l, li) => <text key={l} x={layers[li].x} y={260} textAnchor="middle" fontSize="11" fill={S.ink3} fontFamily="var(--mono)" fontWeight="600" style={{ letterSpacing: '0.05em' }}>{l}</text>)}

        <g style={{ transition: 'opacity 0.4s', opacity: phase >= 3 || history.length > 0 ? 1 : 0.15 }}>
          <rect x="490" y="80" width="130" height="38" rx="8" fill="rgba(96, 165, 250, 0.04)" stroke="var(--accent-p2)" strokeWidth="1" style={{ backdropFilter: 'blur(4px)' }}/>
          <text x="555" y="98" textAnchor="middle" fontSize="11.5" fill={S.ink3} fontFamily="var(--sans)">prediction</text>
          <text x="555" y="112" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--foreground)" fontFamily="var(--mono)">ŷ = {activePred.toFixed(2)}</text>
          
          <rect x="490" y="126" width="130" height="38" rx="8" fill="rgba(251, 191, 36, 0.04)" stroke="var(--accent-p5)" strokeWidth="1" style={{ backdropFilter: 'blur(4px)' }}/>
          <text x="555" y="144" textAnchor="middle" fontSize="11.5" fill={S.ink3} fontFamily="var(--sans)">target</text>
          <text x="555" y="158" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--foreground)" fontFamily="var(--mono)">y = 1.00</text>
        </g>
        <g style={{ transition: 'opacity 0.4s', opacity: phase >= 4 || history.length > 0 ? 1 : 0 }}>
          <rect x="490" y="180" width="130" height="34" rx="17" fill="rgba(251, 113, 133, 0.08)" stroke="var(--accent-p6)" strokeWidth="1.2" style={{ backdropFilter: 'blur(4px)' }}/>
          <text x="555" y="201" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--accent-p6)" fontFamily="var(--mono)">L = {activeLoss.toFixed(4)}</text>
        </g>
      </svg>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, marginBottom: 20 }}>
        <RunButton 
          onClick={run} 
          disabled={phase !== 0 && currentStep <= 5} 
          label={currentStep > 5 ? 'Reset Simulator' : phase !== 0 ? 'Step in progress...' : `Run training step #${currentStep}`} 
        />
        <div style={{ fontSize: 12.5, color: S.ink2, fontStyle: 'italic', minHeight: 18, fontFamily: 'var(--sans)' }}>{status}</div>
      </div>

      {/* Stunning Live Calculation Table */}
      <div style={{ marginTop: 24, borderTop: `1px solid ${S.rule}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: S.blue, fontWeight: 600, fontFamily: 'var(--mono)' }}>Training Loop Step Calculations</div>
          {history.length > 0 && (
            <button 
              onClick={resetSim} 
              style={{ fontSize: 11, color: S.rose, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', textDecoration: 'underline', padding: 0 }}
            >
              Reset simulator
            </button>
          )}
        </div>
        <div style={{ overflowX: 'auto', border: `1px solid ${S.rule}`, borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: S.bgSunk, borderBottom: `1px solid ${S.rule}`, color: S.ink }}>
                <th style={{ padding: '10px 14px', fontWeight: 600, fontFamily: 'var(--mono)' }}>Step</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, fontFamily: 'var(--mono)' }}>Input x</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, fontFamily: 'var(--mono)' }}>Prediction ŷ</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, fontFamily: 'var(--mono)' }}>Target y</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, fontFamily: 'var(--mono)' }}>Loss L = ½(y - ŷ)²</th>
                <th style={{ padding: '10px 14px', fontWeight: 600, fontFamily: 'var(--mono)' }}>Update Action</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && phase === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: S.ink3, fontStyle: 'italic' }}>
                    No training steps completed yet. Click &quot;Run training step #1&quot; to begin optimizing.
                  </td>
                </tr>
              )}
              {history.map((row, idx) => (
                <tr key={row.step} style={{ borderBottom: idx < history.length - 1 ? `1px solid ${S.rule}` : 'none', color: S.ink2 }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: S.ink, fontFamily: 'var(--mono)' }}>#{row.step}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: 12 }}>[0.85, -0.15]</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', color: S.blue, fontWeight: 600 }}>{row.pred.toFixed(2)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', color: S.amber }}>{row.target.toFixed(2)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', color: S.rose, fontWeight: 600 }}>{row.loss.toFixed(4)}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: 11, background: 'rgba(52, 211, 153, 0.1)', color: S.teal, padding: '2px 8px', borderRadius: 10, fontWeight: 600, display: 'inline-block' }}>
                      Parameters Adjusted ✓
                    </span>
                  </td>
                </tr>
              ))}
              {phase !== 0 && currentStep <= 5 && (
                <tr style={{ background: 'rgba(251, 113, 133, 0.04)', color: S.ink2 }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: S.ink, fontFamily: 'var(--mono)' }}>#{currentStep}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.5 }}>[0.85, -0.15]</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', color: S.blue, fontWeight: 600, opacity: phase >= 3 ? 1 : 0.4 }}>
                    {phase >= 3 ? STEP_DATA[currentStep - 1].pred.toFixed(2) : 'calculating...'}
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', color: S.amber }}>{STEP_DATA[currentStep - 1].target.toFixed(2)}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--mono)', color: S.rose, fontWeight: 600, opacity: phase >= 4 ? 1 : 0.4 }}>
                    {phase >= 4 ? STEP_DATA[currentStep - 1].loss.toFixed(4) : 'calculating...'}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: 11, background: 'rgba(251, 191, 36, 0.1)', color: S.amber, padding: '2px 8px', borderRadius: 10, fontWeight: 600, display: 'inline-block' }}>
                      {phase < 4 ? 'forward pass...' : phase < 8 ? 'backpropagation...' : 'updating weights...'}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </VisualCard>
  );
}

// ─── Loss Curve ───
function LossCurveVisual() {
  const N = 100;
  const points = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const base = 2.45 * Math.exp(-t * 4.2) + 0.13;
      const noise = 0.085 * Math.sin(i * 1.6) + 0.045 * Math.cos(i * 0.7) + 0.02 * Math.sin(i * 4.1);
      arr.push(Math.max(0.06, base + noise));
    }
    return arr;
  }, []);

  const [progress, setProgress] = useState(N);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const run = () => {
    if (running) return;
    setProgress(0); setRunning(true);
    let p = 0;
    timerRef.current = setInterval(() => {
      p += 1;
      if (p >= N) { if (timerRef.current) clearInterval(timerRef.current); setProgress(N); setRunning(false); }
      else setProgress(p);
    }, 70);
  };

  const W = 760, H = 320, padL = 50, padR = 30, padT = 30, padB = 52;
  const chartW = 310, chartH = H - padT - padB;
  const xScale = (i: number) => padL + (i / N) * chartW;
  const yMax = 3.0;
  const yScale = (v: number) => padT + (1 - v / yMax) * chartH;
  const visibleN = Math.min(progress, N);
  const linePath = visibleN > 0 ? 'M ' + Array.from({ length: visibleN + 1 }).map((_, i) => `${xScale(i).toFixed(1)} ${yScale(points[i]).toFixed(1)}`).join(' L ') : '';
  const areaPath = visibleN > 0 ? `M ${xScale(0).toFixed(1)} ${yScale(points[0]).toFixed(1)} ` + Array.from({ length: visibleN + 1 }).map((_, i) => `L ${xScale(i).toFixed(1)} ${yScale(points[i]).toFixed(1)}`).join(' ') + ` L ${xScale(visibleN).toFixed(1)} ${yScale(0).toFixed(1)} L ${xScale(0).toFixed(1)} ${yScale(0).toFixed(1)} Z` : '';
  const currentLoss = points[Math.min(progress, N)];
  const labelX = xScale(visibleN), labelY = yScale(currentLoss);

  // 2D Parameter Loss Landscape descent spiral
  const landscapeCenter = { x: 570, y: 149 };
  const trajectory = useMemo(() => {
    const arr: { x: number; y: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      // Beautiful decaying spiral modeling 2D optimization search
      const rX = 130 * Math.pow(1 - t, 1.4);
      const rY = 90 * Math.pow(1 - t, 1.4);
      const angle = t * 6.5; // spiral winding
      const w1 = landscapeCenter.x + rX * Math.cos(angle);
      const w2 = landscapeCenter.y + rY * Math.sin(angle);
      
      // Decay noise for stochastic gradient oscillations
      const noise = 4.5 * Math.sin(i * 1.1) * (1 - t);
      arr.push({ x: w1 + noise, y: w2 + noise * 0.7 });
    }
    return arr;
  }, []);

  const currentParam = trajectory[visibleN];
  const nextHop = visibleN < N ? trajectory[visibleN + 1] : null;

  return (
    <VisualCard caption="Training loop convergence showing Loss Curve (left) and 2D Parameter Loss Landscape Descent (right) side-by-side. As backpropagation runs, gradients guide the parameters in sequential 'hops' down the loss valley directly into the global minimum.">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-p6)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--accent-p6)" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-p6)" />
            <stop offset="100%" stopColor="var(--accent-p2)" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--accent-p5)" />
          </marker>
        </defs>

        {/* ─── LEFT: LOSS CURVE CHART ─── */}
        {[0.5, 1.0, 1.5, 2.0, 2.5].map(v => (
          <g key={v}>
            <line x1={padL} y1={yScale(v)} x2={padL + chartW} y2={yScale(v)} stroke={S.rule} strokeWidth="0.5" strokeDasharray="2 4"/>
            <text x={padL - 8} y={yScale(v) + 4} textAnchor="end" fontSize="10" fill={S.ink3} fontFamily="var(--mono)" fontWeight="600">{v.toFixed(1)}</text>
          </g>
        ))}
        <line x1={padL} y1={yScale(2.4)} x2={padL + chartW} y2={yScale(2.4)} stroke={S.ink3} strokeWidth="0.6" strokeDasharray="4 4" opacity="0.5"/>
        <text x={padL + chartW - 4} y={yScale(2.4) - 4} textAnchor="end" fontSize="10" fill={S.ink3} fontStyle="italic" fontFamily="var(--sans)">random init</text>
        <line x1={padL} y1={yScale(0.15)} x2={padL + chartW} y2={yScale(0.15)} stroke={S.ink3} strokeWidth="0.6" strokeDasharray="4 4" opacity="0.5"/>
        <text x={padL + chartW - 4} y={yScale(0.15) - 4} textAnchor="end" fontSize="10" fill={S.ink3} fontStyle="italic" fontFamily="var(--sans)">converged</text>
        
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={S.ink3} strokeWidth="0.8"/>
        <line x1={padL} y1={H - padB} x2={padL + chartW} y2={H - padB} stroke={S.ink3} strokeWidth="0.8"/>
        
        {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}
        {linePath && <path d={linePath} fill="none" stroke="url(#curveGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>}
        
        {visibleN > 0 && <>
          <circle cx={labelX} cy={labelY} r="5" fill="var(--accent-p6)"/>
          <circle cx={labelX} cy={labelY} r="9" fill="none" stroke="var(--accent-p6)" strokeWidth="1.2" opacity="0.4"/>
        </>}
        {visibleN > 0 && <g>
          <rect x={Math.min(padL + chartW - 88, labelX + 10)} y={labelY - 16} width="78" height="22" rx="6" fill="rgba(251, 113, 133, 0.1)" stroke="var(--accent-p6)" strokeWidth="1" style={{ backdropFilter: 'blur(4px)' }}/>
          <text x={Math.min(padL + chartW - 88, labelX + 10) + 39} y={labelY - 1} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--foreground)" fontFamily="var(--mono)">L = {currentLoss.toFixed(3)}</text>
        </g>}
        
        {[0, 25, 50, 75, 100].map(tick => (
          <g key={`xt-${tick}`}>
            <line x1={xScale(tick)} y1={H - padB} x2={xScale(tick)} y2={H - padB + 4} stroke={S.ink3} strokeWidth="0.6"/>
            <text x={xScale(tick)} y={H - padB + 16} textAnchor="middle" fontSize="10" fill={S.ink3} fontFamily="var(--mono)" fontWeight="600">{tick}</text>
          </g>
        ))}
        <text x={padL + chartW / 2} y={H - 10} textAnchor="middle" fontSize="10" fill={S.ink3} fontFamily="var(--mono)" fontWeight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>training step</text>
        <text x={18} y={H / 2} textAnchor="middle" fontSize="10" fill={S.ink3} fontFamily="var(--mono)" fontWeight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }} transform={`rotate(-90, 18, ${H / 2})`}>loss value</text>

        {/* ─── RIGHT: PARAMETER LOSS LANDSCAPE ─── */}
        {/* Sleek dashed contour ellipses depicting 3D valley projected to 2D space */}
        <ellipse cx={landscapeCenter.x} cy={landscapeCenter.y} rx="130" ry="90" fill="none" stroke="rgba(251, 113, 133, 0.12)" strokeWidth="1.2" strokeDasharray="3 6" />
        <ellipse cx={landscapeCenter.x} cy={landscapeCenter.y} rx="100" ry="70" fill="none" stroke="rgba(251, 113, 133, 0.2)" strokeWidth="1.2" strokeDasharray="3 5" />
        <ellipse cx={landscapeCenter.x} cy={landscapeCenter.y} rx="70" ry="50" fill="none" stroke="rgba(96, 165, 250, 0.25)" strokeWidth="1.2" strokeDasharray="3 4" />
        <ellipse cx={landscapeCenter.x} cy={landscapeCenter.y} rx="45" ry="32" fill="none" stroke="rgba(96, 165, 250, 0.35)" strokeWidth="1.2" strokeDasharray="3 3" />
        <ellipse cx={landscapeCenter.x} cy={landscapeCenter.y} rx="20" ry="14" fill="none" stroke="rgba(52, 211, 153, 0.45)" strokeWidth="1.2" />

        {/* Target Optimal Minimum (Bowl Floor) */}
        <g style={{ opacity: 0.9 }}>
          <circle cx={landscapeCenter.x} cy={landscapeCenter.y} r="6" fill="none" stroke="var(--accent-p4)" strokeWidth="1.5" />
          <line x1={landscapeCenter.x - 12} y1={landscapeCenter.y} x2={landscapeCenter.x + 12} y2={landscapeCenter.y} stroke="var(--accent-p4)" strokeWidth="1" />
          <line x1={landscapeCenter.x} y1={landscapeCenter.y - 12} x2={landscapeCenter.x} y2={landscapeCenter.y + 12} stroke="var(--accent-p4)" strokeWidth="1" />
        </g>

        {/* Parameter Hop Trajectory Path */}
        {visibleN > 0 && (
          <path
            d={'M ' + trajectory.slice(0, visibleN + 1).map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}
            fill="none"
            stroke="url(#curveGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
        )}

        {/* Gradient updates hop vector arrow (next descent direction) */}
        {nextHop && (
          <line
            x1={currentParam.x}
            y1={currentParam.y}
            x2={currentParam.x + (nextHop.x - currentParam.x) * 1.5}
            y2={currentParam.y + (nextHop.y - currentParam.y) * 1.5}
            stroke="var(--accent-p5)"
            strokeWidth="2.2"
            markerEnd="url(#arrow)"
          />
        )}

        {/* Active parameter dot with glowing/pulsing effect */}
        <circle cx={currentParam.x} cy={currentParam.y} r="5.5" fill="var(--accent-p2)" filter="url(#glow)" />
        <circle cx={currentParam.x} cy={currentParam.y} r="5.5" fill="none" stroke="#fff" strokeWidth="1.2" />

        {/* Text Labels */}
        <text x={landscapeCenter.x + 95} y={65} textAnchor="middle" fontSize="9" fill={S.ink3} fontStyle="italic" fontFamily="var(--sans)" opacity="0.6">High Loss Basin</text>
        <text x={landscapeCenter.x} y={landscapeCenter.y - 18} textAnchor="middle" fontSize="9.5" fill="var(--accent-p4)" fontWeight="700" fontFamily="var(--sans)" opacity="0.9">Global Minimum (w*, b*)</text>
        <text x={landscapeCenter.x} y={H - 10} textAnchor="middle" fontSize="10" fill={S.ink3} fontFamily="var(--mono)" fontWeight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>2D Parameter Space (w₁, w₂)</text>

        {/* Vertical divider */}
        <line x1="395" y1="20" x2="395" y2="280" stroke={S.rule} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" />
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
        <RunButton onClick={run} disabled={running} label={running ? 'Training...' : 'Run training'} />
        <div style={{ fontSize: 12.5, color: S.ink2, fontStyle: 'italic', minHeight: 18, fontFamily: 'var(--sans)' }}>
          {running ? `step ${progress} of ${N} · loss ${currentLoss.toFixed(3)}` : progress === N ? `final loss ${currentLoss.toFixed(3)} · parameters converged` : 'press run to begin'}
        </div>
      </div>
    </VisualCard>
  );
}

export default function SectionBackprop() {
  return (
    <Section id="backprop" eyebrow="1.7 · Backpropagation" title="Backpropagation — how the parameters get learned" kicker="An untrained MLP outputs garbage. Backpropagation is the algorithm that turns garbage into competence by gradually adjusting every weight and every bias.">
      <Para>
        Learning is a three-step loop repeated trillions of times: <em>predict, measure, correct</em>. Backpropagation encompasses this entire sequence. First, a <strong>forward pass</strong> feeds inputs through layers to produce a prediction. Second, a <strong>loss function</strong> measures how wrong that prediction was compared to the target. Finally, a <strong>backward pass</strong> applies the chain rule of calculus in reverse to calculate gradients, letting the optimizer nudge each weight and bias toward correctness.
      </Para>
      <Sub title="One training step (Consolidated Loop)">
        <Para>Below is one step in slow motion. Notice that the forward pass happens first (activating input, hidden, and output nodes in blue), and then the gradient (in rose) walks <em>back</em> through the exact same connections — the chain rule applied through the computational graph to determine the update direction.</Para>
        <BackpropVisual />
      </Sub>
      <Sub title="Reducing loss — the parameter hopping descent">
        <Para>Repeat that training step many thousands of times and the parameters gradually slide down the high-dimensional loss landscape. Below, we visualize both the dropping Loss Curve (left) and the corresponding parameter &quot;hops&quot; down the contour bowl of the Loss Landscape (right) in real time.</Para>
        <LossCurveVisual />
        <Callout label="The four moving parts">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}><strong style={{ color: S.teal, fontFamily: 'var(--mono)', fontSize: 12, minWidth: 110 }}>Loss function</strong> <span style={{ color: S.ink2 }}>— one scalar quantifying how wrong the prediction was. Cross-entropy for language; MSE for regression.</span></li>
            <li style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}><strong style={{ color: S.teal, fontFamily: 'var(--mono)', fontSize: 12, minWidth: 110 }}>Gradient</strong> <span style={{ color: S.ink2 }}>— partial derivative of the loss with respect to each parameter, computed efficiently by the chain rule.</span></li>
            <li style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}><strong style={{ color: S.teal, fontFamily: 'var(--mono)', fontSize: 12, minWidth: 110 }}>Learning rate</strong> <span style={{ color: S.ink2 }}>— step size. Modern recipes warm up from zero, then decay on a cosine schedule.</span></li>
            <li style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}><strong style={{ color: S.teal, fontFamily: 'var(--mono)', fontSize: 12, minWidth: 110 }}>Optimizer</strong> <span style={{ color: S.ink2 }}>— the rule that turns gradients into updates. AdamW is the default in 2026.</span></li>
          </ul>
        </Callout>
      </Sub>
      <Callout label="The whole story">
        Every modern LLM — pretraining, supervised fine-tuning, DPO, PPO, GRPO — is this loop, scaled up. The architecture changes; the learning algorithm doesn't. Phase 3's nanoGPT build will have you run this exact loop on real data.
      </Callout>
    </Section>
  );
}
