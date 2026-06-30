<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import 'page-flip/src/Style/stPageFlip.css';
	import WaveSurfer from 'wavesurfer.js';

	let { data }: { data: PageData } = $props();
	const { paper } = data;

	let flipBookContainer: HTMLDivElement;
	let pageFlip: any;
	let PageFlipClass: any;
	let wavesurfer: WaveSurfer | null = null;
	let waveformContainer = $state<HTMLDivElement | undefined>(undefined);
	let isPlaying = $state(false);
	let currentTime = $state('0:00');
	let duration = $state('0:00');
	let playbackSpeed = $state(1);
	let paperPages = $state<string[]>([]);

	// Determine available paper pages
	onMount(async () => {
		if (!browser) return;

		// Dynamically import page-flip
		const PageFlipModule = await import('page-flip');
		PageFlipClass = PageFlipModule.PageFlip || (PageFlipModule as any).default;

		// Play tudum sound when page loads
		const tudumSound = new Audio('/audio/tudum.mp3');
		tudumSound.volume = 0.3;
		tudumSound.play().catch(() => {
			// Ignore errors if audio can't play
		});

		// Generate paper pages based on pageCount from researchData
		const pages: string[] = [];
		const pageImageExtension = paper.pageImageExtension ?? 'png';

		// Add cover image as the first page
		pages.push(`/research/papers/${paper.slug}/${paper.coverImage}`);

		for (let i = 1; i <= paper.pageCount; i++) {
			pages.push(`/research/papers/${paper.slug}/${paper.slug}-${i}.${pageImageExtension}`);
		}

		paperPages = pages;

		// Initialize WaveSurfer
		initializeAudioPlayer();
	});

	// Initialize flipbook when paperPages are loaded and container is ready
	$effect(() => {
		if (paperPages.length === 0 || !flipBookContainer) return;

		// Use setTimeout to ensure DOM is fully updated
		setTimeout(() => {
			initializeFlipBook();
		}, 0);
	});

	function playFlipSound() {
		const flipSound = new Audio('/audio/flip.mp3');
		flipSound.play().catch(() => {
			// Ignore errors if audio can't play
		});
	}

	function initializeFlipBook() {
		if (!browser || !flipBookContainer || !PageFlipClass) {
			return;
		}

		// Prevent duplicate listeners when reinitializing on resize.
		window.removeEventListener('resize', handleResize);

		// Clean up existing instance if any
		if (pageFlip) {
			pageFlip.destroy();
		}

		const isMobile = window.innerWidth < 768;

		pageFlip = new PageFlipClass(flipBookContainer, {
			width: isMobile ? window.innerWidth - 40 : 550,
			height: isMobile ? (window.innerWidth - 40) * 1.414 : 733,
			size: 'stretch',
			minWidth: 315,
			maxWidth: 1000,
			minHeight: 420,
			maxHeight: 1350,
			showCover: true,
			mobileScrollSupport: false,
			swipeDistance: 30,
			clickEventForward: true,
			usePortrait: isMobile,
			startPage: 0,
			drawShadow: false,
			flippingTime: 1000,
			useMouseEvents: true,
			autoSize: true,
			maxShadowOpacity: 0.5,
			showPageCorners: true,
			disableFlipByClick: false
		});

		// Load pages from HTML elements in the container
		const pages = flipBookContainer.querySelectorAll('.page');
		if (pages.length > 0) {
			pageFlip.loadFromHTML(pages);
		}

		// Add event listener for page flip
		pageFlip.on('flip', (e: any) => {
			// Don't play sound for first page (front cover) or last page (back cover)
			const currentPage = e.data;
			const totalPages = pageFlip.getPageCount();

			// Skip sound if flipping to/from the first or last page
			if (currentPage !== 0 && currentPage !== totalPages - 1) {
				playFlipSound();
			}
		});

		// Handle window resize
		window.addEventListener('resize', handleResize);
	}

	function handleResize() {
		if (!pageFlip) return;

		const currentPage = pageFlip.getCurrentPageIndex?.() ?? 0;
		initializeFlipBook();

		if (pageFlip && typeof pageFlip.turnToPage === 'function') {
			pageFlip.turnToPage(currentPage);
		}
	}

	function initializeAudioPlayer() {
		if (!paper.audioSummary) return;
		if (!browser || !waveformContainer) return;

		const audioPath = `/research/papers/${paper.slug}/${paper.audioSummary}`;

		// Check if dark mode is active
		const isDarkMode = document.documentElement.classList.contains('dark');

		// Adjust height based on screen size
		const isMobile = window.innerWidth < 768;
		const waveformHeight = isMobile ? 60 : 80;

		wavesurfer = WaveSurfer.create({
			container: waveformContainer,
			waveColor: isDarkMode ? '#94a3b8' : '#6b7280',
			progressColor: '#FF5722',
			cursorColor: '#FF5722',
			barWidth: 2,
			barGap: 1,
			barRadius: 3,
			height: waveformHeight,
			normalize: true,
			interact: true
		});

		wavesurfer.load(audioPath);

		wavesurfer.on('ready', () => {
			duration = formatTime(wavesurfer!.getDuration());
		});

		wavesurfer.on('audioprocess', () => {
			currentTime = formatTime(wavesurfer!.getCurrentTime());
		});

		wavesurfer.on('play', () => {
			isPlaying = true;
		});

		wavesurfer.on('pause', () => {
			isPlaying = false;
		});

		wavesurfer.on('finish', () => {
			isPlaying = false;
		});
	}

	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${minutes}:${secs.toString().padStart(2, '0')}`;
	}

	function togglePlayPause() {
		if (wavesurfer) {
			wavesurfer.playPause();
		}
	}

	function skipBackward() {
		if (wavesurfer) {
			wavesurfer.skip(-10);
		}
	}

	function skipForward() {
		if (wavesurfer) {
			wavesurfer.skip(10);
		}
	}

	function changePlaybackSpeed(speed: number) {
		playbackSpeed = speed;
		if (wavesurfer) {
			wavesurfer.setPlaybackRate(speed);
		}
	}

	onDestroy(() => {
		if (pageFlip) {
			pageFlip.destroy();
		}
		if (wavesurfer) {
			wavesurfer.destroy();
		}
		window.removeEventListener('resize', handleResize);
	});

	const scholarlySchema = {
		'@context': 'https://schema.org',
		'@type': 'ScholarlyArticle',
		headline: paper.title,
		description: paper.description,
		url: `https://arihant25.github.io/research/${paper.slug}`,
		sameAs: paper.paperLink,
		author: {
			'@type': 'Person',
			name: 'Arihant',
			url: 'https://arihant25.github.io'
		},
		datePublished: String(paper.year),
		publisher: {
			'@type': 'Organization',
			name: paper.venue
		}
	};
