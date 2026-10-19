import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { createServer } from 'vite';

async function main() {
  const sourceRoot = process.cwd();
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-sec-item4-'));
  let server: Awaited<ReturnType<typeof createServer>> | undefined;
  const bodyMarker = 'VALIDATION_PRIVATE_ARTICLE_BODY_836901';
  const orphanMarker = 'VALIDATION_UNREGISTERED_MARKDOWN_836901';
  const noteMarker = 'VALIDATION_PRIVATE_NOTE_BODY_836901';
  const tagMarker = 'VALIDATION_PRIVATE_TAG_836901';
  const translationMarker = 'VALIDATION_PRIVATE_TRANSLATION_836901';
  const sourceNoteMarker = 'VALIDATION_PRIVATE_SOURCE_NOTE_836901';
  const publicNoteMarker = 'VALIDATION_PUBLIC_SOURCE_NOTE_836901';
  try {
    for (const name of ['src', 'scripts', 'public', 'package.json', 'tsconfig.json', 'vite.config.ts', 'index.html', 'favicon.svg']) {
      fs.cpSync(path.join(sourceRoot, name), path.join(fixture, name), { recursive: true });
    }
    fs.symlinkSync(path.join(sourceRoot, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
    const contentRoot = path.join(fixture, 'src/content/articles');
    fs.writeFileSync(path.join(contentRoot, 'validation-private-draft.md'), bodyMarker);
    fs.writeFileSync(path.join(contentRoot, 'validation-unregistered.md'), orphanMarker);
    const draft = {
      id: 'validation-private', slug: 'validation-private-draft', title: 'Private validation draft',
      summary: 'VALIDATION_PRIVATE_SUMMARY_836901', contentFile: 'validation-private-draft.md',
      date: '2026-10-18', readTime: '1 min', area: 'OT', published: false, views: 0,
      sourceLanguage: 'pt', translations: { en: { title: translationMarker, summary: translationMarker } },
    };
    const publicBody = 'VALIDATION_PUBLIC_ARTICLE_BODY_836901';
    const publicTranslationBody = 'VALIDATION_PUBLIC_TRANSLATION_BODY_836901';
    const publicSpanishBody = 'VALIDATION_PUBLIC_SPANISH_BODY_836901';
    fs.writeFileSync(path.join(contentRoot, 'validation-public-article.md'), publicBody);
    fs.writeFileSync(path.join(contentRoot, 'validation-public-article.en.md'), publicTranslationBody);
    fs.writeFileSync(path.join(contentRoot, 'validation-public-article.es.md'), publicSpanishBody);
    const publicArticle = { ...draft, id: 'validation-public', slug: 'validation-public-article',
      title: 'Public validation article', summary: 'Public summary', contentFile: 'validation-public-article.md',
      published: true, translations: {
        en: { title: 'Translated public title', summary: 'Translated public summary',
          contentFile: 'validation-public-article.en.md' },
        es: { title: 'Artículo público traducido', summary: 'Resumen público traducido',
          contentFile: 'validation-public-article.es.md' },
      } };
    const metadataPath = path.join(contentRoot, 'metadata.ts');
    const metadata = fs.readFileSync(metadataPath, 'utf8');
    assert.match(metadata, /\];\s*$/);
    fs.writeFileSync(metadataPath, metadata.replace(/\];\s*$/,
      `,${JSON.stringify(draft)},${JSON.stringify(publicArticle)}\n];\n`));

    fs.appendFileSync(path.join(fixture, 'src/content/notes.ts'),
      `\nRESEARCH_NOTES.push(${JSON.stringify({
        id: 'source-draft', date: '2026-10-18', tag: '#PRIVATE', content: sourceNoteMarker, published: false,
      })}, ${JSON.stringify({
        id: 'source-public', date: '2026-10-18', tag: '#PUBLIC', content: publicNoteMarker, published: true,
      })});\n`);

    const build = spawnSync('npm', ['run', 'build'], { cwd: fixture, encoding: 'utf8', timeout: 120000 });
    assert.equal(build.status, 0, build.stderr + build.stdout);
    const staleHtml = path.join(fixture, 'dist/en/articles/validation-private-draft.html');
    fs.writeFileSync(staleHtml, bodyMarker);
    const rerender = spawnSync('npm', ['run', 'prerender'], { cwd: fixture, encoding: 'utf8', timeout: 30000 });
    assert.equal(rerender.status, 0, rerender.stderr + rerender.stdout);
    assert.equal(fs.existsSync(staleHtml), false, 'Standalone prerender retained an unpublished page');
    const assets = path.join(fixture, 'dist/assets');
    const javascript = fs.readdirSync(assets).filter(name => name.endsWith('.js'))
      .map(name => fs.readFileSync(path.join(assets, name), 'utf8')).join('\n');
    const sitemap = fs.readFileSync(path.join(fixture, 'dist/sitemap.xml'), 'utf8');
    const publicArticleHtml = fs.readFileSync(
      path.join(fixture, 'dist/en/articles/validation-public-article.html'), 'utf8');
    const publicPortugueseHtml = fs.readFileSync(
      path.join(fixture, 'dist/pt/articles/validation-public-article.html'), 'utf8');
    const publicSpanishHtml = fs.readFileSync(
      path.join(fixture, 'dist/es/articles/validation-public-article.html'), 'utf8');

    const stored = new Map<string, string>([['ot_sec_notes', JSON.stringify([{
      id: 'validation-note', date: '2026-10-18', tag: '#TEST', tags: [tagMarker],
      content: noteMarker, author: 'Validation', published: false,
    }])]]);
    (globalThis as any).localStorage = {
      getItem: (key: string) => stored.get(key) ?? null,
      setItem: (key: string, value: string) => stored.set(key, value),
      removeItem: (key: string) => stored.delete(key),
    };
    server = await createServer({ root: fixture, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
    const { BlogProvider, useBlog } = await server.ssrLoadModule('/src/context/BlogContext.tsx');
    const { LanguageProvider } = await server.ssrLoadModule('/src/context/LanguageContext.tsx');
    const { Home } = await server.ssrLoadModule('/src/pages/Home.tsx');
    const { Research } = await server.ssrLoadModule('/src/pages/Research.tsx');
    const { ArticleDetail } = await server.ssrLoadModule('/src/pages/ArticleDetail.tsx');
    const { PUBLISHED_ARTICLES } = await server.ssrLoadModule('/src/content/articles/index.ts');
    const { mergeArticles } = await server.ssrLoadModule('/src/lib/articleState.ts');
    const { localizeArticle } = await server.ssrLoadModule('/src/lib/articleLocalization.ts');
    const publicArticles = mergeArticles(PUBLISHED_ARTICLES, [], [], {});
    const render = (node: React.ReactElement, route = '/') => renderToStaticMarkup(
      <LanguageProvider><BlogProvider><MemoryRouter initialEntries={[route]}>{node}</MemoryRouter></BlogProvider></LanguageProvider>
    );
    const home = render(<Home />);
    const research = render(<Research />, '/insights');
    const direct = render(<Routes><Route path="/articles/:slug" element={<ArticleDetail />} /></Routes>, '/articles/validation-private-draft');
    const byId = render(<Routes><Route path="/articles/:slug" element={<ArticleDetail />} /></Routes>, '/articles/validation-private');
    const visible = render(<Routes><Route path="/articles/:slug" element={<ArticleDetail />} /></Routes>, '/articles/validation-public-article');
    function LocalEditorProbe() { return <div>{useBlog().adminNotes.map((note: any) => note.content).join('')}</div>; }
    const editor = render(<LocalEditorProbe />);
    stored.delete('ot_sec_notes');
    const sourceHome = render(<Home />);
    const productionArticles = PUBLISHED_ARTICLES.filter((item: any) => !item.id.startsWith('validation-'));
    const allArticleLanguagesComplete = productionArticles.every((item: any) =>
      ['en', 'pt', 'es'].every(language => {
        const localized = localizeArticle(item, language);
        return localized.contentLanguage === language && localized.bodyTranslated
          && Boolean(localized.article.title.trim() && localized.article.summary.trim() && localized.article.content.trim());
      }));
    const results = {
      fixtureBuildPassed: true,
      staleDraftHtmlRemoved: !fs.existsSync(staleHtml),
      registeredDraftInPublicCollection: publicArticles.some((item: any) => item.id === draft.id),
      registeredDraftBodyInJavascript: javascript.includes(bodyMarker),
      unregisteredMarkdownInJavascript: javascript.includes(orphanMarker),
      registeredDraftHasStaticHtml: ['en', 'pt', 'es'].some(language =>
        fs.existsSync(path.join(fixture, `dist/${language}/articles/validation-private-draft.html`))),
      registeredDraftInSitemap: sitemap.includes('/articles/validation-private-draft'),
      directDraftUrlRendersBody: direct.includes(bodyMarker),
      homeRendersUnpublishedNote: home.includes(noteMarker),
      insightsShowsDraftTag: research.includes(tagMarker),
      insightsRendersDraftBodyInitially: research.includes(noteMarker),
      directDraftIdRendersBody: byId.includes(bodyMarker),
      draftPageIsNoindex: direct.includes('noindex'),
      publicArticleInJavascript: javascript.includes(publicBody),
      publicTranslationInJavascript: javascript.includes(publicTranslationBody),
      publicArticleBodyInStaticHtml: publicArticleHtml.includes(publicTranslationBody),
      publicArticleHasEmptyRoot: publicArticleHtml.includes('<div id="root"></div>'),
      localizedStaticHtmlGenerated: publicArticleHtml.includes('<html lang="en">')
        && publicPortugueseHtml.includes('<html lang="pt-BR">')
        && publicSpanishHtml.includes('<html lang="es">'),
      multilingualSeoLinked: publicArticleHtml.includes('hreflang="pt-BR"')
        && publicArticleHtml.includes('hreflang="x-default"')
        && sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'),
      publicTranslationRenders: visible.includes(publicTranslationBody),
      allArticleLanguagesComplete,
      localDraftRemainsInEditor: editor.includes(noteMarker),
      privateMetadataInJavascript: javascript.includes(draft.slug) || javascript.includes(draft.summary),
      privateTranslationInJavascript: javascript.includes(translationMarker),
      privateSourceNoteInJavascript: javascript.includes(sourceNoteMarker),
      publicSourceNoteInJavascript: javascript.includes(publicNoteMarker),
      privateSourceNoteInHome: sourceHome.includes(sourceNoteMarker),
    };
    assert.equal(results.registeredDraftInPublicCollection, false);
    assert.equal(results.directDraftUrlRendersBody, false);
    assert.equal(results.homeRendersUnpublishedNote, false);
    assert.equal(results.registeredDraftBodyInJavascript, false);
    assert.equal(results.unregisteredMarkdownInJavascript, false);
    assert.equal(results.registeredDraftHasStaticHtml, false);
    assert.equal(results.registeredDraftInSitemap, false);
    assert.equal(results.insightsShowsDraftTag, false);
    assert.equal(results.insightsRendersDraftBodyInitially, false);
    assert.equal(results.directDraftIdRendersBody, false);
    assert.equal(results.draftPageIsNoindex, true);
    assert.equal(results.publicArticleInJavascript, true);
    assert.equal(results.publicTranslationInJavascript, true);
    assert.equal(results.publicArticleBodyInStaticHtml, true);
    assert.equal(results.publicArticleHasEmptyRoot, false);
    assert.equal(results.localizedStaticHtmlGenerated, true);
    assert.equal(results.multilingualSeoLinked, true);
    assert.equal(results.publicTranslationRenders, true);
    assert.equal(results.allArticleLanguagesComplete, true);
    assert.equal(results.localDraftRemainsInEditor, true);
    assert.equal(results.privateMetadataInJavascript, false);
    assert.equal(results.privateTranslationInJavascript, false);
    assert.equal(results.privateSourceNoteInJavascript, false);
    assert.equal(results.publicSourceNoteInJavascript, true);
    assert.equal(results.privateSourceNoteInHome, false);
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await server?.close();
    delete (globalThis as any).localStorage;
    assert.ok(fixture.startsWith(path.join(os.tmpdir(), 'ot-sec-item4-')));
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
