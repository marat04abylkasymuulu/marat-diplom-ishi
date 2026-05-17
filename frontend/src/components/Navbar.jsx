import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes } from 'react-icons/fa';
import ScrollProgressBar from './ScrollProgressBar';

const languages = [
  { code: 'ky', label: 'Кыргызча' },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/courses', label: t('nav.courses') },
    { to: '/schedule', label: t('nav.schedule') },
    { to: '/teachers', label: t('nav.teachers') },
    { to: '/achievements', label: t('nav.achievements') },
    { to: '/reviews', label: t('nav.reviews') },
    { to: '/news', label: t('nav.news') },
    { to: '/contacts', label: t('nav.contacts') },
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <>
      <nav className="record-nav-shell relative sticky top-0 z-[100] border-b border-slate-200/80 bg-white/90 shadow-md shadow-slate-900/10 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #cbd5e1 0.5px, transparent 0.5px)',
            backgroundSize: '18px 18px',
          }}
        />
      </div>
      <div className="nav-accent-line absolute inset-x-0 top-0 h-[3px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="flex h-[4.25rem] items-center justify-between gap-4">
          <Link to="/" className="group flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-secondary to-primary opacity-80 blur-[2px] transition group-hover:opacity-100" />
              <img
                src="/brand/record-logo.png"
                alt="RECORD"
                className="relative h-12 w-12 rounded-full border-2 border-white object-cover shadow-md md:h-14 md:w-14"
              />
            </div>
            <div className="min-w-0 text-left leading-tight">
              <span className="font-display text-lg font-extrabold tracking-tight text-primary md:text-xl">
                РЕКОРД
              </span>
              <p className="hidden truncate text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:block md:text-xs">
                Аналитикалык жана билим берүү уюму
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link-pop relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'text-primary'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-primary'
                  }`}
                >
                  {active ? (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-secondary" />
                  ) : null}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div
              className="record-lang-rail flex items-stretch rounded-xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-slate-100/90 p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
              role="group"
              aria-label={t('nav.language')}
            >
              {languages.map((lang) => {
                const active = i18n.language?.startsWith(lang.code);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    title={lang.label}
                    className={`record-lang-seg relative min-w-[2.5rem] rounded-lg px-2 py-2 text-center font-mono text-[11px] font-black uppercase tracking-tight transition-all md:min-w-[2.75rem] md:px-2.5 ${
                      active
                        ? 'text-white shadow-lg shadow-secondary/35'
                        : 'text-slate-500 hover:bg-white/80 hover:text-primary'
                    }`}
                  >
                    {active ? (
                      <span
                        className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-secondary via-secondary to-primary record-lang-pulse-motion"
                        aria-hidden
                      />
                    ) : null}
                    <span className="relative">{lang.code}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-700 transition hover:bg-slate-50 lg:hidden"
              aria-label="Menu"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {isOpen ? (
          <div className="border-t border-slate-100 pb-4 pt-2 lg:hidden">
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-base font-medium ${
                    location.pathname === link.to
                      ? 'bg-primary/5 text-primary'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
    <ScrollProgressBar />
    </>
  );
}
