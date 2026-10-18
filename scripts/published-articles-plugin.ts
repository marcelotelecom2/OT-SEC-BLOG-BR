import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { ARTICLES_METADATA } from '../src/content/articles/metadata';
import { ARTICLE_TRANSLATIONS } from '../src/content/articles/translations';
import { RESEARCH_NOTES } from '../src/content/notes';
import { publicNotes } from '../src/lib/articleState';

/** Generate the client module at build time. Draft metadata and bodies never enter its graph. */
export function publishedArticlesPlugin(): Plugin {
  const virtualId = 'virtual:published-articles';
  const resolvedId = `\0${virtualId}`;
  let root: string;
  return {
    name: 'published-articles-only',
    configResolved(config) { root = config.root; },
    resolveId(id) { if (id === virtualId) return resolvedId; },
    load(id) {
      if (id !== resolvedId) return;
      const imports: string[] = [];
      const entries: string[] = [];
      const ids = new Set<string>();
      const slugs = new Set<string>();
      const translations: typeof ARTICLE_TRANSLATIONS = Object.create(null);
      this.addWatchFile(path.join(root, 'src/content/articles/metadata.ts'));
      this.addWatchFile(path.join(root, 'src/content/articles/translations.ts'));
      this.addWatchFile(path.join(root, 'src/content/notes.ts'));
      for (const { contentFile, ...metadata } of ARTICLES_METADATA) {
        if (metadata.published !== true) continue;
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) {
          throw new Error(`Slug de artigo inválido: ${metadata.slug}`);
        }
        if (!/^[a-z0-9][a-z0-9-]*\.md$/.test(contentFile)) {
          throw new Error(`Arquivo de artigo inválido: ${contentFile}`);
        }
        if (ids.has(metadata.id) || slugs.has(metadata.slug)) {
          throw new Error(`Identificador ou slug duplicado: ${metadata.slug}`);
        }
        ids.add(metadata.id);
        slugs.add(metadata.slug);
        if (Object.hasOwn(ARTICLE_TRANSLATIONS, metadata.id)) translations[metadata.id] = ARTICLE_TRANSLATIONS[metadata.id];
        const filename = path.join(root, 'src/content/articles', contentFile);
        if (!fs.existsSync(filename)) throw new Error(`Conteúdo não encontrado: ${contentFile}`);
        this.addWatchFile(filename);
        const name = `articleContent${entries.length}`;
        imports.push(`import ${name} from ${JSON.stringify(`/src/content/articles/${contentFile}?raw`)};`);
        entries.push(`{ ...${JSON.stringify(metadata)}, content: ${name} }`);
      }
      const notes = publicNotes(RESEARCH_NOTES);
      return `${imports.join('\n')}\nexport const PUBLISHED_ARTICLES = [${entries.join(',\n')}];\n`
        + `export const ARTICLE_TRANSLATIONS = ${JSON.stringify(translations)};\n`
        + `export const PUBLISHED_NOTES = ${JSON.stringify(notes)};\n`;
    },
  };
}
