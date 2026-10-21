import type { ArticleLanguage, RadarPublication } from '../types';

export const RADAR_TYPES = ['news', 'vulnerability', 'advisory', 'incident', 'regulation'] as const;
const languages = ['en', 'pt', 'es'] as const;

export function originalSourceUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

/** The same editorial validation runs in the form, API and production build. */
export function validateRadarPublication(value: unknown): RadarPublication {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid Radar publication.');
  const input = value as Record<string, any>;
  if (typeof input.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(input.id)) throw new Error('Invalid Radar ID.');
  if (!RADAR_TYPES.includes(input.type)) throw new Error('Invalid Radar type.');
  if (typeof input.published !== 'boolean' || !languages.includes(input.sourceLanguage)) throw new Error('Invalid publication status or language.');
  const fields = ['title', 'date', 'sourceName', 'sourceUrl', 'comment'] as const;
  for (const field of fields) {
    if (typeof input[field] !== 'string' || (input.published && !input[field].trim())) throw new Error(`Required field: ${field}.`);
  }
  if (input.date && (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || Number.isNaN(Date.parse(input.date))
    || new Date(input.date).toISOString().slice(0, 10) !== input.date)) throw new Error('Invalid date (YYYY-MM-DD).');
  if (input.sourceUrl && !originalSourceUrl(input.sourceUrl)) throw new Error('The original source requires an absolute HTTP(S) URL.');
  if (input.title.length > 240 || input.comment.length > 2000) throw new Error('Title or technical comment is too long.');
  const publication: RadarPublication = {
    id: input.id, type: input.type, published: input.published, sourceLanguage: input.sourceLanguage,
    title: input.title.trim(), date: input.date, sourceName: input.sourceName.trim(),
    sourceUrl: input.sourceUrl.trim(), comment: input.comment.trim(),
  };
  if (input.translations !== undefined) {
    if (!input.translations || typeof input.translations !== 'object' || Array.isArray(input.translations)) throw new Error('Invalid translations.');
    publication.translations = {};
    for (const [language, raw] of Object.entries(input.translations)) {
      const translation = raw as Record<string, unknown>;
      if (!languages.includes(language as ArticleLanguage) || language === input.sourceLanguage
        || !translation || typeof translation !== 'object'
        || typeof translation.title !== 'string' || typeof translation.comment !== 'string') throw new Error('Invalid translation.');
      if (!translation.title.trim() && !translation.comment.trim()) continue;
      if (!translation.title.trim() || !translation.comment.trim() || translation.title.length > 240 || translation.comment.length > 2000) throw new Error('Complete the translated title and comment.');
      publication.translations[language as ArticleLanguage] = { title: translation.title.trim(), comment: translation.comment.trim() };
    }
  }
  return publication;
}

export function parseRadarSource(source: string): RadarPublication[] {
  const value: unknown = JSON.parse(source);
  if (!Array.isArray(value)) throw new Error('Invalid Radar registry.');
  const entries = value.map(validateRadarPublication);
  if (new Set(entries.map(item => item.id)).size !== entries.length) throw new Error('Duplicate Radar ID.');
  return entries;
}

export function publicRadar(entries: RadarPublication[]): RadarPublication[] {
  return entries.filter(item => item.published === true).sort((a, b) => b.date.localeCompare(a.date));
}

export function localizeRadar(item: RadarPublication, language: ArticleLanguage): RadarPublication {
  const translation = item.translations?.[language];
  return translation && language !== item.sourceLanguage ? { ...item, ...translation, sourceLanguage: language } : item;
}
