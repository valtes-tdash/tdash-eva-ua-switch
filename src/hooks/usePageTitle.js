import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} - T-DASH サロン予約` : 'サロン予約システム';
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default usePageTitle;
