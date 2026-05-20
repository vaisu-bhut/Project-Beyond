"use client";

import { useState } from "react";
import type { RoadmapNode, SectionKind } from "@/data/roadmap";
import { BookSidebar } from "@/components/book/Sidebar";

export function PhaseContent({
  node,
  theoryBody,
  buildsBody,
}: {
  node: RoadmapNode;
  theoryBody: React.ReactNode;
  buildsBody: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<SectionKind>("theory");

  const theorySection = node.sections.find((s) => s.id === "theory");
  const buildsSection = node.sections.find((s) => s.id === "builds");

  const activeSection = activeTab === "theory" ? theorySection : buildsSection;
  const activeBody = activeTab === "theory" ? theoryBody : buildsBody;

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-12 md:py-16">
      <div className="grid md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-12 lg:gap-16 xl:gap-20">
        <aside className="hidden md:block">
          <div className="sticky top-16 max-h-[calc(100vh-5rem)] overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-3 py-2 flex flex-col">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 p-1 bg-white/5 border border-white/10 rounded-lg">
              <button
                onClick={() => setActiveTab("theory")}
                className={`flex-1 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-colors ${
                  activeTab === "theory"
                    ? "bg-white/10 text-white"
                    : "text-foreground-muted hover:text-white hover:bg-white/5"
                }`}
              >
                Theory
              </button>
              <button
                onClick={() => setActiveTab("builds")}
                className={`flex-1 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-colors ${
                  activeTab === "builds"
                    ? "bg-white/10 text-white"
                    : "text-foreground-muted hover:text-white hover:bg-white/5"
                }`}
              >
                Builds
              </button>
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
