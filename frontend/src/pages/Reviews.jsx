import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar, FaPlay, FaCheck } from 'react-icons/fa';
import { getReviews, getFeedbacks, submitFeedback } from '../utils/api';
import { useLocalized } from '../hooks/useLocalized';
import PageHeader from '../components/PageHeader';
import RecordInnerPageWrap from '../components/RecordInnerPageWrap';

export default function Reviews() {
  const { t } = useTranslation();
  const { getField } = useLocalized();
  const [reviews, setReviews] = useState(demoReviews);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    Promise.all([getReviews(), getFeedbacks()])
      .then(([revRes, fbRes]) => {
        const revData = revRes.data.results || revRes.data;
        const fbData = fbRes.data.results || fbRes.data;
        if (revData.length) setReviews(revData);
        if (fbData.length) setFeedbacks(fbData);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title={t('reviews.title')} />

      <RecordInnerPageWrap>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:pt-10">
        <div className="mb-10 flex justify-center">
          <button type="button" onClick={() => setShowForm(!showForm)} className="btn-secondary">
            {showForm ? t('reviews.hide_form') : t('reviews.leave_feedback')}
          </button>
        </div>

        {showForm ? <FeedbackForm onSuccess={() => setShowForm(false)} /> : null}

        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="card-accent p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light font-bold text-white shadow-md">
                  {review.student_name?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-primary">{review.student_name}</h4>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-sm text-secondary" />
                    <span className="text-sm font-medium text-secondary">
                      {review.score} {t('reviews.score')}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-slate-600">{getField(review, 'text')}</p>

              {review.video_url ? (
                <a
                  href={review.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary"
                >
                  <FaPlay className="text-xs" />
                  {t('reviews.watch_video')}
                </a>
              ) : null}

              <p className="mt-3 text-xs text-slate-400">{review.year}</p>
            </div>
          ))}
        </div>

        {feedbacks.length > 0 ? (
          <>
            <h2 className="section-title">{t('reviews.student_feedbacks')}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="card border-l-4 border-secondary p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800">{fb.student_name}</h4>
                    <div className="flex text-secondary">
                      {[...Array(fb.rating)].map((_, i) => (
                        <FaStar key={i} className="text-sm" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{fb.text}</p>
                  {fb.course_taken ? <p className="mt-2 text-xs text-slate-400">{fb.course_taken}</p> : null}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
      </RecordInnerPageWrap>
    </div>
  );
}

function FeedbackForm({ onSuccess }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    student_name: '', phone: '', email: '', text: '', rating: 5, course_taken: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitFeedback(form);
    } catch {
      // demo mode fallback
    }
    setSubmitted(true);
    setLoading(false);
    setTimeout(() => {
      setSubmitted(false);
      onSuccess?.();
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="card-accent mx-auto mb-12 max-w-lg p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <FaCheck className="text-2xl text-emerald-600" />
        </div>
        <p className="font-medium text-emerald-700">{t('reviews.feedback_success')}</p>
      </div>
    );
  }

  return (
    <div className="card-accent mx-auto mb-12 max-w-lg p-8">
      <h3 className="font-display mb-6 text-xl font-bold text-primary">{t('reviews.form_title')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t('contacts.form_name')} *</label>
          <input
            type="text"
            required
            value={form.student_name}
            onChange={(e) => setForm({ ...form, student_name: e.target.value })}
            className="input-brand"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t('contacts.form_phone')}</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+996 ..."
              className="input-brand"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-brand"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t('reviews.which_course')}</label>
          <input
            type="text"
            value={form.course_taken}
            onChange={(e) => setForm({ ...form, course_taken: e.target.value })}
            className="input-brand"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">{t('reviews.your_rating')}</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl transition-colors"
              >
                <FaStar
                  className={star <= (hoverRating || form.rating) ? 'text-secondary' : 'text-slate-300'}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t('reviews.your_review')} *</label>
          <textarea
            rows="4"
            required
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder={t('reviews.review_placeholder')}
            className="input-brand resize-none"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
          {loading ? '...' : t('reviews.submit_feedback')}
        </button>

        <p className="text-center text-xs text-slate-500">{t('reviews.moderation_note')}</p>
      </form>
    </div>
  );
}

const demoReviews = [
  { id: 1, student_name: 'Алиев Нурлан', score: 224, year: 2025, text_ky: 'Рекорд окуу борборунда окугандан кийин мен 224 балл алдым. Мугалимдер абдан жакшы түшүндүрүшөт.', text_ru: 'После обучения в центре Рекорд я набрал 224 балла. Преподаватели очень хорошо объясняют.', text_en: 'After studying at Record center I scored 224 points. Teachers explain very well.', video_url: '' },
  { id: 2, student_name: 'Бекова Айдай', score: 219, year: 2025, text_ky: 'Мен ЖРТда 219 балл алдым! Рекордго чоң ыраазычылык. Интенсив курс абдан пайдалуу болду.', text_ru: 'Я набрала 219 баллов на ОРТ! Большая благодарность Рекорду. Интенсивный курс был очень полезен.', text_en: 'I scored 219 on ORT! Big thanks to Record. The intensive course was very useful.', video_url: '' },
  { id: 3, student_name: 'Касымов Эркин', score: 215, year: 2024, text_ky: '10 күндүк интенсив курстан кийин менин баллым 50ге жогорулады. Рекомендация берем!', text_ru: 'После 10-дневного интенсива мой балл вырос на 50. Рекомендую!', text_en: 'After the 10-day intensive my score increased by 50. I recommend it!', video_url: '' },
  { id: 4, student_name: 'Турсунова Малика', score: 212, year: 2024, text_ky: 'Эң мыкты мугалимдер жана жылуу атмосфера. Рекорд менин келечегимди өзгөрттү.', text_ru: 'Лучшие преподаватели и теплая атмосфера. Рекорд изменил мое будущее.', text_en: 'Best teachers and warm atmosphere. Record changed my future.', video_url: '' },
  { id: 5, student_name: 'Жумабеков Арсен', score: 210, year: 2025, text_ky: 'Математика боюнча абдан күчтүү даярдык алдым. 210 балл — бул менин максатым эле!', text_ru: 'Получил очень сильную подготовку по математике. 210 баллов — это была моя цель!', text_en: 'Got very strong preparation in mathematics. 210 points was my goal!', video_url: '' },
  { id: 6, student_name: 'Сатарова Бегимай', score: 208, year: 2024, text_ky: 'Рекордсуз бул жыйынтыкка жетүү мүмкүн эмес болмок. Ыраазымын!', text_ru: 'Без Рекорда этот результат был бы невозможен. Благодарна!', text_en: 'Without Record this result would have been impossible. Grateful!', video_url: '' },
];
