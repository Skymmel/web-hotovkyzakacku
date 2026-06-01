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
    parts.sort((a, b) => b.q - a.q);
    for (const p of parts) {
        const primary = p.range.split('-')[0].toLowerCase();
        const normalized = primary === 'cz' ? 'cs' : primary;
        if (SUPPORTED.has(normalized)) return normalized;
    }
    return null;
}

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Získáme jazyk z cookie (pokud existuje)
    let lang = event.cookies.get('lang');
    const hadCookie = lang !== undefined;

    // normalize alias
    if (lang === 'cz') lang = 'cs';

    // 2. Pokud cookie není, podíváme se na hlavičku prohlížeče
    if (!lang) {
        const acceptLanguage = event.request.headers.get('accept-language');
        lang = parseAcceptLanguage(acceptLanguage ?? undefined) ?? 'cs';
    }

    // 3. Uložíme jazyk do locals, aby byl dostupný v layoutu/stránkách
    event.locals.lang = lang;

    // 4. Pokud návštěva přišla bez cookie, nastavíme ji aby preference přetrvala
    if (!hadCookie) {
        event.cookies.set('lang', lang!, { path: '/', maxAge: 31536000, sameSite: 'lax' });
    }

    // 5. Vložíme jazyk do HTML tagu pro SEO
    return await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%sveltekit.assets.lang%', lang!)
    });
};
