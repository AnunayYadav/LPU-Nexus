
/**
 * Environment Shim
 * Must run before any imports that might initialize the Gemini SDK.
 * Vite requires literal 'import.meta.env.VITE_API_KEY' for static replacement.
 */
(function() {
  const g = (typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : ({} as any));
  g.process = g.process || { env: {} };
  
  try {
    // Check for import.meta.env safely
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const vKey = import.meta.env.VITE_API_KEY;
      // @ts-ignore
      const aKey = import.meta.env.API_KEY;
      
      const key = vKey || aKey;
      if (key) {
        g.process.env.API_KEY = key;
      }
    }
  } catch (e) {
    console.warn("Nexus Environment Shim: Unable to access import.meta.env", e);
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
