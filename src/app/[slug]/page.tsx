import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getNode, ROADMAP, type SectionKind } from "@/data/roadmap";
import { CONTENT } from "@/content/registry";
import { PhaseHeader } from "@/components/ui/PhaseHeader";
import { BookSidebar } from "@/components/book/Sidebar";
import { SectionDivider } from "@/components/book/SectionDivider";

export default async function PhasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const node = getNode(slug);
  if (!node) notFound();

  const content = CONTENT[slug];
  const components: Record<SectionKind, React.ComponentType | undefined> = {
    theory: content?.theory,
    builds: content?.builds,
    exit: content?.exit,
  };

  return (
    <>
      <PhaseHeader node={node} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-12 lg:gap-16 xl:gap-20">
          <aside className="hidden md:block">
            <div className="sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto pr-3 py-2">
              <BookSidebar sections={node.sections} accentVar={node.accentVar} />
            </div>
          </aside>

          <main className="min-w-0">
            {/* Overview */}
            {node.overview && node.overview.length > 0 && (
              <section id="overview" className="scroll-mt-24 mb-4">
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="size-7 rounded-md flex items-center justify-center"
                    style={{
                      background: `color-mix(in oklab, var(${node.accentVar}) 14%, transparent)`,
                      color: `var(${node.accentVar})`,
                    }}
                  >
                    <Sparkles className="size-3.5" />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-foreground-muted font-mono">
                    What this phase covers
                  </p>
                </div>
                <ul className="space-y-3">
                  {node.overview.map((line, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-base md:text-[17px] text-foreground/90 leading-relaxed"
                    >
                      <span
                        className="mt-2.5 size-1.5 rounded-full shrink-0"
                        style={{ background: `var(${node.accentVar})` }}
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {node.sections.map((sec) => {
              const Body = components[sec.id];
              return (
                <div key={sec.id}>
                  <SectionDivider
                    id={sec.id}
                    number={sec.number}
                    title={sec.title}
                    accentVar={node.accentVar}
                  />
                  {Body ? <Body /> : null}
                </div>
              );
            })}
          </main>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return ROADMAP.map((n) => ({ slug: n.slug }));
}
