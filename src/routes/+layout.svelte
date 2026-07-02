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
