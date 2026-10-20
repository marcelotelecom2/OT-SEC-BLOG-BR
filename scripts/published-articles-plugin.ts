import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { ARTICLES_METADATA } from '../src/content/articles/metadata';
import { RESEARCH_NOTES } from '../src/content/notes';
import { PROJECTS } from '../src/content/projects';
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
      const contentFiles = new Set<string>();
      this.addWatchFile(path.join(root, 'src/content/articles/metadata.ts'));
      this.addWatchFile(path.join(root, 'src/content/notes.ts'));
      this.addWatchFile(path.join(root, 'src/content/projects.ts'));
      for (const { contentFile, ...metadata } of ARTICLES_METADATA) {
        if (metadata.published !== true) continue;
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) {
          throw new Error(`Slug de artigo inválido: ${metadata.slug}`);
        }
        if (!/^[a-z0-9][a-z0-9-]*\.md$/.test(contentFile)) {
          throw new Error(`Arquivo de artigo inválido: ${contentFile}`);
        }
        if (metadata.sourceLanguage !== 'en' && metadata.sourceLanguage !== 'pt' && metadata.sourceLanguage !== 'es') {
          throw new Error(`Idioma original inválido: ${metadata.slug}`);
        }
        if (ids.has(metadata.id) || slugs.has(metadata.slug)) {
          throw new Error(`Identificador ou slug duplicado: ${metadata.slug}`);
        }
        if (contentFiles.has(contentFile)) throw new Error(`Arquivo de conteúdo duplicado: ${contentFile}`);
        ids.add(metadata.id);
        slugs.add(metadata.slug);
        contentFiles.add(contentFile);
        const filename = path.join(root, 'src/content/articles', contentFile);
        if (!fs.existsSync(filename)) throw new Error(`Conteúdo não encontrado: ${contentFile}`);
        this.addWatchFile(filename);
        const name = `articleContent${entries.length}`;
        imports.push(`import ${name} from ${JSON.stringify(`/src/content/articles/${contentFile}?raw`)};`);
        const runtimeTranslations: Record<string, { title: string; summary: string; contentExpression?: string }> = {};
        for (const [language, translation] of Object.entries(metadata.translations ?? {})) {
          if (!translation) continue;
          if ((language !== 'en' && language !== 'pt' && language !== 'es') || language === metadata.sourceLanguage
            || !translation.title.trim() || !translation.summary.trim()) {
            throw new Error(`Tradução inválida (${language}): ${metadata.slug}`);
          }
          const { contentFile: translatedContentFile, ...translatedMetadata } = translation;
          let contentExpression: string | undefined;
          if (translatedContentFile) {
            if (!/^[a-z0-9][a-z0-9.-]*\.md$/.test(translatedContentFile)) {
              throw new Error(`Arquivo de tradução inválido: ${translatedContentFile}`);
            }
            if (contentFiles.has(translatedContentFile)) {
              throw new Error(`Arquivo de tradução duplicado: ${translatedContentFile}`);
            }
            contentFiles.add(translatedContentFile);
            const translatedFilename = path.join(root, 'src/content/articles', translatedContentFile);
            if (!fs.existsSync(translatedFilename)) throw new Error(`Tradução não encontrada: ${translatedContentFile}`);
            this.addWatchFile(translatedFilename);
            const translatedName = `articleContent${entries.length}_${language}`;
            imports.push(`import ${translatedName} from ${JSON.stringify(`/src/content/articles/${translatedContentFile}?raw`)};`);
            contentExpression = translatedName;
          }
          runtimeTranslations[language] = { ...translatedMetadata, contentExpression };
        }
        const translationsExpression = Object.entries(runtimeTranslations).map(([language, translation]) => {
          const { contentExpression, ...translationData } = translation;
          return `${JSON.stringify(language)}: { ...${JSON.stringify(translationData)}${contentExpression ? `, content: ${contentExpression}` : ''} }`;
        }).join(',');
        const { translations: _translations, ...articleMetadata } = metadata;
        entries.push(`{ ...${JSON.stringify(articleMetadata)}, content: ${name}, translations: {${translationsExpression}} }`);
      }
      const notes = publicNotes(RESEARCH_NOTES);
      return `${imports.join('\n')}\nexport const PUBLISHED_ARTICLES = [${entries.join(',\n')}];\n`
        + `export const PUBLISHED_NOTES = ${JSON.stringify(notes)};\n`
        + `export const PUBLISHED_PROJECTS = ${JSON.stringify(PROJECTS.filter(project => project.published === true))};\n`;
    },
  };
}
