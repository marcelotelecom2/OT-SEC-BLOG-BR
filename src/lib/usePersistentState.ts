import { useState, useSyncExternalStore } from 'react';
import { createPersistentStore, type StoredValue, type Validator } from './persistence';

export function usePersistentState<T>(key: string, fallback: T, validate: Validator<T>,
  options: { bestEffort?: boolean; load?: () => StoredValue<T> } = {}) {
  const [store] = useState(() => createPersistentStore(key, fallback, validate, options));
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  return [snapshot.value, store.set, snapshot.error] as const;
}
