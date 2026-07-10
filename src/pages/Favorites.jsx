import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import usePageTitle from '../hooks/usePageTitle';

const Favorites = () => {
  usePageTitle('お気に入り一覧');
  const { favorites, salons, toggleFavorite } = useAppContext();
  const favoriteSalons = salons.filter((s) => favorites.includes(s.id));

  return (
    <div className="main-content">
      <div className="card">
        <h2 className="section-title">お気に入り一覧</h2>
        {!favoriteSalons.length && <div className="empty-state">お気に入りがありません。</div>}
        <div className="grid">
          {favoriteSalons.map((salon) => (
            <div className="card" key={salon.id}>
              <div className="flex-between">
                <div>
                  <h3 style={{ margin: '6px 0' }}>{salon.name}</h3>
                  <span className="badge">{salon.category}</span>
                </div>
                <span className="favorite">♥</span>
              </div>
              <p style={{ color: '#4b5563' }}>{salon.description}</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                <Link className="link" to={`/salons/${salon.id}`} target="_blank" rel="noreferrer">
                  詳細を見る
                </Link>
                <button className="button-outline" onClick={() => toggleFavorite(salon.id)} type="button">
                  解除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
