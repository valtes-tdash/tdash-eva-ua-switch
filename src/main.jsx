import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { detectOS } from './utils/detectOS';
import './index.css';
import './styles/app.css';

// UA から判定した OS を <html data-os="..."> に付与し、CSS で OS 別テーマを切り替える
document.documentElement.setAttribute('data-os', detectOS());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </React.StrictMode>,
);
