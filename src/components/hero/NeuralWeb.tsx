"use client";

import { useMemo } from "react";

type Node = { x: number; y: number; r: number; delay: number };

export function NeuralWeb() {
  const layers = useMemo(() => {
    const layerCount = 4;
    const heights = [4, 6, 6, 3];
    const width = 800;
    const height = 320;
    const nodes: Node[][] = [];
    for (let l = 0; l < layerCount; l++) {
      const x = ((l + 1) / (layerCount + 1)) * width;
      const layer: Node[] = [];
      const n = heights[l];
      for (let i = 0; i < n; i++) {
        const y = ((i + 1) / (n + 1)) * height;
        layer.push({ x, y, r: 5, delay: (l * 0.4 + i * 0.1) % 3 });
      }
      nodes.push(layer);
    }
    return { nodes, width, height };
  }, []);

  return (
    <svg
      viewBox={`0 0 ${layers.width} ${layers.height}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="edge-grad" x1="0" x2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="node-grad">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>

      {layers.nodes.slice(0, -1).map((layer, li) =>
        layer.map((from, fi) =>
          layers.nodes[li + 1].map((to, ti) => (
            <line
              key={`${li}-${fi}-${ti}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#edge-grad)"
              strokeWidth="0.5"
              opacity={0.45}
            />
          )),
        ),
      )}

      {layers.nodes.flatMap((layer, li) =>
        layer.map((node, ni) => (
          <g key={`n-${li}-${ni}`}>
            <circle cx={node.x} cy={node.y} r={node.r + 6} fill="url(#node-grad)" opacity="0.5">
              <animate
                attributeName="opacity"
                values="0.2;0.7;0.2"
                dur={`${3 + (ni % 3) * 0.5}s`}
                begin={`${node.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={node.x} cy={node.y} r={node.r} fill="#0a0a14" stroke="#a78bfa" strokeWidth="1.2" />
          </g>
        )),
      )}
    </svg>
  );
}
