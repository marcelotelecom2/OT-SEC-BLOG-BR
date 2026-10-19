import { assertSameOrigin, commitFiles, isAuthenticated, json, metadataSource, parseMetadataSource, readRepositoryFile, type PagesContext } from './_shared';

const languages = ['en', 'pt', 'es'] as const;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function cleanArticle(value: any): any {
  const required = ['id', 'slug', 'title', 'summary', 'content', 'area', 'readTime', 'date'];
  if (!value || typeof value !== 'object') throw new Error('Artigo inválido.');
  for (const field of required) if (typeof value[field] !== 'string' || !value[field].trim()) throw new Error(`Campo obrigatório: ${field}.`);
  if (!slugPattern.test(value.slug)) throw new Error('Slug inválido.');
  if (typeof value.published !== 'boolean') throw new Error('Status editorial inválido.');
  const sourceLanguage = languages.includes(value.sourceLanguage) ? value.sourceLanguage : 'pt';
  if (value.published) for (const language of languages) {
    if (language === sourceLanguage) continue;
    const translation = value.translations?.[language];
    if (!translation?.title?.trim() || !translation?.summary?.trim() || !translation?.content?.trim()) {
      throw new Error(`A publicação exige tradução completa em ${language.toUpperCase()}.`);
    }
  }
  return { ...value, sourceLanguage };
}

function extractImages(text: string, slug: string, files: Map<string, string | Uint8Array>): string {
  return text.replace(/data:image\/(png|jpe?g|gif|webp);base64,([A-Za-z0-9+/]+={0,2})/g, (_all, mime, data) => {
    const bytes = Uint8Array.from(atob(data), character => character.charCodeAt(0));
    const name = `${slug}-${crypto.randomUUID()}.${mime === 'jpeg' ? 'jpg' : mime}`;
    files.set(`public/images/articles/${name}`, bytes);
    return `/images/articles/${name}`;
  });
}

async function authorize(context: PagesContext): Promise<Response | null> {
  try { assertSameOrigin(context.request); }
  catch (error) { return json({ error: error instanceof Error ? error.message : 'Origem inválida.' }, 403); }
  return await isAuthenticated(context.request, context.env) ? null : json({ error: 'Sessão expirada.' }, 401);
}

export async function onRequestPut(context: PagesContext): Promise<Response> {
  const denied = await authorize(context); if (denied) return denied;
  try {
    const article = cleanArticle((await context.request.json() as any).article);
    const source = await readRepositoryFile(context.env, 'src/content/articles/metadata.ts');
    const entries = parseMetadataSource(source);
    if (entries.some(item => item.slug === article.slug && item.id !== article.id)) throw new Error('Este slug já pertence a outro artigo.');
    const previous = entries.find(item => item.id === article.id);
    const contentFile = previous?.contentFile || `${article.slug}.md`;
    const files = new Map<string, string | Uint8Array>();
    const content = extractImages(article.content, article.slug, files);
    const translations: Record<string, any> = {};
    for (const language of languages) {
      if (language === article.sourceLanguage || !article.translations?.[language]) continue;
      const translated = article.translations[language];
      const translatedContent = translated.content ? extractImages(translated.content, `${article.slug}-${language}`, files) : '';
      const contentFileTranslation = previous?.translations?.[language]?.contentFile || `${article.slug}.${language}.md`;
      translations[language] = { title: translated.title.trim(), summary: translated.summary.trim(), ...(translatedContent ? { contentFile: contentFileTranslation } : {}) };
      if (translatedContent) files.set(`src/content/articles/${contentFileTranslation}`, translatedContent.endsWith('\n') ? translatedContent : `${translatedContent}\n`);
    }
    const { content: _content, translations: _translations, views: _views, ...fields } = article;
    const metadata = { ...fields, contentFile, translations, views: 0 };
    const next = previous ? entries.map(item => item.id === article.id ? metadata : item) : [metadata, ...entries];
    files.set(`src/content/articles/${contentFile}`, content.endsWith('\n') ? content : `${content}\n`);
    files.set('src/content/articles/metadata.ts', metadataSource(next));
    const sha = await commitFiles(context.env, files, `${previous ? 'content: atualiza' : 'content: publica'} ${article.slug}`);
    return json({ commit: sha, message: 'Alteração enviada ao GitHub. O Cloudflare Pages iniciou um novo deploy.' });
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Falha ao salvar artigo.' }, 400); }
}

export async function onRequestDelete(context: PagesContext): Promise<Response> {
  const denied = await authorize(context); if (denied) return denied;
  try {
    const { id } = await context.request.json() as { id?: string };
    if (!id) throw new Error('Identificador ausente.');
    const source = await readRepositoryFile(context.env, 'src/content/articles/metadata.ts');
    const entries = parseMetadataSource(source);
    const article = entries.find(item => item.id === id);
    if (!article) throw new Error('Artigo não encontrado no repositório.');
    const next = entries.map(item => item.id === id ? { ...item, published: false } : item);
    const files = new Map<string, string | Uint8Array>([['src/content/articles/metadata.ts', metadataSource(next)]]);
    const sha = await commitFiles(context.env, files, `content: despublica ${article.slug}`);
    return json({ commit: sha, message: 'Artigo despublicado no GitHub. O Cloudflare Pages iniciou um novo deploy.' });
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Falha ao despublicar artigo.' }, 400); }
}
