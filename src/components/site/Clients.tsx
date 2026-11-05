import type { CSSProperties } from "react";
import { clients } from "@/data/site";
import { publicFileExists } from "@/lib/publicAsset";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";

const BAND_DURATION_S = 35;

type ClientLogo = (typeof clients.logos)[number];

export function Clients() {
  return (
    <section id="clients" className="relative border-t border-line bg-bg py-16 text-muted md:py-20">
      <Reveal className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="text-center text-label">{clients.label}</p>
      </Reveal>
      <Marquee durationSeconds={BAND_DURATION_S} fadeEdges className="mt-10 md:mt-12">
        {clients.logos.map((logo) => (
          <div key={logo.name} className="flex h-12 items-center px-8 md:px-12">
            <ClientMark logo={logo} />
          </div>
        ))}
      </Marquee>
    </section>
  );
}

/**
 * The SVG is used as a CSS mask filled with the text colour, so one file works in both themes
 * and the hover colour change needs no second asset.
 */
function ClientMark({ logo }: { logo: ClientLogo }) {
  const markClassName = "text-fg/60 transition-colors duration-300 hover:text-fg";

  if (!publicFileExists(logo.image)) {
    return <span className={`font-heading text-2xl font-bold whitespace-nowrap ${markClassName}`}>{logo.name}</span>;
  }

  const maskStyle = {
    maskImage: `url("${logo.image}")`,
    WebkitMaskImage: `url("${logo.image}")`,
  } as CSSProperties;

  return (
    <span
      role="img"
      aria-label={logo.name}
      style={maskStyle}
      className={`block aspect-[4/1] h-9 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${markClassName}`}
    />
  );
}
