import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; 

// Kết nối code React với thẻ <div id="root"> bên HTML
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);