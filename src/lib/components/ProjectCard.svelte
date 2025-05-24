<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	interface Project {
		name: string;
		codeUrl: string;
		deployedUrl: string;
		coverImage: string;
		screenshots?: string[];
		description: string;
		shortDescription: string;
		year: number;
		technologies?: string[];
		slug: string;
	}

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();

	// Animation states
	let isPressed = $state(false);
	let isNavigating = $state(false);
	let isMobile = $state(false);
	let cardElement: HTMLElement;

	// Check if device is mobile/touch
	onMount(() => {
		isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		
		// Add haptic feedback for iOS devices
		if (isMobile && 'vibrate' in navigator) {
			// Light haptic feedback on touch
		}
	});

	function handleClick(event: MouseEvent | TouchEvent) {
		event.preventDefault();

		// Don't handle if clicking on external links
		if ((event.target as HTMLElement)?.closest('a[href^="http"]')) {
			return;
		}

		// Add haptic feedback for mobile
		if (isMobile && 'vibrate' in navigator) {
			navigator.vibrate(50); // Light vibration
		}

		// Add immediate feedback for touch devices
		if (isMobile) {
			isPressed = true;
			setTimeout(() => {
				isPressed = false;
			}, 150);
		}

		// Start navigation animation
		isNavigating = true;

		// Navigate after a delightful delay
		setTimeout(() => {
			goto(`/code/${project.slug}`);
		}, isMobile ? 400 : 200);
	}

	function handleTouchStart() {
		if (isMobile) {
			isPressed = true;
		}
	}

	function handleTouchEnd() {
		if (isMobile) {
			setTimeout(() => {
				isPressed = false;
			}, 100);
		}
	}

	function handleMouseDown() {
		if (!isMobile) {
			isPressed = true;
		}
	}

	function handleMouseUp() {
		if (!isMobile) {
			isPressed = false;
		}
	}

	function handleMouseLeave() {
		isPressed = false;
	}
</script>

<div
	bind:this={cardElement}
	class="group block w-80 transition-all duration-500 cursor-pointer select-none"
	class:pressed={isPressed}
	class:navigating={isNavigating}
	class:mobile={isMobile}
	onclick={handleClick}
	onmousedown={handleMouseDown}
	onmouseup={handleMouseUp}
	onmouseleave={handleMouseLeave}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	role="button"
	tabindex="0"
	onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick(e)}
