import type { Article } from '../types';

/** Published files always win on public pages. Local edits remain available in Admin. */
export function mergeArticles(
  published: Article[],
  local: Article[],
  deletedIds: string[],
  views: Record<string, number>,
  includeLocalEdits = false,
): Article[] {
  const visibleLocal = includeLocalEdits ? local : [];
  const localIds = new Set(visibleLocal.map(article => article.id));

  return [
    ...visibleLocal,
    ...published.filter(article => !localIds.has(article.id)),
  ]
    .filter(article => !includeLocalEdits || !deletedIds.includes(article.id))
    .map(article => ({ ...article, views: views[article.id] ?? article.views ?? 0 }));
}

/** A view update must never create or modify a stored content snapshot. */
export function updateLocalArticle(
  local: Article[],
  published: Article[],
  id: string,
  updated: Partial<Article>,
): Article[] {
  const { views: _views, ...contentChanges } = updated;
  if (Object.keys(contentChanges).length === 0) return local;

  if (local.some(article => article.id === id)) {
    return local.map(article => article.id === id ? { ...article, ...contentChanges } : article);
  }
  const canonical = published.find(article => article.id === id);
  return canonical ? [{ ...canonical, ...contentChanges }, ...local] : local;
}
