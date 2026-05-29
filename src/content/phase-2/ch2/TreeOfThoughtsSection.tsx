"use client";
import React, { useState } from "react";

/**
 * §2.5 — Tree of Thoughts
 * Game of 24 mini explorer + ToT vs. CoT explanation
 */

const S = {
  ink: "var(--foreground)",
  ink2: "color-mix(in oklab, var(--foreground) 85%, transparent)",
  ink3: "var(--foreground-muted)",
  bg: "var(--background-elevated)",
  bgSunk: "var(--background-soft)",
  rule: "var(--border)",
  blue: "var(--accent-p2)",
  teal: "var(--accent-p4)",
  amber: "var(--accent-p5)",
  rose: "var(--accent-p6)",
  violet: "var(--accent-p1)",
};

function Section({
  id, eyebrow, title, kicker, children,
}: {
  id: string; eyebrow: string; title: string; kicker?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-12" style={{ borderTop: `2px solid ${S.blue}` }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: S.blue, marginBottom: 8, fontFamily: "var(--mono)" }}>
        {eyebrow}
      </div>
      <h2 className="tracking-tight" style={{ fontSize: 32, fontWeight: 600, color: S.ink, lineHeight: 1.1, marginBottom: 12 }}>
        {title}
      </h2>
      {kicker && <p style={{ fontSize: 15, color: S.ink2, fontStyle: "italic", lineHeight: 1.6, marginBottom: 24 }}>{kicker}</p>}
      {children}
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 40, marginBottom: 8 }}>
      <h3 className="tracking-tight" style={{ fontSize: 22, fontWeight: 600, color: S.ink, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15.5, color: S.ink2, lineHeight: 1.7, marginBottom: 16 }}>{children}</p>;
}

