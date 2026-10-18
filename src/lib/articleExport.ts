import type { Article } from '../types';
import { sanitizeImageUrl } from './sanitizeUrl';

export interface ArticleExport {
  format: 'ot-sec-article';
  version: 1;
  article: Article;
}

/** Shared validation for browser downloads and the local publication command. */
export function parseArticleExport(value: unknown): ArticleExport {
  if (!value || typeof value !== 'object') throw new Error('Arquivo de artigo inválido.');
  const packet = value as Record<string, unknown>;
  if (packet.format !== 'ot-sec-article' || packet.version !== 1) {
    throw new Error('Formato de exportação não reconhecido.');
  }
  if (!packet.article || typeof packet.article !== 'object') throw new Error('Artigo ausente.');
  const source = packet.article as Record<string, unknown>;
  const required = ['id', 'slug', 'title', 'summary', 'content', 'area', 'readTime', 'date'] as const;
  for (const field of required) {
    if (typeof source[field] !== 'string' || !source[field].trim()) {
      throw new Error(`Campo obrigatório: ${field}.`);
    }
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.slug as string)) {
    throw new Error('O slug deve conter apenas letras minúsculas, números e hífens.');
  }
  for (const field of ['date', 'updatedAt']) {
    const date = source[field];
    if (date !== undefined && (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)
      || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)) {
      throw new Error(`Data inválida: ${field}. Use AAAA-MM-DD.`);
    }
  }
  if (typeof source.published !== 'boolean') throw new Error('Status de publicação inválido.');
  for (const field of ['coverImage', 'author']) {
    if (source[field] !== undefined && typeof source[field] !== 'string') {
      throw new Error(`Campo inválido: ${field}.`);
    }
  }
  if (source.tags !== undefined && (!Array.isArray(source.tags)
    || source.tags.some(tag => typeof tag !== 'string'))) throw new Error('Tags inválidas.');
  if (source.coverImage && !sanitizeImageUrl(source.coverImage as string)) {
    throw new Error('URL da imagem de capa inválida.');
  }

  // Explicitly copy editorial fields. Browser counters and runtime fields are not published.
  const article: Article = {
    id: (source.id as string).trim(), slug: source.slug as string,
    title: (source.title as string).trim(), summary: (source.summary as string).trim(),
    content: source.content as string, area: (source.area as string).trim(),
    readTime: (source.readTime as string).trim(), date: source.date as string,
    published: source.published,
  };
  for (const field of ['coverImage', 'author', 'updatedAt'] as const) {
    if (typeof source[field] === 'string' && source[field].trim()) article[field] = source[field].trim();
  }
  if (source.tags) article.tags = (source.tags as string[]).map(tag => tag.trim()).filter(Boolean);
  return { format: 'ot-sec-article', version: 1, article };
}

export function serializeArticleExport(article: Article): string {
  return JSON.stringify(parseArticleExport({ format: 'ot-sec-article', version: 1, article }), null, 2) + '\n';
}

export function downloadArticleExport(article: Article): void {
  const json = serializeArticleExport(article);
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${article.slug}.ot-sec.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
