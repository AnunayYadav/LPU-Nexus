
/**
 * Global Environment Shim
 * Bridges Vite's build-time environment variables to process.env.API_KEY.
 * This MUST run before any other application code.
 */
(function initializeNexusEnvironment() {
  const g = (typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : ({} as any));
  
  // Initialize process object if missing
  g.process = g.process || { env: {} };
  g.process.env = g.process.env || {};

  try {
    /**
     * VITE STATIC REPLACEMENT:
     * We must use the literal strings below so Vite can find and replace them 
     * with the actual values from the Vercel/Local environment at build time.
     */
    // @ts-ignore
    const vKey = import.meta.env?.VITE_API_KEY;
    // @ts-ignore
    const aKey = import.meta.env?.API_KEY;
    
    const key = vKey || aKey;
    
    if (key) {
      g.process.env.API_KEY = key;
    }
  } catch (e) {
    // Silently fail if import.meta is not supported in the current context
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
