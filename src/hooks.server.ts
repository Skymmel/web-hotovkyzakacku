// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

const SUPPORTED = new Set(['cs', 'de', 'en']);

// Accept-Language parsing intentionally removed.
// Prefer server default 'cs' when no cookie is present to avoid unexpected German fallback.

export const handle: Handle = async ({ event, resolve }) => {
    // 1) Prefer cookie
    let lang = event.cookies.get('lang') ?? undefined;

    // normalize alias
    if (lang === 'cz') lang = 'cs';
    if (lang && !SUPPORTED.has(lang)) lang = undefined;

    // 2) Fallback to Accept-Language
    if (!lang) {
            // Default to Czech ('cs') when no explicit cookie present.
            lang = 'cs';
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
