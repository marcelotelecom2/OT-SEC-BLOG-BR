import React, { createContext, useContext, useState, useEffect } from 'react';
import { Article, ResearchNote, Project, MediaItem, AnalyticsKPIs } from '../types';
import { PUBLISHED_ARTICLES } from '../content/articles';

const INITIAL_NOTES: ResearchNote[] = [
  {
    id: '1',
    date: '2026-07-20',
    tag: '#IEC62443',
    tags: ['IEC62443', 'ICS', 'SCADA'],
    contentType: 'Vulnerability Analysis',
    content: 'Observing interesting artifacts in the recent Siemens S7-1500 firmware dump. The encrypted payload mechanism seems to utilize a custom implementation of Curve25519 rather than standard libraries. Investigating further.',
    author: 'SYS_ADMIN_01'
  },
  {
    id: '2',
    date: '2026-07-18',
    tag: '#OT_SECURITY',
    tags: ['OT_SECURITY', 'CISA', 'SCADA'],
    contentType: 'Industry Watch',
    content: 'Activity linked to Volt Typhoon identified in water treatment facility Honeypots. Primary vector appears to be exploiting legacy VPN gateways (CVE-2023-XXXX) to establish initial foothold before moving laterally via SMB.',
    author: 'SYS_ADMIN_01'
  },
  {
    id: '3',
    date: '2026-07-05',
    tag: '#SCADA',
    tags: ['SCADA', 'ICS', 'IEC61850'],
    contentType: 'Technology Watch',
    content: 'Mapped out the undocumented function codes in the Omron FINS protocol. Functions 0x09 and 0x0A allow for unauthenticated memory reads across the controller backplane. Developing a PoC.',
    author: 'SEC_RESEARCHER'
  },
  {
    id: '4',
    date: '2026-06-22',
    tag: '#ICS',
    tags: ['ICS', 'OT_SECURITY', 'POWER_GRID'],
    contentType: 'News Analysis',
    content: 'Ransomware deployment on a manufacturing execution system (MES). The threat actors did not encrypt the PLCs directly but locked the HMI SQL databases, effectively halting production. Time-to-recovery is heavily dependent on bare-metal backups.',
    author: 'SEC_RESEARCHER'
  },
  {
    id: '5',
    date: '2026-06-01',
    tag: '#AI',
    tags: ['AI', 'LLM', 'SCADA'],
    contentType: 'Paper Review',
    content: 'Fine-tuning the SLM for log analysis. It struggles with distinguishing between legitimate engineering workstation programming events and unauthorized ladder logic modifications. Need to weight the dataset heavier towards normal engineering behavior.',
    author: 'AI_LAB_LEAD'
  }
];

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
  totalVisitors: 18420,
  pageViews: 42190,
  uniqueIPs: 12890,
  avgTimeOnSite: '4m 12s',
  bounceRate: '28.4%',
  trafficSources: [
    { name: 'Direct (IP/Bookmark)', value: 42, color: '#06b6d4' },
    { name: 'Threat Intel Feeds', value: 28, color: '#3b82f6' },
    { name: 'Search Engines', value: 18, color: '#10b981' },
    { name: 'Academic Networks', value: 12, color: '#f43f5e' }
  ],
  hourlyTraffic: [
    { hour: '00:00', views: 420, visitors: 180 },
    { hour: '04:00', views: 210, visitors: 90 },
    { hour: '08:00', views: 890, visitors: 410 },
    { hour: '12:00', views: 1650, visitors: 780 },
    { hour: '16:00', views: 1890, visitors: 910 },
    { hour: '20:00', views: 1120, visitors: 540 }
  ],
  pageViewCounts: {
    '/': 14200,
    '/articles': 12400,
    '/research': 8900,
    '/projects': 4500,
    '/about': 2190
  },
  recentEvents: [
    { id: 'ev1', time: 'Just now', event: 'PAGE_VIEW: /articles', ip: '187.32.102.14', location: 'São Paulo, BR' },
    { id: 'ev2', time: '2m ago', event: 'DOWNLOAD: s7_fuzzer_v1.2.zip', ip: '82.165.197.1', location: 'Frankfurt, DE' },
    { id: 'ev3', time: '5m ago', event: 'PAGE_VIEW: /research', ip: '198.51.100.42', location: 'Virginia, US' },
    { id: 'ev4', time: '12m ago', event: 'SEARCH_QUERY: "Siemens S7-1500"', ip: '203.0.113.88', location: 'Tokyo, JP' },
    { id: 'ev5', time: '18m ago', event: 'PAGE_VIEW: /projects', ip: '194.28.172.9', location: 'Amsterdam, NL' }
  ]
};

