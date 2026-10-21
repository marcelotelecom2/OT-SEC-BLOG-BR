import { assertSameOrigin, commitFiles, isAuthenticated, json, readRepositoryFile, type PagesContext } from './_shared';
import { parseRadarSource, validateRadarPublication } from '../../../src/lib/radar';

const registry = 'src/content/radar.json';
async function authorize(context: PagesContext) {
  try { assertSameOrigin(context.request); }
  catch { return json({ error: 'Origem inválida.' }, 403); }
  return await isAuthenticated(context.request, context.env) ? null : json({ error: 'Sessão expirada.' }, 401);
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const denied = await authorize(context); if (denied) return denied;
  try { return json({ entries: parseRadarSource(await readRepositoryFile(context.env, registry)) }); }
  catch (error) { return json({ error: error instanceof Error ? error.message : 'Falha ao carregar Radar.' }, 400); }
}

export async function onRequestPut(context: PagesContext): Promise<Response> {
  const denied = await authorize(context); if (denied) return denied;
  try {
    const entry = validateRadarPublication((await context.request.json() as any).entry);
    const entries = parseRadarSource(await readRepositoryFile(context.env, registry));
    const next = entries.some(item => item.id === entry.id)
      ? entries.map(item => item.id === entry.id ? entry : item) : [entry, ...entries];
    const commit = await commitFiles(context.env, new Map([[registry, `${JSON.stringify(next, null, 2)}\n`]]), `content: atualiza Radar OT ${entry.id}`);
    return json({ entry, commit });
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Falha ao salvar Radar.' }, 400); }
}

export async function onRequestDelete(context: PagesContext): Promise<Response> {
  const denied = await authorize(context); if (denied) return denied;
  try {
    const { id } = await context.request.json() as { id?: string };
    const entries = parseRadarSource(await readRepositoryFile(context.env, registry));
    if (!entries.some(item => item.id === id)) throw new Error('Publicação não encontrada.');
    const next = entries.map(item => item.id === id ? { ...item, published: false } : item);
    const commit = await commitFiles(context.env, new Map([[registry, `${JSON.stringify(next, null, 2)}\n`]]), `content: despublica Radar OT ${id}`);
    return json({ commit });
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Falha ao despublicar.' }, 400); }
}
