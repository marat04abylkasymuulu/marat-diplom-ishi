import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';
import { getAchievements, getReviews } from '../utils/api';
import { useLocalized } from '../hooks/useLocalized';
import PageHeader from '../components/PageHeader';
import RecordInnerPageWrap from '../components/RecordInnerPageWrap';

export default function Achievements() {
  const { t } = useTranslation();
  const { getField } = useLocalized();
  const [achievements, setAchievements] = useState(demoAchievements);
  const [topStudents, setTopStudents] = useState(demoTopStudents);

  useEffect(() => {
    Promise.all([getAchievements(), getReviews(true)])
      .then(([achRes, revRes]) => {
        const achData = achRes.data.results || achRes.data;
        const revData = revRes.data.results || revRes.data;
        if (achData.length) setAchievements(achData);
        if (revData.length) setTopStudents(revData);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title={t('achievements.title')} />

      <RecordInnerPageWrap>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:pt-14">
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {achievements.map((ach, i) => (
            <div
              key={ach.id || i}
              className="card relative overflow-hidden p-8 text-center before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-secondary before:to-primary before:content-['']"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/5" />
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                {i === 0 ? (
                  <FaTrophy className="text-3xl text-secondary" />
                ) : i === 1 ? (
                  <FaMedal className="text-3xl text-secondary" />
                ) : (
                  <FaStar className="text-3xl text-secondary" />
                )}
              </div>
              <p className="font-display text-4xl font-black text-primary md:text-5xl">{ach.value}</p>
              <h3 className="relative mt-2 text-lg font-semibold text-slate-800">{getField(ach, 'title')}</h3>
              {getField(ach, 'description') ? (
                <p className="relative mt-2 text-sm text-slate-600">{getField(ach, 'description')}</p>
              ) : null}
            </div>
          ))}
        </div>

        <h2 className="section-title">{t('achievements.high_scorers')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topStudents.map((student, i) => (
            <div key={student.id || i} className="card p-5 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary shadow-lg shadow-secondary/25">
                <span className="font-display text-lg font-black text-white">{student.score}</span>
              </div>
              <h4 className="font-semibold text-primary">{student.student_name}</h4>
              <p className="mt-1 text-sm text-slate-500">{student.year}</p>
            </div>
          ))}
        </div>
      </div>
      </RecordInnerPageWrap>
    </div>
  );
}

const demoAchievements = [
  {
    id: 1,
    title_ky: 'Жылдык тажрыйба',
    title_ru: 'Лет опыта',
    title_en: 'Years of Experience',
    value: '8+',
    description_ky: '',
    description_ru: '',
    description_en: '',
  },
  {
    id: 2,
    title_ky: '200+ балл алгандар',
    title_ru: 'Учеников с 200+ баллами',
    title_en: 'Students with 200+ Score',
    value: '150+',
    description_ky: '',
    description_ru: '',
    description_en: '',
  },
  {
    id: 3,
    title_ky: 'Алтын сертификаттар',
    title_ru: 'Золотых сертификатов',
    title_en: 'Gold Certificates',
    value: '50+',
    description_ky: '',
    description_ru: '',
    description_en: '',
  },
];

const demoTopStudents = [
  { id: 1, student_name: 'Алиев Нурлан', score: 224, year: 2025 },
  { id: 2, student_name: 'Бекова Айдай', score: 219, year: 2025 },
  { id: 3, student_name: 'Касымов Эркин', score: 215, year: 2024 },
  { id: 4, student_name: 'Турсунова Малика', score: 212, year: 2024 },
  { id: 5, student_name: 'Жумабеков Арсен', score: 210, year: 2025 },
  { id: 6, student_name: 'Сатарова Бегимай', score: 208, year: 2024 },
  { id: 7, student_name: 'Маматов Данияр', score: 205, year: 2023 },
  { id: 8, student_name: 'Осмонова Элина', score: 203, year: 2023 },
];
