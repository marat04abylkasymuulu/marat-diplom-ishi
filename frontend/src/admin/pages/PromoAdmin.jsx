import { useState, useEffect } from 'react';
import { adminApi } from '../AuthContext';

const empty = {
  discount_ky: '',
  discount_ru: '',
  discount_en: '',
  limited_ky: '',
  limited_ru: '',
  limited_en: '',
  ticker_enabled: true,
};

export default function PromoAdmin() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .get('/site-promo/')
      .then((res) => setForm({ ...empty, ...res.data }))
      .catch(() => setForm(empty))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await adminApi.patch('/site-promo/', form);
      setForm({ ...empty, ...data });
      alert('Сакталды');
    } catch (err) {
      alert('Ката: ' + JSON.stringify(err.response?.data));
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Башкы бет — акция тизмеси</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-2xl">
        Жогорку жылжымалуу тизмедеги текст. Бош калтырсаңыз, сайттын котормосу (promo.discount / promo.limited) колдонулат.
        «Тизмени көрсөтүү» өчүк болсо, акция тизмеси жашырылат.
      </p>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 bg-white rounded-xl p-6 shadow-sm">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={form.ticker_enabled}
            onChange={(e) => setForm({ ...form, ticker_enabled: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          Акция тизмесин көрсөтүү
        </label>

        <div className="grid md:grid-cols-3 gap-4">
          {['ky', 'ru', 'en'].map((lang) => (
            <div key={lang} className="space-y-3 border border-gray-100 rounded-lg p-3">
              <p className="text-xs font-bold uppercase text-gray-400">{lang}</p>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Акция тексти</label>
                <input
                  type="text"
                  value={form[`discount_${lang}`]}
                  onChange={(e) => setForm({ ...form, [`discount_${lang}`]: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Чектөө / убакыт</label>
                <input
                  type="text"
                  value={form[`limited_${lang}`]}
                  onChange={(e) => setForm({ ...form, [`limited_${lang}`]: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? '...' : 'Сактоо'}
        </button>
      </form>
    </div>
  );
}
