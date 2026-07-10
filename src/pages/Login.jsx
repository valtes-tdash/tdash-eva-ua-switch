import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import usePageTitle from '../hooks/usePageTitle';

const Login = () => {
  usePageTitle('ログイン');
  const { login, isAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  // ログイン済みで /login に来た場合は宣言的にリダイレクト（描画中の命令的 navigate は
  // iOS Safari 等で白画面になり得るため <Navigate> を使う）
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-bg">
      <div className="card" style={{
        maxWidth: 420,
        width: '100%',
        padding: '32px'
      }}>
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            color: '#dc2626',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            エラーメッセージエリア: {error}
          </div>
        )}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          ログイン
        </h2>
        <p style={{
          color: '#64748b',
          marginBottom: '24px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          サービスにログインする
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="label" htmlFor="email">
              メールアドレス
            </label>
            <input
              className="input"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              // iOS Safari の自動大文字化・自動修正・オートフィルを抑止（メール欄が
              // 勝手に大文字化/クリアされて自動入力が通らない問題を防ぐ）
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              required
            />
          </div>
          <div className="form-row">
            <label className="label" htmlFor="password">
              パスワード
            </label>
            <input
              className="input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            className="button-primary"
            type="submit"
            style={{
              width: '100%',
              marginTop: '8px'
            }}
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
