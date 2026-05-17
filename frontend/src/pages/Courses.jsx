import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaClock, FaCalendar, FaTag } from 'react-icons/fa';
import { getCourses, getCategories } from '../utils/api';
import { useLocalized } from '../hooks/useLocalized';
import PageHeader from '../components/PageHeader';
import RecordInnerPageWrap from '../components/RecordInnerPageWrap';

export default function Courses() {
  const { t } = useTranslation();
  const { getField } = useLocalized();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.results || res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    getCourses(activeCategory || undefined)
      .then((res) => {
        if (!cancelled) setCourses(res.data.results || res.data);
      })
      .catch(() => {
        if (!cancelled && !activeCategory) setCourses(demoCourses);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  if (loading) {
    return (
      <div>
        <PageHeader title={t('courses.title')} />
        <RecordInnerPageWrap>
          <div className="flex justify-center py-24">
            <div className="spinner-brand" />
          </div>
        </RecordInnerPageWrap>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t('courses.title')} />

      <RecordInnerPageWrap>
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:pt-14">
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('')}
            className={`pill-filter ${!activeCategory ? 'pill-filter-active' : ''}`}
          >
            {t('courses.filter_all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={`pill-filter ${activeCategory === cat.slug ? 'pill-filter-active' : ''}`}
            >
              {getField(cat, 'name')}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article key={course.id} className="card flex flex-col">
              <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary via-primary-light to-slate-800">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)]" />
                {course.image ? (
                  <img src={course.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-5xl font-black text-white/25">
                    R
                  </div>
                )}
                <span className="absolute bottom-3 left-3 rounded-full bg-secondary/95 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  RECORD
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold text-primary">{getField(course, 'title')}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {getField(course, 'description')}
                </p>
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-secondary" />
                    <span>
                      {t('courses.duration')}: {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTag className="text-secondary" />
                    <span>
                      {t('courses.price')}: {course.price} сом
                    </span>
                  </div>
                  {course.start_date ? (
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-secondary" />
                      <span>
                        {t('courses.start_date')}: {course.start_date}
                      </span>
                    </div>
                  ) : null}
                </div>
                <Link to="/contacts" className="btn-primary mt-6 w-full justify-center py-3 text-center text-sm">
                  {t('courses.enroll')}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {courses.length === 0 ? (
          <p className="py-16 text-center text-slate-500">No courses available yet.</p>
        ) : null}
      </div>
      </RecordInnerPageWrap>
    </div>
  );
}

const demoCourses = [
  {
    id: 1,
    title_ky: 'ЖРТ Математика',
    title_ru: 'ОРТ Математика',
    title_en: 'ORT Mathematics',
    description_ky: 'Толук математика курсу',
    description_ru: 'Полный курс математики',
    description_en: 'Full mathematics course',
    duration: '3 ай',
    price: '5000',
    start_date: '2026-06-01',
  },
  {
    id: 2,
    title_ky: 'ЖРТ Кыргыз тили',
    title_ru: 'ОРТ Кыргызский язык',
    title_en: 'ORT Kyrgyz Language',
    description_ky: 'Кыргыз тили курсу',
    description_ru: 'Курс кыргызского языка',
    description_en: 'Kyrgyz language course',
    duration: '3 ай',
    price: '5000',
    start_date: '2026-06-01',
  },
  {
    id: 3,
    title_ky: 'Интенсив 10 күн',
    title_ru: 'Интенсив 10 дней',
    title_en: 'Intensive 10 days',
    description_ky: '10 күндүк интенсив программа',
    description_ru: '10-дневная интенсивная программа',
    description_en: '10-day intensive program',
    duration: '10 күн',
    price: '3000',
    start_date: '2026-06-15',
  },
];
