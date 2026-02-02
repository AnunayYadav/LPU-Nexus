
/**
 * Environment Shim
 * In Vite-based environments (like Vercel), environment variables are accessed via 
 * import.meta.env and prefixed with VITE_. To satisfy the Gemini SDK's requirement 
 * for process.env.API_KEY, we bridge the variables here at the application entry point.
 */
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
  const env = (import.meta as any).env;
  if (env) {
    (process.env as any).API_KEY = (process.env as any).API_KEY || env.VITE_API_KEY || env.API_KEY;
  }
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
