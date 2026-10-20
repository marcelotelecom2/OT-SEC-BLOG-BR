import React, { createContext, useContext, useEffect, useState } from 'react';
import { Article, ResearchNote, Project, MediaItem, AnalyticsKPIs } from '../types';
import { PUBLISHED_ARTICLES } from '../content/articles';
import { PUBLISHED_NOTES as INITIAL_NOTES, PUBLISHED_PROJECTS as INITIAL_PROJECTS } from 'virtual:published-articles';
import { mergeArticles, publicNotes, updateLocalArticle } from '../lib/articleState';
import { usePersistentState } from '../lib/usePersistentState';
import { generateSlug, loadLocalArticles, LOCAL_ARTICLES_KEY } from '../lib/articleStorage';
import { compressImageFile } from '../lib/storage';
import { adminApi } from '../lib/adminApi';
import { isArticleArray, isStringArray, isViewCounts, isNoteArray, isProjectArray, isMediaArray, isAnalytics } from '../lib/storageSchemas';
export { CONTENT_VERSION_KEY, CURRENT_CONTENT_VERSION } from '../lib/articleStorage';

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    name: 'stuxnet_architecture.png',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    type: 'image/png',
    size: '1.2 MB',
    uploadDate: '2026-07-22',
    dimensions: '1920x1080'
  },
  {
    id: 'm2',
    name: 'plc_backplane_capture.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    type: 'image/jpeg',
    size: '850 KB',
    uploadDate: '2026-07-15',
    dimensions: '1280x720'
  },
  {
    id: 'm3',
    name: 'ot_soc_dashboard_mock.png',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    type: 'image/png',
    size: '2.4 MB',
    uploadDate: '2026-07-10',
    dimensions: '2560x1440'
  }
];

const INITIAL_ANALYTICS: AnalyticsKPIs = {
  totalVisitors: 0,
  pageViews: 0,
  uniqueIPs: 0,
  avgTimeOnSite: '0m 00s',
  bounceRate: '0.0%',
  trafficSources: [
    { name: 'Direct (IP/Bookmark)', value: 0, color: '#06b6d4' },
    { name: 'Threat Intel Feeds', value: 0, color: '#3b82f6' },
    { name: 'Search Engines', value: 0, color: '#10b981' },
    { name: 'Academic Networks', value: 0, color: '#f43f5e' }
  ],
  hourlyTraffic: [
    { hour: '00:00', views: 0, visitors: 0 },
    { hour: '04:00', views: 0, visitors: 0 },
    { hour: '08:00', views: 0, visitors: 0 },
    { hour: '12:00', views: 0, visitors: 0 },
    { hour: '16:00', views: 0, visitors: 0 },
    { hour: '20:00', views: 0, visitors: 0 }
  ],
  pageViewCounts: {},
  recentEvents: []
};

