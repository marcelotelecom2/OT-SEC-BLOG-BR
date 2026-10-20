/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { LanguageProvider } from './context/LanguageContext';
import { PageLayout } from './components/layout/PageLayout';

const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Articles = lazy(() => import('./pages/Articles').then(module => ({ default: module.Articles })));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail').then(module => ({ default: module.ArticleDetail })));
const Research = lazy(() => import('./pages/Research').then(module => ({ default: module.Research })));
const Projects = lazy(() => import('./pages/Projects').then(module => ({ default: module.Projects })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

function RouteFallback() {
  return (
    <div role="status" aria-live="polite" className="min-h-[45vh] flex items-center justify-center px-4">
      <div className="font-mono text-xs tracking-[0.2em] text-cyan-400 animate-pulse">
        LOADING MODULE...
      </div>
    </div>
  );
}

function LegacyArticleRedirect() {
  const { slug = '' } = useParams();
  return <Navigate to={`/en/articles/${slug}`} replace />;
}

export default function App() {
  return (
    <LanguageProvider>
      <BlogProvider>
        <Router>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<PageLayout />}>
                <Route index element={<Home />} />
                <Route path="articles" element={<Articles />} />
                <Route path="articles/:slug" element={<LegacyArticleRedirect />} />
                <Route path="en/articles/:slug" element={<ArticleDetail routeLanguage="en" />} />
                <Route path="pt/articles/:slug" element={<ArticleDetail routeLanguage="pt" />} />
                <Route path="es/articles/:slug" element={<ArticleDetail routeLanguage="es" />} />
                <Route path="insights" element={<Research />} />
                <Route path="research" element={<Navigate to="/insights" replace />} />
                <Route path="projects" element={<Projects />} />
                <Route path="about" element={<About />} />
                <Route path="admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </BlogProvider>
    </LanguageProvider>
  );
}