>
	<!-- Project Card Container -->
	<div
		class="project-card relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200"
	>
		<!-- Loading Overlay -->
		{#if isNavigating}
			<div class="loading-overlay absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
				<div class="loading-spinner"></div>
			</div>
		{/if}
		<!-- Project Image Container -->
		<div class="image-container relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
			<img
				src={project.coverImage}
				alt={project.name}
				class="project-image h-52 w-full object-cover transition-transform duration-700"
				loading="lazy"
			/>

			<!-- Gradient Overlay -->
			<div
				class="overlay absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300"
			></div>

			<!-- Ripple Effect for Touch -->
			<div class="ripple-container absolute inset-0 overflow-hidden pointer-events-none">
				<div class="ripple"></div>
			</div>

			<!-- Year Badge -->
			<div
				class="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-lg backdrop-blur-sm"
			>
				{project.year}
			</div>

			<!-- Tech Tags Overlay -->
			{#if project.technologies && project.technologies.length > 0}
				<div class="absolute right-4 bottom-4 left-4">
					<div class="flex flex-wrap gap-1.5">
						{#each project.technologies.slice(0, 3) as tech}
							<span
								class="rounded-lg bg-orange-500/95 px-2.5 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
							>
								{tech}
							</span>
						{/each}
						{#if project.technologies.length > 3}
							<span
								class="rounded-lg bg-orange-600/95 px-2.5 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
							>
								+{project.technologies.length - 3}
							</span>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- Project Info -->
		<div class="space-y-3 p-6">
			<div class="flex items-start justify-between">
				<h3
					class="project-title text-xl leading-tight font-bold text-gray-900 transition-colors duration-300"
				>
					{project.name}
				</h3>

				<!-- Arrow Icon -->
				<div
					class="arrow-icon ml-3 flex-shrink-0"
				>
					<svg
						class="h-5 w-5 text-orange-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 17l9.2-9.2M17 17V7H7"
						></path>
					</svg>
				</div>
			</div>

			<p class="text-base leading-relaxed text-gray-600">
				{project.shortDescription}
			</p>

			<!-- Bottom Action Area -->
			<div class="flex items-center justify-between pt-2">
				<span
					class="view-text text-sm font-medium text-orange-600"
				>
					View Project
				</span>

				<!-- External Links -->
				<div
					class="external-links flex space-x-2"
				>
					{#if project.codeUrl}
						<a
							href={project.codeUrl}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="View source code on GitHub"
							onclick={(e) => e.stopPropagation()}
						>
							<div class="h-5 w-5 text-gray-500 transition-colors hover:text-orange-600">
								<svg fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
									/>
								</svg>
							</div>
						</a>
					{/if}
					{#if project.deployedUrl}
						<a
							href={project.deployedUrl}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="View deployed project"
							onclick={(e) => e.stopPropagation()}
						>
							<div class="h-5 w-5 text-gray-500 transition-colors hover:text-orange-600">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									></path>
								</svg>
							</div>
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Base transitions and hover effects */
	.group:hover:not(.pressed):not(.navigating) {
		transform: translateY(-8px);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
	}

	.group:hover .project-image {
		transform: scale(1.1);
	}

	.group:hover .overlay {
		opacity: 1;
	}

	.group:hover .arrow-icon {
		transform: translateX(0);
		opacity: 1;
	}

	.group:hover .view-text {
		transform: translateY(0);
		opacity: 1;
	}

	.group:hover .external-links {
		opacity: 1;
	}

	.group:hover .project-title {
		color: #ea580c; /* orange-600 */
	}

	/* Mobile touch feedback */
	.mobile.pressed {
		transform: scale(0.96) translateY(-2px);
		transition: transform 0.15s cubic-bezier(0.4, 0, 0.6, 1);
	}

	.mobile.pressed .project-card {
		box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
	}

	/* Desktop press feedback */
	.pressed:not(.mobile) {
		transform: scale(0.99) translateY(-6px);
		transition: transform 0.1s ease-out;
	}

	/* Navigation state - delightful bounce */
	.navigating {
		animation: bounceNavigate 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	.navigating .project-card {
		box-shadow: 0 25px 50px -12px rgba(234, 88, 12, 0.2);
		border-color: #fb923c; /* orange-400 */
	}

	.navigating .project-image {
		transform: scale(1.08);
		transition: transform 0.4s ease-out;
	}

	@keyframes bounceNavigate {
		0% { transform: scale(1) translateY(-8px); }
		50% { transform: scale(1.05) translateY(-15px); }
		100% { transform: scale(1.02) translateY(-10px); }
	}

	/* Loading overlay */
	.loading-overlay {
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* Loading spinner */
	.loading-spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #f3f4f6;
		border-top: 3px solid #ea580c;
		border-radius: 50%;
		animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
		position: relative;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	/* Ripple effect for mobile */
	.ripple-container {
		border-radius: 1rem;
	}

	.mobile.pressed .ripple {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		background: radial-gradient(circle, rgba(234, 88, 12, 0.2) 0%, rgba(251, 146, 60, 0.1) 40%, transparent 70%);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		animation: ripple 0.6s cubic-bezier(0.4, 0, 0.6, 1);
	}

	@keyframes ripple {
		0% {
			width: 0;
			height: 0;
			opacity: 1;
		}
		100% {
			width: 400px;
			height: 400px;
			opacity: 0;
		}
	}

	/* Pulse effect for extra delight */
	.navigating .project-card::before {
		content: '';
		position: absolute;
		inset: -4px;
		background: linear-gradient(45deg, #ea580c, #fb923c, #ea580c);
		border-radius: 1.25rem;
		z-index: -1;
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.5; transform: scale(1); }
		50% { opacity: 0.8; transform: scale(1.02); }
	}

	/* Utility classes for animations */
	.arrow-icon {
		transform: translateX(8px);
		opacity: 0;
		transition: all 0.3s ease;
	}

	.view-text {
		transform: translateY(4px);
		opacity: 0;
		transition: all 0.3s ease;
	}

	.external-links {
		opacity: 0.6;
		transition: opacity 0.3s ease;
	}

	.project-title {
		transition: color 0.3s ease;
	}

	/* Focus styles for accessibility */
	.group:focus-visible {
		outline: 2px solid #ea580c;
		outline-offset: 2px;
	}

	/* Disable text selection on mobile */
	.mobile {
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}
</style>
