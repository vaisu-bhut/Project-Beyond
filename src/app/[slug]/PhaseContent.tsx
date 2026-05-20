"use client";

import { useState } from "react";
import type { RoadmapNode, SectionKind } from "@/data/roadmap";
import { BookSidebar } from "@/components/book/Sidebar";

export function PhaseContent({
  node,
  theoryBody,
  buildsBody,
  exitBody,
}: {
  node: RoadmapNode;
  theoryBody: React.ReactNode;
  buildsBody: React.ReactNode;
  exitBody?: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<SectionKind>("theory");

  const theorySection = node.sections.find((s) => s.id === "theory");
  const buildsSection = node.sections.find((s) => s.id === "builds");
  const exitSection = node.sections.find((s) => s.id === "exit");

  const activeSection =
    activeTab === "theory"
      ? theorySection
      : activeTab === "builds"
        ? buildsSection
        : exitSection;

  const activeBody =
    activeTab === "theory"
      ? theoryBody
      : activeTab === "builds"
        ? buildsBody
        : exitBody;

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-12 md:py-16">
      <div className="grid md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-12 lg:gap-16 xl:gap-20">
        <aside className="hidden md:block">
          <div className="sticky top-16 max-h-[calc(100vh-5rem)] overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-3 py-2 flex flex-col">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 p-1 bg-foreground/[0.05] border border-foreground/[0.08] rounded-lg">
              <button
                onClick={() => setActiveTab("theory")}
                className={`flex-1 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-colors ${
                  activeTab === "theory"
                    ? "bg-foreground/[0.08] text-foreground font-semibold"
                    : "text-foreground-muted hover:text-foreground hover:bg-foreground/[0.04]"
                }`}
              >
                Theory
              </button>
              <button
                onClick={() => setActiveTab("builds")}
                className={`flex-1 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-colors ${
                  activeTab === "builds"
                    ? "bg-foreground/[0.08] text-foreground font-semibold"
                    : "text-foreground-muted hover:text-foreground hover:bg-foreground/[0.04]"
                }`}
              >
                Builds
              </button>
              {exitBody && (
                <button
                  onClick={() => setActiveTab("exit")}
                  className={`flex-1 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-colors ${
                    activeTab === "exit"
                      ? "bg-foreground/[0.08] text-foreground font-semibold"
                      : "text-foreground-muted hover:text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  Exit
                </button>
              )}
            </div>
            {/* Sidebar content */}
            <div className="flex-1 overflow-y-auto">
              <BookSidebar 
                sections={activeSection ? [activeSection] : []} 
                accentVar={node.accentVar} 
                hideOverview={true}
              />
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          {activeSection && (
            <div key={activeSection.id} className="animate-in fade-in duration-500">
              {activeBody}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
