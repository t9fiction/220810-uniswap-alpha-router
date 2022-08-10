import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalProvider } from './context/GlobalState'
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GlobalProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </GlobalProvider>
);

