// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

const SUPPORTED = new Set(['cs', 'de']);

function parseAcceptLanguage(header?: string): string | null {
    if (!header) return null;
    const parts = header.split(',').map(p => p.trim()).map(part => {
        const [range, qpart] = part.split(';').map(p => p.trim());
        let q = 1;
        if (qpart) {
            const m = qpart.match(/q=([0-9.]+)/);
            if (m) q = parseFloat(m[1]);
        }
        return { range, q };
    });
    // sort by quality (descending)
    parts.sort((a, b) => b.q - a.q);
    for (const p of parts) {
        const primary = p.range.split('-')[0].toLowerCase();
        const normalized = primary === 'cz' ? 'cs' : primary;
        if (SUPPORTED.has(normalized)) return normalized;
    }
    return null;
}

export const handle: Handle = async ({ event, resolve }) => {
    // 1) Prefer cookie
    let lang = event.cookies.get('lang') ?? undefined;
    const hadCookie = lang !== undefined;

    // normalize alias
    if (lang === 'cz') lang = 'cs';
    if (lang && !SUPPORTED.has(lang)) lang = undefined;

    // 2) Fallback to Accept-Language (choose first supported preferred language)
    if (!lang) {
        const header = event.request.headers.get('accept-language') ?? undefined;
        lang = parseAcceptLanguage(header) ?? 'cs';
    }

    // Save to locals for server-side loads
    event.locals.lang = lang;

    // If this request came without a lang cookie, set it so subsequent requests persist the choice
    if (!hadCookie) {
        event.cookies.set('lang', lang!, { path: '/', maxAge: 31536000, sameSite: 'lax' });
    }

    // Resolve and inject HTML lang placeholder
    const response = await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%sveltekit.assets.lang%', lang!)
    });

    // Set header
    response.headers.set('Content-Language', lang!);

    return response;
};
