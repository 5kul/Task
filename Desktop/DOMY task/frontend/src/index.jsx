import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <>
    <Toaster position="top-right" reverseOrder={false} />
    <App />
  </>
);