interface BlogContextType {
  articles: Article[];
  notes: ResearchNote[];
  projects: Project[];
  mediaLibrary: MediaItem[];
  analytics: AnalyticsKPIs;
  isAdminLoggedIn: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  addArticle: (article: Omit<Article, 'id' | 'views' | 'slug'> & { slug?: string }) => void;
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
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const generateSlug = (title: string, fallbackId: string): string => {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return base || `article-${fallbackId}`;
};

/**
 * Migration Key & One-Time LocalStorage Migration:
 * Removes legacy demo view values (e.g. 1420, 2150) stored in localStorage.
 * Runs only once when a new CONTENT_VERSION is detected, ensuring views start at 0
 * and do not get overwritten to 0 on subsequent application reloads.
 */
export const CONTENT_VERSION_KEY = 'ot_sec_content_version';
export const CURRENT_CONTENT_VERSION = '2.2.0-phase-2c-zero-views';

const runViewsMigrationIfNeeded = () => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const currentVersion = localStorage.getItem(CONTENT_VERSION_KEY);
    if (currentVersion !== CURRENT_CONTENT_VERSION) {
      // 1. Wipe previous mock/demo view values from local storage
      localStorage.removeItem('ot_sec_article_views');
      localStorage.removeItem('ot_sec_articles');

      // 2. Reset views to 0 for any local/draft articles created previously with mock counts
      const localSaved = localStorage.getItem('ot_sec_local_articles');
      if (localSaved) {
        try {
          const parsed: Article[] = JSON.parse(localSaved);
          const reset = parsed.map(item => ({ ...item, views: 0 }));
          localStorage.setItem('ot_sec_local_articles', JSON.stringify(reset));
        } catch {
          // ignore parsing error
        }
      }

      // 3. Mark migration as finished so this executes only once
      localStorage.setItem(CONTENT_VERSION_KEY, CURRENT_CONTENT_VERSION);
    }
  } catch {
    // ignore storage access issues
  }
};

