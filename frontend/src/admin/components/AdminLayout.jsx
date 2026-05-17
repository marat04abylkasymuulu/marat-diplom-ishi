import { useState } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  FaHome, FaBook, FaChalkboardTeacher, FaCalendarAlt,
  FaStar, FaNewspaper, FaMapMarkerAlt, FaEnvelope,
  FaSignOutAlt, FaBars, FaTimes, FaTrophy, FaBolt, FaComments,
} from 'react-icons/fa';

const navItems = [
  { to: '/panel', icon: FaHome, label: 'Башкы бет' },
  { to: '/panel/promo', icon: FaBolt, label: 'Акция / тизме' },
  { to: '/panel/courses', icon: FaBook, label: 'Курстар' },
  { to: '/panel/teachers', icon: FaChalkboardTeacher, label: 'Окутуучулар' },
  { to: '/panel/schedule', icon: FaCalendarAlt, label: 'Расписание' },
  { to: '/panel/reviews', icon: FaStar, label: 'Отзывдар (ЖРТ)' },
  { to: '/panel/feedbacks', icon: FaComments, label: 'Окуучу пикири' },
  { to: '/panel/achievements', icon: FaTrophy, label: 'Жетишкендиктер' },
  { to: '/panel/news', icon: FaNewspaper, label: 'Жаңылыктар' },
  { to: '/panel/contacts', icon: FaEnvelope, label: 'Кайрылуулар' },
  { to: '/panel/branches', icon: FaMapMarkerAlt, label: 'Филиалдар' },
];

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/panel/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark text-white transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-700">
          <Link to="/panel" className="text-xl font-black text-secondary">
            РЕКОРД <span className="text-xs text-gray-400 font-normal">admin</span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === item.to
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className="text-lg" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-medium">{user.first_name || user.username}</p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            <FaSignOutAlt /> Чыгуу
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600">
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <span className="font-bold text-primary">РЕКОРД Admin</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
