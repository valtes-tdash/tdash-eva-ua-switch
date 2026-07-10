import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { logout } = useAppContext();
  const navigate = useNavigate();
  // モバイル幅ではナビをハンバーガーメニューに畳む
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    const success = await logout();
    if (success) navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-brand">
        <div style={{ fontWeight: 800, fontSize: '18px' }}>Salon Booking</div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>テスト自動化練習用SPA</div>
      </div>
      <button
        type="button"
        className="nav-toggle"
        aria-label="メニュー"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
      </button>
      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/" onClick={closeMenu}>
          サロン一覧
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/me" onClick={closeMenu}>
          マイページ
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          to="/reservations"
          onClick={closeMenu}
        >
          予約一覧
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          to="/favorites"
          onClick={closeMenu}
        >
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
