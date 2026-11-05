const BASE =
  "inline-flex items-center justify-center gap-3 rounded-full text-label transition duration-500 ease-out-expo disabled:cursor-wait disabled:opacity-70";

const VARIANTS = {
  solid: "bg-accent text-on-accent hover:bg-fg hover:text-bg",
  outline: "border border-line text-fg hover:border-fg hover:bg-fg hover:text-bg",
  /** For use on an accent-coloured background, where the solid style would disappear. */
  contrast: "bg-on-accent text-accent hover:bg-bg hover:text-fg",
};

// Padding lives in its own map: appending a second padding class would leave the winner up to CSS order.
const SIZES = {
  default: "px-8 py-4",
  compact: "px-6 py-3",
};

export const buttonStyle = (variant: keyof typeof VARIANTS, size: keyof typeof SIZES = "default") =>
  `${BASE} ${SIZES[size]} ${VARIANTS[variant]}`;

export const BUTTON_STYLES = {
  solid: buttonStyle("solid"),
  outline: buttonStyle("outline"),
};
