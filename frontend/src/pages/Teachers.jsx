import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { getTeachers } from '../utils/api';
import { useLocalized } from '../hooks/useLocalized';
import PageHeader from '../components/PageHeader';
import RecordInnerPageWrap from '../components/RecordInnerPageWrap';

export default function Teachers() {
  const { t } = useTranslation();
  const { getField } = useLocalized();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeachers()
      .then((res) => setTeachers(res.data.results || res.data))
      .catch(() => setTeachers(demoTeachers))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title={t('teachers.title')} subtitle={t('about.description')} />

      <RecordInnerPageWrap>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:pt-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner-brand" />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <article key={teacher.id} className="card-accent p-8 text-center">
                <div className="relative mx-auto mb-5 h-36 w-36">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/30 to-primary/20 blur-md" />
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg">
                    {teacher.photo ? (
                      <img src={teacher.photo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <FaChalkboardTeacher className="text-5xl text-primary/40" />
                    )}
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-primary">{getField(teacher, 'full_name')}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-secondary">{getField(teacher, 'subject')}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {teacher.experience_years} {t('teachers.experience')}
                </p>
                {getField(teacher, 'bio') ? (
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">{getField(teacher, 'bio')}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
      </RecordInnerPageWrap>
    </div>
  );
}

const demoTeachers = [
  {
    id: 1,
    full_name_ky: 'Нишанов Шекербек',
    full_name_ru: 'Нишанов Шекербек',
    full_name_en: 'Nishanov Shekerbek',
    subject_ky: 'Математика',
    subject_ru: 'Математика',
    subject_en: 'Mathematics',
    experience_years: 8,
    bio_ky: 'Тажрыйбалуу математика мугалими',
    bio_ru: 'Опытный преподаватель математики',
    bio_en: 'Experienced mathematics teacher',
  },
  {
    id: 2,
    full_name_ky: 'Акматова Айгүл',
    full_name_ru: 'Акматова Айгуль',
    full_name_en: 'Akmatova Aigul',
    subject_ky: 'Кыргыз тили',
    subject_ru: 'Кыргызский язык',
    subject_en: 'Kyrgyz Language',
    experience_years: 6,
    bio_ky: 'Кыргыз тили боюнча адис',
    bio_ru: 'Специалист по кыргызскому языку',
    bio_en: 'Kyrgyz language specialist',
  },
  {
    id: 3,
    full_name_ky: 'Турдуев Бакыт',
    full_name_ru: 'Турдуев Бакыт',
    full_name_en: 'Turduev Bakyt',
    subject_ky: 'Аналогия/Толуктоо',
    subject_ru: 'Аналогия/Дополнение',
    subject_en: 'Analogy/Completion',
    experience_years: 5,
    bio_ky: 'Аналогия жана толуктоо боюнча мугалим',
    bio_ru: 'Преподаватель аналогии и дополнения',
    bio_en: 'Analogy and completion teacher',
  },
];
