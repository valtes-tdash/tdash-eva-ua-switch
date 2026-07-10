# 📱 Salon Booking SPA — UA切替版（モバイルWeb確認用）

テスト自動化練習用デモサイト。サロン予約 SPA を題材に、**User-Agent による表示切り替え**を確認するためのサイトです。
元サイト [`valtes-rd/tdash-eva-202602`](https://github.com/valtes-rd/tdash-eva-202602)（Vite + React）をベースに、
読み込み時の UA から **Android / iOS / その他** を判定し、OS 別に見た目を切り替えます（レスポンシブ対応も内包）。

> UA判定なしのレスポンシブのみの版は別リポジトリ [`tdash-eva-responsive`](https://github.com/valtes-tdash/tdash-eva-responsive) にあります。

## 🌐 公開URL

**https://valtes-tdash.github.io/tdash-eva-ua-switch/**

スマホ実機で開けば、その端末の OS に応じて自動でテーマが切り替わります（手動切替ではありません）。

## ⚠ 免責事項

テスト自動化の練習専用のテストページです。実在のサービス・製品とは一切関係ありません。
データはブラウザの `localStorage` にのみ保存され、外部サーバーへの送信は行いません。ログイン等は固定のモックデータで動作します。

## 🔀 UA 切り替えの仕様（本版の中心機能）

読み込み時に `navigator.userAgent` から OS を判定し、**自動で** OS 別テーマに切り替えます。UA が変わった場合は再読込で再判定されます。

**判定ロジック（`src/utils/detectOS.js`）**

- `Android` を含む → `android`
- `iPhone`/`iPod`/`iPad` を含む → `ios`（iPadOS 13+ は Mac の UA を返すため `navigator.maxTouchPoints` で補完）
- それ以外 → `other`（PC 等）

**OS 別テーマ**

| OS | ヘッダー/ボタン | バナー |
|---|---|---|
| Android | グリーン系 | 緑「Android版」 |
| iOS | ダークグレー + iOSブルー | グレー「iOS版」 |
| その他 | デフォルト | アンバー「その他（PC等）」＝対象外である旨を明示 |

**テスト用フック**

- ルート要素：`<html data-os="android|ios|other">`
- 検出バナー：`[data-testid="detected-os"]`（`data-os` 属性付き）
- 生の UA：`[data-testid="detected-ua"]`

> Chrome DevTools のデバイスエミュレーション（iPhone/Pixel 等）で UA を上書きし、リロードすると PC でも各テーマを確認できます。

## 🔑 ログイン情報（モック）

ログイン画面の初期表示はダミー値のため通りません。以下の固定ユーザーを使用してください。

| メールアドレス | パスワード |
|---|---|
| `alice@example.com` | `alicepassyamada` |
| `bob@example.com` | `12345abcde` |
| `celine@example.com` | `zxcvbnm` |
| `damian@example.com` | `asdfg@spy` |
| `elizabeth@example.com` | `qwert@dash` |

> いちばん手軽なのは **alice@example.com / alicepassyamada**（予約データが紐づいています）。

## 🗺 画面とルート（HashRouter）

| ルート | 画面 | 認証 |
|---|---|---|
| `#/login` | ログイン | 不要 |
| `#/` | サロン一覧 | 要 |
| `#/salons/:id` | サロン詳細（カレンダー） | 要 |
| `#/reserve/:id` | 予約フォーム | 要 |
| `#/reservations` | 予約一覧 | 要 |
| `#/favorites` | お気に入り | 要 |
| `#/me` | マイページ | 要 |

未認証で保護ルートに来ると `#/login` にリダイレクトされます。

## 🎯 主要要素（自動テスト用の取っ掛かり）

| 画面 | 要素（id / 属性） |
|---|---|
| 共通（本版） | `html[data-os]` / `[data-testid=detected-os]` / `[data-testid=detected-ua]` |
| ログイン | `#email` / `#password` / `button[type=submit]` |
| サロン一覧 | `input[name=category]` / `#reserve-date` |
| サロン詳細 | `#calendar-header` / `#calendar-body` |
| 予約フォーム | `#name` / `#date` / `#menu` / `input[name=time]` / `#reservation-number` |
| 予約一覧 | `#reservation-table` |
| 共通 | ローディング `[data-testid=loading-overlay]` |

## 📱 レスポンシブ（内包）

`src/styles/app.css` にブレークポイント（`≤900 / ≤640 / ≤380px`）を追加済み。スマホ幅でもレイアウトが崩れません。

## ⏱ 動的な挙動（待機練習用）

モックの `fakeFetch`（`src/data/fakeFetch.js`）が意図的に遅延を挟むため、操作中に
`[data-testid="loading-overlay"]` のローディングオーバーレイが表示されます。

## 🗂 ファイル構成（★ が本版の追加/変更）

```
├── index.html                 # <title>: Salon Booking SPA (UA切替版)
├── vite.config.js             # base: './'
├── package.json
└── src/
    ├── main.jsx               # ★ <html data-os="..."> を付与
    ├── App.jsx                # ★ <OsBanner/> を描画
    ├── index.css
    ├── styles/app.css         # ★ @media（レスポンシブ）＋ OS別テーマを追加
    ├── utils/detectOS.js      # ★ UA→OS 判定
    ├── components/
    │   ├── OsBanner.jsx       # ★ 検出結果バナー
    │   └── Header / Modal / LoadingOverlay
    ├── context/AppContext.jsx # 認証・状態（localStorage 永続）
    ├── data/                  # mockData.js / fakeFetch.js
    ├── hooks/usePageTitle.js
    └── pages/                 # Login / SalonList / SalonDetail / ReservationForm / ReservationList / Favorites / MyPage
```

## 🛠 技術スタック

| 分類 | 技術 |
|---|---|
| 言語/UI | React 18 + JSX |
| ルーティング | react-router-dom（`HashRouter`） |
| ビルド | Vite 5 |
| UA 判定 | `navigator.userAgent` / `navigator.maxTouchPoints` |
| データ | モック（`src/data/*`）＋ `localStorage`。バックエンド不要 |
| デプロイ | GitHub Actions → GitHub Pages（push で自動） |

## 🚀 起動方法（ローカル）

```bash
npm install

# 開発サーバ（--host で同一LANのスマホ実機からもアクセス可）
npm run dev -- --port 5174 --host
#  ➜ Local:   http://localhost:5174/
#  ➜ Network: http://<PCのLAN IP>:5174/

npm run build     # 本番ビルド → dist/
npm run preview   # ビルド結果をローカル配信
```

`main` に push すると `.github/workflows/deploy.yml` が自動でビルドし、上記の公開URLへデプロイします。

## 📝 出典

元サイト [`valtes-rd/tdash-eva-202602`](https://github.com/valtes-rd/tdash-eva-202602) の派生物です。テスト自動化の学習・練習目的で利用してください。
