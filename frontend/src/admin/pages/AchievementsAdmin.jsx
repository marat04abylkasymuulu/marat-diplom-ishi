import { useState, useEffect } from 'react';
import { adminApi } from '../AuthContext';
import FormModal from '../components/FormModal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function AchievementsAdmin() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = () => {
    adminApi.get('/achievements/')
      .then((res) => setAchievements(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Жок кылуу?')) return;
    await adminApi.delete(`/achievements/${id}/`);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Жетишкендиктер</h1>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus /> Кошуу
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-black text-primary mb-2">{a.value}</p>
              <p className="font-medium text-sm">{a.title_ky || a.title_ru}</p>
              <p className="text-xs text-gray-500 mt-1">{a.title_ru}</p>
              <div className="flex justify-center gap-3 mt-4">
                <button onClick={() => { setEditing(a); setModalOpen(true); }} className="text-primary text-sm hover:underline flex items-center gap-1">
                  <FaEdit /> Өзгөртүү
                </button>
                <button onClick={() => handleDelete(a.id)} className="text-red-400 text-sm hover:text-red-600 flex items-center gap-1">
                  <FaTrash /> Жок кылуу
                </button>
              </div>
            </div>
          ))}
          {achievements.length === 0 && (
            <p className="text-gray-400 col-span-full text-center py-8">Жетишкендиктер жок.</p>
          )}
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Өзгөртүү' : 'Жаңы жетишкендик'}>
        <AchievementForm item={editing} onSuccess={() => { setModalOpen(false); fetchData(); }} />
      </FormModal>
    </div>
  );
}

function AchievementForm({ item, onSuccess }) {
  const writableFields = ['title_ky', 'title_ru', 'title_en', 'description_ky', 'description_ru', 'description_en', 'value', 'order'];

  const getInitial = () => {
    const base = { title_ky: '', title_ru: '', title_en: '', description_ky: '', description_ru: '', description_en: '', value: '', order: 0 };
    if (!item) return base;
    const filled = { ...base };
    writableFields.forEach((key) => {
      if (item[key] !== undefined) filled[key] = item[key];
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
      if (item) {
        await adminApi.patch(`/achievements/${item.id}/`, payload);
      } else {
        await adminApi.post('/achievements/', payload);
      }
      onSuccess();
    } catch (err) {
      alert('Ката: ' + JSON.stringify(err.response?.data));
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Маани (мисалы: "200+", "8+")</label>
          <input type="text" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
            placeholder="200+" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Тартип</label>
          <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Title (English)</label>
          <input type="text" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? '...' : (item ? 'Сактоо' : 'Кошуу')}
      </button>
    </form>
  );
}
