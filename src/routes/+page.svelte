<script lang="ts">
    import { translations } from '$lib/translations.js';
    let lang = $state('cz'); // Výchozí jazyk
    let { data } = $props();

</script>

<h1>Hotovky za kačku</h1>
<button onclick={() => lang = 'cz'} disabled={lang === 'cz'}>CZ</button>
<button onclick={() => lang = 'de'} disabled={lang === 'de'}>DE</button>

{#each Object.entries(data.menu) as [tyden, dny]}
    <div style="border: 1px solid #000; padding: 20px; margin: 20px 0;">
        <h2>{tyden === data.currentWeek.toString() ? translations[lang].week : translations[lang].nextWeek}</h2>

        {#each Object.entries(dny) as [den, info]: any}
            <h3>{translations[lang].days[den] || den} ({info.datum})</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h4>{translations[lang].soups}</h4>
                    <ol>{#each info.polevky as p}<li>{p.Název}</li>{/each}</ol>
                </div>
                <div>
                    <h4>{translations[lang].meals}</h4>
                    <ol >{#each info.jidla as p}<li>{p.Název} - {p.Cena} Kč</li>{/each}</ol>
                </div>
            </div>
        {/each}
    </div>
{/each}
