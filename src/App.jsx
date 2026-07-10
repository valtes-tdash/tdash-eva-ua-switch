import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import LoadingOverlay from './components/LoadingOverlay';
import OsBanner from './components/OsBanner';
import { useAppContext } from './context/AppContext';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import ReservationForm from './pages/ReservationForm';
import ReservationList from './pages/ReservationList';
import SalonDetail from './pages/SalonDetail';
import SalonList from './pages/SalonList';

// 認証が必要なルート用のラッパーコンポーネント
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-shell">
      <OsBanner />
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><SalonList /></ProtectedRoute>} />
        <Route path="/salons/:id" element={<ProtectedRoute><SalonDetail /></ProtectedRoute>} />
        <Route path="/reserve/:id" element={<ProtectedRoute><ReservationForm /></ProtectedRoute>} />
        <Route path="/reservations" element={<ProtectedRoute><ReservationList /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/me" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LoadingOverlay />
    </div>
  );
};

export default App;
