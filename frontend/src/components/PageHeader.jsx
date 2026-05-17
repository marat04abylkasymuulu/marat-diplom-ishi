import MathInfinityBackdrop from './MathInfinityBackdrop';

/**
 * Compact hero band — dialed up: slash, watermark, scanlines.
 */
export default function PageHeader({ title, subtitle }) {
  return (
    <header className="hero-mesh relative overflow-hidden text-white">
      <div className="page-header-slash motion-reduce:hidden" aria-hidden />
      <div className="page-header-letter" aria-hidden>
        <span>R</span>
      </div>
      <div className="hero-scanlines motion-reduce:hidden opacity-[0.05]" aria-hidden />
      <MathInfinityBackdrop variant="compact" />
      <div className="page-header-grain motion-reduce:hidden" aria-hidden />

      <div
        className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#c8102e]/35 blur-3xl motion-safe:animate-[record-header-glow_14s_ease-in-out_infinite]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl motion-safe:animate-[record-header-glow_18s_ease-in-out_infinite_reverse]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <svg
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 w-full text-[#f4f6f9] md:h-16"
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path fill="currentColor" d="M0,64 L0,18 Q280,52 720,22 T1440,30 L1440,64 Z" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-3xl text-center motion-safe:fade-rise">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-gradient-to-r from-secondary/30 to-white/10 px-5 py-2 text-xs font-black uppercase tracking-[0.4em] text-white shadow-lg backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-200 shadow-[0_0_12px_#fde68a]" />
            RECORD
          </p>
          <h1 className="page-title-chrome font-display text-3xl font-black tracking-tight text-white md:text-6xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-6 max-w-2xl border-t border-white/10 pt-6 text-base leading-relaxed text-slate-200/95 md:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
