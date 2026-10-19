import { assertSameOrigin, json, type PagesContext } from './_shared';
export async function onRequestPost({ request }: PagesContext): Promise<Response> {
  try { assertSameOrigin(request); }
  catch (error) { return json({ error: error instanceof Error ? error.message : 'Origem inválida.' }, 403); }
  return json({ authenticated: false }, 200, { 'Set-Cookie': 'ot_sec_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' });
}
