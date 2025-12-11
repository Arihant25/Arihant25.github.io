<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
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
