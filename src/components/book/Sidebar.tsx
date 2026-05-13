"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Section } from "@/data/roadmap";

type Props = {
  sections: Section[];
  accentVar: string;
};

export function BookSidebar({ sections, accentVar }: Props) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids: string[] = ["overview"];
    for (const sec of sections) {
      ids.push(sec.id);
      if (sec.chapters) {
        for (const ch of sec.chapters) {
          for (const sub of ch.subchapters) ids.push(sub.id);
        }
      }
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibility.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visibility.delete(entry.target.id);
          }
        }
        if (visibility.size === 0) return;
        let bestId: string | null = null;
        let bestTop = Number.POSITIVE_INFINITY;
        for (const [id, top] of visibility) {
          if (top < bestTop) {
            bestTop = top;
            bestId = id;
          }
        }
        if (bestId) setActive(bestId);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="text-sm" aria-label="Phase contents">
      <p className="text-[11px] uppercase tracking-[0.22em] text-foreground-muted font-mono mb-5">
        Contents
      </p>

      <ul className="space-y-1">
        <li>
          <Row
            id="overview"
            label="Overview"
            depth={0}
            active={active === "overview"}
            accentVar={accentVar}
          />
        </li>

        {sections.map((sec) => {
          const subIds = sec.chapters?.flatMap((c) => c.subchapters.map((s) => s.id)) ?? [];
          const inThisSection = active === sec.id || subIds.includes(active ?? "");
          return (
            <li key={sec.id} className="pt-4">
              <Row
                id={sec.id}
                label={sec.title}
                number={sec.number}
                depth={0}
                active={active === sec.id}
                emphasized={inThisSection}
                accentVar={accentVar}
              />

              {sec.chapters && sec.chapters.length > 0 && (
                <ul className="mt-1 ml-3">
                  {sec.chapters.map((ch) => {
                    const chSubIds = ch.subchapters.map((s) => s.id);
                    const inThisChapter = chSubIds.includes(active ?? "");
                    return (
                      <li key={ch.id} className="mt-2">
                        <div
                          className={cn(
                            "px-3 py-1 text-[12px] font-mono uppercase tracking-[0.16em] flex items-baseline gap-2",
                            inThisChapter ? "text-foreground/85" : "text-foreground-muted/80",
                          )}
                        >
                          <span className="tabular-nums opacity-80">Ch. {ch.number}</span>
                          <span className="text-foreground/65 font-sans tracking-normal normal-case text-[12.5px]">
                            {ch.title}
                          </span>
                        </div>
                        <ul className="border-l border-white/[0.06] ml-3 mt-1">
                          {ch.subchapters.map((sub) => (
                            <li key={sub.id}>
                              <Row
                                id={sub.id}
                                label={sub.title}
                                number={sub.number}
                                depth={2}
                                active={active === sub.id}
                                accentVar={accentVar}
                              />
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Row({
  id,
  label,
  number,
  depth,
  active,
  emphasized,
  accentVar,
}: {
  id: string;
  label: string;
  number?: string;
  depth: 0 | 1 | 2;
  active: boolean;
  emphasized?: boolean;
  accentVar: string;
}) {
  const isSection = depth === 0;
  const isSub = depth === 2;
  return (
    <a
      href={`#${id}`}
      className={cn(
        "group block transition-colors -ml-px border-l",
        isSection ? "pl-4 py-2 text-[15px]" : "pl-4 py-1.5 text-[13.5px] leading-snug",
        active
          ? "text-foreground"
          : emphasized
            ? "text-foreground/85 border-transparent"
            : "text-foreground-muted hover:text-foreground/85 border-transparent",
      )}
      style={
        active
          ? { color: `var(${accentVar})`, borderColor: `var(${accentVar})` }
          : undefined
      }
    >
      <span className="flex items-baseline gap-2.5">
        {number && (
          <span
            className={cn(
              "font-mono tabular-nums shrink-0",
              isSection ? "text-[11px]" : "text-[11px]",
              !active && "opacity-60",
            )}
            style={active ? { color: `var(${accentVar})` } : undefined}
          >
            {number}
          </span>
        )}
        <span
          className={cn(
            isSection && "font-semibold tracking-tight",
            isSub && "text-[13px]",
          )}
        >
          {label}
        </span>
      </span>
    </a>
  );
}
