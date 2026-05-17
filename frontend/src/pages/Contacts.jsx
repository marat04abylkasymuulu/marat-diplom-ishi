import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPhone, FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import { getBranches, submitContact } from '../utils/api';
import { useLocalized } from '../hooks/useLocalized';
import PageHeader from '../components/PageHeader';
import RecordInnerPageWrap from '../components/RecordInnerPageWrap';
import BranchMapTabs from '../components/BranchMapTabs';

export default function Contacts() {
  const { t } = useTranslation();
  const { getField } = useLocalized();
  const [branches, setBranches] = useState(demoBranches);
  const [form, setForm] = useState({ full_name: '', phone: '', message: '', course_interest: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBranches()
      .then((res) => {
        const data = res.data.results || res.data;
        if (data.length) setBranches(data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(form);
    } catch {
      // Still show success in demo mode
    }
    setSubmitted(true);
    setLoading(false);
    setForm({ full_name: '', phone: '', message: '', course_interest: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const mapBranch = useMemo(
    () => branches.find((b) => b.is_main) || branches[0],
    [branches],
  );

  return (
    <div>
      <PageHeader title={t('contacts.title')} subtitle={t('about.description')} />

      <RecordInnerPageWrap>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:pt-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="card-accent p-8 shadow-xl md:p-10">
            <h2 className="font-display text-2xl font-bold text-primary">{t('contacts.form_title')}</h2>
            <p className="mt-2 text-sm text-slate-500">Биз сизге жакын арада байланышабыз.</p>

            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <FaCheck className="text-2xl text-emerald-600" />
                </div>
                <p className="font-medium text-emerald-700">{t('contacts.form_success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t('contacts.form_name')}</label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="input-brand"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t('contacts.form_phone')}</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+996 ..."
                    className="input-brand"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t('contacts.form_course')}</label>
                  <input
                    type="text"
                    value={form.course_interest}
                    onChange={(e) => setForm({ ...form, course_interest: e.target.value })}
                    className="input-brand"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t('contacts.form_message')}</label>
                  <textarea
                    rows="3"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-brand resize-none"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
                  {loading ? '...' : t('contacts.form_submit')}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            {branches.map((branch) => (
              <div key={branch.id} className="card overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-secondary via-primary to-sky-500" />
                <div className="p-6 md:p-8">
                  <h3 className="flex flex-wrap items-center gap-2 font-display text-lg font-bold text-primary">
                    <FaMapMarkerAlt className="text-secondary" />
                    {getField(branch, 'name')}
                    {branch.is_main ? (
                      <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-secondary">
                        Main
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{getField(branch, 'address')}</p>
                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FaPhone />
                      </span>
                      <a href={`tel:${branch.phone}`} className="font-medium text-slate-800 hover:text-secondary">
                        {branch.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                        <FaWhatsapp />
                      </span>
                      <a
                        href={`https://wa.me/${branch.whatsapp?.replace(/\D/g, '')}`}
                        className="font-medium text-slate-800 hover:text-emerald-600"
                      >
                        WhatsApp: {branch.whatsapp}
                      </a>
                    </div>
                    {branch.instagram_url ? (
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500/10 text-pink-600">
                          <FaInstagram />
                        </span>
                        <a
                          href={branch.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:text-pink-600"
                        >
                          Instagram
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            <div className="card overflow-hidden p-1">
              <BranchMapTabs
                key={JSON.stringify([
                  mapBranch.id,
                  mapBranch.google_maps_embed_url || '',
                  mapBranch.two_gis_embed_url || '',
                  mapBranch.latitude ?? '',
                  mapBranch.longitude ?? '',
                ])}
                branch={mapBranch}
              />
            </div>
          </div>
        </div>
      </div>
      </RecordInnerPageWrap>
    </div>
  );
}

const demoBranches = [
  {
    id: 1,
    name_ky: 'Рекорд Ош (негизги)',
    name_ru: 'Рекорд Ош (основной)',
    name_en: 'Record Osh (main)',
    address_ky: 'Ош шаары, Курманжан Датка көчөсү',
    address_ru: 'г. Ош, ул. Курманжан Датки',
    address_en: 'Osh city, Kurmanjan Datka st.',
    phone: '+996 555 000 001',
    whatsapp: '+996 555 000 001',
    instagram_url: 'https://instagram.com/record_osh',
    is_main: true,
    latitude: 40.5283,
    longitude: 72.8065,
  },
  {
    id: 2,
    name_ky: 'Рекорд Бишкек',
    name_ru: 'Рекорд Бишкек',
    name_en: 'Record Bishkek',
    address_ky: 'Бишкек шаары, Чүй проспекти',
    address_ru: 'г. Бишкек, пр. Чуй',
    address_en: 'Bishkek, Chuy Ave.',
    phone: '+996 555 000 002',
    whatsapp: '+996 555 000 002',
    instagram_url: 'https://instagram.com/record_bishkek',
    is_main: false,
  },
];
