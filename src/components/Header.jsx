import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();
    if (success) navigate('/login');
  };

  return (
    <header className="header">
      <div>
        <div style={{ fontWeight: 800, fontSize: '18px' }}>Salon Booking</div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>テスト自動化練習用SPA</div>
      </div>
      <nav className="nav-links">
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">
          サロン一覧
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/me">
          マイページ
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/reservations">
          予約一覧
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/favorites">
          お気に入り
        </NavLink>
        <button
          className="nav-link"
          onClick={handleLogout}
          type="button"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            marginLeft: '8px'
          }}
        >
          ログアウト
        </button>
      </nav>
    </header>
  );
};

export default Header;
