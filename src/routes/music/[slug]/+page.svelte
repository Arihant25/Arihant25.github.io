<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import { musicReleases } from '$lib/musicData';

	let { data }: { data: PageData } = $props();

	// Get the slug parameter from the URL
	const slug = page.params.slug;

	// Find the current release based on the slug
	const release = musicReleases.find((r) => r.slug === slug);
</script>

<svelte:head>
	<title>{release ? `${release.title} | Arihant` : 'Music | Arihant'}</title>
</svelte:head>

{#if release}
	<div class="mx-auto max-w-7xl p-5 py-12 sm:px-6 lg:px-8">
		<!-- Back button -->
		<div class="my-8 w-full">
			<a href="/music" class="group flex items-center gap-1 text-gray-700 hover:text-black">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				Back to Music
			</a>
		</div>

		<!-- Header with title and release info -->
		<div class="mb-10">
			<h1 class="text-4xl font-bold md:text-5xl lg:text-6xl">{release.title}</h1>
			<div class="mt-8 flex items-center">
				<span class="mr-4 text-xl font-semibold text-orange-500">{release.year}</span>
				<div class="rounded border border-orange-500 px-3 py-1 text-sm text-orange-500">
					{release.type}
				</div>
			</div>
		</div>

		<!-- Content area: About and Embed side by side on desktop -->
		<div class="flex flex-col gap-8 lg:flex-row">
			<!-- About this release -->
			<div class="w-full lg:w-1/3">
				<h2 class="mb-4 text-2xl font-semibold">About this release</h2>
				<p class="leading-relaxed text-gray-700">{release.extendedDescription}</p>
			</div>

			<!-- Spotify embed -->
			<div class="w-full lg:w-2/3">
				<h2 class="mb-4 text-2xl font-semibold">Listen</h2>
				<div class="overflow-hidden rounded-lg">
					<iframe
						src={release.spotifyEmbed}
						style="width:100%; max-width:100%;"
						height="380"
						frameborder="0"
						allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
						loading="lazy"
						class="rounded-lg"
						title="Spotify Embed"
					></iframe>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="mx-auto flex flex-col items-center p-4 py-12 sm:px-6 lg:px-8">
		<h1 class="mb-4 text-4xl font-bold">Release Not Found</h1>
		<p class="mb-8">The music release you're looking for doesn't exist.</p>
		<a href="/music" class="text-orange-500 hover:text-orange-600"> Return to Music </a>
	</div>
{/if}
