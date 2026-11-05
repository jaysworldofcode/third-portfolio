"use client";

import Image from "next/image";
import { useInView } from "@/hooks/useInView";

type ImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

/** Wipes an image in from the bottom while it settles from a slight zoom. */
export function ImageReveal({ src, alt, className = "", sizes = "(min-width: 1024px) 40vw, 100vw" }: ImageRevealProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-surface transition-[clip-path] duration-[1200ms] ease-out-expo motion-reduce:transition-none ${
        isInView ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(100%_0_0_0)] motion-reduce:[clip-path:inset(0_0_0_0)]"
      } ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover transition-transform duration-[1600ms] ease-out-expo motion-reduce:transition-none ${
          isInView ? "scale-100" : "scale-125"
        }`}
      />
    </div>
  );
}
