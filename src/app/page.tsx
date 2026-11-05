import type { ComponentType } from "react";
import { About } from "@/components/site/About";
import { Blog } from "@/components/site/Blog";
import { Clients } from "@/components/site/Clients";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Navbar } from "@/components/site/Navbar";
import { Preloader } from "@/components/site/Preloader";
import { Pricing } from "@/components/site/Pricing";
import { Process } from "@/components/site/Process";
import { Services } from "@/components/site/Services";
import { Team } from "@/components/site/Team";
import { Testimonials } from "@/components/site/Testimonials";
import { Work } from "@/components/site/Work";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, contact, enabledSectionIds, meta, owner, socialLinks, type SectionId } from "@/data/site";

const SECTION_COMPONENTS: Record<SectionId, ComponentType> = {
  home: Hero,
  clients: Clients,
  about: About,
  services: Services,
  process: Process,
  work: Work,
  team: Team,
  testimonials: Testimonials,
  pricing: Pricing,
  blog: Blog,
  contact: Contact,
};

const emailMethod = contact.methods.find((method) => method.href.startsWith("mailto:"));
const phoneMethod = contact.methods.find((method) => method.href.startsWith("tel:"));

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: meta.siteName,
  url: absoluteUrl("/"),
  description: meta.description,
  logo: owner.logo ? absoluteUrl(owner.logo) : undefined,
  image: meta.ogImage ? absoluteUrl(meta.ogImage) : undefined,
  email: emailMethod?.value,
  telephone: phoneMethod?.value,
  sameAs: socialLinks.map((link) => link.href).filter((href) => href.startsWith("http")),
};

export default function Home() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <Preloader />
      <Navbar />
      <main>
        {enabledSectionIds.map((id) => {
          const Section = SECTION_COMPONENTS[id];
          return <Section key={id} />;
        })}
      </main>
      <Footer />
    </>
  );
}
