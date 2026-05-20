import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getNode, ROADMAP, type SectionKind } from "@/data/roadmap";
import { CONTENT } from "@/content/registry";
import { PhaseHeader } from "@/components/ui/PhaseHeader";
import { BookSidebar } from "@/components/book/Sidebar";
import { SectionDivider } from "@/components/book/SectionDivider";
import { PhaseContent } from "./PhaseContent";

export default async function PhasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const node = getNode(slug);
  if (!node) notFound();

  const content = CONTENT[slug];
  const TheoryBody = content?.theory;
  const BuildsBody = content?.builds;
  const ExitBody = content?.exit;

  return (
    <>
      <PhaseHeader node={node} />

      <PhaseContent 
        node={node} 
        theoryBody={TheoryBody ? <TheoryBody /> : null}
        buildsBody={BuildsBody ? <BuildsBody /> : null}
        exitBody={ExitBody ? <ExitBody /> : null}
      />
    </>
  );
}

export async function generateStaticParams() {
  return ROADMAP.map((n) => ({ slug: n.slug }));
}