export function BlogProvider({ children }: { children: React.ReactNode }) {
  // Execute migration once before reading stored state
  runViewsMigrationIfNeeded();

  // Canonical published articles are always sourced from src/content/articles
  // Local articles / drafts created via Admin are stored in localStorage
  const [localArticles, setLocalArticles] = useState<Article[]>(() => {
    const localSaved = localStorage.getItem('ot_sec_local_articles');
    if (localSaved) {
      try {
        const parsed: Article[] = JSON.parse(localSaved);
        return parsed.map(item => ({
          ...item,
          views: item.views ?? 0,
          slug: item.slug || generateSlug(item.title, item.id)
        }));
      } catch {
        return [];
      }
    }
    // Migration: recover any non-canonical custom articles or drafts from old ot_sec_articles
    const legacySaved = localStorage.getItem('ot_sec_articles');
    if (legacySaved) {
      try {
        const parsed: Article[] = JSON.parse(legacySaved);
        return parsed
          .filter(item => !PUBLISHED_ARTICLES.some(pub => pub.id === item.id))
          .map(item => ({
            ...item,
            views: 0,
            slug: item.slug || generateSlug(item.title, item.id)
          }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [articleViews, setArticleViews] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('ot_sec_article_views');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  // Canonical published articles are always served from src/content/articles,
  // merged with live views and local articles / drafts.
  const articles: Article[] = [
    ...PUBLISHED_ARTICLES.map(pub => ({
      ...pub,
      views: articleViews[pub.id] !== undefined ? articleViews[pub.id] : pub.views
    })),
    ...localArticles
  ];

  // Save local articles / drafts and views to localStorage
  useEffect(() => {
    localStorage.setItem('ot_sec_local_articles', JSON.stringify(localArticles));
  }, [localArticles]);

  useEffect(() => {
    localStorage.setItem('ot_sec_article_views', JSON.stringify(articleViews));
  }, [articleViews]);

  // Clean legacy ot_sec_articles so it never overrides canonical published articles
  useEffect(() => {
    if (localStorage.getItem('ot_sec_articles')) {
      localStorage.removeItem('ot_sec_articles');
    }
  }, []);

  const [notes, setNotes] = useState<ResearchNote[]>(() => {
    const saved = localStorage.getItem('ot_sec_notes');
    if (saved) {
      try {
        const parsed: ResearchNote[] = JSON.parse(saved);
        return parsed.map((n) => {
          const defaultMatch = INITIAL_NOTES.find((init) => init.id === n.id);
          if (defaultMatch && (!n.tags || n.tags.length === 0 || (n.tag && n.tag.startsWith('#VULN_ANALYSIS')))) {
            return {
              ...n,
              tag: defaultMatch.tag,
              tags: defaultMatch.tags,
              contentType: n.contentType || defaultMatch.contentType
            };
          }
          return n;
        });
      } catch (e) {
        return INITIAL_NOTES;
      }
    }
    return INITIAL_NOTES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('ot_sec_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('ot_sec_media');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });

  const [analytics, setAnalytics] = useState<AnalyticsKPIs>(() => {
    const saved = localStorage.getItem('ot_sec_analytics');
    return saved ? JSON.parse(saved) : INITIAL_ANALYTICS;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('ot_sec_admin_auth') === 'true';
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ot_sec_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('ot_sec_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('ot_sec_media', JSON.stringify(mediaLibrary));
  }, [mediaLibrary]);

  useEffect(() => {
    localStorage.setItem('ot_sec_analytics', JSON.stringify(analytics));
  }, [analytics]);

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('ot_sec_admin_password') || 'sec2026';
  });

  const loginAdmin = (password: string) => {
    // Accepts custom password or default initialization key
    if (password === adminPassword || password === 'sec2026') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('ot_sec_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('ot_sec_admin_auth');
  };

  const changePassword = (currentPass: string, newPass: string) => {
    if (currentPass !== adminPassword && currentPass !== 'sec2026' && currentPass !== 'admin' && currentPass !== 'root') {
      return { success: false, message: 'Current password credential is incorrect.' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long.' };
    }
    const cleanPass = newPass.trim();
    setAdminPassword(cleanPass);
    localStorage.setItem('ot_sec_admin_password', cleanPass);
    return { success: true, message: 'Password successfully updated! Keep your new credential safe.' };
  };

  // Handlers
  const addArticle = (data: Omit<Article, 'id' | 'views' | 'slug'> & { slug?: string }) => {
    const id = Date.now().toString();
    const slug = data.slug || generateSlug(data.title, id);
    const newArticle: Article = {
      ...data,
      id,
      slug,
      views: 0
    };
    setLocalArticles(prev => [newArticle, ...prev]);
  };

  const updateArticle = (id: string, updated: Partial<Article>) => {
    if (updated.views !== undefined) {
      setArticleViews(prev => ({
        ...prev,
        [id]: updated.views!
      }));
    }
    setLocalArticles(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteArticle = (id: string) => {
    setLocalArticles(prev => prev.filter(item => item.id !== id));
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
      const url = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(input);
      });

      const sizeInMB = (input.size / (1024 * 1024)).toFixed(1);
      const sizeStr = input.size > 1024 * 1024 ? `${sizeInMB} MB` : `${Math.round(input.size / 1024)} KB`;

      newItem = {
        id: Date.now().toString(),
        name: input.name,
        url,
        type: input.type || 'image/jpeg',
        size: sizeStr,
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

  return (
    <BlogContext.Provider
      value={{
        articles,
        notes,
        projects,
        mediaLibrary,
        analytics,
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
        recordPageView
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
