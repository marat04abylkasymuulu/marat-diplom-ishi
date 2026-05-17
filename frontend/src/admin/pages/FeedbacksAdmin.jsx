import { useState, useEffect } from 'react';
import { adminApi } from '../AuthContext';
import { FaCheck, FaTimes, FaStar, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function FeedbacksAdmin() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    adminApi.get('/feedbacks/')
      .then((res) => setFeedbacks(res.data.results || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    await adminApi.post(`/feedbacks/${id}/approve/`);
    fetchData();
  };

  const handleReject = async (id) => {
    await adminApi.post(`/feedbacks/${id}/reject/`);
    fetchData();
  };

  const filtered = feedbacks.filter((f) => filter === 'all' || f.status === filter);

  const statusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'approved': return <FaCheckCircle className="text-green-500" />;
      case 'rejected': return <FaTimesCircle className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Окуучулардын отзывдары</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'pending', label: 'Күтүүдө', count: feedbacks.filter(f => f.status === 'pending').length },
          { key: 'approved', label: 'Жарыяланган', count: feedbacks.filter(f => f.status === 'approved').length },
          { key: 'rejected', label: 'Четке кагылган', count: feedbacks.filter(f => f.status === 'rejected').length },
          { key: 'all', label: 'Баары', count: feedbacks.length },
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
        <div className="space-y-4">
          {filtered.map((fb) => (
            <div key={fb.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {statusIcon(fb.status)}
                    <h3 className="font-semibold">{fb.student_name}</h3>
                    <div className="flex text-secondary">
                      {[...Array(fb.rating)].map((_, i) => (
                        <FaStar key={i} className="text-xs" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{fb.text}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    {fb.phone && <span>Тел: {fb.phone}</span>}
                    {fb.email && <span>Email: {fb.email}</span>}
                    {fb.course_taken && <span>Курс: {fb.course_taken}</span>}
                    <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {fb.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(fb.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100"
                    >
                      <FaCheck /> Жарыялоо
                    </button>
                    <button
                      onClick={() => handleReject(fb.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100"
                    >
                      <FaTimes /> Четке кагуу
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8">Отзывдар жок.</p>
          )}
        </div>
      )}
    </div>
  );
}
