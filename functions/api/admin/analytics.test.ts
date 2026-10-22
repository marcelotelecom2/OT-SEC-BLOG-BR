import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import { onRequestGet } from './analytics';
import { createSession } from './_shared';

Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto });
const env = { ADMIN_PASSWORD: 'test', ADMIN_SESSION_SECRET: 'test-only-secret', GITHUB_TOKEN: 'test', CLOUDFLARE_ANALYTICS_TOKEN: 'test-only-token' };

test('analytics requires a session and same origin; missing configuration never reports zero', async () => {
  assert.equal((await onRequestGet({ request: new Request('https://example.com/api/admin/analytics'), env })).status, 401);
  const cookie = `ot_sec_session=${await createSession(env)}`;
  const request = (query = '', origin = 'https://example.com') => new Request(`https://example.com/api/admin/analytics${query}`, { headers: { Cookie: cookie, Origin: origin } });
  assert.equal((await onRequestGet({ request: request('', 'https://other.example'), env })).status, 403);
  assert.equal((await onRequestGet({ request: request('?days=999'), env })).status, 400);
  const response = await onRequestGet({ request: request(), env: { ...env, CLOUDFLARE_ANALYTICS_TOKEN: '' } });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).pageViews, undefined);
});

test('provider totals, empty results and upstream failures remain distinct', async t => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  const request = new Request('https://example.com/api/admin/analytics?days=7', { headers: { Cookie: `ot_sec_session=${await createSession(env)}` } });
  let body: unknown = { data: { viewer: { accounts: [{ totals: [{ count: 37, sum: { visits: 27 } }] }] } } };
  globalThis.fetch = async (url, init) => {
    assert.equal(url, 'https://api.cloudflare.com/client/v4/graphql');
    assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer test-only-token');
    assert.ok(String(init?.body).includes('rumPageloadEventsAdaptiveGroups'));
    assert.ok(String(init?.body).includes('e497662b337b4a6ebb3c397563bc10f6'));
    return Response.json(body);
  };
  const response = await onRequestGet({ request, env });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const result = await response.json();
  assert.equal(result.visits, 27); assert.equal(result.pageViews, 37);
  assert.ok(Math.abs(Date.parse(result.end) - Date.parse(result.start) - 7 * 86400000) < 100);
  body = { data: { viewer: { accounts: [{ totals: [] }] } } };
  assert.equal((await (await onRequestGet({ request, env })).json()).visits, 0);
  for (const failure of [
    { errors: [{ message: 'test-only-token private error' }] },
    { data: { viewer: { accounts: [] } } },
    { data: { viewer: { accounts: [{ totals: [{ sum: { visits: 2 } }] }] } } },
  ]) {
    body = failure;
    const failed = await onRequestGet({ request, env });
    assert.equal(failed.status, 502);
    const text = await failed.text();
    assert.ok(!text.includes('test-only-token')); assert.ok(!text.includes('"visits":0'));
  }
  globalThis.fetch = async () => { throw new Error('network failed'); };
  assert.equal((await onRequestGet({ request, env })).status, 502);
});
