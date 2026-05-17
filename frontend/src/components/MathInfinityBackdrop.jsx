/**
 * Decorative moving math motifs (∞, π, axes, sine).
 * `hero` — full home hero. `compact` — inner PageHeader band.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 */
export default function MathInfinityBackdrop({ variant = 'hero' }) {
  const base =
    'record-math-layer pointer-events-none absolute inset-0 z-[1] overflow-hidden motion-reduce:hidden';

  if (variant === 'compact') {
    return (
      <div className={`${base} record-math-layer--compact text-white/22`} aria-hidden>
        <div className="record-math-drift-a absolute -left-[2%] top-[4%] select-none font-display text-[clamp(2.75rem,12vw,6rem)] font-black leading-none tracking-tighter text-white/[0.14] drop-shadow-[0_0_28px_rgba(200,16,46,0.18)]">
          ∞
        </div>
        <div className="record-math-drift-b absolute right-[4%] top-[18%] select-none font-serif text-[clamp(1.75rem,7vw,3.5rem)] font-normal italic leading-none text-secondary/35 md:right-[8%]">
          π
        </div>
        <div className="record-math-drift-c absolute left-[18%] top-[42%] select-none font-display text-[clamp(1.25rem,4vw,2.25rem)] font-bold text-white/[0.12]">
          ∑
        </div>
        <div className="record-math-drift-f absolute right-[22%] top-[48%] select-none font-display text-[clamp(1.1rem,3.5vw,2rem)] font-black text-secondary/30">
          ∫
        </div>
        <div className="record-math-drift-g absolute left-[6%] bottom-[14%] select-none font-serif text-[clamp(1rem,3vw,1.75rem)] italic text-white/[0.11]">
          √
        </div>
        <div className="record-math-spin-slow absolute right-[8%] bottom-[10%] select-none font-display text-[clamp(1.5rem,5vw,2.75rem)] font-black text-white/[0.1]">
          ∞
        </div>
        <div className="record-math-drift-h absolute left-[40%] top-[8%] select-none font-mono text-[10px] font-bold tracking-[0.25em] text-secondary/40 md:text-[11px]">
          Δx
        </div>

        <div className="pointer-events-none absolute bottom-[4%] right-[2%] w-[min(55vw,280px)] opacity-[0.22] md:bottom-[8%]">
          <svg
            className="record-math-drift-wave w-full"
            viewBox="0 0 280 88"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="10" y1="68" x2="268" y2="68" stroke="currentColor" strokeWidth="0.9" opacity="0.45" />
            <line x1="28" y1="10" x2="28" y2="76" stroke="currentColor" strokeWidth="0.9" opacity="0.45" />
            <path
              className="record-math-sine-path text-secondary/60"
              d="M 32 44 C 68 12, 104 12, 140 44 S 208 76, 244 44 S 276 12, 268 44"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`${base} text-white/22`} aria-hidden>
      <div className="record-math-drift-a absolute -left-[4%] top-[8%] select-none font-display text-[clamp(4rem,16vw,11rem)] font-black leading-none tracking-tighter text-white/[0.16] drop-shadow-[0_0_48px_rgba(200,16,46,0.2)] md:top-[6%]">
        ∞
      </div>

      <div className="record-math-drift-b absolute right-[2%] top-[16%] select-none font-serif text-[clamp(3rem,10vw,6.5rem)] font-normal italic leading-none text-secondary/28 md:right-[6%]">
        π
      </div>

      <div className="record-math-drift-c absolute bottom-[22%] left-[4%] select-none font-display text-[clamp(2rem,6vw,4.25rem)] font-bold tracking-widest text-white/[0.14]">
        ∑
      </div>

      <div className="record-math-drift-f absolute top-[38%] right-[14%] select-none font-display text-[clamp(1.75rem,5vw,3.5rem)] font-black text-secondary/22 md:right-[18%]">
        ∫
      </div>

      <div className="record-math-drift-g absolute bottom-[12%] left-[22%] select-none font-serif text-[clamp(1.5rem,4vw,3rem)] italic text-white/[0.12]">
        √
      </div>

      <div className="record-math-drift-h absolute left-[8%] top-[52%] select-none font-display text-[clamp(1.75rem,5vw,3.25rem)] font-black text-secondary/18">
        θ
      </div>

      <div className="record-math-drift-d absolute bottom-[14%] right-[2%] select-none font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-white/[0.12] md:text-sm">
        lim
        <span className="mx-0.5 text-secondary/45">Δx→0</span>
      </div>

      <div className="record-math-spin-slow absolute left-[36%] top-[56%] text-[clamp(2.25rem,7vw,5rem)] font-black text-white/[0.1] md:top-[50%]">
        ∞
      </div>

      <div className="record-math-drift-e absolute right-[28%] top-[10%] hidden select-none font-display text-[clamp(1.25rem,3vw,2rem)] font-bold text-white/[0.09] md:block">
        ∏
      </div>

      <div className="pointer-events-none absolute bottom-[6%] left-1/2 -translate-x-1/2 md:bottom-[8%]">
        <svg
          className="record-math-drift-wave w-[min(96vw,480px)] opacity-[0.26]"
          viewBox="0 0 400 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="24" y1="96" x2="376" y2="96" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          <line x1="40" y1="16" x2="40" y2="104" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          <path
            className="record-math-sine-path text-secondary/55"
            d="M 44 60 C 80 18, 120 18, 160 60 S 240 102, 280 60 S 360 18, 392 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle className="record-math-orbit-dot text-white" cx="320" cy="28" r="3.5" fill="currentColor" />
        </svg>
      </div>

      <svg
        className="record-math-drift-e pointer-events-none absolute right-[10%] top-[44%] hidden h-32 w-32 opacity-[0.2] md:block"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
        <line x1="50" y1="50" x2="88" y2="50" stroke="#c8102e" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
        <circle cx="88" cy="50" r="3" fill="#fca5a5" opacity="0.6" />
      </svg>
    </div>
  );
}
