/// <reference types="vite/client" />

declare module 'virtual:published-articles' {
  export const PUBLISHED_ARTICLES: import('./types').Article[];
  export const PUBLISHED_NOTES: import('./types').ResearchNote[];
  export const ARTICLE_TRANSLATIONS: Record<string, Record<'en' | 'pt' | 'es', { title: string; summary: string }>>;
}

declare module '*.md?raw' {
  const content: string;
  export default content;
}
