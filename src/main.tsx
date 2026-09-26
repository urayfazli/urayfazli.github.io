import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {LanguageProvider} from './context/LanguageContext.tsx';
import {initWebCachingSystem} from './utils/cacheManager.ts';
import './index.css';

initWebCachingSystem();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
