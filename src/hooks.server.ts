// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

const SUPPORTED = new Set(['cs', 'de']);

function parseAcceptLanguage(header?: string): string | null {
	if (!header) return null;
	const first = header.split(',')[0]?.split(';')[0]?.trim();
	if (!first) return null;
	const primary = first.split('-')[0].toLowerCase();
	if (primary === 'cz') return 'cs';
	return SUPPORTED.has(primary) ? primary : null;
}

export const handle: Handle = async ({ event, resolve }) => {
	// 1) Prefer cookie
	let lang = event.cookies.get('lang') ?? undefined;

	// normalize alias
	if (lang === 'cz') lang = 'cs';
	if (lang && !SUPPORTED.has(lang)) lang = undefined;

	// 2) Fallback to Accept-Language
	if (!lang) {
		lang = parseAcceptLanguage(event.request.headers.get('accept-language') ?? undefined) ?? 'cs';
	}

	// Save to locals for server-side loads
	event.locals.lang = lang;

	// Resolve and inject HTML lang placeholder
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%sveltekit.assets.lang%', lang!)
	});

	// Set header
	response.headers.set('Content-Language', lang!);

	return response;
};
