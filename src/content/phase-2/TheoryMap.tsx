"use client";

import { ChapterDivider } from "@/components/book/ChapterDivider";
import SectionTransformer from "./ch1/TransformerSection";
import SectionMLP from "./ch1/MLPSection";
import SectionBackprop from "./ch1/BackpropSection";

const ACCENT = "--accent-p2";

const STYLES = `
  .p2-root {
    /* Mapped theme variables */
    --bg: transparent;
    --bg-elev: var(--background-elevated);
    --bg-sunken: var(--background-soft);
    --ink: var(--foreground);
    --ink-2: color-mix(in oklab, var(--foreground) 85%, transparent);
    --ink-3: var(--foreground-muted);
    --rule: var(--border);
    --sans: var(--font-sans), system-ui, sans-serif;
    --mono: var(--font-mono), ui-monospace, monospace;
    font-family: var(--sans);
    color: var(--ink);
  }

  /* Premium visual elements */
  .p2-glass {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .p2-glass:hover {
    border-color: rgba(96, 165, 250, 0.25);
    box-shadow: 0 12px 40px 0 rgba(96, 165, 250, 0.06);
  }

  html.light .p2-glass {
    background: rgba(255, 255, 255, 0.7);
    border-color: rgba(0, 0, 0, 0.06);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
  }
  
  html.light .p2-glass:hover {
    border-color: rgba(96, 165, 250, 0.3);
    box-shadow: 0 12px 40px 0 rgba(96, 165, 250, 0.08);
  }

  /* Micro-animations */
  @keyframes stream-pulse {
    0%, 100% { filter: drop-shadow(0 0 1px rgba(96, 165, 250, 0.2)); opacity: 0.8; }
    50% { filter: drop-shadow(0 0 4px rgba(96, 165, 250, 0.6)); opacity: 1; }
  }
  .pulse-stream {
    animation: stream-pulse 3s ease-in-out infinite;
  }

  @keyframes pulse-node {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0px var(--accent-p2)); }
    50% { transform: scale(1.05); filter: drop-shadow(0 0 4px var(--accent-p2)); }
  }
  .pulse-node-active {
    animation: pulse-node 1.5s ease-in-out infinite;
  }

  /* Button styles */
  .p2-btn-pill {
    background: var(--bg-sunken);
    border: 1px solid var(--rule);
    color: var(--ink-2);
    border-radius: 9999px;
    padding: 6px 14px;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .p2-btn-pill:hover:not(:disabled) {
    border-color: var(--accent-p2);
    color: var(--ink);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.08);
  }

  .p2-btn-pill:active:not(:disabled) {
    transform: translateY(0);
  }

  .p2-btn-pill-active {
    background: linear-gradient(135deg, var(--accent-p2) 0%, #3b82f6 100%);
    border-color: var(--accent-p2);
    color: #ffffff !important;
    box-shadow: 0 4px 14px rgba(96, 165, 250, 0.2);
  }

  html.light .p2-btn-pill-active {
    color: #ffffff !important;
  }

  .p2-btn-pill-active:hover {
    box-shadow: 0 6px 18px rgba(96, 165, 250, 0.3);
  }

  /* Transition timings */
  .transition-svg {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

export default function Phase2TheoryMap() {
  return (
    <div className="p2-root space-y-12">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <ChapterDivider number="1" title="Vectors, Weights, Biases — and the Loop That Trains Them" accentVar={ACCENT} />
      <SectionTransformer />
      <SectionMLP />
      <SectionBackprop />
    </div>
  );
}
