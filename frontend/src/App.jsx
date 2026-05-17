import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import PageBodyMathBackdrop from './components/PageBodyMathBackdrop';
import InnerPagesVisualRail from './components/InnerPagesVisualRail';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Schedule from './pages/Schedule';
import Teachers from './pages/Teachers';
import Achievements from './pages/Achievements';
import Reviews from './pages/Reviews';
import News from './pages/News';
import Contacts from './pages/Contacts';

import { AuthProvider } from './admin/AuthContext';
import AdminLayout from './admin/components/AdminLayout';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import CoursesAdmin from './admin/pages/CoursesAdmin';
import TeachersAdmin from './admin/pages/TeachersAdmin';
import ScheduleAdmin from './admin/pages/ScheduleAdmin';
import FeedbacksAdmin from './admin/pages/FeedbacksAdmin';
import AchievementsAdmin from './admin/pages/AchievementsAdmin';
import NewsAdmin from './admin/pages/NewsAdmin';
import ContactsAdmin from './admin/pages/ContactsAdmin';
import BranchesAdmin from './admin/pages/BranchesAdmin';
import PromoAdmin from './admin/pages/PromoAdmin';
import ReviewsAdmin from './admin/pages/ReviewsAdmin';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Site */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
          <Route path="/schedule" element={<PublicLayout><Schedule /></PublicLayout>} />
          <Route path="/teachers" element={<PublicLayout><Teachers /></PublicLayout>} />
          <Route path="/achievements" element={<PublicLayout><Achievements /></PublicLayout>} />
          <Route path="/reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
          <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
          <Route path="/contacts" element={<PublicLayout><Contacts /></PublicLayout>} />

          {/* Admin Panel */}
          <Route path="/panel/login" element={<Login />} />
          <Route path="/panel" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<CoursesAdmin />} />
            <Route path="teachers" element={<TeachersAdmin />} />
            <Route path="schedule" element={<ScheduleAdmin />} />
            <Route path="feedbacks" element={<FeedbacksAdmin />} />
            <Route path="reviews" element={<ReviewsAdmin />} />
            <Route path="achievements" element={<AchievementsAdmin />} />
            <Route path="news" element={<NewsAdmin />} />
            <Route path="contacts" element={<ContactsAdmin />} />
            <Route path="branches" element={<BranchesAdmin />} />
            <Route path="promo" element={<PromoAdmin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function PublicLayout({ children }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main
        className={`public-main-shell relative isolate flex-1 ${!isHome ? 'record-inner-pages' : ''}`}
      >
        {!isHome ? <PageBodyMathBackdrop /> : null}
        {!isHome ? <InnerPagesVisualRail /> : null}
        <div className="public-main-shell-content relative z-[1] min-h-0">{children}</div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
