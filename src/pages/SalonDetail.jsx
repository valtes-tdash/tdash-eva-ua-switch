import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import usePageTitle from '../hooks/usePageTitle';

const SalonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { salons, favorites, toggleFavorite, isSlotAvailable, formatDate } = useAppContext();
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  // iframeからのメッセージを受信
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'dateSelect') {
        setSelectedDate(event.data.date);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const salon = salons.find((s) => s.id === id);
  usePageTitle(salon ? salon.name : 'サロン詳細');
  const isFavorite = favorites.includes(id);

  const upcoming = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, idx) =>
      formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + idx)),
    );
  }, [formatDate]);

  if (!salon) {
    return (
      <div className="main-content">
        <div className="card">サロンが見つかりませんでした。</div>
      </div>
    );
  }

  const handleFavorite = async () => {
    setMessage('');
    try {
      await toggleFavorite(id);
      setMessage(isFavorite ? 'お気に入りを解除しました。' : 'お気に入りに登録しました。');
    } catch (err) {
      setMessage(err.message);
    }
  };

  // 直近の予約可能日を取得
  const nearestAvailableDate = useMemo(() => {
    if (!salon) return null;
    const today = new Date();
    const todayStr = formatDate(today);
    // 今日から14日間をチェック
    for (let i = 0; i < 14; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const dateStr = formatDate(date);
      if (dateStr >= todayStr && isSlotAvailable(salon, dateStr)) {
        return dateStr;
      }
    }
    return null;
  }, [formatDate, isSlotAvailable, salon]);

  const handleReserve = () => {
    // 選択日があればその日、なければ直近の予約可能日で予約画面へ
    const dateToUse = selectedDate || nearestAvailableDate;
    if (dateToUse) {
      navigate(`/reserve/${id}?date=${dateToUse}`);
    }
  };

  // Generate calendar data for 2 weeks (日曜日スタート)
  const calendarData = useMemo(() => {
    const today = new Date();
    const todayStr = formatDate(today);
    const weeks = [];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    // 今日を含む週の日曜日を取得
    const dayOfWeek = today.getDay(); // 0=日, 1=月, ... 6=土
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek);

    for (let week = 0; week < 2; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + (week * 7) + day);
        const dateStr = formatDate(date);
        const isPast = dateStr < todayStr; // 今日より前は過去
        const isToday = dateStr === todayStr;
        // 過去の日は予約不可、それ以外は通常判定
        const available = isPast ? false : isSlotAvailable(salon, dateStr);
        weekData.push({
          date: dateStr,
          dayOfMonth: date.getDate(),
          dayName: dayNames[date.getDay()],
          available,
          isToday,
          isPast,
        });
      }
      weeks.push(weekData);
    }
    return { weeks, dayNames };
  }, [formatDate, isSlotAvailable, salon]);

  return (
    <div className="main-content">
      <div className="card">
        <div className="flex-between">
          <div>
            <h2 className="section-title" style={{ marginBottom: 4 }}>
              {salon.name}
            </h2>
            <span className="badge">{salon.category}</span>
          </div>
          <button className="button-primary" type="button" onClick={handleFavorite}>
            {isFavorite ? 'お気に入り解除' : 'お気に入り登録'}
          </button>
        </div>
        {message && <p style={{ color: '#2563eb' }}>{message}</p>}
        <img
          src={salon.image}
          alt={salon.name}
          style={{ width: '100%', borderRadius: 12, margin: '12px 0' }}
        />
        <p style={{ color: '#4b5563' }}>{salon.description}</p>
        <div className="tag-row" style={{ marginTop: 10 }}>
          <span className="badge">住所: {salon.address}</span>
          <span className="badge">TEL: {salon.phone}</span>
        </div>

        <h3 className="section-title" style={{ marginTop: 20 }}>
          予約カレンダー
        </h3>
        <iframe
          title="予約カレンダー"
          style={{
            width: '100%',
            height: 200,
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            background: 'white',
          }}
          srcDoc={`
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { margin: 0; padding: 8px; font-family: sans-serif; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; background: white; }
                th, td { text-align: center; padding: 8px; border-bottom: 1px solid #e5e7eb; }
                th { background: #f1f5f9; }
                .available { color: #0f9d58; font-weight: 700; cursor: pointer; }
                .available:hover { text-decoration: underline; }
                .unavailable { color: #d93025; }
                .today { font-weight: 700; }
                .selected { background: #dbeafe; }
              </style>
            </head>
            <body>
              <table>
                <thead id="calendar-header">
                  <tr>
                    ${calendarData.dayNames.map(day => `<th>${day}</th>`).join('')}
                  </tr>
                </thead>
                <tbody id="calendar-body">
                  ${calendarData.weeks.map(week => `
                    <tr>
                      ${week.map(day => `
                        <td data-date="${day.date}" data-available="${day.available}" class="${selectedDate === day.date ? 'selected' : ''}">
                          <div class="${day.isToday ? 'today' : ''}">${day.dayOfMonth}</div>
                          <div class="day-status" style="${day.available ? 'color:#0f9d58;font-weight:700;cursor:pointer;' : 'color:#d93025;'}" ${day.available ? `onclick="window.parent.postMessage({type:'dateSelect',date:'${day.date}'},'*')"` : ''}>${day.available ? '○' : '×'}</div>
                        </td>
                      `).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
            </html>
          `}
        />
        {selectedDate && (
          <p style={{ marginTop: 8, color: '#2563eb' }}>
            選択中: {selectedDate}
          </p>
        )}
        <div style={{ marginTop: 16 }}>
          <button
            className="button-primary"
            type="button"
            onClick={handleReserve}
            disabled={!selectedDate && !nearestAvailableDate}
            style={{ width: '100%' }}
          >
            このサロンを予約する
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonDetail;
