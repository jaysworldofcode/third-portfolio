"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FaArrowLeft, FaBars, FaXmark } from "react-icons/fa6";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export type DocsNavGroup = { title: string; items: { id: string; label: string }[] };

type DocsSidebarProps = { groups: DocsNavGroup[]; backLabel: string };

export function DocsSidebar({ groups, backLabel }: DocsSidebarProps) {
  const sectionIds = useMemo(() => groups.flatMap((group) => group.items.map((item) => item.id)), [groups]);
  const activeId = useScrollSpy(sectionIds);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeLabel = groups.flatMap((group) => group.items).find((item) => item.id === activeId)?.label;

  return (
    <>
      <div className="sticky top-0 z-40 -mx-6 flex items-center justify-between gap-4 border-b border-line bg-bg/85 px-6 py-3 backdrop-blur-lg lg:hidden">
        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="docs-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-fg"
        >
          {isMenuOpen ? <FaXmark className="size-4" /> : <FaBars className="size-4" />}
          {activeLabel}
        </button>
        <Link href="/" className="text-sm text-muted transition hover:text-fg">
          {backLabel}
        </Link>
      </div>

      {isMenuOpen && (
        <div
          id="docs-menu"
          className="fixed inset-x-0 top-[49px] bottom-0 z-30 overflow-y-auto bg-bg/95 px-6 py-6 backdrop-blur-xl lg:hidden"
        >
          <NavGroups groups={groups} activeId={activeId} onNavigate={() => setIsMenuOpen(false)} />
        </div>
      )}

      <aside className="sticky top-0 hidden h-svh overflow-y-auto border-r border-line py-12 pr-6 lg:block">
        <Link
          href="/"
          className="group mb-10 inline-flex items-center gap-2 text-sm text-muted transition hover:text-fg"
        >
          <FaArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" />
          {backLabel}
        </Link>
        <NavGroups groups={groups} activeId={activeId} />
      </aside>
    </>
  );
}

function NavGroups({
  groups,
  activeId,
  onNavigate,
}: {
  groups: DocsNavGroup[];
  activeId: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-9">
      {groups.map((group) => (
        <div key={group.title}>
          <h2 className="mb-3 text-label text-fg/50">
            {group.title}
          </h2>
          <ul className="border-l border-line">
            {group.items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={onNavigate}
                    aria-current={isActive ? "location" : undefined}
                    className={`-ml-px block border-l py-1.5 pl-4 text-sm transition-colors ${
                      isActive
                        ? "border-accent font-medium text-fg"
                        : "border-transparent text-muted hover:border-fg/40 hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
