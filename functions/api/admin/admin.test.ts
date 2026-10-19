import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import { createSession, isAuthenticated, metadataSource, parseMetadataSource } from './_shared';

const env = {
  ADMIN_PASSWORD: 'test-only',
  ADMIN_SESSION_SECRET: 'a-long-test-secret-that-never-leaves-this-test',
  GITHUB_TOKEN: 'unused',
};

Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto });

test('repository metadata serialization is lossless and remains parseable by the Function', () => {
  const articles = [{ id: '1', slug: 'safe-slug', published: true, title: 'Title' }];
  assert.deepEqual(parseMetadataSource(metadataSource(articles)), articles);
});

test('admin sessions are signed, expire, and reject tampering', async () => {
  const session = await createSession(env);
  const valid = new Request('https://example.com/api/admin/session', { headers: { Cookie: `ot_sec_session=${session}` } });
  const tampered = new Request('https://example.com/api/admin/session', { headers: { Cookie: `ot_sec_session=${session}x` } });
  assert.equal(await isAuthenticated(valid, env), true);
  assert.equal(await isAuthenticated(tampered, env), false);
});