interface BlogContextType {
  articles: Article[];
  adminArticles: Article[];
  notes: ResearchNote[];
  adminNotes: ResearchNote[];
  projects: Project[];
  adminProjects: Project[];
  mediaLibrary: MediaItem[];
  analytics: AnalyticsKPIs;
  storageError: string | null;
  isAdminLoggedIn: boolean;
  loginAdmin: (pass: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  updateArticle: (id: string, article: Partial<Article>) => void;
  saveArticle: (article: Article) => Promise<Article>;
  deleteArticle: (id: string) => Promise<void>;
  addNote: (note: Omit<ResearchNote, 'id'>) => void;
  updateNote: (id: string, note: Partial<ResearchNote>) => void;
  deleteNote: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  uploadImage: (file: File | { name: string; url: string; size: string; type: string }) => Promise<MediaItem>;
  deleteMedia: (id: string) => void;
  recordPageView: (path: string) => void;
  resetCounters: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [localArticles, setLocalArticles, articlesError] = usePersistentState<Article[]>(
    LOCAL_ARTICLES_KEY, [], isArticleArray, { load: loadLocalArticles });
  const [deletedArticleIds, setDeletedArticleIds, deletionError] = usePersistentState<string[]>(
    'ot_sec_deleted_article_ids', [], isStringArray);
  const [articleViews, setArticleViews] = usePersistentState<Record<string, number>>(
    'ot_sec_article_views', {}, isViewCounts, { bestEffort: true });
  const [notes, setNotes, notesError] = usePersistentState<ResearchNote[]>('ot_sec_notes', INITIAL_NOTES, isNoteArray);
  const [projects, setProjects, projectsError] = usePersistentState<Project[]>('ot_sec_projects', INITIAL_PROJECTS, isProjectArray);
  const [mediaLibrary, setMediaLibrary, mediaError] = usePersistentState<MediaItem[]>('ot_sec_media', INITIAL_MEDIA, isMediaArray);
  const [analytics, setAnalytics] = usePersistentState<AnalyticsKPIs>(
    'ot_sec_analytics', INITIAL_ANALYTICS, isAnalytics, { bestEffort: true });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const storageError = articlesError || deletionError || notesError || projectsError || mediaError;
  const articles = mergeArticles(PUBLISHED_ARTICLES, localArticles, deletedArticleIds, articleViews);
  const adminArticles = mergeArticles(PUBLISHED_ARTICLES, localArticles, deletedArticleIds, articleViews, true);

  useEffect(() => {
    adminApi.session().then(({ authenticated }) => {
      setIsAdminLoggedIn(authenticated);
      // Older versions treated deletion as a browser-only hide. Restore those rows so
      // the administrator can despublicá-las through the repository-backed action.
      if (authenticated) setDeletedArticleIds([], true);
    }).catch(() => setIsAdminLoggedIn(false));
  }, []);

  const loginAdmin = async (password: string) => {
    try {
      await adminApi.login(password);
      setIsAdminLoggedIn(true);
      setDeletedArticleIds([], true);
      return true;
    } catch { return false; }
  };

  const logoutAdmin = async () => {
    await adminApi.logout().catch(() => undefined);
    setIsAdminLoggedIn(false);
  };

  const changePassword = (currentPass: string, newPass: string) => {
    void currentPass; void newPass;
    return { success: false, message: 'A senha agora é gerenciada pelo segredo ADMIN_PASSWORD no Cloudflare Pages.' };
  };

  // Handlers
  const addArticle = (data: Omit<Article, 'id' | 'views' | 'slug'> & { id?: string; slug?: string }) => {
    const id = data.id || Date.now().toString();
    const slug = data.slug || generateSlug(data.title, id);
    const newArticle: Article = {
      ...data,
      id,
      slug,
      views: 0
    };
    setLocalArticles(prev => [newArticle, ...prev.filter(item => item.id !== newArticle.id)]);
    return newArticle;
  };

  const updateArticle = (id: string, updated: Partial<Article>) => {
    setLocalArticles(prev => updateLocalArticle(prev, PUBLISHED_ARTICLES, id, updated));
    if (updated.views !== undefined) {
      setArticleViews(prev => ({
        ...prev,
        [id]: updated.views!
      }));
    }
  };

  const saveArticle = async (article: Article) => {
    await adminApi.saveArticle(article);
    if (PUBLISHED_ARTICLES.some(item => item.id === article.id)) updateArticle(article.id, article);
    else setLocalArticles(previous => [article, ...previous.filter(item => item.id !== article.id)]);
    return article;
  };

  const deleteArticle = async (id: string) => {
    if (PUBLISHED_ARTICLES.some(article => article.id === id)) {
      await adminApi.deleteArticle(id);
      setDeletedArticleIds(previous => previous.includes(id) ? previous : [...previous, id]);
    } else {
      setLocalArticles(previous => previous.filter(article => article.id !== id));
    }
  };

  const addNote = (data: Omit<ResearchNote, 'id'>) => {
    const newNote: ResearchNote = {
      ...data,
      id: Date.now().toString()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, updated: Partial<ResearchNote>) => {
    setNotes(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(item => item.id !== id));
  };

  const addProject = (data: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...data,
      id: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || Date.now().toString()
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(item => item.id !== id));
  };

  const uploadImage = async (input: File | { name: string; url: string; size: string; type: string }): Promise<MediaItem> => {
    let newItem: MediaItem;

    if (input instanceof File) {
      const compressed = await compressImageFile(input);
      newItem = {
        id: Date.now().toString(),
        name: input.name,
        url: compressed.url,
        type: compressed.type || 'image/jpeg',
        size: compressed.sizeStr,
        uploadDate: new Date().toISOString().split('T')[0],
        dimensions: 'Responsive'
      };
    } else {
      newItem = {
        id: Date.now().toString(),
        name: input.name,
        url: input.url,
        type: input.type,
        size: input.size,
        uploadDate: new Date().toISOString().split('T')[0],
        dimensions: '1920x1080'
      };
    }

    setMediaLibrary(prev => [newItem, ...prev]);
    return newItem;
  };

  const deleteMedia = (id: string) => {
    setMediaLibrary(prev => prev.filter(item => item.id !== id));
  };

  /**
   * Browser-Local Telemetry:
   * In this client-side single page app (no database, no remote analytics backend),
   * recordPageView operates strictly as a local counter stored in the client's localStorage.
   * It reflects only interactions performed within the current browser instance and is NOT
   * a global or server-wide visitor metric.
   */
  const recordPageView = (path: string) => {
    setAnalytics(prev => {
      const pageViews = prev.pageViews + 1;
      const pageViewCounts = {
        ...prev.pageViewCounts,
        [path]: (prev.pageViewCounts[path] || 0) + 1
      };
      
      const newEvent = {
        id: Date.now().toString(),
        time: 'Just now',
        event: `PAGE_VIEW: ${path}`,
        ip: `${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        location: 'Active Session'
      };

      return {
        ...prev,
        pageViews,
        pageViewCounts,
        recentEvents: [newEvent, ...prev.recentEvents.slice(0, 9)]
      };
    });
  };

  const resetCounters = () => {
    const zeroViews = Object.fromEntries(adminArticles.map(article => [article.id, 0]));
    setArticleViews(zeroViews, true);

    const zeroAnalytics: AnalyticsKPIs = {
      totalVisitors: 0,
      pageViews: 0,
      uniqueIPs: 0,
      avgTimeOnSite: '0m 00s',
      bounceRate: '0.0%',
      trafficSources: [
        { name: 'Direct (IP/Bookmark)', value: 0, color: '#06b6d4' },
        { name: 'Threat Intel Feeds', value: 0, color: '#3b82f6' },
        { name: 'Search Engines', value: 0, color: '#10b981' },
        { name: 'Academic Networks', value: 0, color: '#f43f5e' }
      ],
      hourlyTraffic: [
        { hour: '00:00', views: 0, visitors: 0 },
        { hour: '04:00', views: 0, visitors: 0 },
        { hour: '08:00', views: 0, visitors: 0 },
        { hour: '12:00', views: 0, visitors: 0 },
        { hour: '16:00', views: 0, visitors: 0 },
        { hour: '20:00', views: 0, visitors: 0 }
      ],
      pageViewCounts: {},
      recentEvents: []
    };

    setAnalytics(zeroAnalytics, true);
  };

  return (
    <BlogContext.Provider
      value={{
        articles,
        adminArticles,
        // Public notes follow the reviewed deployment. Browser copies remain in
        // adminNotes so stale template entries cannot reappear after unpublishing.
        notes: publicNotes(INITIAL_NOTES),
        adminNotes: notes,
        // Public projects follow the reviewed deployment, never stale browser seeds.
        projects: INITIAL_PROJECTS,
        adminProjects: projects,
        mediaLibrary,
        analytics,
        storageError,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        changePassword,
        updateArticle,
        saveArticle,
        deleteArticle,
        addNote,
        updateNote,
        deleteNote,
        addProject,
        updateProject,
        deleteProject,
        uploadImage,
        deleteMedia,
        recordPageView,
        resetCounters
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
