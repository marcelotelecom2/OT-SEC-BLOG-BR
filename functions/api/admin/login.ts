import { assertSameOrigin, createSession, json, type PagesContext } from './_shared';

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  try {
    assertSameOrigin(request);
    if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) return json({ error: 'Painel não configurado no Cloudflare.' }, 503);
    const { password } = await request.json() as { password?: string };
    if (!password || password !== env.ADMIN_PASSWORD) return json({ error: 'Credencial inválida.' }, 401);
    const session = await createSession(env);
    return json({ authenticated: true }, 200, {
      'Set-Cookie': `ot_sec_session=${session}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`,
    });
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Falha no login.' }, 400); }
}
