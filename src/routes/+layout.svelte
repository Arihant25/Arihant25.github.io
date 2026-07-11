<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { preloadSounds } from '$lib/sounds';

	let { children } = $props();

	onMount(() => {
		// Warm the sound cache while the browser is idle so pages that
		// play audio (e.g. research papers) respond instantly.
		if ('requestIdleCallback' in window) {
			requestIdleCallback(() => preloadSounds());
		} else {
			setTimeout(preloadSounds, 1000);
		}

		// A note for the people who open the hood.
		console.log(
			'%c“%c\nHi, fellow tinkerer! What are you doing here? The site is open source, snoop around github.com/Arihant25/Arihant25.github.io if you want to see the code.\n',
			'color: #FF5722; font-family: Georgia, serif; font-size: 48px; font-weight: bold;',
			'color: inherit; font-family: monospace; font-size: 12px;'
		);
	});
</script>

<div
	class="grid-bg flex min-h-screen flex-col"
	style="background-color: var(--bg-primary); color: var(--text-primary);"
>
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
