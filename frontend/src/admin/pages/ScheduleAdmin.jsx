import { useState, useEffect } from 'react';
import { adminApi } from '../AuthContext';
import FormModal from '../components/FormModal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const dayLabels = {
  mon: 'Дүйшөмбү', tue: 'Шейшемби', wed: 'Шаршемби',
  thu: 'Бейшемби', fri: 'Жума', sat: 'Ишемби', sun: 'Жекшемби'
};

export default function ScheduleAdmin() {
  const [schedule, setSchedule] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = () => {
    Promise.all([adminApi.get('/schedule/'), adminApi.get('/courses/')])
      .then(([sRes, cRes]) => {
        setSchedule(sRes.data.results || sRes.data);
        setCourses(cRes.data.results || cRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Жок кылуу?')) return;
    await adminApi.delete(`/schedule/${id}/`);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Расписание</h1>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus /> Кошуу
        </button>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Күн</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Убакыт</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Курс</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Аудитория</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Аракеттер</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {schedule.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{dayLabels[item.day] || item.day}</td>
                  <td className="px-4 py-3 text-sm">{item.start_time} - {item.end_time}</td>
                  <td className="px-4 py-3 text-sm">{courses.find(c => c.id === item.course)?.title_ru || `ID: ${item.course}`}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.room || '-'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => { setEditing(item); setModalOpen(true); }} className="text-primary hover:text-primary-light">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {schedule.length === 0 && (
            <p className="text-center text-gray-400 py-8">Расписание бош. Кошуңуз.</p>
          )}
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Өзгөртүү' : 'Жаңы сабак'}>
        <ScheduleForm item={editing} courses={courses} onSuccess={() => { setModalOpen(false); fetchData(); }} />
      </FormModal>
    </div>
  );
}

function ScheduleForm({ item, courses, onSuccess }) {
  const writableFields = ['course', 'day', 'start_time', 'end_time', 'room'];

  const getInitial = () => {
    const base = { course: '', day: 'mon', start_time: '09:00', end_time: '11:00', room: '' };
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
        await adminApi.patch(`/schedule/${item.id}/`, payload);
      } else {
        await adminApi.post('/schedule/', payload);
      }
      onSuccess();
    } catch (err) {
      alert('Ката: ' + JSON.stringify(err.response?.data));
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Курс</label>
        <select required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
          <option value="">Курсту тандаңыз</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title_ru}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Күн</label>
          <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
            {Object.entries(dayLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Аудитория</label>
          <input type="text" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}
            placeholder="101" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Башталыш</label>
          <input type="time" required value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Аяктоо</label>
          <input type="time" required value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? '...' : (item ? 'Сактоо' : 'Кошуу')}
      </button>
    </form>
  );
}
