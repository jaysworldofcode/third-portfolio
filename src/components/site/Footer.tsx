import Link from "next/link";
import type { ReactNode } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { contact, footer, navItems, owner, socialLinks } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { NewsletterForm } from "./NewsletterForm";

const LOGO_SIZE_PX = 48;
const footerContactLinks = contact.methods.filter((method) => method.href);

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg text-muted">
      {footer.newsletter.enabled && <NewsletterBlock />}

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex items-center gap-4">
            <Logo sizePx={LOGO_SIZE_PX} className="size-12" initialsClassName="text-xs" />
            <span className="font-heading text-2xl font-bold text-fg">{owner.name}</span>
          </Link>
          <p className="mt-6 max-w-sm leading-relaxed">{footer.description}</p>
          <SocialLinks links={socialLinks} className="mt-8" />
        </div>

        <FooterColumn title={footer.exploreTitle} className="md:col-span-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <FooterLink href={`/#${item.id}`}>{item.label}</FooterLink>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title={footer.contactTitle} className="md:col-span-3">
          {footerContactLinks.map((method) => (
            <li key={method.label}>
              <FooterLink href={method.href}>{method.value}</FooterLink>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title={footer.studioTitle} className="md:col-span-2">
          {footer.studioItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </FooterColumn>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            © {new Date().getFullYear()} {owner.name}. {footer.rightsText}
          </p>
          <p className="text-label">{footer.tagline}</p>
          <a href="#" className="group inline-flex items-center gap-3 text-fg transition-colors hover:text-accent-text">
            {footer.backToTopLabel}
            <span className="grid size-9 place-items-center rounded-full border border-line transition duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
              <FaArrowUp aria-hidden className="size-3" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function NewsletterBlock() {
  return (
    <div className="border-b border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-10 lg:grid-cols-12 lg:items-end lg:py-20">
        <div className="lg:col-span-6">
          <h2 className="font-heading text-3xl leading-tight font-bold text-fg md:text-5xl">
            {footer.newsletter.title}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed">{footer.newsletter.description}</p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}

function FooterColumn({ title, className, children }: { title: string; className: string; children: ReactNode }) {
  return (
    <div className={className}>
      <h3 className="text-label text-accent-text">{title}</h3>
      <ul className="mt-6 space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const className = "text-fg/80 transition-colors hover:text-accent-text";
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
