// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Získáme jazyk z cookie (pokud existuje)
    let lang = event.cookies.get('lang');

    // normalize alias
    if (lang === 'cz') lang = 'cs';

    // 2. Default to Czech when no cookie present
    if (!lang) {
        lang = 'cs';
    }

    // 3. Uložíme jazyk do locals, aby byl dostupný v layoutu/stránkách
    event.locals.lang = lang;

    // 4. Vložíme jazyk do HTML tagu pro SEO
    return await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%sveltekit.assets.lang%', lang!)
    });
};
