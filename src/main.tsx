import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

async function bootstrap() {
  // Keep the complete prerendered article visible until its interactive route is ready.
  // This avoids replacing useful HTML with the Suspense fallback during hydration startup.
  if (/^\/(?:en|pt|es)\/articles\/[^/]+\/?$/.test(window.location.pathname)) {
    await import('./pages/ArticleDetail');
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
