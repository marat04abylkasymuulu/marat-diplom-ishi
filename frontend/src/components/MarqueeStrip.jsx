/**
 * Infinite horizontal marquee (two identical segments). Same palette, high energy.
 * @param {{ reverse?: boolean }} props
 */
export default function MarqueeStrip({ children, className = '', reverse = false }) {
  const trackClass = reverse ? 'record-marquee-track record-marquee-track-reverse' : 'record-marquee-track';
  return (
    <div className={`overflow-hidden ${className}`.trim()}>
      <div className={`${trackClass} flex w-max items-center`}>
        <div className="flex shrink-0 items-center gap-10 px-6 md:gap-16 md:px-10">{children}</div>
        <div className="flex shrink-0 items-center gap-10 px-6 md:gap-16 md:px-10" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
