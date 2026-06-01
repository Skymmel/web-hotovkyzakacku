<script lang="ts">
	import { onMount } from 'svelte';
	import { langState } from '$lib/lang.svelte.js';
	import './globals.scss';
	let { data, children } = $props();
	import { translations } from '$lib/translations.js';

	let isOpen = $state(false);
	function toggleNav() {
		isOpen = !isOpen;
	}
	function closeNav() {
		isOpen = false;
	}

	// Initialize lang from server (locals.lang)
	$effect(() => {
		langState.set((data as any).lang ?? 'cs');
	});

	// Ensure <html lang> reflects current lang state
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.lang = langState.value;
		}
	});

	onMount(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.lang = (data as any).lang ?? 'cs';
		}
	});

	function changeLang(newLang: string) {
		// update state and cookie; no URL prefixing
		langState.set(newLang);
		document.cookie = `lang=${newLang}; path=/; max-age=31536000; samesite=lax`;
		if (typeof document !== 'undefined') {
			document.documentElement.lang = newLang;
		}
	}
</script>

<header class="site-header">
	<div class="header-items">
		<div class="mobile-site-header">
			<div class="logo">
				<a href="/">
					<img src="/logo.svg" alt="HotovkyZaKacku.cz" />
				</a>
			</div>
			<button onclick={() => toggleNav()}>=</button>
		</div>
		<div class="main-navigation" class:open={isOpen}>
			<div class="nav-items">
				<nav aria-label="Hlavní navigace" class="site-navigation">
					<ul>
						<li>
							<a href="/" onclick={() => closeNav()}
								>{translations[langState.value].navigation.home}</a
							>
						</li>
						<li>
							<a href="/#menu" onclick={() => closeNav()}
								>{translations[langState.value].navigation.menu}</a
							>
						</li>
						<li><a href="/#kontakt" onclick={() => closeNav()}>Kontakt</a></li>
					</ul>
				</nav>
				<div class="site-language">
					<small>{translations[langState.value].navigation.language}</small>
					<nav aria-label="Jazykové volby">
						<button onclick={() => changeLang('cs')} disabled={langState.value === 'cs'}>
							<svg
								width="20px"
								height="20px"
								viewBox="0 0 24 24"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								aria-labelledby="languageIconTitle"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								fill="none"
								color="currentColor"
								><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								></g><g id="SVGRepo_iconCarrier">
									<title id="languageIconTitle">Language</title>
									<circle cx="12" cy="12" r="10"></circle>
									<path
										stroke-linecap="round"
										d="M12,22 C14.6666667,19.5757576 16,16.2424242 16,12 C16,7.75757576 14.6666667,4.42424242 12,2 C9.33333333,4.42424242 8,7.75757576 8,12 C8,16.2424242 9.33333333,19.5757576 12,22 Z"
									></path> <path stroke-linecap="round" d="M2.5 9L21.5 9M2.5 15L21.5 15"></path>
								</g></svg
							>CS</button
						>
						<button onclick={() => changeLang('de')} disabled={langState.value === 'de'}>
							<svg
								width="20px"
								height="20px"
								viewBox="0 0 24 24"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								aria-labelledby="languageIconTitle"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								fill="none"
								color="currentColor"
								><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								></g><g id="SVGRepo_iconCarrier">
									<title id="languageIconTitle">Language</title>
									<circle cx="12" cy="12" r="10"></circle>
									<path
										stroke-linecap="round"
										d="M12,22 C14.6666667,19.5757576 16,16.2424242 16,12 C16,7.75757576 14.6666667,4.42424242 12,2 C9.33333333,4.42424242 8,7.75757576 8,12 C8,16.2424242 9.33333333,19.5757576 12,22 Z"
									></path> <path stroke-linecap="round" d="M2.5 9L21.5 9M2.5 15L21.5 15"></path>
								</g></svg
							>DE</button
						>
					</nav>
				</div>
			</div>
		</div>
	</div>
</header>
{@render children()}
<footer></footer>
