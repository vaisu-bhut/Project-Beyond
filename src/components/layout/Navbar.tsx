import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative size-7 rounded-lg flex items-center justify-center overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 opacity-90" />
            <span className="absolute inset-[1.5px] rounded-[7px] bg-background" />
            <span className="relative font-mono font-bold text-xs gradient-text">β</span>
          </span>
          <span className="font-semibold tracking-tight">
            Project <span className="gradient-text">Beyond</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/#phases"
            className="px-3 py-1.5 rounded-md text-foreground-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
          >
            Phases
          </Link>
          <Link
            href="/concepts"
            className="px-3 py-1.5 rounded-md text-foreground-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
          >
            Concepts
          </Link>
          <Link
            href="/appendix"
            className="px-3 py-1.5 rounded-md text-foreground-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
          >
            Appendix
          </Link>
        </nav>
      </div>
    </header>
  );
}
