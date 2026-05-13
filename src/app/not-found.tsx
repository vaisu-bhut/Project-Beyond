import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted font-mono mb-4">
        404 · Off-path
      </p>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
        That page <span className="gradient-text">isn&apos;t in the roadmap.</span>
      </h1>
      <p className="text-foreground-muted max-w-md mx-auto mb-10 leading-relaxed">
        Maybe a phase URL that doesn&apos;t exist, or a section that hasn&apos;t been written yet.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
      >
        Back to the roadmap
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
