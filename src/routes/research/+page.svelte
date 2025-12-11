<!-- filepath: /home/arihanttr/Git/Arihant25.github.io/src/routes/research/+page.svelte -->
<script lang="ts">
	import ResearchCard from '$lib/components/ResearchCard.svelte';
	import { researchData } from '$lib/researchData';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Research | Arihant</title>
	<meta name="description" content="Research papers by Arihant." />
</svelte:head>

<div class="mx-auto flex flex-col items-center p-5 py-12 sm:px-6 lg:px-8">
	<h1 class="mt-8 mb-16 w-full text-center text-7xl font-bold sm:text-8xl lg:text-8xl">
		Research<span class="orange">.</span>
	</h1>

	<div
		class="mb-12 grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 sm:gap-12 md:gap-16 lg:grid-cols-3 xl:grid-cols-4"
	>
		{#each researchData as paper}
			<ResearchCard {paper} />
		{/each}
	</div>
</div>
