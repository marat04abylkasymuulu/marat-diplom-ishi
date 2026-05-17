import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaInstagram, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#050d18] via-primary to-[#0a1628] text-white">
      <div
        className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-16">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <div className="mb-5 flex items-center gap-4">
              <img
                src="/brand/record-logo.png"
                alt="RECORD"
                className="h-16 w-16 rounded-full border-2 border-white/20 object-cover shadow-lg"
              />
              <div>
                <h3 className="font-display text-2xl font-extrabold tracking-tight">РЕКОРД</h3>
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  ЖРТ · ОРТ · Окуу борбору
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-300">{t('about.description')}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-4 md:grid-cols-2">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-secondary">{t('nav.courses')}</h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li>
                  <Link to="/courses" className="transition hover:text-white">
                    {t('nav.courses')}
                  </Link>
                </li>
                <li>
                  <Link to="/schedule" className="transition hover:text-white">
                    {t('nav.schedule')}
                  </Link>
                </li>
                <li>
                  <Link to="/teachers" className="transition hover:text-white">
                    {t('nav.teachers')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-secondary">{t('nav.about')}</h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li>
                  <Link to="/about" className="transition hover:text-white">
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <Link to="/achievements" className="transition hover:text-white">
                    {t('nav.achievements')}
                  </Link>
                </li>
                <li>
                  <Link to="/reviews" className="transition hover:text-white">
                    {t('nav.reviews')}
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="transition hover:text-white">
                    {t('nav.news')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-secondary">{t('nav.contacts')}</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-0.5 shrink-0 text-secondary" />
                <span>Ош шаары, Кыргызстан</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="shrink-0 text-secondary" />
                <a href="tel:+996555000000" className="transition hover:text-white">
                  +996 555 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="shrink-0 text-emerald-400" />
                <a href="https://wa.me/996555000000" className="transition hover:text-white">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaInstagram className="shrink-0 text-pink-400" />
                <a href="https://instagram.com/record_osh" className="transition hover:text-white">
                  @record_osh
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-xs text-slate-500 md:text-sm">
          <p>
            &copy; {new Date().getFullYear()} РЕКОРД. {t('footer.rights')}.
          </p>
        </div>
      </div>

      <div className="footer-watermark motion-reduce:hidden" aria-hidden>
        RECORD
      </div>
    </footer>
  );
}
