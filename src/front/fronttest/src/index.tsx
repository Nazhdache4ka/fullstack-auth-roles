import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { setupAxiosInterceptors } from './api/axios-config';
import './index.css';

setupAxiosInterceptors();

const root = createRoot(document.getElementById('root')!);

if (!root) {
  throw new Error('Root element not found');
}

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
