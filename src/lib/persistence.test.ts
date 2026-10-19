import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { createPersistentStore, readStoredJson, safeGetItem, safeSetItem } from './persistence';
import { loadLocalArticles, LOCAL_ARTICLES_KEY, LEGACY_ARTICLES_KEY } from './articleStorage';
import { isArticleArray, isStringArray } from './storageSchemas';
import type { Article } from '../types';

class MemoryStorage {
  data = new Map<string, string>();
  writes: string[] = [];
  full = false;
  dropWrites = false;
  denyRemoval = false;
  get length() { return this.data.size; }
  key(index: number) { return [...this.data.keys()][index] ?? null; }
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) {
    this.writes.push(key);
    if (this.full) throw Object.assign(new Error('Full'), { name: 'QuotaExceededError' });
    if (!this.dropWrites) this.data.set(key, value);
  }
  removeItem(key: string) { if (this.denyRemoval) throw new Error('Blocked'); this.data.delete(key); }
}

let memory: MemoryStorage;
const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
beforeEach(() => {
  memory = new MemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: memory });
});
afterEach(() => {
  if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
  else Reflect.deleteProperty(globalThis, 'localStorage');
});
const article = (id: string, content = 'Research'): Article => ({
  id, slug: `article-${id}`, title: `Article ${id}`, summary: 'Summary', content,
  area: 'OT', date: '2026-10-18', readTime: '5 min', published: false, views: 7,
});

test('a successful edit is written and read back before subscribers observe the saved state', () => {
  const store = createPersistentStore('notes', [], isStringArray);
  let observed = false;
  store.subscribe(() => {
    assert.deepEqual(JSON.parse(memory.getItem('notes')!), store.getSnapshot().value);
    observed = true;
  });
  assert.equal(memory.writes.length, 0);
  store.set(['Saved']);
  assert.equal(observed, true);
  assert.equal(store.getSnapshot().error, null);
});

test('quota failures do not report success or evict media, counters or previous edits', () => {
  memory.data.set('notes', '["Previous"]');
  memory.data.set('ot_sec_media', 'media-to-keep');
  memory.data.set('ot_sec_analytics', 'analytics-to-keep');
  const store = createPersistentStore('notes', [], isStringArray);
  memory.full = true;
  assert.throws(() => store.set(['Unsaved']), /cheio/);
  assert.deepEqual(store.getSnapshot().value, ['Previous']);
  assert.match(store.getSnapshot().error!, /cheio/);
  assert.equal(memory.getItem('notes'), '["Previous"]');
  assert.equal(memory.getItem('ot_sec_media'), 'media-to-keep');
  assert.equal(memory.getItem('ot_sec_analytics'), 'analytics-to-keep');
  assert.equal(safeSetItem(LOCAL_ARTICLES_KEY, '[]'), false);
  memory.full = false;
  store.set(['Recovered']);
  assert.equal(store.getSnapshot().error, null);
  assert.deepEqual(JSON.parse(memory.getItem('notes')!), ['Recovered']);
});

test('a browser dropping writes is treated as a failure even without an exception', () => {
  const store = createPersistentStore('notes', [], isStringArray);
  memory.dropWrites = true;
  assert.throws(() => store.set(['Unsaved']), /confirmar/);
  assert.deepEqual(store.getSnapshot().value, []);
});

test('blocked storage getters do not crash initial loading or language preferences', () => {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('SecurityError'); } });
  assert.equal(safeGetItem('ot_sec_language'), null);
  assert.equal(safeSetItem('ot_sec_language', 'pt'), false);
  const store = createPersistentStore('notes', ['Fallback'], isStringArray);
  assert.deepEqual(store.getSnapshot().value, ['Fallback']);
  assert.ok(store.getSnapshot().error);
  assert.throws(() => store.set(['Unsaved']), /confirmar/);
  assert.deepEqual(store.getSnapshot().value, ['Fallback']);
});

test('malformed and wrong-shaped data are preserved on load instead of overwritten with defaults', () => {
  for (const raw of ['{broken', 'null', '{"unexpected":true}']) {
    memory.data.set('notes', raw);
    const result = readStoredJson('notes', ['Fallback'], isStringArray);
    assert.deepEqual(result.value, ['Fallback']);
    assert.equal(result.recoveryRaw, raw);
    assert.equal(memory.getItem('notes'), raw);
  }
  assert.equal(memory.writes.length, 0);
});

test('a corrupt original is backed up before an explicit replacement can succeed', () => {
  memory.data.set('notes', '{broken');
  const store = createPersistentStore('notes', [], isStringArray);
  memory.full = true;
  assert.throws(() => store.set(['Replacement']));
  assert.equal(memory.getItem('notes'), '{broken');
  memory.full = false;
  store.set(['Replacement']);
  const backup = [...memory.data].find(([key]) => key.startsWith('notes_recovery_'));
  assert.equal(backup?.[1], '{broken');
  assert.deepEqual(JSON.parse(memory.getItem('notes')!), ['Replacement']);
});

