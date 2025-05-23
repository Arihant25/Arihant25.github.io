<script lang="ts">
	import PhotoCard from '$lib/components/PhotoCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto flex flex-col items-center p-4 py-12 sm:px-6 lg:px-8">
	<h1 class="mb-16 w-full text-center text-7xl font-bold sm:text-8xl lg:text-8xl">
		Photos<span class="orange">.</span>
	</h1>

	{#if data.photos.length > 0}
		<!-- Photowall - True masonry layout -->
		<div class="photowall-container">
			<div class="masonry-grid">
				{#each data.photos as photo (photo.id)}
					<PhotoCard {photo} />
				{/each}
			</div>
		</div>
	{:else}
		<!-- Empty state -->
		<div class="flex flex-col items-center justify-center py-20 text-center">
			<div class="mb-4 text-6xl opacity-20">📷</div>
			<h2 class="mb-2 text-2xl font-semibold text-gray-700">No photos yet</h2>
			<p class="text-gray-500">
				Photos will appear here once they're uploaded to the static/photos folder.
			</p>
		</div>
	{/if}
</div>

<style>
	.photowall-container {
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.masonry-grid {
		columns: 4;
		column-gap: 8px;
		width: 100%;
	}

	/* Responsive column adjustments */
	@media (max-width: 1200px) {
		.masonry-grid {
			columns: 3;
			column-gap: 6px;
		}
	}

	@media (max-width: 768px) {
		.masonry-grid {
			columns: 2;
			column-gap: 4px;
		}

		.photowall-container {
			padding: 0 0.5rem;
		}
	}

	@media (max-width: 480px) {
		.masonry-grid {
			columns: 1;
			column-gap: 0;
		}
	}

	/* Ensure each photo card doesn't break across columns */
	:global(.photo-card) {
		break-inside: avoid;
		margin-bottom: 8px;
		display: block;
		width: 100%;
	}

	/* Tighter spacing on smaller screens */
	@media (max-width: 768px) {
		:global(.photo-card) {
			margin-bottom: 4px;
		}
	}
</style>