function Callout({
  borderColor, labelColor, label, children,
}: {
  borderColor?: string; labelColor?: string; label: string; children: React.ReactNode;
}) {
  return (
    <div className="p2-glass p2-callout" style={{ borderLeft: `3px solid ${borderColor || S.blue}`, padding: "16px 20px", margin: "24px 0", borderRadius: "0 12px 12px 0" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, color: labelColor || S.blue, marginBottom: 6, fontFamily: "var(--mono)" }}>
        {label}
      </div>
      <div style={{ fontSize: 14.5, color: S.ink2, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function VisualCard({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <div style={{ margin: "28px 0" }}>
      <div className="p2-glass p2-visual-card" style={{ borderRadius: 16, padding: "28px 24px" }}>{children}</div>
      {caption && (
        <div style={{ fontSize: 12, color: S.ink3, fontStyle: "italic", marginTop: 10, maxWidth: 720, margin: "10px auto 0", lineHeight: 1.6, padding: "0 16px", textAlign: "center" }}>
          {caption}
        </div>
      )}
    </div>
  );
}

// ── Tree of Thoughts Data ──
type TreeNode = {
  id: string;
  label: string;
  remaining?: string;
  score: number;
  status: "solved" | "promising" | "dead" | "exploring";
  note?: string;
  children?: TreeNode[];
};

const TOT_TREE: TreeNode = {
  id: "root",
  label: "Cards: 4, 6, 8, 8 → make 24",
  score: 1.0,
  status: "exploring",
  children: [
    {
      id: "A",
      label: "4 + 8 = 12",
      remaining: "12, 6, 8 → 24",
      score: 0.7,
      status: "promising",
      children: [
        {
          id: "A1",
          label: "12 × 6 = 72",
          remaining: "72, 8 → 24",
          score: 0.1,
          status: "dead",
          note: "72/8 = 9, 72-8 = 64. Dead end.",
        },
        {
          id: "A2",
          label: "12 - 6 = 6",
          remaining: "6, 8 → 24",
          score: 0.5,
          status: "promising",
          children: [
            {
              id: "A2a",
              label: "6 × 8 = 48",
              remaining: "48 → 24?",
              score: 0.1,
              status: "dead",
              note: "48/2 has no 2. Dead end.",
            },
          ],
        },
        {
          id: "A3",
          label: "12 ÷ 6 = 2",
          remaining: "2, 8 → 24",
          score: 0.8,
          status: "promising",
          children: [
            {
              id: "A3a",
              label: "2 × 8 = 16",
              remaining: "16 → 24?",
              score: 0.0,
              status: "dead",
              note: "Can't reach 24 from 16 alone.",
            },
            {
              id: "A3b",
              label: "8 ÷ 2 = 4",
              remaining: "4 → 24?",
              score: 0.0,
              status: "dead",
              note: "4 ≠ 24. Dead end.",
            },
          ],
        },
      ],
    },
    {
      id: "B",
      label: "8 ÷ 4 = 2",
      remaining: "2, 6, 8 → 24",
      score: 0.75,
      status: "promising",
      children: [
        {
          id: "B1",
          label: "2 × 6 = 12",
          remaining: "12, 8 → 24",
          score: 0.9,
          status: "promising",
          children: [
            {
              id: "B1a",
              label: "12 + 8 = 20",
              remaining: "20 → 24?",
              score: 0.0,
              status: "dead",
              note: "20 ≠ 24.",
            },
            {
              id: "B1b",
              label: "12 × 8 = 96",
              remaining: "96 → 24?",
              score: 0.0,
              status: "dead",
              note: "96/4 needs a 4. Dead end.",
            },
          ],
        },
        {
          id: "B2",
          label: "6 × 8 = 48",
          remaining: "48, 2 → 24",
          score: 0.95,
          status: "solved",
          note: "48 ÷ 2 = 24 ✓",
          children: [
            {
              id: "B2a",
              label: "48 ÷ 2 = 24",
              remaining: "= 24 ✓",
              score: 1.0,
              status: "solved",
              note: "SOLUTION: (8÷4) yields 2; 6×8=48; 48÷2=24",
            },
          ],
        },
      ],
    },
    {
      id: "C",
      label: "6 × 8 = 48",
      remaining: "48, 4, 8 → 24",
      score: 0.6,
      status: "promising",
      children: [
        {
          id: "C1",
          label: "48 ÷ 4 = 12",
          remaining: "12, 8 → 24",
          score: 0.4,
          status: "dead",
          note: "12 + 8 = 20, 12 × 8 = 96. Dead end.",
        },
        {
          id: "C2",
          label: "48 ÷ 8 = 6",
          remaining: "6, 4 → 24",
          score: 0.85,
          status: "solved",
          note: "6 × 4 = 24 ✓",
          children: [
            {
              id: "C2a",
              label: "6 × 4 = 24",
              remaining: "= 24 ✓",
              score: 1.0,
              status: "solved",
              note: "SOLUTION: 6×8=48; 48÷8=6; 6×4=24",
            },
          ],
        },
      ],
    },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  solved: "var(--accent-p4)",
  promising: "var(--accent-p2)",
  dead: "var(--accent-p6)",
  exploring: "var(--accent-p5)",
};

const STATUS_BG: Record<string, string> = {
  solved: "rgba(52, 211, 153, 0.12)",
  promising: "rgba(96, 165, 250, 0.10)",
  dead: "rgba(251, 113, 133, 0.08)",
  exploring: "rgba(251, 191, 36, 0.10)",
};

function TreeNodeView({
  node,
  expanded,
  onToggle,
  depth = 0,
}: {
  node: TreeNode;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  depth?: number;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded[node.id];
  const color = STATUS_COLORS[node.status];
  const bg = STATUS_BG[node.status];

  return (
    <div style={{ paddingLeft: depth > 0 ? 24 : 0, marginTop: depth > 0 ? 8 : 0 }}>
      {depth > 0 && (
        <div style={{
          position: "absolute", left: depth * 24 - 12,
          top: 0, width: 12, height: "50%",
          borderLeft: `1px dashed ${S.rule}`,
          borderBottom: `1px dashed ${S.rule}`,
          pointerEvents: "none",
        }} />
      )}
      <div style={{ position: "relative" }}>
        <div
          onClick={() => hasChildren && onToggle(node.id)}
          style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "10px 14px", borderRadius: 8,
            background: bg, border: `1px solid ${color}30`,
            cursor: hasChildren ? "pointer" : "default",
            transition: "all 0.2s",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 20 }}>
            {hasChildren && (
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color, lineHeight: 1 }}>
                {isExpanded ? "▾" : "▸"}
              </span>
            )}
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: color,
              boxShadow: `0 0 4px ${color}`,
              marginTop: hasChildren ? 0 : 4,
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: S.ink, fontFamily: "var(--mono)" }}>
              {node.label}
            </div>
            {node.remaining && (
              <div style={{ fontSize: 12, color: S.ink3, marginTop: 2 }}>
                remaining: <span style={{ color: color }}>{node.remaining}</span>
              </div>
            )}
            {node.note && (
              <div style={{ fontSize: 12, color: node.status === "solved" ? color : S.ink3, marginTop: 4, fontStyle: "italic" }}>
                {node.note}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11,
              background: bg, color, padding: "2px 7px",
              borderRadius: 4, border: `1px solid ${color}40`,
              whiteSpace: "nowrap",
            }}>
              {node.status}
            </div>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11,
              color: S.ink3,
            }}>
              {(node.score * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div style={{ marginLeft: 20, borderLeft: `1px solid ${S.rule}`, paddingLeft: 4 }}>
            {node.children!.map((child) => (
              <TreeNodeView
                key={child.id}
                node={child}
                expanded={expanded}
                onToggle={onToggle}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TreeOfThoughtsExplorer() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    root: true,
    B: true,
    B2: true,
  });

  const onToggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    function traverse(node: TreeNode) {
      all[node.id] = true;
      node.children?.forEach(traverse);
    }
    traverse(TOT_TREE);
    setExpanded(all);
  };

  const collapseAll = () => setExpanded({ root: true });

  return (
    <VisualCard caption="Click any node with children to expand/collapse. Follow path B → B2 → B2a for the primary solution.">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.ink3, fontFamily: "var(--mono)", marginBottom: 4 }}>
            Game of 24 — Cards: 4, 6, 8, 8
          </div>
          <div style={{ fontSize: 13, color: S.ink2 }}>Explore the thought tree. Dead ends are pruned; promising branches are expanded.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="p2-btn-pill" onClick={collapseAll}>Collapse</button>
          <button className="p2-btn-pill p2-btn-pill-active" onClick={expandAll}>Expand all</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 4px ${color}` }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: S.ink3 }}>{status}</span>
          </div>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <TreeNodeView node={TOT_TREE} expanded={expanded} onToggle={onToggle} />
      </div>
    </VisualCard>
  );
}

// ── CoT vs ToT comparison SVG ──
function CotVsToTDiagram() {
  return (
    <VisualCard caption="CoT generates a single path; ToT branches, evaluates, and backtracks. The cost difference is real — ToT is an expensive oracle method, not a default prompting strategy.">
      <svg viewBox="0 0 720 320" className="w-full h-auto">
        {/* CoT column */}
        <text x="120" y="28" textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fill={S.blue} fontWeight="700" letterSpacing="1">
          CHAIN-OF-THOUGHT
        </text>
        <text x="120" y="44" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill={S.ink3}>
          Single path, no backtracking
        </text>

        {/* CoT chain */}
        {["Problem", "Step 1", "Step 2", "Step 3", "Answer"].map((label, i) => {
          const y = 70 + i * 50;
          const isAnswer = i === 4;
          return (
            <g key={i}>
              <rect x={40} y={y} width={160} height={34} rx={6}
                fill={isAnswer ? "rgba(96,165,250,0.1)" : "rgba(96,165,250,0.05)"}
                stroke={S.blue} strokeWidth={isAnswer ? 2 : 1} />
              <text x={120} y={y + 21} textAnchor="middle" fontFamily="var(--mono)" fontSize={12} fill={S.ink}>
                {label}
              </text>
              {i < 4 && (
                <line x1={120} y1={y + 34} x2={120} y2={y + 50}
                  stroke={S.blue} strokeWidth={1.5} strokeDasharray="4 2" />
              )}
            </g>
          );
        })}

        {/* Divider */}
        <line x1="240" y1="20" x2="240" y2="310" stroke={S.rule} strokeWidth={1} />

        {/* ToT column */}
        <text x="480" y="28" textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fill={S.teal} fontWeight="700" letterSpacing="1">
          TREE OF THOUGHTS
        </text>
        <text x="480" y="44" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill={S.ink3}>
          Multiple paths, pruning, backtracking
        </text>

        {/* ToT tree structure */}
        {/* Root */}
        <rect x={380} y={70} width={200} height={34} rx={6}
          fill="rgba(251,191,36,0.10)" stroke={S.amber} strokeWidth={1.5} />
        <text x={480} y={91} textAnchor="middle" fontFamily="var(--mono)" fontSize={12} fill={S.ink}>Problem</text>

        {/* Branch lines */}
        <line x1={430} y1={104} x2={370} y2={136} stroke={S.rule} strokeWidth={1} strokeDasharray="4 2" />
        <line x1={480} y1={104} x2={480} y2={136} stroke={S.rule} strokeWidth={1} strokeDasharray="4 2" />
        <line x1={530} y1={104} x2={600} y2={136} stroke={S.rule} strokeWidth={1} strokeDasharray="4 2" />

        {/* Branch A — dead */}
        <rect x={310} y={136} width={120} height={30} rx={5} fill="rgba(251,113,133,0.08)" stroke={S.rose} strokeWidth={1} />
        <text x={370} y={154} textAnchor="middle" fontFamily="var(--mono)" fontSize={11} fill={S.rose}>Path A ✗</text>

        {/* Branch B — solved */}
        <rect x={420} y={136} width={120} height={30} rx={5} fill="rgba(52,211,153,0.10)" stroke={S.teal} strokeWidth={2} />
        <text x={480} y={154} textAnchor="middle" fontFamily="var(--mono)" fontSize={11} fill={S.teal}>Path B ✓</text>
        <line x1={480} y1={166} x2={480} y2={196} stroke={S.teal} strokeWidth={1.5} />
        <rect x={420} y={196} width={120} height={30} rx={5} fill="rgba(52,211,153,0.15)" stroke={S.teal} strokeWidth={2} />
        <text x={480} y={214} textAnchor="middle" fontFamily="var(--mono)" fontSize={11} fill={S.teal}>= 24 ✓</text>

        {/* Branch C — dead */}
        <rect x={550} y={136} width={120} height={30} rx={5} fill="rgba(251,113,133,0.08)" stroke={S.rose} strokeWidth={1} />
        <text x={610} y={154} textAnchor="middle" fontFamily="var(--mono)" fontSize={11} fill={S.rose}>Path C ✗</text>

        {/* Evaluator badge */}
        <rect x={400} y={252} width={160} height={36} rx={8}
          fill="rgba(167,139,250,0.10)" stroke={S.violet} strokeWidth={1.5} />
        <text x={480} y={267} textAnchor="middle" fontFamily="var(--mono)" fontSize={10} fill={S.violet} letterSpacing="1">EVALUATOR</text>
        <text x={480} y={281} textAnchor="middle" fontFamily="var(--sans)" fontSize={11} fill={S.ink2}>score each partial state</text>

        <text x={360} y={310} fontFamily="var(--mono)" fontSize={10} fill={S.ink3}>N paths × depth steps × eval calls</text>
      </svg>
    </VisualCard>
  );
}

// ── Main Export ──
export default function SectionTreeOfThoughts() {
  return (
    <Section
      id="tree-of-thoughts"
      eyebrow="2.5 · Tree of Thoughts"
      title="Tree of Thoughts"
      kicker="CoT generates a single path. ToT generates many, scores each partial state, and backtracks. More powerful, substantially more expensive."
    >
      <Para>
        Yao et al. (2023) extended CoT by turning the generation process into a tree search. Instead
        of committing to one chain of reasoning, the model generates multiple{" "}
        <strong style={{ color: S.blue }}>thought candidates</strong> at each step, evaluates which
        are most promising, and explores the best branches — pruning dead ends and backtracking when
        stuck.
      </Para>

      <Sub title="CoT vs. ToT — the structural difference">
        <Para>
          Chain-of-thought is a path. Tree of Thoughts is a search procedure.
        </Para>
        <CotVsToTDiagram />
      </Sub>

      <Sub title="Game of 24 — explore the thought tree">
        <Para>
          The Game of 24 is a classic ToT benchmark: given four numbers, use arithmetic operations
          to reach 24. CoT almost always fails because the solution requires backtracking.
          Explore the tree below — try following path B → B2 → B2a for the primary solution.
        </Para>
        <TreeOfThoughtsExplorer />
      </Sub>

      <Callout borderColor={S.teal} labelColor={S.teal} label="Why CoT fails the Game of 24">
        CoT commits to each step before evaluating whether it leads anywhere useful. If the first
        operation creates a dead end, there is no way to recover — the model cannot backtrack.
        ToT evaluates partial states before committing to them, using the language model as its own
        evaluator: <em>"Does this partial game state look solvable?"</em>
      </Callout>

      <Callout borderColor={S.rose} labelColor={S.rose} label="Cost — this is an oracle method, not a default">
        ToT at breadth=5 and depth=4 requires{" "}
        <strong style={{ color: S.ink }}>5⁴ = 625 LM calls</strong> in the worst case, plus
        evaluator calls. This is useful for academic benchmarking and hard combinatorial problems,
        not for everyday LLM applications. In practice, most systems that need structured search use
        MCTS or beam search with a learned verifier instead of naive ToT.
      </Callout>

      <Sub title="The design space: what ToT adds over CoT">
        <div className="p2-glass p2-card" style={{ borderRadius: 12, padding: "20px 24px", margin: "20px 0" }}>
          {[
            {
              feature: "Thought decomposition",
              cot: "Single token stream",
              tot: "Explicit thought steps (sentences, code blocks, actions)",
              color: S.blue,
            },
            {
              feature: "Search strategy",
              cot: "Greedy / beam",
              tot: "BFS, DFS, MCTS — configurable",
              color: S.teal,
            },
            {
              feature: "State evaluation",
              cot: "None (committed on generation)",
              tot: "LM evaluates: sure / maybe / impossible",
              color: S.amber,
            },
            {
              feature: "Backtracking",
              cot: "Impossible",
              tot: "Built-in — prune dead branches",
              color: S.violet,
            },
          ].map(({ feature, cot, tot, color }) => (
            <div key={feature} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12, marginBottom: 12, paddingBottom: 12,
              borderBottom: `1px solid ${S.rule}`,
            }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color, fontWeight: 600 }}>{feature}</span>
              <span style={{ fontSize: 13, color: S.ink3 }}>{cot}</span>
              <span style={{ fontSize: 13, color: S.ink }}>{tot}</span>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 4 }}>
            <span />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: S.ink3, letterSpacing: "0.1em" }}>CoT</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: S.blue, letterSpacing: "0.1em" }}>Tree of Thoughts</span>
          </div>
        </div>
      </Sub>

      <Callout borderColor={S.blue} labelColor={S.blue} label="Where this is heading">
        ToT was an important 2023 paper, but modern reasoning models (DeepSeek-R1, OpenAI o-series)
        have largely internalized search behavior through reinforcement learning on chain-of-thought.
        Rather than prompting a base model to do explicit tree search, these models learn to explore,
        backtrack, and verify in their extended thinking tokens. The{" "}
        <strong style={{ color: S.blue }}>structure of ToT</strong> — evaluate, branch, prune — is
        still deeply relevant. It just moved from prompt engineering to model training (Phase 5).
      </Callout>
    </Section>
  );
}