</script>

<svelte:head>
	<title>{paper.title} | Arihant</title>
	<meta name="description" content={paper.description} />
	<link rel="canonical" href="https://arihant25.github.io/research/{paper.slug}" />
	<meta property="og:title" content="{paper.title} | Arihant's Corner" />
	<meta property="og:description" content={paper.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://arihant25.github.io/research/{paper.slug}" />
	<meta
		property="og:image"
		content="https://arihant25.github.io/research/papers/{paper.slug}/{paper.coverImage}"
	/>
	<meta name="twitter:title" content="{paper.title} | Arihant's Corner" />
	<meta name="twitter:description" content={paper.description} />
	<meta
		name="twitter:image"
		content="https://arihant25.github.io/research/papers/{paper.slug}/{paper.coverImage}"
	/>
	{@html `<script type="application/ld+json">${JSON.stringify(scholarlySchema)}</script>`}
</svelte:head>

<div
	class="grid-bg min-h-screen"
	style="background-color: var(--bg-primary); color: var(--text-primary);"
>
	<div class="mx-auto max-w-7xl px-5 pt-20 pb-12 sm:px-6 lg:px-8">
		<!-- Back button -->
		<div class="mb-8">
			<a
				href="/research"
				class="group inline-flex items-center space-x-2 text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
			>
				<svg
					class="h-4 w-4 transition-transform group-hover:-translate-x-1"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					></path>
				</svg>
				<span class="text-sm font-medium">Back to Research</span>
			</a>
		</div>

		<!-- Header -->
		<div>
			<h1
				class="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
				style="font-family: var(--font-ibm-plex-serif); color: var(--text-primary);"
			>
				{paper.title}<span class="orange">.</span>
			</h1>
			<div
				class="mb-4 flex flex-wrap gap-3 text-base md:text-lg"
				style="color: var(--text-secondary);"
			>
				<span class="font-medium">{paper.venue}</span>
				<span class="text-orange-500">•</span>
				<span>{paper.year}</span>
			</div>
			<p
				class="mb-6 text-lg leading-relaxed font-light md:text-xl"
				style="color: var(--text-secondary);"
			>
				{paper.description}
			</p>
			<!-- Action Links -->
			<div class="flex flex-wrap gap-3">
				<a
					href={paper.paperLink}
					target="_blank"
					rel="noopener noreferrer"
					class="bg-orange inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
				>
					<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
						/>
					</svg>
					Read Paper
				</a>
				{#if paper.codeLink}
					<a
						href={paper.codeLink}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
						style="background-color: var(--card-bg); color: var(--text-primary); border: 1px solid var(--border-color);"
					>
						<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
						View Code
					</a>
				{/if}
			</div>
		</div>

		<!-- Flipbook Container -->
		<div class="mb-12 flex justify-center">
			<div bind:this={flipBookContainer} class="flipbook-container">
				{#if paperPages.length > 0}
					<!-- Front cover with hard density -->
					<div class="page page-cover page-cover-top" data-density="hard">
						<div class="page-content">
							<img
								src={paperPages[0]}
								alt="{paper.title} cover"
								class="h-full w-full object-cover"
							/>
						</div>
					</div>

					<!-- Inner pages -->
					{#each paperPages.slice(1) as pageImage, i}
						<div class="page">
							<div class="page-content">
								<img src={pageImage} alt="Page {i + 1}" class="h-full w-full object-cover" />
							</div>
						</div>
					{/each}

					<!-- Back cover with hard density -->
					<div class="page page-cover page-cover-bottom" data-density="hard">
						<div class="page-content flex items-center justify-center" style="background: #000000;">
							<p
								style="color: #ffffff; font-size: 2rem; font-weight: 300; font-family: var(--font-ibm-plex-serif);"
							>
								The End<span style="color: #FF5722;">.</span>
							</p>
						</div>
					</div>
				{/if}
			</div>
		</div>

		{#if paper.audioSummary}
			<!-- Audio Player -->
			<div
				class="mx-auto max-w-4xl rounded-lg p-4 shadow-lg md:p-6"
				style="background-color: var(--card-bg); border: 1px solid var(--border-color);"
			>
				<h2
					class="mb-4 text-xl font-semibold md:mb-6 md:text-2xl"
					style="color: var(--text-primary); font-family: var(--font-ibm-plex-serif);"
				>
					AI Overview Audio<span class="orange">.</span>
				</h2>

				<!-- Waveform -->
				<div bind:this={waveformContainer} class="mb-4 rounded-lg p-2 md:mb-6 md:p-3"></div>

				<!-- Controls -->
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<!-- Playback Controls -->
					<div class="flex items-center justify-center gap-3 md:gap-4">
						<!-- Skip Backward -->
						<button
							onclick={skipBackward}
							class="rounded-full p-2 transition-all duration-200 hover:scale-110 md:p-2.5"
							style="color: var(--text-secondary); background-color: var(--bg-secondary);"
							title="Skip -10s"
							aria-label="Skip backward 10 seconds"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
								></path>
							</svg>
						</button>

						<!-- Play/Pause -->
						<button
							onclick={togglePlayPause}
							class="bg-orange rounded-full p-3 text-white transition-all duration-200 hover:scale-110 hover:shadow-lg md:p-3.5"
							title={isPlaying ? 'Pause' : 'Play'}
						>
							{#if isPlaying}
								<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
										clip-rule="evenodd"
									/>
								</svg>
							{:else}
								<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}
						</button>

						<!-- Skip Forward -->
						<button
							onclick={skipForward}
							class="rounded-full p-2 transition-all duration-200 hover:scale-110 md:p-2.5"
							style="color: var(--text-secondary); background-color: var(--bg-secondary);"
							title="Skip +10s"
							aria-label="Skip forward 10 seconds"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
								></path>
							</svg>
						</button>
					</div>

					<!-- Speed Control and Time Display -->
					<div class="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
						<!-- Speed Slider -->
						<div class="flex items-center justify-center gap-2">
							<span class="text-xs font-medium" style="color: var(--text-secondary);">
								Speed:
							</span>
							<input
								type="range"
								min="1"
								max="2"
								step="0.1"
								value={playbackSpeed}
								oninput={(e) => changePlaybackSpeed(parseFloat(e.currentTarget.value))}
								class="speed-slider w-24 cursor-pointer md:w-20"
								aria-label="Playback speed"
							/>
							<span
								class="text-xs font-semibold"
								style="color: var(--text-primary); min-width: 2rem;"
							>
								{playbackSpeed.toFixed(1)}x
							</span>
						</div>

						<!-- Time Display -->
						<div
							class="text-center text-sm font-medium md:text-left"
							style="color: var(--text-secondary);"
						>
							<span>{currentTime}</span>
							<span class="mx-1">/</span>
							<span>{duration}</span>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.flipbook-container {
		max-width: 100%;
		overflow: visible;
	}

	:global(.stf__parent) {
		margin: 0 auto;
	}

	:global(.stf__wrapper) {
		border-radius: 8px;
	}

	/* Page styles */
	.page {
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.page-content {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		box-sizing: border-box;
	}

	.page-content img {
		display: block;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	/* Cover page styles */
	.page-cover .page-content {
		padding: 0;
	}

	/* Waveform customization for dark mode */
	:global(.dark) {
		--wavesurfer-wave-color: #94a3b8;
		--wavesurfer-progress-color: #ff5722;
		--wavesurfer-cursor-color: #ff5722;
	}

	/* Speed slider styles */
	.speed-slider {
		-webkit-appearance: none;
		appearance: none;
		height: 4px;
		border-radius: 2px;
		background: var(--bg-secondary);
		outline: none;
	}

	.speed-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #ff5722;
		cursor: pointer;
		transition: all 0.2s;
	}

	.speed-slider::-webkit-slider-thumb:hover {
		transform: scale(1.2);
		box-shadow: 0 0 0 4px rgba(255, 87, 34, 0.2);
	}

	.speed-slider::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #ff5722;
		cursor: pointer;
		border: none;
		transition: all 0.2s;
	}

	.speed-slider::-moz-range-thumb:hover {
		transform: scale(1.2);
		box-shadow: 0 0 0 4px rgba(255, 87, 34, 0.2);
	}
</style>
