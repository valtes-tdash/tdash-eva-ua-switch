const today = new Date();

// ローカルタイムでYYYY-MM-DD形式に変換（タイムゾーン問題を回避）
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const initialUsers = [
  {
    email: 'alice@example.com',
    password: 'alicepassyamada',
    name: '山田アリス',
    registeredAt: '2023-06-01',
    memberId: 'EV-1001',
  },
  {
    email: 'bob@example.com',
    password: '12345abcde',
    name: '鈴木ボブ',
    registeredAt: '2023-07-15',
    memberId: 'EV-1002',
  },
  {
    email: 'celine@example.com',
    password: 'zxcvbnm',
    name: '佐藤セリーヌ',
    registeredAt: '2023-08-20',
    memberId: 'EV-1003',
  },
  {
    email: 'damian@example.com',
    password: 'asdfg@spy',
    name: '今田ダミアン',
    registeredAt: '2023-09-10',
    memberId: 'EV-1004',
  },
  {
    email: 'elizabeth@example.com',
    password: 'qwert@dash',
    name: '田中エリザベス',
    registeredAt: '2023-10-01',
    memberId: 'EV-1005',
  },
];

export const initialSalons = [
  {
    id: 'salon-1',
    name: 'アグ ヘアサロン',
    category: 'ヘアサロン',
    categories: ['ヘアサロン'],
    description: '表参道にある上質なヘアサロン。毎週月曜日は定休日です。',
    image: import.meta.env.BASE_URL + 'store_screen/agu_hair.jpg',
    menus: ['カット', 'カット＋カラー', 'カット＋トリートメント', 'グラデーション'],
    timeSlots: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    address: '東京都渋谷区神宮前1-1-1',
    phone: '03-0000-1111',
    closedDay: 1, // Monday
  },
  {
    id: 'salon-2',
    name: 'プラージュ',
    category: 'ヘアサロン',
    categories: ['ヘアサロン', 'ネイルサロン', 'エステサロン'],
    description: '複合型ビューティーサロン。毎週火曜日11:00のみ空いています。',
    image: import.meta.env.BASE_URL + 'store_screen/plage.jpg',
    menus: ['カット', 'ネイル', 'フェイシャル'],
    timeSlots: ['11:00'], // Tuesday 11:00 only
    address: '東京都中央区銀座2-2-2',
    phone: '03-0000-2222',
    specialRule: 'tuesday-11only',
  },
  {
    id: 'salon-3',
    name: 'EARTH',
    category: 'ヘアサロン',
    categories: ['ヘアサロン', 'ネイルサロン'],
    description: 'トータルビューティーサロン。毎月1日は予約でいっぱいです。',
    image: import.meta.env.BASE_URL + 'store_screen/earth.jpg',
    menus: ['ヘアカット', 'ネイルケア'],
    timeSlots: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    address: '東京都港区北青山3-3-3',
    phone: '03-0000-3333',
    specialRule: 'first-day-full',
  },
  {
    id: 'salon-4',
    name: 'LIM',
    category: 'ヘアサロン',
    categories: ['ヘアサロン', 'ネイルサロン'],
    description: 'スタイリッシュなサロン。ヘアとネイルの同時施術も可能。',
    image: import.meta.env.BASE_URL + 'store_screen/LIM.jpg',
    menus: ['カット', 'カラー', 'ネイル'],
    timeSlots: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    address: '東京都新宿区西新宿4-4-4',
    phone: '03-0000-4444',
  },
  {
    id: 'salon-5',
    name: 'AIR',
    category: 'ヘアサロン',
    categories: ['ヘアサロン', 'ネイルサロン', 'エステサロン'],
    description: 'トータルビューティーサロン。11:00, 12:00, 13:00のみ空きがあります。',
    image: import.meta.env.BASE_URL + 'store_screen/air.jpg',
    menus: ['ヘア', 'ネイル', 'エステ', 'グラデーション'],
    timeSlots: ['11:00', '12:00', '13:00'],
    address: '神奈川県横浜市西区1-1-1',
    phone: '045-000-5555',
  },
  {
    id: 'salon-6',
    name: 'fizelle',
    category: 'ネイルサロン',
    categories: ['ネイルサロン'],
    description: 'ネイル専門サロン。アートデザインが得意です。',
    image: import.meta.env.BASE_URL + 'store_screen/fizelle.jpg',
    menus: ['ワンカラー', 'フレンチ', 'アートデザイン'],
    timeSlots: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    address: '東京都世田谷区1-1-1',
    phone: '03-0000-6666',
  },
  {
    id: 'salon-7',
    name: 'カットコムズ',
    category: 'ヘアサロン',
    categories: ['ヘアサロン'],
    description: 'メンズカット専門店。スピーディーな施術が特徴。',
    image: import.meta.env.BASE_URL + 'store_screen/cutcomz.jpg',
    menus: ['カット', 'シェービング'],
    timeSlots: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    address: '東京都豊島区池袋1-1-1',
    phone: '03-0000-7777',
  },
  {
    id: 'salon-8',
    name: 'TAYA',
    category: 'ヘアサロン',
    categories: ['ヘアサロン', 'エステサロン'],
    description: 'ヘアとエステの複合サロン。リラックス空間で癒しを提供。',
    image: import.meta.env.BASE_URL + 'store_screen/taya.jpg',
    menus: ['ヘアケア', 'ヘッドスパ', 'フェイシャル'],
    timeSlots: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    address: '東京都品川区大崎1-1-1',
    phone: '03-0000-8888',
  },
];

export const initialReservations = [
  {
    id: 'res-1',
    salonId: 'salon-1',
    userEmail: 'alice@example.com',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)),
    time: '12:00',
    menu: 'カット',
    userName: '山田アリス',
  },
  {
    id: 'res-2',
    salonId: 'salon-5',
    userEmail: 'alice@example.com',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14)),
    time: '12:00',
    menu: 'ネイル',
    userName: '山田アリス',
  },
  {
    id: 'res-3',
    salonId: 'salon-3',
    userEmail: 'bob@example.com',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)),
    time: '11:00',
    menu: 'ヘアカット',
    userName: '鈴木ボブ',
  },
];

export const initialFavorites = ['salon-3'];

export { formatDate };
