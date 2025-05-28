<script lang="ts">
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	type NavItem = {
		href: string;
		label: string;
	};

	let isMenuOpen = $state(false);
	let isNavbarVisible = $state(true);
	let lastScrollY = $state(0);
	let scrollTimeout: number | undefined;

	const navItems: NavItem[] = [
		{ href: '/code', label: 'Code' },
		{ href: '/research', label: 'Research' },
		{ href: '/music', label: 'Music' },
		{ href: '/photos', label: 'Photos' },
		{ href: '/blog', label: 'Blog' }
	];

	// Derived state to check active route
	let currentPath = $derived(page.url.pathname);

	// Function to toggle mobile menu
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Function to handle scroll events
	function handleScroll() {
		const currentScrollY = window.scrollY;
		const scrollDifference = currentScrollY - lastScrollY;

		// Only hide/show navbar if scrolled past a certain threshold (50px from top)
		if (currentScrollY > 50) {
			if (scrollDifference > 0 && currentScrollY > lastScrollY) {
				// Scrolling down - hide navbar
				isNavbarVisible = false;
				// Close mobile menu if open when hiding navbar
				if (isMenuOpen) {
					isMenuOpen = false;
				}
			} else if (scrollDifference < 0) {
				// Scrolling up - show navbar
				isNavbarVisible = true;
			}
		} else {
			// Always show navbar when near the top
			isNavbarVisible = true;
		}

		lastScrollY = currentScrollY;
	}

	// Throttled scroll handler
	function throttledScrollHandler() {
		if (scrollTimeout) return;

		scrollTimeout = setTimeout(() => {
			handleScroll();
			scrollTimeout = undefined;
		}, 10);
	}

	// Effect to close menu when route changes
	$effect(() => {
		// Reset menu when navigating
		currentPath;
		isMenuOpen = false;
	});

	// Effect to setup scroll listener
	$effect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', throttledScrollHandler, { passive: true });

			return () => {
				window.removeEventListener('scroll', throttledScrollHandler);
				if (scrollTimeout) {
					clearTimeout(scrollTimeout);
				}
			};
		}
	});
</script>

<nav
	class="fixed top-0 z-50 w-full bg-white shadow-sm transition-transform duration-300 ease-in-out"
	class:translate-y-0={isNavbarVisible}
	class:-translate-y-full={!isNavbarVisible}
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
		<span class="flex items-center gap-4">
			<img src="/favicon.ico" alt="Logo" class="h-9 w-9" />
			<a href="/">
				<span class="font-ibm-plex-serif nav-underline text-2xl tracking-wider"
					>Arihant's Corner</span
				>
			</a>
		</span>

		<!-- Desktop Navigation -->
		<div class="hidden md:block">
			<ul class="flex items-center gap-6">
				{#each navItems as item}
					<li>
						<a
							href={item.href}
							class="nav-underline font-mono text-gray-600 uppercase transition-colors hover:text-black"
							aria-current={currentPath === item.href ? 'page' : undefined}
							aria-label={item.label}
							class:font-semibold={currentPath === item.href}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Mobile Menu Button -->
		<button
			onclick={toggleMenu}
			class="flex h-10 w-10 items-center justify-center rounded-md focus:outline-none md:hidden"
			aria-label="Toggle menu"
			aria-expanded={isMenuOpen}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
				/>
			</svg>
		</button>
	</div>

	<!-- Mobile Navigation (shows/hides based on isMenuOpen state) -->
	{#if isMenuOpen}
		<div
			class="absolute top-full right-0 left-0 z-20 border-t bg-white pt-2 pb-4 shadow-lg md:hidden"
			transition:slide={{ duration: 300, easing: cubicOut }}
		>
			<ul class="flex flex-col space-y-2 px-4">
				{#each navItems as item}
					<li>
						<a
							href={item.href}
							class="nav-underline block py-2 font-mono text-gray-600 uppercase transition-colors hover:text-black"
							aria-current={currentPath === item.href ? 'page' : undefined}
							aria-label={item.label}
							class:font-semibold={currentPath === item.href}
							class:text-black={currentPath === item.href}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</nav>
