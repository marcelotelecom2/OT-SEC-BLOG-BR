export type Validator<T> = (value: unknown) => value is T;
export interface StoredValue<T> {
  value: T;
  error: string | null;
  storedRaw: string | null;
  recoveryRaw?: string;
}

export class StorageError extends Error {
  constructor(message: string, options?: ErrorOptions) { super(message, options); this.name = 'StorageError'; }
}

function storage(): Storage {
  // Accessing the property itself can throw SecurityError in restricted browsers.
  const result = globalThis.localStorage;
  if (!result) throw new Error('Storage unavailable');
  return result;
}

function failure(cause: unknown): StorageError {
  if (cause instanceof StorageError) return cause;
  const name = (cause as { name?: string })?.name;
  return new StorageError(name === 'QuotaExceededError' || name === 'NS_ERROR_DOM_QUOTA_REACHED'
    ? 'O armazenamento do navegador está cheio. Exporte sua edição antes de fechar ou recarregar.'
    : 'O navegador não permitiu confirmar o salvamento. Mantenha a edição aberta e exporte seu trabalho.', { cause });
}

export function safeGetItem(key: string): string | null {
  try { return storage().getItem(key); } catch { return null; }
}

export function writeVerifiedItem(key: string, value: string): void {
  try {
    const target = storage();
    target.setItem(key, value);
    if (target.getItem(key) !== value) throw new Error('Write verification failed');
  } catch (error) { throw failure(error); }
}

export function safeSetItem(key: string, value: string): boolean {
  try { writeVerifiedItem(key, value); return true; } catch { return false; }
}

export function removeVerifiedItem(key: string): void {
  try {
    const target = storage();
    target.removeItem(key);
    if (target.getItem(key) !== null) throw new Error('Removal verification failed');
  } catch (error) { throw failure(error); }
}

export function safeRemoveItem(key: string): void {
  try { removeVerifiedItem(key); } catch { /* Best effort for non-editorial preferences. */ }
}

export function readStoredJson<T>(key: string, fallback: T, validate: Validator<T>): StoredValue<T> {
  let raw: string | null = null;
  try {
    raw = storage().getItem(key);
    if (raw === null) return { value: fallback, storedRaw: null, error: null };
    const value: unknown = JSON.parse(raw);
    if (!validate(value)) throw new Error('Invalid stored data');
    return { value, storedRaw: raw, error: null };
  } catch (error) {
    return {
      value: fallback, storedRaw: raw, recoveryRaw: raw ?? undefined,
      error: raw === null ? failure(error).message
        : 'Há dados locais inválidos. O original foi preservado; exporte uma cópia local para recuperá-lo.',
    };
  }
}

/** Keep distinct recovery copies without overwriting earlier backups or evicting user media. */
export function preserveRawItem(key: string, raw: string): void {
  let hash = 2166136261;
  for (let index = 0; index < raw.length; index++) hash = Math.imul(hash ^ raw.charCodeAt(index), 16777619);
  const prefix = `${key}_recovery_${(hash >>> 0).toString(16)}`;
  try {
    const target = storage();
    let destination = prefix;
    for (let suffix = 1; ; suffix++) {
      const existing = target.getItem(destination);
      if (existing === raw) return;
      if (existing === null) break;
      destination = `${prefix}_${suffix}`;
    }
    writeVerifiedItem(destination, raw);
  } catch (error) { throw failure(error); }
}

export function createPersistentStore<T>(
  key: string, fallback: T, validate: Validator<T>,
  options: { bestEffort?: boolean; load?: () => StoredValue<T> } = {},
) {
  let snapshot = options.load ? options.load() : readStoredJson(key, fallback, validate);
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach(listener => listener());
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    set(next: T | ((previous: T) => T), requirePersistence = !options.bestEffort): void {
      const value = typeof next === 'function' ? (next as (previous: T) => T)(snapshot.value) : next;
      if (Object.is(value, snapshot.value)) return;
      try {
        if (!validate(value)) throw new StorageError('Os dados não puderam ser validados. A edição não foi salva.');
        if (requirePersistence && storage().getItem(key) !== snapshot.storedRaw) {
          throw new StorageError('Os dados foram alterados em outra aba. Exporte a edição atual antes de recarregar.');
        }
        if (snapshot.recoveryRaw !== undefined) preserveRawItem(key, snapshot.recoveryRaw);
        const raw = JSON.stringify(value);
        writeVerifiedItem(key, raw);
        snapshot = { value, storedRaw: raw, error: null };
        emit();
      } catch (cause) {
        const error = failure(cause);
        snapshot = { ...snapshot, value: requirePersistence ? snapshot.value : value, error: error.message };
        emit();
        if (requirePersistence) throw error;
      }
    },
  };
}

export function downloadEditorialBackup(): void {
  const keys = ['ot_sec_local_articles', 'ot_sec_articles', 'ot_sec_notes', 'ot_sec_projects', 'ot_sec_media', 'ot_sec_deleted_article_ids'];
  const values: Record<string, string> = {};
  try {
    const target = storage();
    const names = new Set(keys);
    for (let index = 0; index < target.length; index++) {
      const name = target.key(index);
      if (name && keys.some(key => name.startsWith(`${key}_recovery_`))) names.add(name);
    }
    for (const key of names) { const raw = target.getItem(key); if (raw !== null) values[key] = raw; }
  } catch (error) { throw failure(error); }
  const url = URL.createObjectURL(new Blob([JSON.stringify({ format: 'ot-sec-local-backup', version: 1, values }, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ot-sec-copia-local.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
