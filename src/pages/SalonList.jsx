import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import usePageTitle from '../hooks/usePageTitle';

const filterCategories = ['ヘアサロン', 'ネイルサロン', 'エステサロン'];

// サービスアイコンコンポーネント（アイコンと文言を表示）
const ServiceIcon = ({ type }) => {
  const icons = {
    'ヘアサロン': { icon: '✂', label: 'ヘアサロン' },
    'ネイルサロン': { icon: '💅', label: 'ネイルサロン' },
    'エステサロン': { icon: '✨', label: 'エステサロン' },
  };
  const config = icons[type];
  if (!config) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 14,
        marginRight: 12,
        color: '#4b5563',
      }}
    >
      <span style={{ fontSize: 16, marginRight: 4 }}>{config.icon}</span>
      {config.label}
    </span>
  );
};

// YYYYMMDD形式に変換
const toYYYYMMDD = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.replace(/-/g, '');
};

// YYYYMMDD形式からYYYY-MM-DD形式に変換
const fromYYYYMMDD = (yyyymmdd) => {
  if (!yyyymmdd || yyyymmdd.length !== 8) return '';
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
};

const SalonList = () => {
  usePageTitle('サロン一覧');
  const { salons, isSlotAvailable, formatDate, favorites, toggleFavorite } = useAppContext();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([...filterCategories]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [pendingDate, setPendingDate] = useState(toYYYYMMDD(formatDate(new Date())));
  const [isLoading, setIsLoading] = useState(false);

  const filteredSalons = useMemo(
    () =>
      salons.filter((salon) => {
        // 全カテゴリチェックON = すべて表示
        if (selectedCategories.length === filterCategories.length) return true;
        // チェックなし = すべて表示
        if (selectedCategories.length === 0) return true;
        // AND条件: 選択されたすべてのカテゴリを持つサロンのみ表示
        if (salon.categories) {
          return selectedCategories.every((cat) => salon.categories.includes(cat));
        }
        return false;
      }),
    [salons, selectedCategories],
  );

  const handleReserve = (salonId) => {
    if (!selectedDate) return;
    navigate(`/reserve/${salonId}?date=${selectedDate}`);
  };

  const handleCategoryChange = async (cat) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) {
        return prev.filter((c) => c !== cat);
      }
      return [...prev, cat];
    });
    setIsLoading(false);
  };

  const handleClearCategories = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setSelectedCategories([]);
    setIsLoading(false);
  };

  const handleDateUpdate = async () => {
    const dateStr = fromYYYYMMDD(pendingDate);
    if (!dateStr || isNaN(new Date(dateStr).getTime())) {
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setSelectedDate(dateStr);
    setIsLoading(false);
  };

  return (
    <div className="main-content">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <div className="loading-text">読み込み中...</div>
          </div>
        </div>
      )}
      <div className="hero">
        <h2 className="section-title">サロン一覧</h2>
        <div className="tag-row">
          <div>
            <div>
              {filterCategories.map((cat) => (
                <label key={cat} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 16, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="category"
                    value={cat}
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    style={{ marginRight: 4 }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
          <button
            className={`button-outline ${selectedCategories.length === 0 ? 'button-secondary' : ''}`}
            onClick={handleClearCategories}
          >
            すべて
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <label className="label" htmlFor="reserve-date">
            予約希望日（YYYYMMDD形式）
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              className="input"
              type="text"
              id="reserve-date"
              value={pendingDate}
              onChange={(e) => setPendingDate(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
              placeholder="例: 20260215"
              maxLength={8}
              style={{ flex: 1 }}
            />
            <button
              className="button-primary"
              type="button"
              onClick={handleDateUpdate}
            >
              更新
            </button>
          </div>
          <p style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
            選択中: {selectedDate}
          </p>
        </div>
      </div>

      <div className="grid">
        {filteredSalons.map((salon) => {
          const available = selectedDate ? isSlotAvailable(salon, selectedDate) : false;
          const isFavorite = favorites.includes(salon.id);
          return (
            <div className="card" key={salon.id} style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                  <img
                    src={salon.image}
                    alt={salon.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                  />
                  <button
                    type="button"
                    onClick={() => toggleFavorite(salon.id)}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'rgba(255,255,255,0.8)',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: 20,
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isFavorite ? '#ef4444' : '#d1d5db',
                    }}
                    title={isFavorite ? 'お気に入り解除' : 'お気に入りに追加'}
                  >
                    {isFavorite ? '❤' : '🤍'}
                  </button>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <div>
                      <a
                        href={`#/salons/${salon.id}`}
                        id={`${salon.name}-detail`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontWeight: 700, fontSize: 16, color: '#2563eb', textDecoration: 'underline' }}
                      >
                        {salon.name}
                      </a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {salon.categories && salon.categories.map((cat) => (
                      <ServiceIcon key={cat} type={cat} />
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <button
                      className={available ? 'button-primary' : 'button-outline'}
                      id={`reserve-btn-${salon.name.toLowerCase()}`}
                      disabled={!available}
                      onClick={() => handleReserve(salon.id)}
                      type="button"
                      style={{ padding: '6px 16px' }}
                    >
                      {available ? '予約' : '予約不可'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalonList;
