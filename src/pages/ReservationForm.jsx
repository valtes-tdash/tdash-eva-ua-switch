import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import usePageTitle from '../hooks/usePageTitle';
import { initialUsers } from '../data/mockData';

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

const ReservationForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { salons, formatDate, getReservationsBySalonDate, addReservation, user, isSlotAvailable } = useAppContext();
  const navigate = useNavigate();

  const salon = salons.find((s) => s.id === id);
  usePageTitle(salon ? salon.name : '予約');
  const defaultDate = searchParams.get('date') || formatDate(new Date());
  const [date, setDate] = useState(defaultDate);
  const [pendingDate, setPendingDate] = useState(toYYYYMMDD(defaultDate));
  const [menu, setMenu] = useState(salon?.menus[0] ?? '');
  const [time, setTime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');
  const [userName, setUserName] = useState(user?.name || initialUsers[0].name);

  const reservedTimes = useMemo(() => getReservationsBySalonDate(id, date).map((r) => r.time), [date, getReservationsBySalonDate, id]);

  if (!salon) {
    return (
      <div className="main-content">
        <div className="card">該当するサロンがありません。</div>
      </div>
    );
  }

  // 選択した日付がこのサロンで予約可能かチェック
  const isDateAvailable = useMemo(() => {
    if (!salon || !date) return false;
    return isSlotAvailable(salon, date);
  }, [salon, date, isSlotAvailable]);

  const selectableTimes = salon.timeSlots.map((slot) => ({
    value: slot,
    disabled: !isDateAvailable || reservedTimes.includes(slot),
  }));

  const handleDateUpdate = async () => {
    const dateStr = fromYYYYMMDD(pendingDate);
    if (!dateStr || isNaN(new Date(dateStr).getTime())) {
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setDate(dateStr);
    setTime('');
    setIsLoading(false);
  };

  const openConfirm = async (e) => {
    e.preventDefault();
    setError('');
    if (!date || !menu || !time) {
      setError('入力内容を確認してください');
      return;
    }
    if (!isDateAvailable) {
      setError('選択した日付は予約できません');
      return;
    }
    // 予約確認ボタン押下時はloading表示
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    setIsLoading(false);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      const result = await addReservation({ salonId: id, date, time, menu, userName });
      setReservationNumber(result.reservationNumber);
      setShowConfirm(false);
      setShowComplete(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompleteClose = () => {
    setShowComplete(false);
    navigate('/reservations');
  };

  return (
    <div className="main-content" style={{ maxWidth: 640 }}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <div className="loading-text">読み込み中...</div>
          </div>
        </div>
      )}
      <div className="card">
        <h2 className="section-title">予約登録</h2>
        <p>{salon.name} での予約を登録します。</p>
        <div className="form-row">
          <label className="label" htmlFor="name">予約者</label>
          <input
            className="input"
            type="text"
            id="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="お名前を入力してください"
          />
        </div>
        <form onSubmit={openConfirm}>
          <div className="form-row">
            <label className="label" htmlFor="date">
              予約日（YYYYMMDD形式）
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                className="input"
                type="text"
                id="date"
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
              選択中の予約日: {date}
            </p>
            {!isDateAvailable && date && (
              <p style={{ color: '#d93025', fontSize: 12, marginTop: 4 }}>
                この日は予約できません（定休日または予約満員）
              </p>
            )}
          </div>
          <div className="form-row">
            <label className="label" htmlFor="menu">
              メニュー
            </label>
            <select
              id="menu"
              className="select"
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
            >
              {salon.menus.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label className="label">時間帯</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectableTimes.map((slot) => (
                <label
                  key={slot.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '8px 12px',
                    border: time === slot.value ? '2px solid #2563eb' : '2px solid #e2e8f0',
                    borderRadius: 8,
                    cursor: slot.disabled ? 'not-allowed' : 'pointer',
                    opacity: slot.disabled ? 0.5 : 1,
                    background: time === slot.value ? '#eff6ff' : 'white',
                  }}
                >
                  <input
                    type="radio"
                    name="time"
                    value={slot.value}
                    checked={time === slot.value}
                    disabled={slot.disabled}
                    onChange={(e) => setTime(e.target.value)}
                    style={{ margin: 0 }}
                  />
                  <span>{slot.value}</span>
                  {slot.disabled && <span style={{ color: '#d93025', fontSize: 12 }}>(予約不可)</span>}
                </label>
              ))}
            </div>
          </div>
          {error && <div style={{ color: '#d93025', marginBottom: 10 }}>{error}</div>}
          <button className="button-primary" type="submit">
            予約確認
          </button>
        </form>
      </div>

      {showConfirm && (
        <Modal
          title="予約内容の確認"
          onClose={() => setShowConfirm(false)}
          actions={
            <button className="button-primary" type="button" onClick={handleConfirm}>
              確定する
            </button>
          }
        >
          <p>サロン: {salon.name}</p>
          <p>予約者: {userName}</p>
          <p>予約日: {date}</p>
          <p>メニュー: {menu}</p>
          <p>時間帯: {time}</p>
        </Modal>
      )}

      {showComplete && (
        <Modal
          title="予約完了"
          onClose={handleCompleteClose}
          actions={
            <button className="button-primary" type="button" onClick={handleCompleteClose}>
              予約一覧へ
            </button>
          }
        >
          <p style={{ textAlign: 'center' }}>予約が完了しました</p>
          <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 18, margin: '12px 0' }}>
            予約番号: <span id="reservation-number">{reservationNumber}</span>
          </p>
          <p>サロン: {salon.name}</p>
          <p>予約者: {userName}</p>
          <p>予約日: {date}</p>
          <p>メニュー: {menu}</p>
          <p>時間帯: {time}</p>
        </Modal>
      )}
    </div>
  );
};

export default ReservationForm;
