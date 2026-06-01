// src/lib/lang.svelte.ts
export class LangState {
	// Reaktivní proměnná pro Svelte 5
	value = $state('cs');

	// Metoda pro změnu jazyka
	set(lang: string) {
		this.value = lang;
	}
}

// Exportujeme instanci, aby byla sdílená v celé aplikaci
export const langState = new LangState();
