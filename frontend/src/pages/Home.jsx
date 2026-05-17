import { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaTrophy, FaUserGraduate, FaCertificate, FaBuilding, FaWhatsapp, FaArrowRight, FaStar, FaBolt } from 'react-icons/fa';
import { getWhatsAppLink } from '../utils/whatsapp';
import { getSitePromo } from '../utils/api';
import MarqueeStrip from '../components/MarqueeStrip';
import TiltPlane from '../components/TiltPlane';
import MathInfinityBackdrop from '../components/MathInfinityBackdrop';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useInView } from '../hooks/useInView';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [promo, setPromo] = useState(null);
  const heroRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const [statsRevealRef, statsVisible] = useInView({ threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  const [ctaRevealRef, ctaVisible] = useInView({ threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

  useEffect(() => {
    getSitePromo()
      .then((res) => setPromo(res.data))
      .catch(() => setPromo(null));
  }, []);

  const langBase = i18n.language?.split('-')[0] || 'ky';
  const lang = ['ky', 'ru', 'en'].includes(langBase) ? langBase : 'ky';

  const discountLabel =
    (promo && typeof promo[`discount_${lang}`] === 'string' && promo[`discount_${lang}`].trim()) ||
    t('promo.discount');
  const limitedLabel =
    (promo && typeof promo[`limited_${lang}`] === 'string' && promo[`limited_${lang}`].trim()) ||
    t('promo.limited');

  const showSaleTicker = promo === null || promo.ticker_enabled !== false;

  const onHeroPointer = useCallback(
    (e) => {
      if (reducedMotion) return;
      const el = heroRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * 100;
      const py = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty('--gx-num', String(px));
      el.style.setProperty('--gy-num', String(py));
      el.style.setProperty('--gx', `${px}%`);
      el.style.setProperty('--gy', `${py}%`);
    },
    [reducedMotion]
  );

  const stats = [
    { icon: FaTrophy, value: '8+', label: t('stats.experience') },
    { icon: FaUserGraduate, value: '150+', label: t('stats.students') },
    { icon: FaCertificate, value: '50+', label: t('stats.certificates') },
    { icon: FaBuilding, value: '3', label: t('stats.branches') },
  ];

  const statStagger = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4'];

  const tickerFragment = useMemo(
    () => (
      <>
        <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.35em] text-white/95 md:text-xs">
          <FaBolt className="text-amber-200" aria-hidden />
          {discountLabel}
        </span>
        <span className="text-white/40">✦</span>
        <span className="font-black text-amber-100">{limitedLabel}</span>
        <span className="text-white/40">✦</span>
        <span className="text-white/80">RECORD</span>
        <span className="text-white/40">✦</span>
        <span className="text-white/60">
          {t('hero.chip_jrt')} · {t('hero.chip_ort')}
        </span>
        <FaStar className="text-amber-200/90" aria-hidden />
      </>
    ),
    [discountLabel, limitedLabel, t],
  );

  const tickerDark = (
    <>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90 md:text-[11px]">RECORD</span>
      <span className="text-secondary">◆</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45 md:text-[11px]">
        {t('hero.chip_jrt')} · {t('hero.chip_ort')}
      </span>
      <span className="text-white/35">✦</span>
      <span className="font-black text-secondary-light/90">{t('stats.arena_caption')}</span>
      <span className="text-white/35">✦</span>
      <span className="text-[10px] font-black tracking-[0.35em] text-white/50 md:text-[11px]">2016—{new Date().getFullYear()}</span>
    </>
  );

  return (
    <div>
      {showSaleTicker ? (
        <div className="promo-shimmer relative border-b border-white/10 shadow-lg shadow-secondary/25">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 40L40 0H0z\' fill=\'%23ffffff\' fill-opacity=\'0.04\'/%3E%3C/svg%3E')]" />
          <MarqueeStrip className="relative py-3 md:py-3.5">{tickerFragment}</MarqueeStrip>
        </div>
      ) : null}

      <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-r from-[#050d18] via-primary to-[#050d18] py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="record-ticker-fade-l" aria-hidden />
        <div className="record-ticker-fade-r" aria-hidden />
        <MarqueeStrip reverse className="relative z-[2] py-1">
          {tickerDark}
        </MarqueeStrip>
      </div>

      {/* Hero — maximal mesh + watermark + asymmetric grid */}
      <section
        ref={heroRef}
        onPointerMove={onHeroPointer}
        className="hero-mesh relative overflow-hidden text-white"
        style={{
          '--gx': '50%',
          '--gy': '42%',
          '--gx-num': '50',
          '--gy-num': '46',
        }}
      >
        <div className="hero-watermark" aria-hidden>
          <span>RECORD</span>
        </div>
        <div className="hero-scanlines motion-reduce:hidden" aria-hidden />
        <div className="hero-film-grain motion-reduce:hidden" aria-hidden />
        <div className="hero-halftone motion-reduce:hidden" aria-hidden />
        <MathInfinityBackdrop />
        <div className="hero-cursor-glow motion-reduce:hidden" aria-hidden />

        <div
          className="pointer-events-none absolute -left-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-secondary/25 blur-3xl motion-safe:animate-[record-header-glow_12s_ease-in-out_infinite]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 top-0 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/10 blur-3xl motion-safe:animate-[record-header-glow_16s_ease-in-out_infinite_reverse]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl"
          aria-hidden
        />

        <div
          className="hero-grid-shift pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
          aria-hidden
        />

        <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 xl:block" aria-hidden>
          <div className="flex origin-center -rotate-90 flex-col items-center gap-6 text-[10px] font-bold uppercase tracking-[0.5em] text-white/25">
            <span>RECORD</span>
            <span className="h-16 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            <span>ЖРТ</span>
            <span>ОРТ</span>
          </div>
        </div>

        <svg
          className="pointer-events-none absolute right-[4%] top-16 hidden w-64 opacity-[0.18] motion-safe:animate-pulse lg:block"
          viewBox="0 0 220 140"
          fill="none"
          aria-hidden
        >
          <path d="M8 50 Q90 8 210 42" stroke="#c8102e" strokeWidth="10" strokeLinecap="round" />
          <path d="M8 88 Q100 55 210 82" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
          <circle cx="180" cy="28" r="4" fill="#f87171" opacity="0.8" />
        </svg>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-12 md:gap-8 md:py-20 lg:py-28">
          <div className="md:col-span-7 lg:col-span-7">
            <div className="fade-rise mb-5 flex flex-wrap gap-2">
              <Link
                to="/courses"
                className="hero-chip-hit rounded-full border border-secondary/40 bg-secondary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-100 shadow-lg shadow-secondary/20 backdrop-blur-sm"
              >
                {t('hero.chip_jrt')}
              </Link>
              <Link
                to="/courses"
                className="hero-chip-hit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-200 backdrop-blur-sm"
              >
                {t('hero.chip_ort')}
              </Link>
            </div>

            <p className="fade-rise mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-gradient-to-r from-white/15 to-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white shadow-xl shadow-black/30 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary-light shadow-[0_0_14px_#fca5a5]" />
              </span>
              RECORD
            </p>

            <h1 className="font-display text-[2.35rem] font-black leading-[0.95] tracking-[-0.02em] motion-safe:fade-rise motion-safe:stagger-1 sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]">
              <span className="hero-title-chrome motion-reduce:drop-shadow-[0_4px_32px_rgba(0,0,0,0.45)] block text-white md:drop-shadow-[0_4px_32px_rgba(0,0,0,0.45)]">
                {t('hero.title')}
              </span>
              <span className="mt-1 block bg-gradient-to-r from-white via-red-100 to-secondary-light bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(200,16,46,0.35)] md:mt-2">
                {t('hero.subtitle')}
              </span>
            </h1>

            <p className="fade-rise stagger-2 mt-6 max-w-xl border-l-4 border-secondary/80 pl-5 text-base leading-relaxed text-slate-200/95 md:text-lg">
              {t('hero.description')}
            </p>

            <div className="fade-rise stagger-3 mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                to="/contacts"
                className="btn-interactive group btn-secondary px-8 py-4 text-base shadow-2xl shadow-black/30"
              >
                <span className="inline-flex items-center gap-2">
                  {t('hero.cta')}
                  <FaArrowRight className="transition-transform group-hover:translate-x-1.5" />
                </span>
              </Link>
              <Link to="/courses" className="btn-interactive btn-ghost-light px-8 py-4 text-base">
                {t('hero.cta_secondary')}
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center md:col-span-5 lg:justify-end">
            <div className="motion-safe:fade-rise motion-safe:stagger-4 record-logo-poster relative w-full max-w-[min(100%,380px)]">
              <div className="absolute -left-4 top-8 z-20 hidden rotate-[-6deg] rounded-2xl border border-white/20 bg-gradient-to-br from-secondary/90 to-secondary px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-2xl sm:block">
                {t('hero.badge_scores')}
              </div>
              <div className="absolute -right-2 bottom-16 z-20 hidden rotate-[8deg] rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/90 shadow-xl backdrop-blur-md md:block">
                {t('hero.badge_location')}
              </div>

              <div
                className="pointer-events-none absolute -inset-10 rounded-full border border-dashed border-white/20 motion-safe:animate-[record-rotate-slow_56s_linear_infinite]"
                aria-hidden
              />
              <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-secondary/50 via-transparent to-sky-400/20 blur-3xl motion-safe:animate-pulse" />

              <div className="float-logo relative mx-auto w-fit">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-white/30 via-secondary to-primary p-[4px] shadow-[0_0_60px_rgba(200,16,46,0.45)]">
                  <div className="rounded-full bg-[#020617] p-3 md:p-4">
                    <img
                      src="/brand/record-logo.png"
                      alt="RECORD"
                      className="mx-auto h-48 w-48 rounded-full object-cover ring-4 ring-white/15 ring-offset-4 ring-offset-[#020617] md:h-56 md:w-56 lg:h-64 lg:w-64"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <svg
          className="relative -mb-px block h-14 w-full text-[#050d18] md:h-[4.5rem]"
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path fill="currentColor" d="M0,72 L0,12 Q200,48 480,20 T960,36 Q1200,52 1440,8 L1440,72 Z" />
        </svg>
      </section>

      {/* Stats — dark “arena” */}
      <section ref={statsRevealRef} className="stats-arena -mt-1">
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <p className="mb-10 text-center font-display text-xs font-bold uppercase tracking-[0.4em] text-secondary-light/90 md:mb-12">
            {t('stats.arena_caption')}
          </p>
          <div
            className={`record-reveal-block grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 ${
              statsVisible ? 'record-reveal-block--visible' : ''
            }`}
          >
            {stats.map((stat, i) => (
              <TiltPlane key={i} strength={9} className="record-reveal-item">
                <div className={`stat-card-wild motion-safe:fade-rise ${statStagger[i] ?? ''}`}>
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-secondary/20 blur-2xl" />
                  <stat.icon className="relative mb-4 text-3xl text-secondary md:text-4xl" />
                  <p className="stat-value-wild relative">{stat.value}</p>
                  <p className="relative mt-2 text-sm font-medium uppercase tracking-wide text-slate-300">{stat.label}</p>
                </div>
              </TiltPlane>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — diagonal split + wild glass */}
      <section ref={ctaRevealRef} className="cta-split-wrap border-t border-white/10">
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <div
            className={`cta-glass-panel-wild record-reveal-cta ${
              ctaVisible ? 'record-reveal-cta--visible' : ''
            }`}
          >
            <div className="pointer-events-none absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-secondary/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 top-0 h-32 w-32 rounded-full bg-sky-400/20 blur-2xl" />
            <div className="relative z-20 text-center">
              <h2 className="font-display text-3xl font-black tracking-tight text-white drop-shadow-lg md:text-5xl">
                {t('courses.title')}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">{t('about.description')}</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/courses"
                  className="btn-interactive btn-primary min-w-[200px] border border-white/20 shadow-2xl shadow-black/30"
                >
                  {t('hero.cta_secondary')}
                </Link>
                <a
                  href={getWhatsAppLink('Саламатсызбы! Курстар жөнүндө маалымат алгым келет.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive btn-whatsapp min-w-[200px] border border-white/20 shadow-2xl"
                >
                  <FaWhatsapp className="text-xl" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
