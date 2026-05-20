export function Footer() {
  return (
    <footer className="mt-32 border-t border-foreground/[0.08]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="font-semibold tracking-tight">
            Project <span className="gradient-text">Beyond</span>
          </p>
          <p className="text-xs text-foreground-muted mt-1 font-mono">
            14–18 months. 12–15 hrs/week. Theory upfront, builds as the bulk.
          </p>
        </div>
        <p className="text-xs text-foreground-muted max-w-md md:text-right leading-relaxed">
          Most people who claim to know this material can talk about it. Very few can build it. Be the second kind.
        </p>
      </div>
    </footer>
  );
}
