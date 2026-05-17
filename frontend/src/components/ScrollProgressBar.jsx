import { useScrollProgress } from '../hooks/useScrollProgress';

/**
 * Thin document scroll indicator — sits just under the sticky navbar.
 */
export default function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-[4.25rem] z-[99] h-[3px] overflow-hidden bg-slate-200/25"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-secondary via-secondary-light to-primary will-change-transform transition-transform duration-100 ease-out motion-reduce:transition-none"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
