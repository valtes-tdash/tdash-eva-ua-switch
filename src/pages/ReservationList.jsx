import React, { useMemo, useState } from 'react';
import Modal from '../components/Modal';
import { useAppContext } from '../context/AppContext';
import usePageTitle from '../hooks/usePageTitle';

const ReservationList = () => {
  usePageTitle('予約一覧');
  const { reservations, salons, cancelReservation, formatDate } = useAppContext();
  const [targetId, setTargetId] = useState('');

  // ローカルタイムで今日の日付文字列を取得
  const todayStr = useMemo(() => formatDate(new Date()), [formatDate]);

  const sorted = [...reservations].sort((a, b) => `${a.date}-${a.time}`.localeCompare(`${b.date}-${b.time}`));

  const findSalon = (id) => salons.find((s) => s.id === id);

  // 文字列比較でタイムゾーン問題を回避
  const isPast = (date) => date < todayStr;
  const isCancelable = (date) => date > todayStr;

  const handleCancel = async () => {
    await cancelReservation(targetId);
    setTargetId('');
  };

  return (
    <div className="main-content">
        <h2 className="section-title">予約一覧</h2>
        {!sorted.length && <div className="empty-state">予約はまだありません。</div>}
        {!!sorted.length && (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" id="reservation-table">
              <thead>
                <tr>
                  <th>予約番号</th>
                  <th>サロン</th>
                  <th>予約日</th>
                  <th>時間</th>
                  <th>メニュー</th>
                  <th>状態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((item) => {
                  const salon = findSalon(item.salonId);
                  const past = isPast(item.date);
                  const canCancel = isCancelable(item.date);
                  return (
                    <tr key={item.id} id={`reservation-row-${item.reservationNumber || item.id}`}>
                      <td>{item.reservationNumber || '-'}</td>
                      <td>
                        {salon ? (
                          <a
                            href={`#/salons/${salon.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#2563eb', textDecoration: 'underline' }}
                          >
                            {salon.name}
                          </a>
                        ) : (
                          '不明なサロン'
                        )}
                      </td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                      <td>{item.menu}</td>
                      <td>{past ? '利用済み' : '予約中'}</td>
                      <td>
                        {canCancel ? (
                          <button className="button-outline" type="button" onClick={() => setTargetId(item.id)}>
                            キャンセル
                          </button>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>キャンセル不可</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      {targetId && (
        <Modal
          title="予約キャンセル"
          onClose={() => setTargetId('')}
          actions={
            <button className="button-primary" onClick={handleCancel} type="button">
              削除する
            </button>
          }
        >
          <p>予約をキャンセルしますか？</p>
          <p>翌日以降の予約のみキャンセルできます。</p>
        </Modal>
      )}
    </div>
  );
};

export default ReservationList;
