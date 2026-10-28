import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Passenger Pages
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import RouteDetailsPage from './pages/RouteDetailsPage';
import BusSearchPage from './pages/BusSearchPage';
import AllStopsPage from './pages/AllStopsPage';
import RouteMapPage from './pages/RouteMapPage';
import FeedbackPage from './pages/FeedbackPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminStopsPage from './pages/AdminStopsPage';
import AdminRoutesPage from './pages/AdminRoutesPage';
import AdminBusesPage from './pages/AdminBusesPage';
import AdminSchedulesPage from './pages/AdminSchedulesPage';
import AdminFaresPage from './pages/AdminFaresPage';
import AdminFeedbackPage from './pages/AdminFeedbackPage';

// Protected Admin Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Passenger Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/routes/:id" element={<RouteDetailsPage />} />
                <Route path="/bus-search" element={<BusSearchPage />} />
                <Route path="/all-stops" element={<AllStopsPage />} />
                <Route path="/route-map" element={<RouteMapPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />

                {/* Admin Auth */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/stops"
                  element={
                    <ProtectedRoute>
                      <AdminStopsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/routes"
                  element={
                    <ProtectedRoute>
                      <AdminRoutesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/buses"
                  element={
                    <ProtectedRoute>
                      <AdminBusesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/schedules"
                  element={
                    <ProtectedRoute>
                      <AdminSchedulesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/fares"
                  element={
                    <ProtectedRoute>
                      <AdminFaresPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/feedback"
                  element={
                    <ProtectedRoute>
                      <AdminFeedbackPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
