/**
 * Light math “wallpaper” on non-home public routes — larger + denser glyphs.
 */
const GLYPHS = [
  { ch: '∞', cls: 'record-math-drift-a left-[1%] top-[8vh] text-[min(28vw,9rem)] text-primary/[0.11]' },
  { ch: 'π', cls: 'record-math-drift-b right-[2%] top-[14vh] text-[min(20vw,6rem)] text-secondary/[0.16]' },
  { ch: '∑', cls: 'record-math-drift-c left-[4%] top-[38vh] text-[min(16vw,4.5rem)] text-primary/[0.1]' },
  { ch: '∫', cls: 'record-math-drift-d right-[6%] top-[42vh] text-[min(14vw,3.75rem)] text-secondary/[0.12]' },
  { ch: '√', cls: 'record-math-drift-f left-[12%] bottom-[32vh] text-[min(18vw,5rem)] text-primary/[0.09]' },
  { ch: 'Δ', cls: 'record-math-drift-g right-[10%] bottom-[28vh] text-[min(22vw,5.5rem)] text-secondary/[0.13]' },
  { ch: 'θ', cls: 'record-math-drift-h left-[22%] top-[52vh] text-[min(15vw,4rem)] text-primary/[0.08]' },
  { ch: 'λ', cls: 'record-math-drift-a right-[18%] bottom-[18vh] text-[min(12vw,3.25rem)] text-secondary/[0.11] record-math-delay-2' },
  { ch: '∮', cls: 'record-math-drift-b left-[35%] top-[22vh] text-[min(11vw,3rem)] text-primary/[0.07] record-math-delay-1' },
  { ch: '∏', cls: 'record-math-drift-c right-[28%] top-[58vh] text-[min(13vw,3.5rem)] text-secondary/[0.1]' },
  { ch: '∞', cls: 'record-math-spin-slow left-[48%] top-[12vh] text-[min(24vw,7rem)] text-secondary/[0.09]' },
  { ch: '⟨', cls: 'record-math-drift-e left-[6%] bottom-[12vh] text-[min(10vw,2.75rem)] text-primary/[0.08]' },
  { ch: '⟩', cls: 'record-math-drift-f right-[4%] bottom-[8vh] text-[min(10vw,2.75rem)] text-primary/[0.08]' },
  { ch: '∂', cls: 'record-math-drift-g left-[52%] bottom-[38vh] text-[min(11vw,3rem)] text-secondary/[0.1]' },
  { ch: '∇', cls: 'record-math-drift-h right-[38%] top-[48vh] text-[min(9vw,2.5rem)] text-primary/[0.09]' },
  { ch: 'ℝ', cls: 'record-math-drift-d left-[62%] top-[28vh] text-[min(10vw,2.75rem)] text-secondary/[0.09]' },
  { ch: 'ℤ', cls: 'record-math-drift-a left-[72%] bottom-[22vh] text-[min(9vw,2.5rem)] text-primary/[0.07] record-math-delay-3' },
];

export default function PageBodyMathBackdrop() {
  return (
    <div
      className="record-body-math pointer-events-none absolute inset-0 z-0 overflow-hidden motion-reduce:hidden"
      aria-hidden
    >
      {GLYPHS.map(({ ch, cls }, i) => (
        <span key={i} className={`absolute select-none font-display font-black ${cls}`}>
          {ch}
        </span>
      ))}

      <div className="pointer-events-none absolute left-1/2 top-[40vh] w-[min(85vw,480px)] -translate-x-1/2 opacity-[0.14]">
        <svg viewBox="0 0 400 80" fill="none" className="record-math-drift-wave w-full text-primary/45">
          <line x1="12" y1="64" x2="388" y2="64" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          <line x1="32" y1="12" x2="32" y2="68" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          <path
            className="record-math-sine-path"
            d="M 36 40 C 80 8, 120 8, 160 40 S 240 72, 280 40 S 340 8, 380 40"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="pointer-events-none absolute bottom-[6vh] left-1/2 w-[min(75vw,360px)] -translate-x-1/2 opacity-[0.11]">
        <svg viewBox="0 0 300 56" fill="none" className="record-math-drift-e w-full text-secondary/40">
          <path
            className="record-math-sine-path"
            d="M 8 28 C 48 4, 88 4, 128 28 S 208 52, 248 28 S 288 4, 292 28"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
