import { useState, useEffect } from 'react';
import { adminApi } from '../AuthContext';
import FormModal from '../components/FormModal';
import { FaPlus, FaEdit, FaTrash, FaChalkboardTeacher } from 'react-icons/fa';

export default function TeachersAdmin() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = () => {
    adminApi.get('/teachers/')
      .then((res) => setTeachers(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Чын эле жок кылгыңыз келеби?')) return;
    await adminApi.delete(`/teachers/${id}/`);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Окутуучулар</h1>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus /> Жаңы окутуучу
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((t) => (
            <div key={t.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FaChalkboardTeacher className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.full_name_ky || t.full_name_ru}</p>
                  <p className="text-xs text-gray-500">{t.subject_ru}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">{t.experience_years} жыл тажрыйба</p>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(t); setModalOpen(true); }} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <FaEdit /> Өзгөртүү
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                  <FaTrash /> Жок кылуу
                </button>
              </div>
            </div>
          ))}
          {teachers.length === 0 && (
            <p className="text-gray-400 col-span-full text-center py-8">Окутуучулар жок.</p>
          )}
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Окутуучуну өзгөртүү' : 'Жаңы окутуучу'}>
        <TeacherForm teacher={editing} onSuccess={() => { setModalOpen(false); fetchData(); }} />
      </FormModal>
    </div>
  );
}

function TeacherForm({ teacher, onSuccess }) {
  const writableFields = ['full_name_ky', 'full_name_ru', 'full_name_en', 'subject_ky', 'subject_ru', 'subject_en', 'bio_ky', 'bio_ru', 'bio_en', 'experience_years', 'is_active', 'order'];

  const getInitial = () => {
    const base = { full_name_ky: '', full_name_ru: '', full_name_en: '', subject_ky: '', subject_ru: '', subject_en: '', bio_ky: '', bio_ru: '', bio_en: '', experience_years: 0, is_active: true, order: 0 };
    if (!teacher) return base;
    const filled = { ...base };
    writableFields.forEach((key) => {
      if (teacher[key] !== undefined) filled[key] = teacher[key];
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
      if (teacher) {
        await adminApi.patch(`/teachers/${teacher.id}/`, payload);
      } else {
        await adminApi.post('/teachers/', payload);
      }
      onSuccess();
    } catch (err) {
      alert('Ката: ' + JSON.stringify(err.response?.data));
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Аты-жөнү (Кыргызча)</label>
          <input type="text" required value={form.full_name_ky} onChange={(e) => setForm({ ...form, full_name_ky: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ФИО (Русский)</label>
          <input type="text" required value={form.full_name_ru} onChange={(e) => setForm({ ...form, full_name_ru: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name (English)</label>
          <input type="text" value={form.full_name_en} onChange={(e) => setForm({ ...form, full_name_en: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Предмет (Кыргызча)</label>
          <input type="text" required value={form.subject_ky} onChange={(e) => setForm({ ...form, subject_ky: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Предмет (Русский)</label>
          <input type="text" required value={form.subject_ru} onChange={(e) => setForm({ ...form, subject_ru: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Тажрыйба (жыл)</label>
          <input type="number" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Кыскача маалымат (Кыргызча)</label>
        <textarea rows="2" value={form.bio_ky} onChange={(e) => setForm({ ...form, bio_ky: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? '...' : (teacher ? 'Сактоо' : 'Кошуу')}
      </button>
    </form>
  );
}
