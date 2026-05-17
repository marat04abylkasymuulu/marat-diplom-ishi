import { useState, useEffect } from 'react';
import { adminApi } from '../AuthContext';
import FormModal from '../components/FormModal';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';

export default function BranchesAdmin() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = () => {
    adminApi.get('/branches/')
      .then((res) => setBranches(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Жок кылуу?')) return;
    await adminApi.delete(`/branches/${id}/`);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Филиалдар</h1>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus /> Филиал кошуу
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {branches.map((b) => (
            <div key={b.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FaMapMarkerAlt className="text-secondary" />
                <h3 className="font-semibold">{b.name_ky || b.name_ru}</h3>
                {b.is_main && <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">Негизги</span>}
              </div>
              <p className="text-sm text-gray-600 mb-1">{b.address_ru}</p>
              <p className="text-sm text-gray-500">Тел: {b.phone} | WA: {b.whatsapp}</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => { setEditing(b); setModalOpen(true); }} className="text-primary text-sm hover:underline flex items-center gap-1">
                  <FaEdit /> Өзгөртүү
                </button>
                <button onClick={() => handleDelete(b.id)} className="text-red-400 text-sm hover:text-red-600 flex items-center gap-1">
                  <FaTrash /> Жок кылуу
                </button>
              </div>
            </div>
          ))}
          {branches.length === 0 && (
            <p className="text-gray-400 col-span-full text-center py-8">Филиалдар жок.</p>
          )}
        </div>
      )}

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Өзгөртүү' : 'Жаңы филиал'}>
        <BranchForm item={editing} onSuccess={() => { setModalOpen(false); fetchData(); }} />
      </FormModal>
    </div>
  );
}

function BranchForm({ item, onSuccess }) {
  const writableFields = [
    'name_ky', 'name_ru', 'name_en', 'address_ky', 'address_ru', 'address_en',
    'phone', 'whatsapp', 'instagram_url',
    'latitude', 'longitude',
    'google_maps_embed_url', 'two_gis_embed_url',
    'is_main',
  ];

  const getInitial = () => {
    const base = {
      name_ky: '', name_ru: '', name_en: '', address_ky: '', address_ru: '', address_en: '',
      phone: '', whatsapp: '', instagram_url: '', latitude: '', longitude: '',
      google_maps_embed_url: '', two_gis_embed_url: '', is_main: false,
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
    writableFields.forEach((key) => { payload[key] = form[key]; });
    if (!payload.latitude) payload.latitude = null;
    if (!payload.longitude) payload.longitude = null;
    if (!payload.google_maps_embed_url) payload.google_maps_embed_url = '';
    if (!payload.two_gis_embed_url) payload.two_gis_embed_url = '';
    try {
      if (item) {
        await adminApi.patch(`/branches/${item.id}/`, payload);
      } else {
        await adminApi.post('/branches/', payload);
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
          <input type="text" required value={form.name_ky} onChange={(e) => setForm({ ...form, name_ky: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Название (Русский)</label>
          <input type="text" required value={form.name_ru} onChange={(e) => setForm({ ...form, name_ru: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name (English)</label>
          <input type="text" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Дарек (Кыргызча)</label>
        <input type="text" required value={form.address_ky} onChange={(e) => setForm({ ...form, address_ky: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Адрес (Русский)</label>
        <input type="text" required value={form.address_ru} onChange={(e) => setForm({ ...form, address_ru: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Телефон</label>
          <input type="text" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+996 555 000 000" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp</label>
          <input type="text" required value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="+996 555 000 000" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Адрес (English)</label>
        <input type="text" value={form.address_en} onChange={(e) => setForm({ ...form, address_en: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Instagram URL</label>
        <p className="mb-1 text-[11px] text-gray-500">Тек гана Instagram (карта шилтемелерин төмөнкү талааларга).</p>
        <input type="url" value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
          placeholder="https://instagram.com/..." className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Энбелги (latitude)</label>
          <input type="text" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            placeholder="40.5283" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Узундук (longitude)</label>
          <input type="text" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            placeholder="72.8065" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Google Maps (шилтеме же embed src)</label>
        <textarea rows={2} value={form.google_maps_embed_url} onChange={(e) => setForm({ ...form, google_maps_embed_url: e.target.value })}
          placeholder="https://maps.app.goo.gl/... же https://www.google.com/maps/embed?..." className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-xs" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">2GIS (шилтеме же embed src)</label>
        <textarea rows={2} value={form.two_gis_embed_url} onChange={(e) => setForm({ ...form, two_gis_embed_url: e.target.value })}
          placeholder="https://go.2gis.com/... же iframe src" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-xs" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.is_main} onChange={(e) => setForm({ ...form, is_main: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
        <span className="text-sm text-gray-700">Негизги филиал</span>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? '...' : (item ? 'Сактоо' : 'Кошуу')}
      </button>
    </form>
  );
}
