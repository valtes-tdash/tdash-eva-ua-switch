import React from 'react';
import { useAppContext } from '../context/AppContext';
import usePageTitle from '../hooks/usePageTitle';

const MyPage = () => {
  usePageTitle('マイページ');
  const { user } = useAppContext();

  if (!user) {
    return (
      <div className="main-content">
        <div className="card">ログイン情報が見つかりません。</div>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ maxWidth: 720 }}>
      <div className="card">
        <h2 className="section-title">マイページ</h2>
        <p>ログイン中のユーザー情報を表示します。</p>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          <div className="card" style={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
            <div className="label">名前</div>
            <div style={{ fontWeight: 700 }}>{user.name}</div>
          </div>
          <div className="card" style={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
            <div className="label">Email</div>
            <div style={{ fontWeight: 700 }}>{user.email}</div>
          </div>
          <div className="card" style={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
            <div className="label">会員ID</div>
            <div style={{ fontWeight: 700 }}>{user.memberId}</div>
          </div>
          <div className="card" style={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
            <div className="label">登録日</div>
            <div style={{ fontWeight: 700 }}>{user.registeredAt}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
