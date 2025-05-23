<script lang="ts">
	import type { PageData } from './$types';
	import MusicCard from '$lib/components/MusicCard.svelte';
	import { musicReleases } from '$lib/musicData';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto flex flex-col items-center p-4 py-12 sm:px-6 lg:px-8">
	<h1 class="mb-16 w-full text-center text-7xl font-bold sm:text-8xl lg:text-8xl">
		Music<span class="orange">.</span>
	</h1>

	<!-- Music Cards Grid -->
	<div class="mb-12 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each musicReleases as release}
			<MusicCard
				coverImage={release.coverImage}
				title={release.title}
				description={release.description}
				year={release.year}
				slug={release.slug}
			/>
		{/each}
	</div>
</div>
