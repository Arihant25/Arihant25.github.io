<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { projects } from '$lib/projectData';
</script>

<svelte:head>
	<title>Code | Arihant</title>
	<meta name="description" content="Projects by Arihant." />
</svelte:head>

<div class="mx-auto flex flex-col items-center p-5 py-12 sm:px-6 lg:px-8">
	<h1 class="mt-8 mb-16 w-full text-center text-7xl font-bold sm:text-8xl lg:text-8xl">
		Projects<span class="orange">.</span>
	</h1>
	<div class="mb-12 grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 md:gap-16 lg:grid-cols-3 place-items-center">
		{#each projects as project}
			<ProjectCard {project} />
		{/each}
	</div>
</div>