test('another tab cannot be silently overwritten and sequential updates use the latest committed value', () => {
  const store = createPersistentStore('notes', [], isStringArray);
  store.set(previous => [...previous, 'First']);
  store.set(previous => [...previous, 'Second']);
  assert.deepEqual(store.getSnapshot().value, ['First', 'Second']);
  memory.data.set('notes', '["Other tab"]');
  assert.throws(() => store.set(['Stale edit']), /outra aba/);
  assert.equal(memory.getItem('notes'), '["Other tab"]');
});

test('nonessential telemetry can continue in memory while explicit resets still require a confirmed write', () => {
  const store = createPersistentStore('telemetry', [], isStringArray, { bestEffort: true });
  memory.full = true;
  assert.doesNotThrow(() => store.set(['Visit']));
  assert.deepEqual(store.getSnapshot().value, ['Visit']);
  assert.throws(() => store.set([], true));
  assert.deepEqual(store.getSnapshot().value, ['Visit']);
});

test('legacy articles and canonical edits are recovered before the legacy key is removed', () => {
  const legacy = [{ ...article('1'), slug: undefined }, article('custom')];
  memory.data.set(LEGACY_ARTICLES_KEY, JSON.stringify(legacy));
  memory.data.set('ot_sec_article_views', '{"1":19}');
  const result = loadLocalArticles();
  assert.equal(result.error, null);
  assert.equal(result.value.length, 2);
  assert.equal(result.value[0].slug, 'article-1');
  assert.equal(result.value[0].views, 7);
  assert.equal(memory.getItem(LEGACY_ARTICLES_KEY), null);
  assert.deepEqual(JSON.parse(memory.getItem(LOCAL_ARTICLES_KEY)!), result.value);
  assert.equal(memory.getItem('ot_sec_article_views'), '{"1":19}');
  assert.deepEqual(loadLocalArticles().value, result.value);
});

test('migration merges stores, keeps the current edit and preserves conflicting legacy content', () => {
  memory.data.set(LOCAL_ARTICLES_KEY, JSON.stringify([article('1', 'Current edit')]));
  const original = JSON.stringify([article('1', 'Older different edit'), article('2')]);
  memory.data.set(LEGACY_ARTICLES_KEY, original);
  const result = loadLocalArticles();
  assert.equal(result.value[0].content, 'Current edit');
  assert.equal(result.value.length, 2);
  assert.ok([...memory.data].some(([key, raw]) => key.startsWith(`${LEGACY_ARTICLES_KEY}_recovery_`) && raw === original));
  assert.equal(memory.getItem(LEGACY_ARTICLES_KEY), null);
});

test('interrupted migration leaves originals available, exposes recovered work in memory and can be retried', () => {
  const original = JSON.stringify([article('1')]);
  memory.data.set(LEGACY_ARTICLES_KEY, original);
  memory.full = true;
  const failed = loadLocalArticles();
  assert.ok(failed.error);
  assert.equal(failed.value[0].content, 'Research');
  assert.equal(memory.getItem(LEGACY_ARTICLES_KEY), original);
  assert.equal(memory.getItem(LOCAL_ARTICLES_KEY), null);
  memory.full = false;
  const recovered = loadLocalArticles();
  assert.equal(recovered.error, null);
  assert.equal(memory.getItem(LEGACY_ARTICLES_KEY), null);
  assert.equal(recovered.value.length, 1);
});

test('failed legacy cleanup preserves both the verified new store and the original', () => {
  const original = JSON.stringify([article('1')]);
  memory.data.set(LEGACY_ARTICLES_KEY, original);
  memory.denyRemoval = true;
  const result = loadLocalArticles();
  assert.ok(result.error);
  assert.equal(memory.getItem(LEGACY_ARTICLES_KEY), original);
  assert.ok(isArticleArray(JSON.parse(memory.getItem(LOCAL_ARTICLES_KEY)!)));
});

test('malformed legacy data is never deleted, even when a current store already exists', () => {
  const current = JSON.stringify([article('1')]);
  memory.data.set(LOCAL_ARTICLES_KEY, current);
  memory.data.set(LEGACY_ARTICLES_KEY, 'not-json');
  assert.ok(loadLocalArticles().error);
  assert.equal(memory.getItem(LEGACY_ARTICLES_KEY), 'not-json');
  assert.equal(memory.getItem(LOCAL_ARTICLES_KEY), current);
  assert.equal(memory.writes.length, 0);
});
