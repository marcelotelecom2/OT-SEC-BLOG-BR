import { useEffect, useState, type FormEvent } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { LANGUAGE_OPTIONS, useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../lib/adminApi';
import { RADAR_TYPES, validateRadarPublication } from '../../lib/radar';
import type { ArticleLanguage, RadarPublication } from '../../types';

const inputClass = 'w-full min-h-11 px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded text-sm';
const labelClass = 'block text-xs font-mono text-gray-400 mb-2';

export function RadarAdmin() {
  const { language, t } = useLanguage();
  const labels = t.radar;
  const [entries, setEntries] = useState<RadarPublication[]>([]);
  const [editing, setEditing] = useState<RadarPublication | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try { setEntries((await adminApi.radar()).entries); }
    catch (failure) { setError(failure instanceof Error ? failure.message : labels.failed); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const update = (values: Partial<RadarPublication>) => setEditing(previous => previous ? { ...previous, ...values } : null);
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing || busy) return;
    setBusy(true); setError(''); setFeedback('');
    try {
      const entry = validateRadarPublication(editing);
      const result = await adminApi.saveRadar(entry);
      setEntries(previous => [result.entry, ...previous.filter(item => item.id !== entry.id)]);
      setEditing(null); setFeedback(labels.saved);
    } catch (failure) { setError(`${labels.failed} ${failure instanceof Error ? failure.message : ''}`); }
    finally { setBusy(false); }
  };
  const unpublish = async (id: string) => {
    setBusy(true); setError(''); setFeedback('');
    try {
      await adminApi.unpublishRadar(id);
      setEntries(previous => previous.map(item => item.id === id ? { ...item, published: false } : item));
      setFeedback(labels.saved);
    } catch (failure) { setError(`${labels.failed} ${failure instanceof Error ? failure.message : ''}`); }
    finally { setBusy(false); }
  };

  return <section className="space-y-6" aria-label={labels.title}>
    <div className="flex flex-wrap justify-between items-center gap-4 p-4 bg-gray-950/60 border border-gray-800 rounded">
      <div><h2 className="text-lg font-semibold text-white">{labels.title}</h2><p className="text-xs text-gray-400 mt-2 max-w-xl">{labels.manual}</p></div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void load()} disabled={loading || busy} aria-label={labels.retry}
          className="min-h-11 p-3 text-gray-400 border border-gray-800 rounded hover:text-cyan-300 disabled:opacity-50"><RefreshCw className="w-4 h-4" /></button>
        <button type="button" disabled={busy || !!editing} onClick={() => {
          setError(''); setFeedback('');
          setEditing({ id: crypto.randomUUID(), type: 'news', title: '', date: new Date().toISOString().slice(0, 10),
            sourceName: '', sourceUrl: '', comment: '', published: false, sourceLanguage: language });
        }} className="min-h-11 px-4 py-2 bg-cyan-500 text-black font-mono text-xs font-semibold rounded inline-flex items-center gap-2 disabled:opacity-50">
          <Plus aria-hidden="true" className="w-4 h-4" />{labels.newEntry}
        </button>
      </div>
    </div>
    {error && <p role="alert" className="text-rose-300 bg-rose-950/20 border border-rose-900 p-4 rounded text-sm">{error}</p>}
    {feedback && <p role="status" className="text-cyan-300 border border-cyan-900 p-4 rounded text-sm">{feedback}</p>}

    {editing && <form onSubmit={save} className="space-y-5 bg-[#090a0f] border border-gray-800 rounded p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-white">{labels.edit} — {labels.title}</h3>
      <fieldset disabled={busy} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label htmlFor="radar-type" className={labelClass}>{labels.type}</label>
          <select id="radar-type" className={inputClass} value={editing.type} onChange={event => update({ type: event.target.value as RadarPublication['type'] })}>
            {RADAR_TYPES.map(type => <option key={type} value={type}>{labels.types[type]}</option>)}
          </select></div>
        <div><label htmlFor="radar-date" className={labelClass}>{labels.date}</label>
          <input id="radar-date" type="date" required={editing.published} value={editing.date} onChange={event => update({ date: event.target.value })} className={inputClass} /></div>
      </div>
      <div><label htmlFor="radar-language" className={labelClass}>{labels.language}</label>
        <select id="radar-language" className={inputClass} value={editing.sourceLanguage} onChange={event => {
          const sourceLanguage = event.target.value as ArticleLanguage;
          const translations = { ...editing.translations }; delete translations[sourceLanguage];
          update({ sourceLanguage, translations });
        }}>{LANGUAGE_OPTIONS.map(option => <option key={option.code} value={option.code}>{option.label}</option>)}</select></div>
      <div><label htmlFor="radar-title" className={labelClass}>{labels.formTitle}</label>
        <input id="radar-title" required={editing.published} maxLength={240} value={editing.title} onChange={event => update({ title: event.target.value })} className={inputClass} /></div>
      <div><label htmlFor="radar-source" className={labelClass}>{labels.sourceName}</label>
        <input id="radar-source" required={editing.published} value={editing.sourceName} onChange={event => update({ sourceName: event.target.value })} className={inputClass} /></div>
      <div><label htmlFor="radar-link" className={labelClass}>{labels.sourceUrl}</label>
        <input id="radar-link" type="url" required={editing.published} placeholder="https://" value={editing.sourceUrl} onChange={event => update({ sourceUrl: event.target.value })} className={inputClass} /></div>
      <div><label htmlFor="radar-comment" className={labelClass}>{labels.comment}</label>
        <textarea id="radar-comment" required={editing.published} maxLength={2000} rows={4} value={editing.comment} onChange={event => update({ comment: event.target.value })} className={inputClass} /></div>
      <details className="border border-gray-800 rounded p-4">
        <summary className="cursor-pointer text-sm text-cyan-400">{labels.translations}</summary>
        <p className="text-xs text-gray-500 my-4">{labels.translationHelp}</p>
        {LANGUAGE_OPTIONS.filter(option => option.code !== editing.sourceLanguage).map(option => {
          const translation = editing.translations?.[option.code] ?? { title: '', comment: '' };
          const change = (values: Partial<typeof translation>) => update({ translations: { ...editing.translations, [option.code]: { ...translation, ...values } } });
          return <fieldset key={option.code} className="space-y-3 mb-5"><legend className="text-sm text-gray-300 mb-3">{option.label}</legend>
            <label className={labelClass} htmlFor={`radar-title-${option.code}`}>{labels.formTitle} ({option.label})</label>
            <input id={`radar-title-${option.code}`} value={translation.title} maxLength={240} onChange={event => change({ title: event.target.value })} className={inputClass} />
            <label className={labelClass} htmlFor={`radar-comment-${option.code}`}>{labels.comment} ({option.label})</label>
            <textarea id={`radar-comment-${option.code}`} rows={3} value={translation.comment} maxLength={2000} onChange={event => change({ comment: event.target.value })} className={inputClass} />
          </fieldset>;
        })}
      </details>
      <label className="flex gap-3 items-center text-sm text-gray-300 min-h-11">
        <input type="checkbox" checked={editing.published} onChange={event => update({ published: event.target.checked })} className="accent-cyan-500 w-4 h-4" />{labels.publish}
      </label>
      <div className="flex flex-wrap gap-3 justify-end">
        <button type="button" disabled={busy} onClick={() => setEditing(null)} className="min-h-11 px-4 py-2 border border-gray-800 text-gray-400 rounded">{labels.cancel}</button>
        <button type="submit" disabled={busy} className="min-h-11 px-4 py-2 bg-cyan-500 text-black font-semibold rounded disabled:opacity-50">{busy ? labels.saving : labels.save}</button>
      </div>
      </fieldset>
    </form>}

    {loading ? <p role="status" className="text-gray-400 font-mono text-sm">{labels.loading}</p>
      : !entries.length ? <p className="text-gray-500 font-mono text-sm">{labels.adminEmpty}</p>
      : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...entries].sort((a, b) => b.date.localeCompare(a.date)).map(item => <article key={item.id} className="p-5 border border-gray-800 rounded bg-gray-950/40">
        <div className="flex flex-wrap gap-3 text-xs text-cyan-400 font-mono mb-3"><span>{labels.types[item.type]}</span><time dateTime={item.date}>{item.date}</time></div>
        <h3 className="text-white font-semibold break-words">{item.title || labels.draft}</h3>
        <p className="text-xs text-gray-500 mt-2">{item.sourceName}</p>
        <p className="text-xs text-gray-400 mt-2">{item.published ? labels.published : labels.draft}</p>
        <div className="flex gap-4 mt-4">
          <button type="button" disabled={busy || !!editing} onClick={() => { setEditing(structuredClone(item)); setError(''); setFeedback(''); }} className="min-h-11 text-cyan-400 text-sm">{labels.edit}</button>
          {item.published && <button type="button" disabled={busy} onClick={() => void unpublish(item.id)} className="min-h-11 text-amber-400 text-sm">{labels.unpublish}</button>}
        </div>
      </article>)}</div>}
  </section>;
}
