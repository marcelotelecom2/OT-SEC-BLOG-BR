import type { Article } from '../types';
import { isArticleArray } from './storageSchemas';
import { preserveRawItem, readStoredJson, removeVerifiedItem, safeSetItem, writeVerifiedItem, type StoredValue } from './persistence';

export const CONTENT_VERSION_KEY = 'ot_sec_content_version';
export const CURRENT_CONTENT_VERSION = '3.0.0-verified-storage';
export const LOCAL_ARTICLES_KEY = 'ot_sec_local_articles';
export const LEGACY_ARTICLES_KEY = 'ot_sec_articles';

export function generateSlug(title: string, id: string): string {
  return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `article-${id}`;
}

function normalize(article: Article): Article {
  return { ...article, slug: article.slug || generateSlug(article.title, article.id),
    summary: article.summary ?? '', content: article.content ?? '', area: article.area ?? 'ICS Security',
    readTime: article.readTime ?? '', date: article.date ?? '', published: article.published === true, views: article.views ?? 0 };
}

/** Recover before cleanup; keep originals whenever any read, backup or verified write fails. */
export function loadLocalArticles(): StoredValue<Article[]> {
  const current = readStoredJson(LOCAL_ARTICLES_KEY, [], isArticleArray);
  const legacy = readStoredJson(LEGACY_ARTICLES_KEY, [], isArticleArray);
  const local = current.value.map(normalize);
  const existingIds = new Set(local.map(article => article.id));
  const recovered = legacy.value.map(normalize);
  const merged = [...local, ...recovered.filter(article => !existingIds.has(article.id))];
  const initial = { ...current, value: merged, error: current.error || legacy.error };
  if (legacy.storedRaw === null || current.error || legacy.error) return initial;
  try {
    // Colliding IDs may contain different editorial work. Keep the entire legacy version as a backup.
    if (recovered.some(article => existingIds.has(article.id))) preserveRawItem(LEGACY_ARTICLES_KEY, legacy.storedRaw);
    if (globalThis.localStorage.getItem(LOCAL_ARTICLES_KEY) !== current.storedRaw) throw new Error('Concurrent migration');
    const raw = JSON.stringify(merged);
    writeVerifiedItem(LOCAL_ARTICLES_KEY, raw);
    if (globalThis.localStorage.getItem(LEGACY_ARTICLES_KEY) !== legacy.storedRaw) throw new Error('Legacy data changed');
    removeVerifiedItem(LEGACY_ARTICLES_KEY);
    safeSetItem(CONTENT_VERSION_KEY, CURRENT_CONTENT_VERSION);
    return { value: merged, storedRaw: raw, error: null };
  } catch {
    // The current write may have succeeded before cleanup failed; reread its revision for subsequent saves.
    const persisted = readStoredJson(LOCAL_ARTICLES_KEY, [], isArticleArray);
    return { ...initial, storedRaw: persisted.storedRaw,
      error: 'A recuperação dos dados antigos ficou pendente. Os originais foram mantidos; exporte uma cópia local antes de fechar.' };
  }
}
