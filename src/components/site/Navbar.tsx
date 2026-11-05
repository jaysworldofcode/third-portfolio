"use client";

import { useEffect, useState } from "react";
import {
  contact,
  enabledSectionIds,
  hero,
  isLinkAvailable,
  isSectionEnabled,
  navigation,
  navItems,
  owner,
  socialLinks,
  type SectionId,
} from "@/data/site";
import { useScrolledPast } from "@/hooks/useScrolledPast";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { formatIndex } from "@/lib/formatIndex";
import { BUTTON_STYLES, buttonStyle } from "@/components/ui/buttonStyles";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const LOGO_SIZE_PX = 44;
const SOLID_AFTER_SCROLL_PX = 40;
const MOBILE_LINK_STAGGER_MS = 70;
const NO_SECTIONS: SectionId[] = [];
const showCtaButton = isLinkAvailable(navigation.ctaButton.href);
const menuContactLinks = contact.methods.filter((method) => method.href);
const isHomeEnabled = isSectionEnabled("home");
/** These hero styles put the navbar over dark footage, whatever the site theme. */
const heroHasDarkMedia = isHomeEnabled && hero.variant !== "marquee";

type NavbarProps = {
  /** Set on pages outside the landing page: highlights this section and links back to the landing page sections. */
  currentSection?: SectionId;
};

export function Navbar({ currentSection }: NavbarProps) {
  const spiedId = useScrollSpy(currentSection ? NO_SECTIONS : enabledSectionIds);
  const activeId = currentSection ?? spiedId;
  const toPageHref = (href: string) => (currentSection && href.startsWith("#") ? `/${href}` : href);
  const isScrolled = useScrolledPast(SOLID_AFTER_SCROLL_PX);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const isOverDarkMedia = heroHasDarkMedia && !currentSection && !isScrolled && !isMenuOpen;
  // The hero can be switched off, and then "#home" would go nowhere.
  const logoHref = isHomeEnabled ? toPageHref("#home") : "/";

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  return (
    // Scoping the dark palette to the header keeps its tokens readable over the hero footage.
    <header data-theme={isOverDarkMedia ? "dark" : undefined} className="fixed inset-x-0 top-0 z-50 text-muted">
      {/* A sibling layer, because a blurred ancestor would trap the fixed mobile menu inside the header. */}
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 border-b transition-colors duration-500 ${
          isScrolled && !isMenuOpen ? "border-line bg-bg/80 backdrop-blur-lg" : "border-transparent bg-transparent"
        }`}
      />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
        <a href={logoHref} aria-label={owner.name} className="relative z-50 flex items-center gap-3" onClick={closeMenu}>
          <Logo sizePx={LOGO_SIZE_PX} className="size-11" initialsClassName="text-xs" />
          <span className="hidden font-heading text-lg font-bold text-fg sm:block">{owner.name}</span>
        </a>

        <nav className="hidden xl:block">
          <ul className="flex items-center gap-1 rounded-full border border-line px-2 py-1.5">
            {navItems.map((item) => {
              const isActive = item.id === activeId;
              return (
                <li key={item.id}>
                  <a
                    href={toPageHref(`#${item.id}`)}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300 ${
                      isActive ? "bg-fg/10 text-fg" : "hover:text-fg"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-full bg-accent transition-transform duration-300 ${isActive ? "scale-100" : "scale-0"}`}
                    />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle className="relative z-50" />
          {showCtaButton && (
            <div className="hidden xl:block">
              <a href={toPageHref(navigation.ctaButton.href)} className={buttonStyle("solid", "compact")}>
                {navigation.ctaButton.label}
              </a>
            </div>
          )}
          <button
            type="button"
            aria-label={isMenuOpen ? navigation.closeMenuLabel : navigation.openMenuLabel}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="relative z-50 grid size-11 cursor-pointer place-items-center rounded-full border border-line xl:hidden"
          >
            <span aria-hidden className="relative block h-2.5 w-5">
              <span
                className={`absolute left-0 h-0.5 w-full bg-fg transition-all duration-500 ease-out-expo ${
                  isMenuOpen ? "top-1 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-full bg-fg transition-all duration-500 ease-out-expo ${
                  isMenuOpen ? "top-1 -rotate-45" : "top-2"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <MobileMenu activeId={activeId} isOpen={isMenuOpen} onClose={closeMenu} toPageHref={toPageHref} />
    </header>
  );
}

function MobileMenu({
  activeId,
  isOpen,
  onClose,
  toPageHref,
}: {
  activeId: SectionId;
  isOpen: boolean;
  onClose: () => void;
  toPageHref: (href: string) => string;
}) {
  return (
    <div
      inert={!isOpen}
      className={`fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-bg px-6 pt-28 pb-10 transition-opacity duration-500 xl:hidden ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ul className="space-y-3">
        {navItems.map((item, index) => (
          <li
            key={item.id}
            style={{ transitionDelay: isOpen ? `${index * MOBILE_LINK_STAGGER_MS}ms` : "0ms" }}
            className={`border-b border-line pb-3 transition-all duration-700 ease-out-expo ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <a
              href={toPageHref(`#${item.id}`)}
              onClick={onClose}
              className={`flex items-baseline gap-5 font-heading text-4xl font-bold ${
                item.id === activeId ? "text-accent-text" : "text-fg"
              }`}
            >
              <span className="text-label text-muted">{formatIndex(index + 1)}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-12 space-y-8">
        {showCtaButton && (
          <a href={toPageHref(navigation.ctaButton.href)} onClick={onClose} className={`${BUTTON_STYLES.solid} w-full`}>
            {navigation.ctaButton.label}
          </a>
        )}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1 text-sm">
            {menuContactLinks.map((method) => (
              <a key={method.label} href={method.href} className="block text-fg/80 transition-colors hover:text-fg">
                {method.value}
              </a>
            ))}
          </div>
          <SocialLinks links={socialLinks} />
        </div>
      </div>
    </div>
  );
}
