import type { ReactNode } from "react";
import { Notebook } from "lucide-react";

type Props = {
  children?: ReactNode;
  accentVar?: string;
};

/**
 * A dedicated zone in each subsection file where you write your personal
 * summary / notes / takeaways. Drop content (text, JSX, code, formulas)
 * between `<NotesSection>...</NotesSection>` and it will be styled consistently.
 *
 * The empty state ships with the file so you know where to write.
 */
export function NotesSection({ children, accentVar = "--accent-p2" }: Props) {
  const hasContent = children !== undefined && children !== null && children !== false;

  return (
    <section className="mt-16 mb-8">
      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden glass"
        style={{
          background: `linear-gradient(180deg, color-mix(in oklab, var(${accentVar}) 6%, transparent), transparent 70%)`,
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="size-9 rounded-lg flex items-center justify-center"
            style={{
              background: `color-mix(in oklab, var(${accentVar}) 18%, transparent)`,
              color: `var(${accentVar})`,
            }}
          >
            <Notebook className="size-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-foreground-muted font-mono">
              Your notes
            </div>
            <h3 className="text-lg font-semibold text-foreground">Personal summary</h3>
          </div>
        </div>

        {hasContent ? (
          <div className="prose prose-invert max-w-none [&>p]:text-foreground/85 [&>p]:leading-relaxed [&>ul]:text-foreground/85">
            {children}
          </div>
        ) : (
          <div className="text-sm text-foreground-muted italic leading-relaxed border-l-2 border-foreground/10 pl-4">
            Write your summary, key takeaways, links to your repos, code snippets, or
            anything you want to remember here. Edit the <code>NotesSection</code> children
            in this file.
          </div>
        )}
      </div>
    </section>
  );
}
