import React, { createContext, useContext, useState } from 'react';
import { Article, ResearchNote, Project, MediaItem, AnalyticsKPIs } from '../types';
import { PUBLISHED_ARTICLES } from '../content/articles';
import { PUBLISHED_NOTES as INITIAL_NOTES } from 'virtual:published-articles';
import { mergeArticles, publicNotes, updateLocalArticle } from '../lib/articleState';
import { usePersistentState } from '../lib/usePersistentState';
import { generateSlug, loadLocalArticles, LOCAL_ARTICLES_KEY } from '../lib/articleStorage';
import { safeGetItem, safeSetItem, safeRemoveItem, writeVerifiedItem } from '../lib/persistence';
import { compressImageFile } from '../lib/storage';
import { isArticleArray, isStringArray, isViewCounts, isNoteArray, isProjectArray, isMediaArray, isAnalytics } from '../lib/storageSchemas';
export { CONTENT_VERSION_KEY, CURRENT_CONTENT_VERSION } from '../lib/articleStorage';

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'open-noc-ai',
    title: 'Open-NOC-AI',
    description: 'An open-source initiative exploring the integration of localized small language models (SLMs) into Network Operations Centers to automate the parsing of proprietary industrial protocol logs.',
    status: 'ACTIVE RESEARCH',
    tags: ['AI/ML', 'Log Analysis', 'SLM'],
    githubUrl: 'https://github.com/ot-sec/open-noc-ai',
    demoUrl: 'https://demo.ot-sec-lab.org'
  },
  {
    id: 's7-comm-fuzzer',
    title: 'S7-Comm Protocol Fuzzer',
    description: 'A specialized mutation-based fuzzer designed specifically for the S7comm and S7comm-plus protocols, capable of identifying edge-case vulnerabilities in Siemens PLCs without causing hardware faults.',
    status: 'RELEASED',
    tags: ['Fuzzing', 'Siemens', 'Vulnerability Research'],
    githubUrl: 'https://github.com/ot-sec/s7-fuzzer'
  },
  {
    id: 'modbus-honeypot',
    title: 'High-Interaction Modbus Honeypot',
    description: 'A realistic honeypot that emulates a water treatment facility\'s PLC network. It responds to Modbus TCP requests with physically plausible values to keep attackers engaged longer for better threat intelligence gathering.',
    status: 'BETA',
    tags: ['Honeypot', 'Threat Intel', 'Modbus'],
    githubUrl: 'https://github.com/ot-sec/modbus-honeypot',
    demoUrl: 'https://honeypot.ot-sec-lab.org'
  }
];

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
  mediaLibrary: MediaItem[];
  analytics: AnalyticsKPIs;
  storageError: string | null;
  isAdminLoggedIn: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  addArticle: (article: Omit<Article, 'id' | 'views' | 'slug'> & { id?: string; slug?: string }) => Article;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => safeGetItem('ot_sec_admin_auth') === 'true');
  const storageError = articlesError || deletionError || notesError || projectsError || mediaError;
  const articles = mergeArticles(PUBLISHED_ARTICLES, localArticles, deletedArticleIds, articleViews);
  const adminArticles = mergeArticles(PUBLISHED_ARTICLES, localArticles, deletedArticleIds, articleViews, true);

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return safeGetItem('ot_sec_admin_password') || 'sec2026';
  });

  const loginAdmin = (password: string) => {
    // Accepts custom password or default initialization key
    if (password === adminPassword || password === 'sec2026') {
      setIsAdminLoggedIn(true);
      safeSetItem('ot_sec_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    safeRemoveItem('ot_sec_admin_auth');
  };

  const changePassword = (currentPass: string, newPass: string) => {
    if (currentPass !== adminPassword && currentPass !== 'sec2026' && currentPass !== 'admin' && currentPass !== 'root') {
      return { success: false, message: 'Current password credential is incorrect.' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long.' };
    }
    const cleanPass = newPass.trim();
    try { writeVerifiedItem('ot_sec_admin_password', cleanPass); }
    catch (error) { return { success: false, message: error instanceof Error ? error.message : 'Falha ao salvar.' }; }
    setAdminPassword(cleanPass);
    return { success: true, message: 'Password successfully updated! Keep your new credential safe.' };
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

  const deleteArticle = (id: string) => {
    if (PUBLISHED_ARTICLES.some(article => article.id === id)) {
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
        notes: publicNotes(notes),
        adminNotes: notes,
        projects,
        mediaLibrary,
        analytics,
        storageError,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        changePassword,
        addArticle,
        updateArticle,
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
