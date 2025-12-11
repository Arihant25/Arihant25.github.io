<script lang="ts">
	import { onMount } from 'svelte';

	interface ResearchData {
		slug: string;
		title: string;
		year: number;
		venue: string;
		description: string;
		paperLink: string;
		codeLink?: string;
		coverImage: string;
		audioSummary: string;
	}

	interface Props {
		paper: ResearchData;
	}

	let { paper }: Props = $props();

	// Animation states
	let isHovered = $state(false);
	let isPlaying = $state(false);
	let audioElement: HTMLAudioElement | null = null;
	let isMobile = $state(false);

	// Construct full paths
	const coverImagePath = `/research/papers/${paper.slug}/${paper.coverImage}`;
	const audioSummaryPath = `/research/papers/${paper.slug}/${paper.audioSummary}`;

	onMount(() => {
		isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	});

	function handleMouseEnter() {
		if (!isMobile) {
			isHovered = true;
		}
	}

	function handleMouseLeave() {
		if (!isMobile) {
			isHovered = false;
			stopAudio();
		}
	}

	function toggleAudio(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (!audioElement) {
			audioElement = new Audio(audioSummaryPath);
			audioElement.addEventListener('ended', () => {
				isPlaying = false;
			});
		}

		if (isPlaying) {
			stopAudio();
		} else {
			audioElement.play();
			isPlaying = true;
		}
	}

	function stopAudio() {
		if (audioElement) {
			audioElement.pause();
			audioElement.currentTime = 0;
			isPlaying = false;
		}
	}

	function handleCardClick() {
		window.location.href = `/research/${paper.slug}`;
	}
</script>

<div
	class="research-card group relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ease-out"
	class:hovered={isHovered}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleCardClick}
	role="button"
	tabindex="0"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleCardClick();
		}
	}}
>
	<!-- Movie Poster Image -->
	<div class="poster-container relative aspect-[2/3] w-full overflow-hidden">
		<img
			src={coverImagePath}
			alt={paper.title}
			class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
		/>

		<!-- Year badge on top -->
		<div
			class="absolute top-2 left-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm"
		>
			{paper.year}
		</div>

		<!-- Gradient overlay on hover -->
		<div
			class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		></div>

		<!-- Info overlay on hover -->
		<div
			class="absolute right-0 bottom-0 left-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0"
		>
			<h3 class="mb-2 text-lg font-bold text-white">{paper.title}</h3>
			<div class="mb-2 text-sm text-gray-400">
				{paper.venue}
			</div>
			<p class="mb-3 text-sm text-gray-300">{paper.description}</p>

			<!-- Action buttons -->
			<div class="flex gap-2">
				<button
					onclick={(e) => {
						e.stopPropagation();
						window.open(paper.paperLink, '_blank');
					}}
					class="flex items-center justify-center rounded bg-white p-2 transition-colors hover:bg-gray-200"
					title="Read Paper"
					aria-label="Read Paper"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-black"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
						/>
					</svg>
				</button>

				<button
					onclick={toggleAudio}
					class="flex items-center justify-center rounded bg-gray-600/90 p-2 transition-colors hover:bg-gray-600"
					class:bg-orange={isPlaying}
					class:hover:bg-orange={isPlaying}
					title={isPlaying ? 'Stop Audio' : 'Listen to Summary'}
					aria-label={isPlaying ? 'Stop Audio' : 'Listen to Summary'}
				>
					{#if isPlaying}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-white"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
								clip-rule="evenodd"
							/>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-white"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
				</button>

				{#if paper.codeLink}
					<button
						onclick={(e) => {
							e.stopPropagation();
							window.open(paper.codeLink, '_blank');
						}}
						class="flex items-center justify-center rounded bg-gray-600/90 p-2 transition-colors hover:bg-gray-600"
						title="View Code"
						aria-label="View Code"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-white"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>

		<!-- Playing indicator badge -->
		{#if isPlaying}
			<div class="bg-orange absolute top-2 right-2 flex items-center gap-1 rounded-full px-2 py-1">
				<div class="flex gap-0.5">
					<div class="h-3 w-0.5 animate-pulse bg-white"></div>
					<div class="h-3 w-0.5 animate-pulse bg-white delay-75"></div>
					<div class="h-3 w-0.5 animate-pulse bg-white delay-150"></div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.research-card {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.research-card:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
		z-index: 10;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.delay-75 {
		animation-delay: 75ms;
	}

	.delay-150 {
		animation-delay: 150ms;
	}
</style>
