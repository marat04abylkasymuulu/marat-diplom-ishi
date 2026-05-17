import { useState, useEffect } from 'react';
import { adminApi } from '../AuthContext';
import FormModal from '../components/FormModal';
import { FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = () => {
    adminApi
      .get('/reviews/')
      .then((res) => setReviews(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Жок кылуу?')) return;
    await adminApi.delete(`/reviews/${id}/`);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Жарыяланган отзывдар</h1>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <FaPlus /> Кошуу
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{r.student_name}</h3>
                  <p className="text-sm text-gray-500">
                    {r.score} балл · {r.year}
                    {r.is_featured ? (
                      <span className="ml-2 text-xs font-bold text-secondary">★ Featured</span>
                    ) : null}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-3">{r.text_ru || r.text_ky || r.text_en || '—'}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(r);
                      setModalOpen(true);
                    }}
                    className="text-primary text-sm hover:underline flex items-center gap-1"
                  >
                    <FaEdit /> Өзгөртүү
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="text-red-400 text-sm hover:text-red-600 flex items-center gap-1"
                  >
                    <FaTrash /> Жок кылуу
                  </button>
                </div>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-gray-400 col-span-full text-center py-8">Отзывдар жок.</p>}
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Өзгөртүү' : 'Жаңы отзыв'}>
        <ReviewForm key={editing?.id ?? 'new'} item={editing} onSuccess={() => { setModalOpen(false); fetchData(); }} />
      </FormModal>
    </div>
  );
}

function ReviewForm({ item, onSuccess }) {
  const writableFields = [
    'student_name', 'text_ky', 'text_ru', 'text_en',
    'score', 'year', 'video_url', 'is_featured',
  ];

  const getInitial = () => {
    const base = {
      student_name: '',
      text_ky: '',
      text_ru: '',
      text_en: '',
      score: 200,
      year: new Date().getFullYear(),
      video_url: '',
      is_featured: true,
    };
    if (!item) return base;
    const filled = { ...base };
    writableFields.forEach((key) => {
      if (item[key] !== undefined && item[key] !== null) filled[key] = item[key];
    });
    return filled;
  };

  const [form, setForm] = useState(getInitial);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {};
    writableFields.forEach((key) => {
      payload[key] = form[key];
    });
    payload.score = parseInt(String(payload.score), 10) || 0;
    payload.year = parseInt(String(payload.year), 10) || new Date().getFullYear();
    if (!payload.video_url) payload.video_url = '';
    try {
      if (item) {
        await adminApi.patch(`/reviews/${item.id}/`, payload);
      } else {
        await adminApi.post('/reviews/', payload);
      }
      onSuccess();
    } catch (err) {
      alert('Ката: ' + JSON.stringify(err.response?.data));
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Окуучунун аты</label>
        <input
          type="text"
          required
          value={form.student_name}
          onChange={(e) => setForm({ ...form, student_name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Балл</label>
          <input
            type="number"
            required
            value={form.score}
            onChange={(e) => setForm({ ...form, score: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Жыл</label>
          <input
            type="number"
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Текст (Кыргызча)</label>
        <textarea rows={2} value={form.text_ky} onChange={(e) => setForm({ ...form, text_ky: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Текст (Русский)</label>
        <textarea rows={2} value={form.text_ru} onChange={(e) => setForm({ ...form, text_ru: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Text (English)</label>
        <textarea rows={2} value={form.text_en} onChange={(e) => setForm({ ...form, text_en: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Видео URL</label>
        <input type="url" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
        Featured (башкы бетте көрүнүү)
      </label>
      <p className="text-xs text-gray-400 flex items-center gap-1">
        <FaStar className="text-secondary" /> Сүрөт жүктөө азырынча Django admin аркылуу гана.
      </p>
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? '...' : item ? 'Сактоо' : 'Кошуу'}
      </button>
    </form>
  );
}
