import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

type SliderControlsProps = {
  previousLabel: string;
  nextLabel: string;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
};

const BUTTON_CLASS =
  "grid size-14 cursor-pointer place-items-center rounded-full border border-line text-fg transition duration-500 ease-out-expo enabled:hover:border-accent enabled:hover:bg-accent enabled:hover:text-on-accent disabled:cursor-not-allowed disabled:opacity-35";

/** Previous/next arrow buttons for a carousel; labels come from site.json. */
export function SliderControls({
  previousLabel,
  nextLabel,
  canScrollPrev,
  canScrollNext,
  onPrevious,
  onNext,
  className = "",
}: SliderControlsProps) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canScrollPrev}
        aria-label={previousLabel}
        title={previousLabel}
        className={BUTTON_CLASS}
      >
        <FaArrowLeft aria-hidden className="size-4" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canScrollNext}
        aria-label={nextLabel}
        title={nextLabel}
        className={BUTTON_CLASS}
      >
        <FaArrowRight aria-hidden className="size-4" />
      </button>
    </div>
  );
}
