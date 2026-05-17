import { useState, useEffect } from 'react';
import { adminApi } from '../AuthContext';
import { FaCheck, FaPhone, FaWhatsapp } from 'react-icons/fa';

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unprocessed');

  const fetchData = () => {
    adminApi.get('/contacts/')
      .then((res) => setContacts(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleMarkProcessed = async (id) => {
    await adminApi.post(`/contacts/${id}/mark_processed/`);
    fetchData();
  };

  const filtered = filter === 'all'
    ? contacts
    : contacts.filter(c => filter === 'unprocessed' ? !c.is_processed : c.is_processed);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Кайрылуулар</h1>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'unprocessed', label: 'Жаңы', count: contacts.filter(c => !c.is_processed).length },
          { key: 'processed', label: 'Иштелген', count: contacts.filter(c => c.is_processed).length },
          { key: 'all', label: 'Баары', count: contacts.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${c.is_processed ? 'border-green-400' : 'border-yellow-400'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.full_name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:text-primary">
                      <FaPhone className="text-xs" /> {c.phone}
                    </a>
                    <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-green-600 hover:text-green-700">
                      <FaWhatsapp /> WhatsApp
                    </a>
                  </div>
                  {c.course_interest && (
                    <p className="text-sm text-gray-500 mt-1">Курс: <span className="font-medium">{c.course_interest}</span></p>
                  )}
                  {c.message && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{c.message}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{new Date(c.created_at).toLocaleString()}</p>
                </div>

                {!c.is_processed && (
                  <button
                    onClick={() => handleMarkProcessed(c.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 whitespace-nowrap"
                  >
                    <FaCheck /> Иштелди
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8">Кайрылуулар жок.</p>
          )}
        </div>
      )}
    </div>
  );
}
