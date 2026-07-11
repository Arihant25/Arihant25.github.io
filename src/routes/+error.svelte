<script lang="ts">
	import { page } from '$app/state';

	const is404 = $derived(page.status === 404);
</script>

<div class="flex min-h-screen items-center justify-center">
	<div
		class="absolute top-1/2 left-1/2 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
	>
		<h1 class="font-ibm-plex-serif mb-2 text-9xl font-bold text-gray-800 dark:text-gray-200">
			{#if is404}
				4<span class="dying-bulb orange">0</span>4
			{:else}
				{page.status}
			{/if}
		</h1>
		<p class="mb-2 text-2xl text-gray-600 dark:text-gray-400">
			{is404 ? 'There’s no page here.' : 'Something went wrong.'}
		</p>
		{#if is404}
			<p class="font-space-mono mb-8 text-sm" style="color: var(--text-muted);">
				maybe there never was.
			</p>
		{/if}
		<a
			href="/"
			class="bg-orange rounded-md px-6 py-2 text-white shadow transition-all hover:brightness-90"
			>Walk back home</a
		>
	</div>
</div>

<style>
	/* The zero flickers like a bulb about to give up — which, here, it is */
	.dying-bulb {
		display: inline-block;
		animation: bulb-flicker 4s linear infinite;
	}

	@keyframes bulb-flicker {
		0%,
		61%,
		64%,
		66%,
		89%,
		92%,
		100% {
			opacity: 1;
		}
		62%,
		65% {
			opacity: 0.25;
		}
		90%,
		91.5% {
			opacity: 0.4;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dying-bulb {
			animation: none;
		}
	}
</style>
