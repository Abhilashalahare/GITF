import { Routes, Route } from 'react-router-dom';
import SmoothScroll from './components/layout/SmoothScroll';
import ScrollToTop from './components/layout/ScrollToTop';
import Layout from './components/layout/Layout';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Learning from './pages/Learning';
import Programmes from './pages/Programmes';
import ParentsStudents from './pages/ParentsStudents';
import Admissions from './pages/Admissions';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// Admin pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminGallery from './admin/pages/AdminGallery';

// Admin components
import AdminLayout from './admin/components/AdminLayout';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';
import AdminWebsiteMedia from './admin/pages/AdminWebsiteMedia';

export default function App() {
  return (
    <SmoothScroll>
      <ScrollToTop />

      <Routes>

        {/* =========================
            PUBLIC WEBSITE
        ========================== */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="about" element={<About />} />

          <Route path="people" element={<About />} />

          <Route
            path="learning"
            element={<Learning />}
          />

          <Route
            path="programmes"
            element={<Programmes />}
          />

          <Route
            path="parents-students"
            element={<ParentsStudents />}
          />

          <Route
            path="admissions"
            element={<Admissions />}
          />

          <Route
            path="gallery"
            element={<Gallery />}
          />

          <Route
            path="contact"
            element={<Contact />}
          />
        </Route>


        {/* =========================
            ADMIN LOGIN
        ========================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =========================
            PROTECTED ADMIN PANEL
        ========================== */}

        <Route element={<ProtectedAdminRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="gallery"
              element={<AdminGallery />}
            />

            <Route
              path="website-media"
              element={<AdminWebsiteMedia />}
            />

          </Route>

        </Route>

      </Routes>
    </SmoothScroll>
  );
}