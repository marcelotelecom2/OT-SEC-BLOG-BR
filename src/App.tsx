/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { PageLayout } from './components/layout/PageLayout';
import { Home } from './pages/Home';
import { Articles } from './pages/Articles';
import { ArticleDetail } from './pages/ArticleDetail';
import { Research } from './pages/Research';
import { Projects } from './pages/Projects';
import { About } from './pages/About';
import { Admin } from './pages/Admin';

export default function App() {
  return (
    <BlogProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PageLayout />}>
            <Route index element={<Home />} />
            <Route path="articles" element={<Articles />} />
            <Route path="articles/:id" element={<ArticleDetail />} />
            <Route path="research" element={<Research />} />
            <Route path="projects" element={<Projects />} />
            <Route path="about" element={<About />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </BlogProvider>
  );
}
