
/**
 * LPU-Nexus Environment Bootstrap
 * This must run at the absolute top of the entry point to ensure
 * environment variables are available to all subsequently loaded modules.
 */
(function initializeNexusGlobalEnv() {
  const g = (typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : ({} as any));
  
  // Initialize standard process.env structure
  g.process = g.process || { env: {} };
  g.process.env = g.process.env || {};

  const varsToBootstrap = ['API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];

  varsToBootstrap.forEach(varName => {
    try {
      const vitePrefix = `VITE_${varName}`;
      // @ts-ignore
      const vKey = import.meta.env ? import.meta.env[vitePrefix] : undefined;
      // @ts-ignore
      const aKey = import.meta.env ? import.meta.env[varName] : undefined;
      // @ts-ignore
      const pKey = (typeof process !== 'undefined' && process.env) ? process.env[varName] : undefined;
      
      const val = vKey || aKey || pKey;
      if (val) {
        g.process.env[varName] = val;
      }
    } catch (e) {
      // Fail silently for individual vars
    }
  });
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
