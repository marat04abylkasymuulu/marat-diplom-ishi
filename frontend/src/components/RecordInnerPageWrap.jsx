/**
 * Wraps main inner-page content: corner accents + soft panel depth.
 */
export default function RecordInnerPageWrap({ children, className = '' }) {
  return (
    <div className={`record-inner-page-wrap relative ${className}`.trim()}>
      <div className="record-inner-page-wrap__glow pointer-events-none absolute inset-x-0 -top-4 h-40 bg-gradient-to-b from-secondary/[0.07] via-transparent to-transparent md:h-48" aria-hidden />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
