<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { project } = data;

	let selectedScreenshot: string | null = $state(null);
	let loadingStates: Record<number, boolean> = $state({});

	function openFullscreen(imageUrl: string) {
		selectedScreenshot = imageUrl;
	}

	function closeFullscreen() {
		selectedScreenshot = null;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && selectedScreenshot) {
			closeFullscreen();
		}
	}

	function handleImageLoad(index: number) {
		loadingStates[index] = false;
	}

	function handleImageError(index: number) {
		loadingStates[index] = false;
	}

	// Initialize loading states for all screenshots
	$effect(() => {
		if (project.screenshots) {
			const initialLoadingStates: Record<number, boolean> = {};
			project.screenshots.forEach((_, index) => {
				initialLoadingStates[index] = true;
			});
			loadingStates = initialLoadingStates;
		}
	});
</script>

<svelte:head>
	<title>{project.name} | Arihant</title>
	<meta name="description" content={project.shortDescription} />
</svelte:head>

<div class="md:mx-4">
	<!-- Back Navigation -->
	<div class="mx-auto max-w-6xl p-5 sm:px-6 lg:px-8">
		<a
			href="/code"
			class="group inline-flex items-center space-x-2 text-gray-600 transition-colors duration-200 hover:text-gray-900"
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
			<span class="text-sm font-medium">Back to Projects</span>
		</a>
	</div>

	<!-- Hero Section -->
	<div class="mx-auto max-w-6xl p-5 sm:px-6 lg:px-8">
		<div class="mb-16 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
			<!-- Left Column - Hero Content -->
			<div>
				<div class="mb-8">
					<h1 class="font-ibm-plex-serif mb-4 text-6xl leading-tight font-bold">
						{project.name}<span class="orange">.</span>
					</h1>
					<p class="max-w-2xl text-xl leading-relaxed font-light text-gray-700">
						{project.shortDescription}
					</p>
				</div>

				<!-- Project Meta Info -->
				<div class="mb-12 flex flex-wrap items-center gap-6 text-lg">
					<div class="flex items-center space-x-2">
						<span class="font-semibold text-gray-900">Year:</span>
						<span class="font-light">{project.year}</span>
					</div>

					{#if project.technologies && project.technologies.length > 0}
						<div class="flex items-center space-x-3">
							<span class="font-semibold text-gray-900">Built with:</span>
							<div class="flex flex-wrap gap-2">
								{#each project.technologies as tech}
									<span
										class="rounded-lg bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800"
									>
										{tech}
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<!-- Action Links -->
				<div class="flex flex-wrap gap-4">
					{#if project.deployedUrl}
						<a
							href={project.deployedUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center space-x-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-orange-700 hover:shadow-lg"
						>
							<span>View Live Project</span>
							<svg
								class="h-4 w-4 transition-transform group-hover:translate-x-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								></path>
							</svg>
						</a>
					{/if}
					{#if project.codeUrl}
						<a
							href={project.codeUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center space-x-2 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:shadow-md"
						>
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
							<span>View Source Code</span>
						</a>
					{/if}
				</div>
			</div>

			<!-- Right Column - Cover Image -->
			{#if project.coverImage}
				<div class="order-first lg:order-last">
					<div
						class="cursor-pointer overflow-hidden rounded-2xl shadow-2xl"
						onclick={() => openFullscreen(project.coverImage)}
						onkeydown={(e) => e.key === 'Enter' && openFullscreen(project.coverImage)}
						role="button"
						tabindex="0"
						aria-label="View {project.name} cover image in fullscreen"
					>
						<img
							src={`${project.coverImage}`}
							alt={project.name}
							class="h-auto w-full object-cover"
							loading="lazy"
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Project Description -->
	<div class="mx-auto max-w-6xl p-5 sm:px-6 lg:px-8">
		<div class="mb-16">
			<h2 class="mb-6 text-3xl font-bold">About this project</h2>
			<div class="prose prose-lg max-w-none">
				<p class="text-justify text-lg leading-relaxed font-light text-gray-700">
					{project.description}
				</p>
			</div>
		</div>

		<!-- Screenshots Section -->
		{#if project.screenshots && project.screenshots.length > 0}
			<div class="mb-16">
				<h2 class="mb-8 text-3xl font-bold">Screenshots</h2>
				<div class="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
					{#each project.screenshots as screenshot, index}
						<div
							class="group relative inline-block w-fit cursor-pointer justify-self-center overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
							onclick={() => openFullscreen(screenshot)}
							onkeydown={(e) => e.key === 'Enter' && openFullscreen(screenshot)}
							role="button"
							tabindex="0"
							aria-label="View screenshot {index + 1} of {project.name} in fullscreen"
						>
							<!-- Loading placeholder -->
							{#if loadingStates[index]}
								<div
									class="loading-placeholder animate-pulse rounded-xl bg-gradient-to-br from-gray-200 to-gray-300"
								>
									<div class="flex h-64 w-full items-center justify-center md:h-80">
										<div class="loading-spinner"></div>
									</div>
								</div>
							{/if}

							<!-- Actual image -->
							<img
								src={screenshot}
								alt={`Screenshot ${index + 1} of {project.name}`}
								class="block h-auto transition-transform duration-300 group-hover:scale-110"
								class:opacity-0={loadingStates[index]}
								class:opacity-100={!loadingStates[index]}
								loading="lazy"
								onload={() => handleImageLoad(index)}
								onerror={() => handleImageError(index)}
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fullscreen Image Modal -->
		{#if selectedScreenshot}
			<div
				class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black"
				onclick={closeFullscreen}
				onkeydown={handleKeydown}
				role="dialog"
				aria-modal="true"
				tabindex="-1"
			>
				<img
					src={selectedScreenshot}
					alt="Fullscreen Screenshot"
					class="max-h-screen max-w-screen object-contain p-4"
					loading="lazy"
				/>
				<button
					onclick={(e) => {
						e.stopPropagation();
						closeFullscreen();
					}}
					class="absolute top-4 right-4 text-3xl font-bold text-white"
					aria-label="Close fullscreen image"
				>
					&times;
				</button>
			</div>
		{/if}

		<!-- Bottom Navigation -->
		<div class="border-t border-gray-200 pt-8 text-center">
			<a
				href="/code"
				class="group inline-flex items-center space-x-2 text-gray-600 transition-colors duration-200 hover:text-orange-600"
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
				<span class="font-medium">Explore more projects</span>
			</a>
		</div>
	</div>
</div>

<style>
	.prose p {
		margin-bottom: 1.5rem;
	}

	/* Ensure the modal image doesn't exceed viewport and maintains aspect ratio */
	.fixed img {
		max-height: 90vh; /* Adjust as needed */
		max-width: 90vw; /* Adjust as needed */
	}

	/* Loading placeholder styles */
	.loading-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		min-height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Loading spinner */
	.loading-spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #f3f4f6;
		border-top: 3px solid #ea580c;
		border-radius: 50%;
		animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Smooth transition for image visibility */
	img {
		transition: opacity 0.3s ease-in-out;
	}

	/* Shimmer animation for placeholder */
	@keyframes shimmer {
		0% {
			background-position: -468px 0;
		}
		100% {
			background-position: 468px 0;
		}
	}

	.loading-placeholder::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
		background-size: 468px 100%;
		animation: shimmer 1.2s ease-in-out infinite;
	}
</style>
