"use client";

import { InlineMath, BlockMath } from "react-katex";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  formula: string;
  display?: boolean;
  description?: string;
  className?: string;
};

export function FormulaCard({ name, formula, display = true, description, className }: Props) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-5 transition-all hover:border-foreground/20 hover:translate-y-[-2px]",
        className,
      )}
    >
      <div className="text-xs uppercase tracking-widest text-foreground-muted mb-3 font-mono">
        {name}
      </div>
      <div className="text-foreground my-2 overflow-x-auto">
        {display ? <BlockMath math={formula} /> : <InlineMath math={formula} />}
      </div>
      {description && (
        <p className="text-sm text-foreground-muted mt-3 leading-relaxed">{description}</p>
      )}
    </div>
  );
}

export function Inline({ math }: { math: string }) {
  return <InlineMath math={math} />;
}
