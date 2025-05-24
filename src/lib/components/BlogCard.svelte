<script lang="ts">
	import type { Blog } from '$lib/blogData';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	interface Props {
		blog: Blog;
	}

	let { blog }: Props = $props();

	// Animation states
	let isPressed = $state(false);
	let isNavigating = $state(false);
	let isMobile = $state(false);
	let cardElement: HTMLElement;

	// Check if device is mobile/touch
	onMount(() => {
		isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	});

	function handleClick(event: MouseEvent | TouchEvent) {
		event.preventDefault();

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
			goto(`/blog/${blog.slug}`);
		}, isMobile ? 400 : 200);
	}

	function handleReadMore() {
		goto(`/blog/${blog.slug}`);
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
	class="blog-card relative mx-auto flex w-full max-w-md transform flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 ease-in-out cursor-pointer select-none"
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
	<!-- Loading Overlay -->
	{#if isNavigating}
		<div class="loading-overlay absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl">
			<div class="loading-spinner"></div>
		</div>
	{/if}

	<!-- Ripple Effect for Touch -->
	<div class="ripple-container absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
		<div class="ripple"></div>
	</div>

	<div class="blog-image-container relative h-auto w-full">
		<img src={blog.coverImage} alt={blog.title} class="blog-image h-52 w-full rounded-xl object-cover transition-transform duration-700" loading="lazy" />
		
		<!-- Gradient Overlay -->
		<div
			class="overlay absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 rounded-xl"
		></div>
	</div>
	<h3 class="blog-title py-4 text-2xl font-semibold text-slate-800 transition-colors duration-300">{blog.title}</h3>
	<span class="text-sm text-slate-500">{blog.date}</span>
	<p class="py-4 text-base text-slate-600">{blog.description}</p>
	<div class="mt-auto flex items-center justify-end pt-4 text-base">
		<button
			class="read-more-btn focus:ring-opacity-50 bg-orange cursor-pointer rounded-lg px-5 py-2.5 text-base font-medium text-white transition-all duration-200 ease-in-out focus:ring-2 focus:outline-none"
			onclick={(e) => {
				e.stopPropagation();
				handleReadMore();
			}}
		>
			Read More
		</button>
	</div>
</div>

<style>
	/* Base hover effects */
	.blog-card:hover:not(.pressed):not(.navigating) {
		transform: translateY(-8px);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
	}

	.blog-card:hover .blog-image {
		transform: scale(1.05);
	}

	.blog-card:hover .overlay {
		opacity: 1;
	}

	.blog-card:hover .blog-title {
		color: #ea580c; /* orange-600 */
	}

	.blog-card:hover .read-more-btn {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px -8px rgba(234, 88, 12, 0.4);
	}

	/* Mobile touch feedback */
	.mobile.pressed {
		transform: scale(0.96) translateY(-2px);
		transition: transform 0.15s cubic-bezier(0.4, 0, 0.6, 1);
	}

	.mobile.pressed .blog-card {
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

	.navigating {
		box-shadow: 0 25px 50px -12px rgba(234, 88, 12, 0.2);
		border-color: #fb923c; /* orange-400 */
	}

	.navigating .blog-image {
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
	.navigating::before {
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

	/* Read more button animations */
	.read-more-btn {
		transform: translateY(0);
		transition: all 0.2s ease;
	}

	/* Focus styles for accessibility */
	.blog-card:focus-visible {
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

	/* Smooth transitions */
	.blog-image {
		transition: transform 0.7s ease;
	}

	.overlay {
		transition: opacity 0.3s ease;
	}

	.blog-title {
		transition: color 0.3s ease;
	}
</style>
