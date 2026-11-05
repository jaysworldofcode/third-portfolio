import Image from "next/image";
import { owner } from "@/data/site";

type LogoProps = {
  /** Size classes for the logo box. */
  className: string;
  /** Rendered width in pixels, used to pick the image resolution. */
  sizePx: number;
  initialsClassName?: string;
};

export function Logo({ className, sizePx, initialsClassName = "" }: LogoProps) {
  if (owner.logo) {
    return (
      <span className={`relative block overflow-hidden ${className}`}>
        <Image src={owner.logo} alt={owner.name} fill sizes={`${sizePx}px`} className="object-contain" />
      </span>
    );
  }

  return (
    <span
      className={`grid place-items-center rounded-full border border-fg/60 font-heading font-bold tracking-widest text-fg ${className} ${initialsClassName}`}
    >
      {owner.initials}
    </span>
  );
}
