<script lang="ts">
    import { onMount } from 'svelte';
    import { langState } from '$lib/lang.svelte.js';
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
        document.cookie = `lang=${newLang}; path=/; max-age=31536000`;
        if (typeof document !== 'undefined') {
            document.documentElement.lang = newLang;
        }
    }
</script>
<header class="site-header">
  <div class="logo">
    <a href="/">
      <img src="logo.png" alt="HotovkyZaKacku.cz">
    </a>
  </div>
  <div class="">
      <nav aria-label="Jazykové volby" class="site-language">
          <button onclick={() => changeLang('cs')} disabled={langState.value === 'cs'}>CZ</button>
          <button onclick={() => changeLang('de')} disabled={langState.value === 'de'}>DE</button>
      </nav>
      <div>
          <button onclick={() => toggleNav()}>Navigace</button>
      </div>
  </div>
  <nav aria-label="Hlavní navigace" class:open={isOpen} class="site-navigation">
    <ul>
      <li><a href="/" onclick={() => closeNav()}>{translations[langState.value].navigation.home}</a></li>
      <li><a href="/#menu" onclick={() => closeNav()}>{translations[langState.value].navigation.menu}</a></li>
      <li><a href="/#kontakt" onclick={() => closeNav()}>Kontakt</a></li>
    </ul>
  </nav>
</header>
{@render children()}
<footer>

</footer>
