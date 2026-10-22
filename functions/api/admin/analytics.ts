import { assertSameOrigin, isAuthenticated, json, type PagesContext } from './_shared';

// Account and site IDs identify the existing OT-SEC Web Analytics property.
const account = '4729b34deb4cf5a7f8033d8519eaf6ad';
const site = 'e497662b337b4a6ebb3c397563bc10f6';

export async function onRequestGet({ request, env }: PagesContext): Promise<Response> {
  try { assertSameOrigin(request); } catch { return json({ error: 'Origem inválida.' }, 403); }
  if (!await isAuthenticated(request, env)) return json({ error: 'Autenticação necessária.' }, 401);
  const days = new URL(request.url).searchParams.get('days') || '1';
  if (!['1', '7', '30'].includes(days)) return json({ error: 'Período inválido.' }, 400);
  if (!env.CLOUDFLARE_ANALYTICS_TOKEN) {
    return json({ error: 'A integração ainda precisa de uma credencial de leitura da Cloudflare. Consulte as métricas reais no link abaixo.' }, 503);
  }
  const end = new Date().toISOString();
  const start = new Date(Date.now() - Number(days) * 86400000).toISOString();
  const filter = `siteTag: ${JSON.stringify(site)}, datetime_geq: ${JSON.stringify(start)}, datetime_lt: ${JSON.stringify(end)}`;
  const query = `{ viewer { accounts(filter: {accountTag: ${JSON.stringify(account)}}) {
    totals: rumPageloadEventsAdaptiveGroups(limit: 1, filter: {${filter}}) { count sum { visits } }
  } } }`;
  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.CLOUDFLARE_ANALYTICS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }), signal: AbortSignal.timeout(15000),
    });
    const payload = await response.json() as {
      errors?: unknown[];
      data?: { viewer?: { accounts?: { totals?: { count: number; sum: { visits: number } }[] }[] } };
    };
    const accounts = payload.data?.viewer?.accounts;
    const totals = accounts?.[0]?.totals;
    if (!response.ok || payload.errors?.length || accounts?.length !== 1 || !Array.isArray(totals)) throw new Error('Provider unavailable');
    // A successful empty aggregation means no events in this period; failures never become zero.
    if (totals.length > 1) throw new Error('Unexpected aggregation');
    const pageViews = totals.length === 0 ? 0 : totals[0]?.count;
    const visits = totals.length === 0 ? 0 : totals[0]?.sum?.visits;
    if (![pageViews, visits].every(value => Number.isFinite(value) && value >= 0)) throw new Error('Invalid metrics');
    return json({ source: 'Cloudflare Web Analytics', start, end, visits, pageViews });
  } catch {
    return json({ error: 'Não foi possível consultar a Cloudflare. Verifique a credencial e tente novamente. Nenhum número estimado localmente foi exibido.' }, 502);
  }
}
