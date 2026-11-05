import Image from "next/image";
import { team } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";

const CARD_STAGGER_MS = 100;

/*
 * Hover-only styles (grayscale photo, hidden socials) sit behind (hover:hover), so touch screens
 * always see the colour photo and the social icons. The group-hover/focus variants are more
 * specific, so they win over the hover-device defaults.
 */
export function Team() {
  return (
    <section id="team" className="relative border-t border-line bg-bg py-28 text-muted md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow={team.eyebrow}
          title={team.title}
          titleHighlight={team.titleHighlight}
          description={team.description}
        />

        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {team.members.map((member, index) => (
            <li key={member.name}>
              <Reveal delayMs={index * CARD_STAGGER_MS}>
                <article className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-surface">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 ease-out-expo group-hover:scale-105 group-hover:grayscale-0 [@media(hover:hover)]:grayscale"
                    />
                    {member.socials.length > 0 && (
                      <div className="absolute inset-x-0 bottom-5 flex justify-center transition duration-500 ease-out-expo group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:opacity-0">
                        <SocialLinks links={member.socials} itemClassName="bg-bg/85 backdrop-blur-md" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-6 font-heading text-2xl font-bold text-fg">{member.name}</h3>
                  <p className="mt-1 text-sm">{member.role}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
