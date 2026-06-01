<script lang="ts">
    import { langState } from '$lib/lang.svelte.js'; // Importuješ sdílený stav
    import { translations } from '$lib/translations.js';
    let { data } = $props(); // 'data' jsou data z tvého serverového loadu
</script>

<main>
    <h1>{translations[langState.value].mainTitle}</h1>
    {#each Object.entries(data.menu) as [tyden, dny]}
        <div style="border: 1px solid #000; padding: 20px; margin: 20px 0;">
            <h2>
                {tyden === data.currentWeek.toString()
                    ? translations[langState.value].week
                    : translations[langState.value].nextWeek}
            </h2>

{#each Object.entries(data.menu) as [tyden, dny]}
    <div style="border: 1px solid #000; padding: 20px; margin: 20px 0;">
        <h2>{tyden === data.currentWeek.toString() ? translations[lang].week : translations[lang].nextWeek}</h2>

                <div style="display: grid; gap: 20px;">
                    <div>
                        <h4>{translations[langState.value].soups}</h4>
                        <ol>{#each info.polevky as p}<li>
                            {p.Hmotnost}
                            {#if langState.value === 'cs'}
                                {p.Název}
                            {:else}
                                {p.Nazev_DE}
                            {/if} - {p.Cena} Kč</li>{/each}</ol>
                    </div>
                    <div>
                        <h4>{translations[langState.value].meals}</h4>
                        <ol>{#each info.jidla as p}<li>
                            {p.Hmotnost}
                            {#if langState.value === 'cs'}
                                {p.Název}
                            {:else}
                                {p.Nazev_DE}
                            {/if} - {p.Cena} Kč</li>{/each}</ol>
                    </div>
                </div>
            {/each}
        </div>
    {/each}
</main>
