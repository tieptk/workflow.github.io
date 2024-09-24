import React from 'react';
import ReactDOM from 'react-dom/client'; // Sử dụng từ react-dom/client trong React 18
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import Flow from './nodes/Test';

// Lấy root element từ file HTML
const rootElement = document.getElementById('root');

// Sử dụng createRoot thay vì ReactDOM.render
const root = ReactDOM.createRoot(rootElement as HTMLElement);

// Render ứng dụng
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
