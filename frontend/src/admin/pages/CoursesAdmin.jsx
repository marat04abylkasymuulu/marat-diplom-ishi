import { useState, useEffect } from 'react';
import { adminApi } from '../AuthContext';
import FormModal from '../components/FormModal';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaTags } from 'react-icons/fa';

export default function CoursesAdmin() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = () => {
    Promise.all([adminApi.get('/courses/'), adminApi.get('/categories/')])
      .then(([cRes, catRes]) => {
        setCourses(cRes.data.results || cRes.data);
        setCategories(catRes.data.results || catRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Чын эле жок кылгыңыз келеби?')) return;
    await adminApi.delete(`/courses/${id}/`);
    fetchData();
  };

  const handleToggleActive = async (course) => {
    await adminApi.patch(`/courses/${course.id}/`, { is_active: !course.is_active });
    fetchData();
  };

  const openEdit = (course) => {
    setEditing(course);
    setModalOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Курстар</h1>
        <div className="flex gap-2">
          <button onClick={() => setCatModalOpen(true)} className="flex items-center gap-2 text-sm px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            <FaTags /> Категориялар ({categories.length})
          </button>
          <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
            <FaPlus /> Жаңы курс
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Курс</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категория</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Баасы</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Узактыгы</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Аракеттер</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{course.title_ky || course.title_ru}</p>
                    <p className="text-xs text-gray-500">{course.title_ru}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{course.category_name}</td>
                  <td className="px-4 py-3 text-sm font-medium">{course.price} сом</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{course.duration}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleActive(course)}>
                      {course.is_active
                        ? <FaToggleOn className="text-green-500 text-xl" />
                        : <FaToggleOff className="text-gray-400 text-xl" />
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(course)} className="text-primary hover:text-primary-light">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="text-red-400 hover:text-red-600">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {courses.length === 0 && (
            <p className="text-center text-gray-400 py-8">Курстар жок. Жаңысын кошуңуз.</p>
          )}
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Курсту өзгөртүү' : 'Жаңы курс'}>
        <CourseForm course={editing} categories={categories} onSuccess={() => { setModalOpen(false); fetchData(); }} />
      </FormModal>

      <FormModal isOpen={catModalOpen} onClose={() => setCatModalOpen(false)} title="Категориялар">
        <CategoryManager categories={categories} onUpdate={fetchData} />
      </FormModal>
    </div>
  );
}

function CategoryManager({ categories, onUpdate }) {
  const [form, setForm] = useState({ name_ky: '', name_ru: '', name_en: '', slug: '' });
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    const slug = form.slug || form.name_ru.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    try {
      await adminApi.post('/categories/', { ...form, slug });
      setForm({ name_ky: '', name_ru: '', name_en: '', slug: '' });
      onUpdate();
    } catch (err) {
      alert('Ката: ' + JSON.stringify(err.response?.data));
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Бул категорияны жок кылуу? (ичиндеги курстар да жок болот!)')) return;
    await adminApi.delete(`/categories/${id}/`);
    onUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Existing categories */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Бар категориялар:</h4>
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-sm">{cat.name_ky}</span>
                <span className="text-xs text-gray-500 ml-2">({cat.name_ru})</span>
              </div>
              <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-600 text-xs">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new category */}
      <form onSubmit={handleAdd} className="border-t pt-4 space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Жаңы категория кошуу:</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Аталышы (Кыргызча) *</label>
            <input type="text" required value={form.name_ky} onChange={(e) => setForm({ ...form, name_ky: e.target.value })}
              placeholder="мис: ЖРТ Математика" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Название (Русский) *</label>
            <input type="text" required value={form.name_ru} onChange={(e) => setForm({ ...form, name_ru: e.target.value })}
              placeholder="напр: ОРТ Математика" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full text-sm disabled:opacity-50">
          {loading ? '...' : 'Категория кошуу'}
        </button>
      </form>
    </div>
  );
}

function CourseForm({ course, categories, onSuccess }) {
  const writableFields = ['title_ky', 'title_ru', 'title_en', 'description_ky', 'description_ru', 'description_en', 'category', 'duration', 'price', 'start_date', 'is_active'];

  const getInitial = () => {
    const base = { title_ky: '', title_ru: '', title_en: '', description_ky: '', description_ru: '', description_en: '', category: '', duration: '', price: '', start_date: '', is_active: true };
    if (!course) return base;
    const filled = { ...base };
    writableFields.forEach((key) => {
      if (course[key] !== undefined) filled[key] = course[key];
    });
    filled.category = course?.category?.id || course?.category || '';
    filled.start_date = course.start_date || '';
    return filled;
  };

  const [form, setForm] = useState(getInitial);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {};
    writableFields.forEach((key) => { payload[key] = form[key]; });
    if (!payload.start_date) delete payload.start_date;
    try {
      if (course) {
        await adminApi.patch(`/courses/${course.id}/`, payload);
      } else {
        await adminApi.post('/courses/', payload);
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

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Сүрөттөмө (Кыргызча)</label>
        <textarea rows="2" value={form.description_ky} onChange={(e) => setForm({ ...form, description_ky: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Описание (Русский)</label>
        <textarea rows="2" value={form.description_ru} onChange={(e) => setForm({ ...form, description_ru: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Категория</label>
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
            <option value="">Тандаңыз</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name_ru}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Узактыгы</label>
          <input type="text" required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="3 ай" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Баасы (сом)</label>
          <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Башталыш</label>
          <input type="date" value={form.start_date || ''} onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? '...' : (course ? 'Сактоо' : 'Кошуу')}
      </button>
    </form>
  );
}
