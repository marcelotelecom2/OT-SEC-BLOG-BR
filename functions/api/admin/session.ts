import { isAuthenticated, json, type PagesContext } from './_shared';
export async function onRequestGet({ request, env }: PagesContext): Promise<Response> {
  return json({ authenticated: await isAuthenticated(request, env) });
}
