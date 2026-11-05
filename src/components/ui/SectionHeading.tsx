import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  titleHighlight,
  description,
  align = "left",
  className = "mb-16 md:mb-20",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <Reveal className={`max-w-3xl ${isCentered ? "mx-auto text-center" : ""} ${className}`}>
      <span className="mb-6 inline-flex items-center gap-3 rounded-full border border-line px-4 py-1.5 text-label text-fg">
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
        {eyebrow}
      </span>
      <h2 className="font-heading text-4xl leading-[1.02] font-bold tracking-tight text-fg md:text-6xl">
        {title}
        {titleHighlight && (
          <>
            {" "}
            <span className="text-accent-text">{titleHighlight}</span>
          </>
        )}
      </h2>
      {description && (
        <p className={`mt-6 max-w-xl text-lg leading-relaxed ${isCentered ? "mx-auto" : ""}`}>{description}</p>
      )}
    </Reveal>
  );
}
