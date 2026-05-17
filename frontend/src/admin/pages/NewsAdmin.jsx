import { useState, useEffect } from 'react';
import { adminApi } from '../AuthContext';
import FormModal from '../components/FormModal';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

const categoryLabels = { promo: 'Акция', course: 'Жаңы курс', exam: 'ЖРТ жаңылык', general: 'Жалпы' };

export default function NewsAdmin() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = () => {
    adminApi.get('/news/')
      .then((res) => setArticles(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Жок кылуу?')) return;
    await adminApi.delete(`/news/${id}/`);
    fetchData();
  };

  const togglePublish = async (article) => {
    await adminApi.patch(`/news/${article.id}/`, { is_published: !article.is_published });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Жаңылыктар</h1>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus /> Жаңылык кошуу
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a.id} className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.is_published ? 'Жарыяланган' : 'Жашырын'}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {categoryLabels[a.category] || a.category}
                  </span>
                </div>
                <h3 className="font-semibold text-sm">{a.title_ky || a.title_ru}</h3>
                <p className="text-xs text-gray-500 mt-1">{new Date(a.published_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => togglePublish(a)} className={a.is_published ? 'text-green-500' : 'text-gray-400'}>
                  {a.is_published ? <FaEye /> : <FaEyeSlash />}
                </button>
                <button onClick={() => { setEditing(a); setModalOpen(true); }} className="text-primary">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-600">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <p className="text-center text-gray-400 py-8">Жаңылыктар жок.</p>
          )}
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Жаңылыкты өзгөртүү' : 'Жаңы жаңылык'}>
        <NewsForm article={editing} onSuccess={() => { setModalOpen(false); fetchData(); }} />
      </FormModal>
    </div>
  );
}

function NewsForm({ article, onSuccess }) {
  const writableFields = ['title_ky', 'title_ru', 'title_en', 'content_ky', 'content_ru', 'content_en', 'category', 'is_published'];

  const getInitial = () => {
    const base = { title_ky: '', title_ru: '', title_en: '', content_ky: '', content_ru: '', content_en: '', category: 'general', is_published: true };
    if (!article) return base;
    const filled = { ...base };
    writableFields.forEach((key) => {
      if (article[key] !== undefined) filled[key] = article[key];
    });
    return filled;
  };

  const [form, setForm] = useState(getInitial);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {};
    writableFields.forEach((key) => { payload[key] = form[key]; });
    try {
      if (article) {
        await adminApi.patch(`/news/${article.id}/`, payload);
      } else {
        await adminApi.post('/news/', payload);
      }
      onSuccess();
    } catch (err) {
      alert('Ката: ' + JSON.stringify(err.response?.data));
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Аталышы (Кыргызча)</label>
          <input type="text" required value={form.title_ky} onChange={(e) => setForm({ ...form, title_ky: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Название (Русский)</label>
          <input type="text" required value={form.title_ru} onChange={(e) => setForm({ ...form, title_ru: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Мазмуну (Кыргызча)</label>
        <textarea rows="3" required value={form.content_ky} onChange={(e) => setForm({ ...form, content_ky: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Содержание (Русский)</label>
        <textarea rows="3" required value={form.content_ru} onChange={(e) => setForm({ ...form, content_ru: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Категория</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
            {Object.entries(categoryLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-700">Жарыялоо</span>
          </label>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? '...' : (article ? 'Сактоо' : 'Жарыялоо')}
      </button>
    </form>
  );
}
