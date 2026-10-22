import assert from 'node:assert/strict';
import test from 'node:test';
import type { RadarPublication } from '../types';
import { RADAR_TYPES, localizeRadar, originalSourceUrl, parseRadarSource, publicRadar, validateRadarPublication } from './radar';

// Test-only labels, never loaded by the site or published to the registry.
export const fixture: RadarPublication = {
  id: 'validation-only', type: 'news', title: 'Validation title', date: '2026-10-20',
  sourceName: 'Validation source', sourceUrl: 'https://example.com/source', comment: 'Validation commentary',
  published: true, sourceLanguage: 'en',
};

test('five Radar types support manual publication with the required original source and commentary', () => {
  for (const type of RADAR_TYPES) assert.equal(validateRadarPublication({ ...fixture, type }).type, type);
  for (const field of ['title', 'date', 'sourceName', 'sourceUrl', 'comment']) {
    assert.throws(() => validateRadarPublication({ ...fixture, [field]: '' }));
  }
  for (const sourceUrl of ['javascript:alert(1)', 'data:text/html,test', '/relative', 'https://user:secret@example.com']) {
    assert.throws(() => validateRadarPublication({ ...fixture, sourceUrl }));
    assert.equal(originalSourceUrl(sourceUrl), null);
  }
  assert.throws(() => validateRadarPublication({ ...fixture, date: '2026-02-30' }));
  assert.throws(() => validateRadarPublication({ ...fixture, type: 'unknown' }));
});

test('drafts can be incomplete, stay private and do not mutate the original registry', () => {
  const draft = validateRadarPublication({ ...fixture, id: 'draft', published: false, title: '', sourceName: '', sourceUrl: '', comment: '' });
  const entries = [draft, { ...fixture, id: 'older', date: '2026-10-19' }, fixture];
  assert.deepEqual(publicRadar(entries).map(item => item.id), ['validation-only', 'older']);
  assert.equal(entries[0], draft);
  assert.throws(() => parseRadarSource(JSON.stringify([fixture, fixture])), /Duplicate/);
  assert.throws(() => parseRadarSource('{}'));
});

test('related analysis preserves the original source and rejects unsafe paths', () => {
  const entry = validateRadarPublication({ ...fixture, articleSlug: 'ferc-2026-auditorias-nerc-cip-ia' });
  assert.equal(entry.sourceUrl, fixture.sourceUrl);
  assert.equal(localizeRadar(entry, 'es').articleSlug, entry.articleSlug);
  assert.equal(parseRadarSource(JSON.stringify([entry]))[0].articleSlug, entry.articleSlug);
  for (const articleSlug of ['../admin', '/articles/test', 'https://example.com', 'test?lang=en', null]) {
    assert.throws(() => validateRadarPublication({ ...fixture, articleSlug }));
  }
});

test('Portuguese and Spanish translations are optional and never fabricated', () => {
  const entry = validateRadarPublication({ ...fixture, translations: {
    pt: { title: 'Título de validação', comment: 'Comentário de validação' },
    es: { title: 'Título de validación', comment: 'Comentario de validación' },
  } });
  assert.equal(localizeRadar(entry, 'pt').title, 'Título de validação');
  assert.equal(localizeRadar(entry, 'es').sourceLanguage, 'es');
  assert.equal(localizeRadar(fixture, 'pt'), fixture);
  assert.equal(entry.sourceLanguage, 'en');
  assert.throws(() => validateRadarPublication({ ...fixture, translations: { pt: { title: 'Only title', comment: '' } } }));
});
