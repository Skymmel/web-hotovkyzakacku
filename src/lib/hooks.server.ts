// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Získáme jazyk z cookie (pokud existuje)
    let lang = event.cookies.get('lang');

    // 2. Pokud cookie není, podíváme se na hlavičku prohlížeče
    if (!lang) {
        const acceptLanguage = event.request.headers.get('accept-language');
        // Pokud prohlížeč preferuje němčinu (začíná na 'de'), nastavíme 'de', jinak 'cs'
        lang = acceptLanguage?.startsWith('de') ? 'de' : 'cs';
    }

    // 3. Uložíme jazyk do locals, aby byl dostupný v layoutu/stránkách
    event.locals.lang = lang;

    // 4. Vložíme jazyk do HTML tagu pro SEO
    return await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%sveltekit.assets.lang%', lang!)
    });
};
