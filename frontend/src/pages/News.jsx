import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCalendar, FaTag } from 'react-icons/fa';
import { getNews } from '../utils/api';
import { useLocalized } from '../hooks/useLocalized';
import PageHeader from '../components/PageHeader';
import RecordInnerPageWrap from '../components/RecordInnerPageWrap';

export default function News() {
  const { t } = useTranslation();
  const { getField } = useLocalized();
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getNews()
      .then((res) => {
        const data = res.data.results || res.data;
        setArticles(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['promo', 'course', 'exam', 'general'];
  const filtered = activeCategory ? articles.filter((a) => a.category === activeCategory) : articles;

  if (loading) {
    return (
      <div>
        <PageHeader title={t('news.title')} />
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
      <PageHeader title={t('news.title')} />

      <RecordInnerPageWrap>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:pt-14">
        {error ? <p className="py-6 text-center font-medium text-red-600">{t('common.error_loading')}</p> : null}

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
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`pill-filter ${activeCategory === cat ? 'pill-filter-active' : ''}`}
            >
              {t(`news.categories.${cat}`)}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <article key={article.id} className="card flex flex-col overflow-hidden">
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary via-primary-light to-slate-800">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_35%,rgba(255,255,255,0.06)_50%,transparent_65%)]" />
                {article.image ? (
                  <img src={article.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-4xl font-black text-white/20">
                    NEWS
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-secondary">
                    <FaTag className="text-[10px]" />
                    {t(`news.categories.${article.category}`)}
                  </span>
                  {article.published_at ? (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <FaCalendar className="text-[10px]" />
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                  ) : null}
                </div>
                <h3 className="font-display text-lg font-bold text-primary">{getField(article, 'title')}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{getField(article, 'content')}</p>
              </div>
            </article>
          ))}
        </div>

        {!error && filtered.length === 0 ? (
          <p className="py-16 text-center text-slate-500">{t('news.no_news')}</p>
        ) : null}
      </div>
      </RecordInnerPageWrap>
    </div>
  );
}
