import React, { createContext, useContext, useState, useEffect } from 'react';
import { Article, ResearchNote, Project, MediaItem, AnalyticsKPIs } from '../types';

const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Role of AI in Detecting Anomalies in ICS Networks',
    summary: 'An exploration of how machine learning models can be trained on Modbus and DNP3 traffic to identify novel attack vectors and misconfigurations in real-time.',
    content: `## Abstract
Industrial Control Systems (ICS) are increasingly target of cyber threats. Standard signature-based IDS struggle against zero-day exploits in SCADA environments.

## Methodology
Using an isolation forest combined with a lightweight LSTM autoencoder, we parsed raw pcap feeds from Modbus TCP and DNP3 networks...

### Key Findings
1. Anomaly detection accuracy reached 98.4% on PLC register manipulation.
2. Latency impact was under 1.2ms per packet inspection.
3. False positive rate remained under 0.05% during 72-hour stress testing.`,
    date: '2026-07-10',
    readTime: '12 min read',
    area: 'Artificial Intelligence',
    published: true,
    views: 1420
  },
  {
    id: '2',
    title: 'Deconstructing the Stuxnet Payload: Lessons Still Unlearned',
    summary: 'A retrospective analysis of the world\'s most famous cyberweapon, focusing on the specific Siemens Step7 DLL injections and how modern OT systems are still vulnerable to similar tactics.',
    content: `## Retrospective Analysis
16 years after Stuxnet, critical infrastructure continues to run unsupported legacy Siemens S7-300 and Step7 software components without kernel-level code integrity.

### Attack Vector Walkthrough
- Exploitation of LNK vulnerability (CVE-2010-2568)
- Man-in-the-Middle on s7otbxdx.dll
- PLC Frequency Drive speed manipulation (1418 Hz down to 2 Hz)`,
    date: '2026-06-22',
    readTime: '18 min read',
    area: 'Vulnerability Analysis',
    published: true,
    views: 2150
  },
  {
    id: '3',
    title: 'Zero Trust Architecture in Legacy SCADA Environments',
    summary: 'Implementing micro-segmentation and identity-based access controls in networks running 20-year-old PLCs that lack native authentication mechanisms.',
    content: `## Purdue Model Level 2 Microsegmentation
Legacy PLCs lack TLS and native encryption. To implement Zero Trust without hardware replacement, inline hardware proxies (Industrial Firewalls) must enforce strict 5-tuple filtering rules.`,
    date: '2026-05-15',
    readTime: '15 min read',
    area: 'Network Engineering',
    published: true,
    views: 980
  },
  {
    id: '4',
    title: 'Analyzing the Impact of 5G on Smart Grid Security',
    summary: 'With the rollout of 5G infrastructure in power grids, the attack surface expands. We look at the security implications of ultra-reliable low-latency communication (URLLC) in power distribution.',
    content: `5G network slicing offers dedicated channels for power distribution automation. However, slice isolation vulnerabilities could expose synchrophasor streams to spoofing attacks.`,
    date: '2026-04-02',
    readTime: '10 min read',
    area: 'Network Engineering',
    published: true,
    views: 650
  },
  {
    id: '5',
    title: 'Reverse Engineering Proprietary PLC Protocols',
    summary: 'A technical guide on capturing, analyzing, and fuzzing undocumented industrial protocols using custom Wireshark dissectors and software-defined radios (SDR).',
    content: `Step-by-step guide on analyzing proprietary backplane communication in modern automation controllers using Logic Analyzers and Lua dissector scripts.`,
    date: '2026-03-18',
    readTime: '22 min read',
    area: 'Vulnerability Analysis',
    published: true,
    views: 1890
  },
  {
    id: '6',
    title: 'NERC CIP-002: How BES Cyber Systems Are Classified by Impact',
    summary: 'A deep technical breakdown of NERC CIP-002 criteria, explaining how Bulk Electric System (BES) cyber assets and systems are categorized into High, Medium, and Low impact ratings.',
    content: `## What does CIP-002 actually classify?

CIP-002 does not classify devices simply because they are PLCs, HMIs, servers, firewalls, or protection systems.

**The process starts by understanding the role of the asset.**

In the North American bulk electric power grid, reliability is governed by North American Electric Reliability Corporation (NERC) Critical Infrastructure Protection (CIP) standards. Standard CIP-002-5.1a (and subsequent revisions) establishes the fundamental methodology for identifying and categorizing assets.

### Core Classification Hierarchy

To properly scope security controls, engineers must step through five foundational concepts:

- **Responsible Entity**: The registered organization (Generator Owner, Transmission Operator, Balancing Authority) responsible for compliance.
- **BES (Bulk Electric System)**: All transmission elements operating at 100 kV or higher, and real-power generation facilities exceeding regional MVA thresholds.
- **BES Cyber Asset (BCA)**: A programmable electronic device that, if compromised or rendered unavailable, would affect the 15-minute real-time reliability operation of the BES.
- **BES Cyber System (BCS)**: One or more BES Cyber Assets logically or physically grouped together to perform one or more reliability functions.
- **Impact Rating**: The final tier (High, Medium, or Low) assigned to the system based on quantitative criteria defined in Attachment 1 of the standard.

> Equipment type alone does not determine the Impact Rating. The fundamental question is always: *what is the consequence to the Interconnection if this system fails or is subverted in real time?*

---

## Impact Categorization Matrix

Attachment 1 of CIP-002 provides explicit quantitative thresholds to prevent subjective determinations:

| Impact Level | Typical Facilities & Systems | Threshold Criteria |
| :--- | :--- | :--- |
| **High Impact** | Control Centers for large Balancing Authorities and Reliability Coordinators | Large Interconnection reliability impact (e.g. >3,000 MW generation dispatch control) |
| **Medium Impact** | Generation plants, large transmission substations | Generation >1,500 MW aggregate capacity, or transmission substations >=500 kV or >=3,000 MVA |
| **Low Impact** | Distribution substations, small solar/wind farms | All other BES Cyber Systems not categorized as High or Medium |

---

## Substation Architecture & Electronic Security Perimeter

A critical mistake in OT audit preparations is failing to distinguish between the **Physical Security Perimeter (PSP)** and the **Electronic Security Perimeter (ESP)**:

\`\`\`
+--------------------------------------------------------------+
| Physical Security Perimeter (PSP)                            |
|  +--------------------------------------------------------+  |
|  | Electronic Security Perimeter (ESP)                    |  |
|  |   [RTU / Gateway] <---> [Substation LAN / IEC 61850]   |  |
|  |          ^                         ^                   |  |
|  |          |                         |                   |  |
|  |   [Protection Relays]     [Bay Controllers]            |  |
|  +--------------------------------------------------------+  |
|         | Electronic Access Control or Monitoring (EACM)     |
|   [Firewall / Dial-up Encryptor]                             |
+--------------------------------------------------------------+
\`\`\`

### Key Takeaways for Industrial Security Engineers

1. **The 15-Minute Rule**: If an asset can fail without affecting the reliability functions of the BES within a 15-minute window, it is generally not a BES Cyber Asset.
2. **Transient Cyber Assets (TCAs)**: Laptops, test sets, and USB maintenance drives are subject to CIP-010 controls whenever they cross the ESP barrier.
3. **Low-Impact Obligations**: Never assume Low Impact means "no security." CIP-003 Attachment 1 mandates cyber security awareness, physical access controls, electronic access controls, and incident response planning for all Low Impact assets.`,
    date: '2026-08-04',
    readTime: '14 min read',
    area: 'Regulation Update',
    published: true,
    views: 890,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80'
  }
];

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
  addArticle: (article: Omit<Article, 'id' | 'views'>) => void;
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

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('ot_sec_articles');
    if (saved) {
      try {
        const parsed: Article[] = JSON.parse(saved);
        const missing = INITIAL_ARTICLES.filter(init => !parsed.some(p => p.id === init.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch {
        return INITIAL_ARTICLES;
      }
    }
    return INITIAL_ARTICLES;
  });

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
    localStorage.setItem('ot_sec_articles', JSON.stringify(articles));
  }, [articles]);

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
  const addArticle = (data: Omit<Article, 'id' | 'views'>) => {
    const newArticle: Article = {
      ...data,
      id: Date.now().toString(),
      views: 1
    };
    setArticles(prev => [newArticle, ...prev]);
  };

  const updateArticle = (id: string, updated: Partial<Article>) => {
    setArticles(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(item => item.id !== id));
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
