<script lang="ts">
	import { langState } from '$lib/lang.svelte.js';
	import { translations } from '$lib/translations.js';
	let { data } = $props();
</script>

<main>
	<!-- <h1>{translations[langState.value]?.week}</h1> -->
	{#if data?.error}
		<div style="background:#fee;border:1px solid #fbb;padding:12px;margin:12px 0;">
			Chyba: {data.error}
		</div>
	{/if}

	{#if data?.menu && Object.keys(data.menu).length > 0}
		{#each Object.entries(data.menu) as [tyden, dny]}
			<div class="menu">
				<h2>
					{tyden === (data.currentWeek ?? '').toString()
						? translations[langState.value]?.week
						: translations[langState.value]?.nextWeek}
				</h2>

				{#each Object.entries(dny) as [den, info]: any}
                    <div class="menu-day">
                        <h3>{translations[langState.value]?.days[den] || den} {(info as any).datum}</h3>
					<h4>{translations[langState.value]?.soups}</h4>
					<ol class="menu-list">
						{#each (info as any).polevky as p}
							<li>
							<div>
							<small>{(p as any).Hmotnost}</small>
							{langState.value === 'cs' ? (p as any).Název : (p as any).Nazev_DE}
							<span>{(p as any).Cena} Kč</span>
							</div>
							</li>
						{/each}
					</ol>
					<h4>{translations[langState.value]?.meals}</h4>
					<ol class="menu-list">
						{#each (info as any).jidla as p}
						<li>
						<div>
						<small>{(p as any).Hmotnost}</small>
						{langState.value === 'cs' ? (p as any).Název : (p as any).Nazev_DE}
						<span>{(p as any).Cena} Kč</span>
						</div>
						</li>
						{/each}
					</ol>
                    </div>

				{/each}
			</div>
		{/each}
	{:else}
		<p>Žádná data k zobrazení.</p>
	{/if}
</main>

<style lang="scss">
	@import 'page.scss';
</style>
