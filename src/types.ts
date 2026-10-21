export type ArticleLanguage = 'en' | 'pt' | 'es';
export type ArticleCategory = 'standards' | 'papers' | 'technical';

export type RadarType = 'news' | 'vulnerability' | 'advisory' | 'incident' | 'regulation';
export interface RadarPublication {
  id: string;
  type: RadarType;
  title: string;
  date: string;
  sourceName: string;
  sourceUrl: string;
  comment: string;
  published: boolean;
  sourceLanguage: ArticleLanguage;
  translations?: Partial<Record<ArticleLanguage, { title: string; comment: string }>>;
}

export interface ArticleTranslation {
  title: string;
  summary: string;
  /** When omitted, the canonical body is shown with an explicit language notice. */
  content?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  area: string;
  category?: ArticleCategory;
  readTime: string;
  date: string;
  coverImage?: string;
  published: boolean;
  views?: number;
  author?: string;
  updatedAt?: string;
  tags?: string[];
  /** Language of title, summary and content stored in the canonical fields. */
  sourceLanguage?: ArticleLanguage;
  /** Optional article-owned versions. Missing content means metadata-only translation. */
  translations?: Partial<Record<ArticleLanguage, ArticleTranslation>>;
}

export type ContentType =
  | 'Paper Review'
  | 'News Analysis'
  | 'Technology Watch'
  | 'Regulation Update'
  | 'Vulnerability Analysis'
  | 'Industry Watch';

export interface ResearchNote {
  id: string;
  title?: string;
  date: string;
  summary?: string;
  content: string;
  contentType?: ContentType | string;
  tag: string;
  tags?: string[];
  sourceName?: string;
  sourceUrl?: string;
  author?: string;
  published?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE RESEARCH' | 'RELEASED' | 'BETA' | 'CONCEPT' | 'IN DEVELOPMENT';
  /** Only explicitly reviewed repository entries are published. */
  published?: boolean;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  coverImage?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  uploadDate: string;
  dimensions?: string;
}

export interface AnalyticsKPIs {
  totalVisitors: number;
  pageViews: number;
  uniqueIPs: number;
  avgTimeOnSite: string;
  bounceRate: string;
  trafficSources: { name: string; value: number; color: string }[];
  hourlyTraffic: { hour: string; views: number; visitors: number }[];
  pageViewCounts: Record<string, number>;
  recentEvents: { id: string; time: string; event: string; ip: string; location: string }[];
}
