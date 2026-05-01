import { useLanguage } from "@/app/contexts/useLanguage";

/**
 * RTL utilities hook.
 *
 * Usage:
 *   const { isRtl, dirFlip } = useRtl();
 *   <ChevronRight className={`w-4 h-4 ${dirFlip}`} />
 */
export function useRtl() {
  const { direction } = useLanguage();
  const isRtl = direction === "rtl";

  /**
   * Class to flip a directional icon (horizontal arrows, chevrons) in RTL.
   * Apply to ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, etc.
   */
  const dirFlip = isRtl ? "scale-x-[-1]" : "";

  return { isRtl, dirFlip };
}
