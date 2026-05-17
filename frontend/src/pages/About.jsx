import { useTranslation } from 'react-i18next';
import { FaGraduationCap, FaBullseye, FaUsers } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import RecordInnerPageWrap from '../components/RecordInnerPageWrap';

export default function About() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t('about.title')} subtitle={t('about.description')} />

      <RecordInnerPageWrap>
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 md:pt-16">
        <div className="card-accent mb-14 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-light to-[#1a5080] p-8 text-white shadow-2xl md:p-12">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-12">
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-4 border-white/25 bg-white/10 shadow-inner backdrop-blur-sm md:h-48 md:w-48">
              <FaUsers className="text-6xl text-white/90 md:text-7xl" />
            </div>
            <div className="text-center md:text-left">
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-secondary-light">{t('about.director')}</p>
              <h2 className="font-display text-3xl font-extrabold md:text-4xl">{t('about.director_name')}</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">{t('about.description')}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="card-accent p-8 md:p-10">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <FaBullseye className="text-2xl text-secondary" />
            </div>
            <h3 className="font-display text-xl font-bold text-primary md:text-2xl">{t('about.mission')}</h3>
            <p className="mt-4 leading-relaxed text-slate-600">{t('about.mission_text')}</p>
          </div>

          <div className="card-accent p-8 md:p-10">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
              <FaGraduationCap className="text-2xl text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold text-primary md:text-2xl">{t('about.history')}</h3>
            <p className="mt-4 leading-relaxed text-slate-600">{t('about.description')}</p>
          </div>
        </div>
        </div>
      </RecordInnerPageWrap>
    </div>
  );
}
