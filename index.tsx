
/**
 * LPU-Nexus Environment Bootstrap
 * This must run at the absolute top of the entry point to ensure
 * process.env.API_KEY is available to all subsequently loaded modules.
 */
(function initializeNexusGlobalEnv() {
  const g = (typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : ({} as any));
  
  // Initialize standard process.env structure
  g.process = g.process || { env: {} };
  g.process.env = g.process.env || {};

  try {
    /**
     * VITE STATIC REPLACEMENT:
     * Using literal strings ensures the Vite bundler replaces these 
     * with actual values from the Vercel/Local environment at build time.
     */
    // @ts-ignore
    const V_KEY = import.meta.env ? import.meta.env.VITE_API_KEY : undefined;
    // @ts-ignore
    const A_KEY = import.meta.env ? import.meta.env.API_KEY : undefined;
    
    const key = V_KEY || A_KEY;
    
    if (key) {
      g.process.env.API_KEY = key;
    }
  } catch (e) {
    // Fail silently - environment might not support import.meta
  }
})();

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
