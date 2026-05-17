import MarqueeStrip from './MarqueeStrip';

/**
 * Thin kinetic symbol strip for non-home public routes (sits under navbar).
 */
export default function InnerPagesVisualRail() {
  const chunk = (
    <>
      <span className="text-secondary/80">∞</span>
      <span className="text-primary/50">π</span>
      <span className="text-secondary/70">∑</span>
      <span className="text-primary/45">∫</span>
      <span className="text-secondary/75">√</span>
      <span className="text-primary/40">Δ</span>
      <span className="text-secondary/65">θ</span>
      <span className="text-primary/50">λ</span>
      <span className="text-secondary/55">∮</span>
      <span className="text-primary/45">∏</span>
      <span className="text-secondary/70">⟨</span>
      <span className="text-primary/40">x²</span>
      <span className="text-secondary/70">⟩</span>
      <span className="text-primary/35">∂</span>
      <span className="text-secondary/60">∇</span>
      <span className="text-primary/45">ℝ</span>
      <span className="text-secondary/50">ℤ</span>
      <span className="text-primary/40">ℚ</span>
      <span className="text-xs font-black tracking-[0.4em] text-secondary/50">RECORD</span>
    </>
  );

  return (
    <div className="record-inner-rail pointer-events-none relative z-[1] border-b border-primary/15 bg-gradient-to-r from-primary/[0.09] via-white/90 to-secondary/[0.08] py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] motion-reduce:hidden">
      <MarqueeStrip className="font-mono text-sm font-black tracking-[0.2em] text-primary/30 md:text-base">
        {chunk}
      </MarqueeStrip>
    </div>
  );
}
