import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../AuthContext';
import {
  FaBook, FaChalkboardTeacher, FaStar, FaEnvelope,
  FaNewspaper, FaExclamationCircle
} from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    adminApi.get('/dashboard/')
      .then((res) => setStats(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <FaExclamationCircle className="text-red-500 text-3xl mx-auto mb-3" />
        <p className="text-red-700 font-medium">Маалыматтарды жүктөөдө ката кетти</p>
        <button onClick={() => window.location.reload()} className="mt-3 text-sm text-primary hover:underline">
          Кайра аракет кылуу
        </button>
      </div>
    );
  }

  const cards = [
    { label: 'Активдүү курстар', value: stats?.courses_count || 0, icon: FaBook, color: 'bg-blue-500', link: '/panel/courses' },
    { label: 'Окутуучулар', value: stats?.teachers_count || 0, icon: FaChalkboardTeacher, color: 'bg-green-500', link: '/panel/teachers' },
    { label: 'Күтүүдөгү отзывдар', value: stats?.pending_feedbacks || 0, icon: FaStar, color: 'bg-yellow-500', link: '/panel/feedbacks' },
    { label: 'Жаңы кайрылуулар', value: stats?.unprocessed_contacts || 0, icon: FaEnvelope, color: 'bg-red-500', link: '/panel/contacts' },
    { label: 'Жаңылыктар', value: stats?.news_count || 0, icon: FaNewspaper, color: 'bg-purple-500', link: '/panel/news' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Башкы бет</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} to={card.link} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Жаңы кайрылуулар</h2>
            <Link to="/panel/contacts" className="text-sm text-primary hover:underline">Баары →</Link>
          </div>
          {stats?.recent_contacts?.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_contacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{c.full_name}</p>
                    <p className="text-xs text-gray-500">{c.phone} • {c.course_interest || 'Курс көрсөтүлгөн эмес'}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Жаңы кайрылуулар жок</p>
          )}
        </div>

        {/* Pending Feedbacks */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Күтүүдөгү отзывдар</h2>
            <Link to="/panel/feedbacks" className="text-sm text-primary hover:underline">Баары →</Link>
          </div>
          {stats?.recent_feedbacks?.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_feedbacks.map((f) => (
                <div key={f.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{f.student_name}</p>
                    <span className="text-secondary text-xs">{'⭐'.repeat(f.rating)}</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{f.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Күтүүдөгү отзывдар жок</p>
          )}
        </div>
      </div>
    </div>
  );
}
