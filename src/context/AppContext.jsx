import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { fakeFetch } from '../data/fakeFetch';
import {
  formatDate,
  initialFavorites,
  initialReservations,
  initialSalons,
  initialUsers,
} from '../data/mockData';

const AppContext = createContext();

// LocalStorageキー
const STORAGE_KEYS = {
  USER: 'tdash_user',
  RESERVATIONS: 'tdash_reservations',
  FAVORITES: 'tdash_favorites',
};

// LocalStorageからデータを読み込む
const loadFromStorage = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    const reservations = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return {
      user: user ? JSON.parse(user) : null, // ログイン前はnull
      reservations: reservations ? JSON.parse(reservations) : initialReservations,
      favorites: favorites ? JSON.parse(favorites) : initialFavorites,
    };
  } catch {
    return {
      user: null,
      reservations: initialReservations,
      favorites: initialFavorites,
    };
  }
};

// 予約番号を生成する関数
const generateReservationNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RSV-${timestamp}-${random}`;
};

// 初期状態をlocalStorageから読み込む
const storedData = loadFromStorage();
const initialState = {
  user: storedData.user,
  isAuthenticated: !!storedData.user,
  salons: initialSalons,
  reservations: storedData.reservations,
  favorites: storedData.favorites,
  loading: false,
};

const reducer = (state, action) => {
  let newState;
  switch (action.type) {
    case 'LOGIN':
      newState = { ...state, user: action.payload, isAuthenticated: true };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      return newState;
    case 'LOGOUT':
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      return { ...initialState, user: null, isAuthenticated: false, salons: initialSalons, reservations: initialReservations, favorites: initialFavorites };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.includes(action.payload);
      const updated = exists
        ? state.favorites.filter((id) => id !== action.payload)
        : [...state.favorites, action.payload];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      return { ...state, favorites: updated };
    }
    case 'ADD_RESERVATION':
      newState = { ...state, reservations: [...state.reservations, action.payload] };
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(newState.reservations));
      return newState;
    case 'CANCEL_RESERVATION':
      newState = {
        ...state,
        reservations: state.reservations.filter((item) => item.id !== action.payload),
      };
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(newState.reservations));
      return newState;
    case 'SYNC_FROM_STORAGE':
      // 他タブからの変更を同期
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        reservations: action.payload.reservations,
        favorites: action.payload.favorites,
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 他タブからのlocalStorage変更を監視
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        event.key === STORAGE_KEYS.USER ||
        event.key === STORAGE_KEYS.RESERVATIONS ||
        event.key === STORAGE_KEYS.FAVORITES
      ) {
        const newData = loadFromStorage();
        dispatch({ type: 'SYNC_FROM_STORAGE', payload: newData });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setLoading = (value) => dispatch({ type: 'SET_LOADING', payload: value });

  const withLatency = async (callback) => {
    setLoading(true);
    try {
      await fakeFetch(null);
      return callback();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    return withLatency(() => {
      const found = initialUsers.find((u) => u.email === email);
      if (!found || found.password !== password) {
        throw new Error('メールアドレスまたはパスワードが一致しません');
      }
      dispatch({ type: 'LOGIN', payload: found });
      return found;
    });
  };

  const logout = async () => {
    const ok = window.confirm('ログアウトしますか？');
    if (!ok) return false;
    return withLatency(() => {
      dispatch({ type: 'LOGOUT' });
      return true;
    });
  };

  const toggleFavorite = async (salonId) =>
    withLatency(() => {
      dispatch({ type: 'TOGGLE_FAVORITE', payload: salonId });
      return salonId;
    });

  const addReservation = async ({ salonId, date, time, menu, userName }) => {
    // 予約確定はloading表示なしで即座に実行
    const reservationNumber = generateReservationNumber();
    const newReservation = {
      id: crypto.randomUUID(),
      reservationNumber,
      salonId,
      userEmail: state.user?.email ?? initialUsers[0].email,
      userName: userName || state.user?.name || '',
      date,
      time,
      menu,
    };
    dispatch({ type: 'ADD_RESERVATION', payload: newReservation });
    return newReservation;
  };

  const cancelReservation = async (reservationId) =>
    withLatency(() => {
      dispatch({ type: 'CANCEL_RESERVATION', payload: reservationId });
      return reservationId;
    });

  const getReservationsBySalonDate = (salonId, date) =>
    state.reservations.filter((r) => r.salonId === salonId && r.date === date);

  const isSlotAvailable = (salon, date) => {
    // YYYY-MM-DD形式の日付文字列をローカルタイムでパース
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day); // monthは0始まり
    const dayOfWeek = dateObj.getDay(); // 0=日, 1=月, 2=火, 3=水, 4=木, 5=金, 6=土
    const dayOfMonth = dateObj.getDate();

    // アグ ヘアサロン (salon-1): 毎週月曜日定休
    if (salon.id === 'salon-1' && dayOfWeek === 1) {
      return false;
    }

    // プラージュ (salon-2): 毎週火曜日11:00のみ空き（火曜日以外は予約不可）
    if (salon.id === 'salon-2') {
      return dayOfWeek === 2; // 火曜日のみtrue
    }

    // EARTH (salon-3): 毎月1日は予約満員
    if (salon.id === 'salon-3' && dayOfMonth === 1) {
      return false;
    }

    // 通常の予約判定（空きスロットがあるか）
    return salon.timeSlots.some((slot) => !getReservationsBySalonDate(salon.id, date).some((r) => r.time === slot));
  };

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      toggleFavorite,
      addReservation,
      cancelReservation,
      getReservationsBySalonDate,
      isSlotAvailable,
      formatDate,
    }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
