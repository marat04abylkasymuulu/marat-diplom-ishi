import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSchedule } from '../utils/api';
import { useLocalized } from '../hooks/useLocalized';
import PageHeader from '../components/PageHeader';
import RecordInnerPageWrap from '../components/RecordInnerPageWrap';

const daysOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const dayNames = {
  ky: {
    mon: 'Дүйшөмбү',
    tue: 'Шейшемби',
    wed: 'Шаршемби',
    thu: 'Бейшемби',
    fri: 'Жума',
    sat: 'Ишемби',
    sun: 'Жекшемби',
  },
  ru: {
    mon: 'Понедельник',
    tue: 'Вторник',
    wed: 'Среда',
    thu: 'Четверг',
    fri: 'Пятница',
    sat: 'Суббота',
    sun: 'Воскресенье',
  },
  en: {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  },
};

export default function Schedule() {
  const { t } = useTranslation();
  const { lang, getField } = useLocalized();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchedule()
      .then((res) => setSchedule(res.data.results || res.data))
      .catch(() => setSchedule(demoSchedule))
      .finally(() => setLoading(false));
  }, []);

  const grouped = daysOrder.reduce((acc, day) => {
    acc[day] = schedule.filter((s) => s.day === day);
    return acc;
  }, {});

  const currentDayNames = dayNames[lang] || dayNames.ky;

  return (
    <div>
      <PageHeader title={t('schedule.title')} />

      <RecordInnerPageWrap>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:pt-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner-brand" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-primary to-primary-light text-white">
                    <th className="px-5 py-4 font-display text-xs font-bold uppercase tracking-wider md:px-6">
                      {t('schedule.day')}
                    </th>
                    <th className="px-5 py-4 font-display text-xs font-bold uppercase tracking-wider md:px-6">
                      {t('schedule.time')}
                    </th>
                    <th className="px-5 py-4 font-display text-xs font-bold uppercase tracking-wider md:px-6">
                      {t('schedule.course')}
                    </th>
                    <th className="px-5 py-4 font-display text-xs font-bold uppercase tracking-wider md:px-6">
                      {t('schedule.room')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {daysOrder.map((day) =>
                    grouped[day]?.length > 0
                      ? grouped[day].map((item, i) => (
                          <tr key={`${day}-${i}`} className="transition hover:bg-slate-50/80">
                            {i === 0 ? (
                              <td
                                rowSpan={grouped[day].length}
                                className="border-r border-slate-100 bg-gradient-to-b from-secondary/8 to-transparent px-5 py-4 align-top font-display font-bold text-primary md:px-6"
                              >
                                {currentDayNames[day]}
                              </td>
                            ) : null}
                            <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700 md:px-6">
                              {item.start_time} – {item.end_time}
                            </td>
                            <td className="px-5 py-4 font-medium text-slate-800 md:px-6">
                              {item.course_name || getField(item, 'course_title') || item.course}
                            </td>
                            <td className="px-5 py-4 text-slate-500 md:px-6">{item.room || '—'}</td>
                          </tr>
                        ))
                      : null,
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      </RecordInnerPageWrap>
    </div>
  );
}

const demoSchedule = [
  { day: 'mon', start_time: '09:00', end_time: '11:00', course: 'ЖРТ Математика', room: '101' },
  { day: 'mon', start_time: '11:30', end_time: '13:30', course: 'ЖРТ Кыргыз тили', room: '102' },
  { day: 'tue', start_time: '09:00', end_time: '11:00', course: 'Интенсив', room: '201' },
  { day: 'wed', start_time: '09:00', end_time: '11:00', course: 'ЖРТ Математика', room: '101' },
  { day: 'wed', start_time: '14:00', end_time: '16:00', course: 'Практика', room: '103' },
  { day: 'thu', start_time: '09:00', end_time: '11:00', course: 'ЖРТ Кыргыз тили', room: '102' },
  { day: 'fri', start_time: '09:00', end_time: '12:00', course: 'Интенсив', room: '201' },
  { day: 'sat', start_time: '10:00', end_time: '13:00', course: 'Практика тест', room: '101' },
];
