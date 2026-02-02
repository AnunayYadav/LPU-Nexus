
/**
 * Environment Shim
 * Bridges Vite/Vercel environment variables to process.env.API_KEY for the @google/genai SDK.
 * IMPORTANT: Bundlers like Vite require the full literal path 'import.meta.env.VITE_API_KEY'
 * to be present in the source code to perform static string replacement during build.
 */
(function() {
  const g = (typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : ({} as any));
  g.process = g.process || { env: {} };
  
  try {
    // We check for both standard and VITE_ prefixed keys using literal paths for the bundler
    // @ts-ignore
    const viteKey = import.meta.env.VITE_API_KEY;
    // @ts-ignore
    const envKey = import.meta.env.API_KEY;
    
    const finalKey = viteKey || envKey;
    
    if (finalKey) {
      g.process.env.API_KEY = finalKey;
    }
  } catch (e) {
    // Fallback for non-Vite environments
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
