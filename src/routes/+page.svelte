<script lang="ts">
    let { data } = $props();

    // Výpočet týdne
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const currentWeek = Math.ceil((((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000) + 1) / 7);

    // Zpracování dat
    const menu = (data.data || []).reduce((acc: any, p: any) => {
        const tw = parseInt(p.Týden);
        if (tw !== currentWeek && tw !== currentWeek + 1) return acc;

        if (!acc[tw]) acc[tw] = {};
        if (!acc[tw][p.Den]) acc[tw][p.Den] = { datum: p.Datum, polevky: [], jidla: [] };

        if (p.Kategorie === 'Polévka') acc[tw][p.Den].polevky.push(p);
        else acc[tw][p.Den].jidla.push(p);

        return acc;
    }, {});
</script>

<h1>Hotovky za kačku</h1>

{#each Object.entries(menu) as [tyden, dny]}
    <div style="border: 1px solid #000; padding: 20px; margin: 20px 0;">
        <h2>{tyden === currentWeek.toString() ? 'Tento týden' : 'Příští týden'}</h2>
        {#each Object.entries(dny) as [den, info]: any}
            <h3>{den} ({info.datum})</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <ol>{#each info.polevky as p}<li>{p.Název}</li>{/each}</ol>
                    <ol>{#each info.jidla as p}<li>{p.Název}</li>{/each}</ol>
                </div>
            </div>
        {/each}
    </div>
{/each}
