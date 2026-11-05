import type { CSSProperties, ReactNode } from "react";

const DEFAULT_DURATION_S = 40;

type MarqueeProps = {
  /** One full set of items. It is rendered twice so the loop has no gap. */
  children: ReactNode;
  /** Seconds for one full loop; longer is slower. */
  durationSeconds?: number;
  reverse?: boolean;
  /** Fades the left and right edges. */
  fadeEdges?: boolean;
  className?: string;
};

/**
 * An endlessly scrolling band driven by CSS (the `animate-marquee` utility). It pauses on hover,
 * and stands still for visitors who prefer reduced motion.
 */
export function Marquee({
  children,
  durationSeconds = DEFAULT_DURATION_S,
  reverse = false,
  fadeEdges = false,
  className = "",
}: MarqueeProps) {
  const style = { "--marquee-duration": `${durationSeconds}s` } as CSSProperties;

  return (
    <div className={`overflow-hidden ${fadeEdges ? "mask-fade-x" : ""} ${className}`}>
      <div
        style={style}
        className={`flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        {/* The copy only exists to fill the loop; inert hides it from screen readers and keyboard focus. */}
        <div inert className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
