import React from 'react';
import { useAppContext } from '../context/AppContext';

const LoadingOverlay = () => {
  const { loading } = useAppContext();
  if (!loading) return null;
  return (
    <div className="loading-overlay" data-testid="loading-overlay">
      <div className="loading-content">
        <div className="spinner" />
        <p className="loading-text">loading...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
