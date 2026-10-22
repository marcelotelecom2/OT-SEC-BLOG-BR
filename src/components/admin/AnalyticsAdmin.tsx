import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { analyticsDashboardUrl, type SiteAnalytics } from '../../lib/analytics';

export function AnalyticsAdmin() {
  const [days, setDays] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<SiteAnalytics | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setData(null);
    setError('');
    adminApi.analytics(days).then(value => { if (active) setData(value); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : 'Falha na consulta.'); });
    return () => { active = false; };
  }, [days, refresh]);
  return <section className="space-y-6" aria-label="Métricas do site">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 className="text-xl text-white font-bold">Métricas do site</h2>
      <div className="flex gap-3 flex-wrap">
        <select aria-label="Período das métricas" value={days} onChange={event => setDays(Number(event.target.value))} className="bg-gray-950 border border-gray-700 rounded p-2 text-gray-200">
          <option value={1}>Últimas 24 horas</option><option value={7}>Últimos 7 dias</option><option value={30}>Últimos 30 dias</option>
        </select>
        <button onClick={() => setRefresh(value => value + 1)} className="border border-cyan-800 text-cyan-400 rounded px-4 py-2">Atualizar</button>
      </div>
    </div>
    <p className="text-sm text-gray-400">Fonte: Cloudflare Web Analytics. Visitas não representam pessoas únicas. A coleta pode sofrer bloqueios do navegador e atraso no processamento.</p>
    {!data && !error && <p role="status" className="text-cyan-400">Consultando métricas…</p>}
    {error && <p role="alert" className="p-4 rounded border border-amber-800 text-amber-300">{error}</p>}
    {data && <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[['Visitas', data.visits], ['Visualizações de páginas', data.pageViews]].map(([label, value]) => <div key={label} className="bg-gray-950 border border-gray-800 rounded p-6">
          <p className="text-gray-400 text-sm">{label}</p><p className="text-3xl text-white font-mono mt-2">{Number(value).toLocaleString('pt-BR')}</p>
        </div>)}
      </div>
      <p className="text-xs text-gray-400">Período: {new Date(data.start).toLocaleString('pt-BR')} até {new Date(data.end).toLocaleString('pt-BR')} (fuso do navegador). Inclui as páginas acompanhadas pela propriedade, inclusive /admin. Os dados podem usar amostragem da Cloudflare.</p>
    </>}
    <a href={analyticsDashboardUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-cyan-400 underline">Abrir relatório completo na Cloudflare</a>
    <p className="text-xs text-gray-500">Os antigos contadores deste navegador não são usados neste relatório. Limpar contadores locais não altera os dados da Cloudflare.</p>
  </section>;
}
